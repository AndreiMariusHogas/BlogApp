var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');




//Mongoose Deprecation Settings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/blog_app");
//Settings
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//Mongoose Model Config
var blogPostSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogPostSchema);

//Routes
//Index Route
app.get("/",function(req, res){
    res.redirect("/blogs");
})
app.get("/blogs", function(req,res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs:blogs});
        }
    });   
});
//Add BlogPost Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    })
})
    
//Create New Form Route
app.get("/blogs/new",function(req, res){
    res.render("new");
});
//Show Route
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});
//Edit Route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});
        }
    });
});
//Update Route
app.put("/blogs/:id",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log("sosete");
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + updatedBlog.id);
        }
    })
});

//Delete Route
app.delete("/blogs/:id",function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        else{
        res.redirect("/blogs");
        };
    });
});

app.listen(3000,function(){
    console.log("Server Connected");
});