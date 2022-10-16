const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Club' });
});

// Get Signup Form
router.get("/sign-up", userController.user_signup);

module.exports = router;
