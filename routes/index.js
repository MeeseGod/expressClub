const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const userController = require("../controllers/userController");
const indexController = require("../controllers/indexController");
const messageController = require("../controllers/messageController");
const User = require ("../models/user");

// Get Index
router.get("/", indexController.index);

// Get Signup Form
router.get("/sign-up", userController.user_signup_get);

// Get Login
router.get("/log-in", userController.user_login_get);

router.post("/log-in", userController.user_login_post);

// Handle Signup Request
router.post("/sign-up", userController.user_signup_post);

// Logout
router.get("/log-out", userController.user_logout);

router.post("/verify-phrase", userController.user_verify);

router.post("/create-post", messageController.message_create_post);

// Delete Message
router.post("/delete-message/:id", messageController.message_delete_post);

module.exports = router;
