const { body, validationResult } = require("express-validator");
const Message = require("../models/message");
const User = require("../models/user");

const async = require('async');

exports.message_delete_get = (req, res, next) => {
    async.parallel({
        message(callback){
            Message.findById(req.params.id)
            .populate("postAuthor")
            .exec(callback);
        }
    },
    (err, results) => {
        if (err) {
            return next(err);
          }
          if (results.message == null) {
            // No results.
            res.redirect("/");
          }
          // Successful, so render.
          res.render("message_delete", {
            title: "Delete Message",
            message: results.message,
          });
    });
}

exports.message_delete_post = [

]

exports.message_create_post = [
    body("postContent")
    .trim()
    .isLength()
    .escape(),

    async (req, res, next) => {
        const errors = validationResult(req);
        const user = await User.findOne({userName: req.user.userName});

        const message = new Message({
            messageText : req.body.postContent,
            postAuthor: user,
            datePosted: Date.now(),
        })

        if(!errors.isEmpty()){
            res.redirect("/");
        }

        message.save((err) => {
            if(err) {
                return next(err);
            }
            res.redirect("/");
        })
    }
]