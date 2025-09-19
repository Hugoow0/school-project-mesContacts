const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/middleware").authenticateToken;

// Import controllers
const contactsController = require("../controllers/contacts.controller");

// Use controllers in routes
router.get("/", requireAuth, contactsController.getContactsOfUser);
router.post("/", requireAuth, contactsController.postContactsOfUser);
/*
router.patch("/:id", requireAuth, contactsController.updateContact);
router.delete("/:id", requireAuth, contactsController.protectedRoute);
*/
module.exports = router;
