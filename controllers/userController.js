
exports.index = (req, res, next) => {
    res.render("index", {
        title: "The Club",
    })
}

exports.user_signup = (req, res, next) => {
    res.render("user_signup", {
        title: "Sign Up",
    })
}