const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");

// Import controllers
const healthController = require("../controllers/health.controller");
const authRoutes = require("./auth.route");
const contactsRoutes = require("./contacts.route");

router.get("/", (req, res) => {
    res.status(200).send("Hello World!");
});

// Use controllers in routes
router.get("/health", healthController.healthCheck);
router.use("/auth", authRoutes);
router.use("/contacts", contactsRoutes);

// Swagger documentation
router.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(require("../docs/openapi/openapi.json"))
);

module.exports = router;
