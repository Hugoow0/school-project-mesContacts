const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/middleware").authenticateToken;

// Import controllers
const contactsController = require("../controllers/contacts.controller");

// Use controllers in routes
router.get("/", requireAuth, contactsController.getContacts);
router.post("/", requireAuth, contactsController.postContact);
router.patch("/:id", requireAuth, contactsController.patchContact);
router.delete("/:id", requireAuth, contactsController.deleteContact);

module.exports = router;
