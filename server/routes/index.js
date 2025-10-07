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
const swaggerDocument = require("../docs/openapi/openapi.json");

// Swagger configuration options
const swaggerOptions = {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "MesContacts API Documentation",
    swaggerOptions: {
        url: null, // Disable the default URL
        spec: swaggerDocument,
    },
};

// Serve Swagger UI
router.get("/docs", (req, res, next) => {
    // Force reload the swagger document for each request
    delete require.cache[require.resolve("../docs/openapi/openapi.json")];
    const freshSwaggerDoc = require("../docs/openapi/openapi.json");

    // Setup swagger with the fresh document
    const swaggerSetup = swaggerUi.setup(freshSwaggerDoc, swaggerOptions);
    swaggerSetup(req, res, next);
});

router.use("/docs", swaggerUi.serve);

module.exports = router;
