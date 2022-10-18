const Message = require("../models/message");
const User = require("../models/user");

exports.index = (req, res, next) => {
    const messageList = Message.find()
    .populate("postAuthor", "userName")
    .exec(function(err, list_messages){
        if(err){return next(err);}
        res.render("index", {
            title: "The Club",
            messages: list_messages,
        })
    })
}

exports.user_signup = (req, res, next) => {
    res.render("user_signup", {
        title: "Sign Up",
    })
}