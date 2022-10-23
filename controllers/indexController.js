const Message = require("../models/message");

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