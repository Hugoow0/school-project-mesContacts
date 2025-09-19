const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/middleware").authenticateToken;

// Import controllers
const authController = require("../controllers/auth.controller");

// Use controllers in routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/protected", requireAuth, authController.protectedRoute);

module.exports = router;
