const express = require("express");
const router = express.Router();

// Import controllers
const healthController = require("../controllers/health.controller");
const authRoutes = require("./auth.route");
const contactsRoutes = require("./contacts.route");

router.get("/", (req, res) => {
    res.send("Hello World!");
});

// Use controllers in routes
router.get("/health", healthController.healthCheck);
router.use("/auth", authRoutes);
router.use("/contacts", contactsRoutes);
module.exports = router;
