const express = require("express");
const router = express.Router();

// Import controllers
const authController = require("../controllers/auth.controller");

// Use controllers in routes
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
