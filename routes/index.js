const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");

// Get Index
router.get("/", userController.index);

// Get Signup Form
router.get("/sign-up", userController.user_signup);

module.exports = router;
