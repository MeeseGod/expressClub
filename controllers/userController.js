const Message = require("../models/message");
const User = require("../models/user");
const passport = require("passport");

exports.index = (req, res, next) => {
    const messageList = Message.find()
    .populate("postAuthor", "userName")
    .exec(function(err, list_messages){
        if(err){return next(err);}
        res.render("index", {
            title: "The Club",
            messages: list_messages,
            user: req.user,
        })
    })
}

exports.user_signup = (req, res, next) => {
    res.render("user_signup", {
        title: "Sign Up",
    })
}

exports.user_login_get = (req, res, next) => {
    res.render("user_login", {
        title: "Login",
        user: req.user,
    })
}

exports.user_logout = (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err)
        }
    res.redirect("/");
    })
}

exports.user_login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user_login"
});