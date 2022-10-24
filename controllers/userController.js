const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.user_signup_get = (req, res, next) => {
    res.render("user_signup", {
        title: "Sign Up",
    })
}

exports.user_signup_post = [
    body("firstName", "Your first name must not be empty and must be at least 1 characters long")
    .trim()
    .isLength({ min: 3})
    .escape(),
    body("lastName", "Your last name must not be empty and must be at least 3 characters long")
    .trim()
    .isLength({ min: 3})
    .escape(),
    body("userName", "Usernames must not be empty and must be at least 3 characters long")
    .trim()
    .isLength({ min: 3})
    .escape(),
    body("password", "Passwords must not be empty and must be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
    body("passwordConfirmation").trim().isLength({ min: 3 }).escape()
    .custom(async (value, { req }) => {
      // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
      if (value !== req.body.password) throw new Error('Passwords must be the same');
    }),
    
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.render("user_signup", { title: "Sign Up" });
        }
    
        try {
          const isUserInDB = await User.find({ "userName": req.body.userName });
          if (isUserInDB.length > 0) return res.render("user_signup", { title: "Sign Up" });
          // If username does not exist, continute to register new user to db
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) return next(err);
            const user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              userName: req.body.userName,
              password: hashedPassword,
              membership: "user",
              isVerified: false,
            }).save(err => err ? next(err) : res.redirect("/"));
          });
        } catch (err) {
          return next(err);
        }
      }
]

exports.user_login_get = (req, res, next) => {
    res.render("user_login", {
        title: "Login",
    })
}

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user_login"
});

exports.user_logout = (req, res, next) => {
    req.logout(function(err){
        if(err){
            return next(err)
        }
    res.redirect("/");
    })
}