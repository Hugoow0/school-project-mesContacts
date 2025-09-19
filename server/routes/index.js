const express = require("express");
const router = express.Router();

// Import controllers
const healthController = require("../controllers/health.controller");

router.get("/", (req, res) => {
    res.send("Hello World!");
});

// Use controllers in routes
router.get("/health", healthController.healthCheck);
router.use("/auth", require("./auth.route"));
module.exports = router;
