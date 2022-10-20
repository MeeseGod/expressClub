const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const userController = require("../controllers/userController");
const User = require ("../models/user");

// Get Index
router.get("/", userController.index);

// Get Signup Form
router.get("/sign-up", userController.user_signup);

// Get Login
router.get("/log-in", userController.user_login_get);

router.post("/log-in", userController.user_login_post);

module.exports = router;
