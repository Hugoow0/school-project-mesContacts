const client = require("../config/db");
const validator = require("../utils/validator");
const Contact = require("../models/contact.model");

const middleware = require("../middlewares/middleware");

const getContactsByUser = async (req, res) => {
    const userId = middleware.getUserId(req);
    if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
    }
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DBNAME);
        const contacts = await db
            .collection("contacts")
            .find({ userId })
            .toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
};

const postContact = async (req, res) => {
    const userId = middleware.getUserId(req);
    const { firstName, lastName, phone } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
    }

    if (!firstName || !lastName || !phone) {
        return res.status(400).json({
            error: "First name, last name, and phone number are required.",
        });
    } else {
        if (validator.validatePhone(phone) === false) {
            return res.status(400).json({
                error: "Phone number must be a valid phone number.",
            });
        }
        const newContact = new Contact({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
        });

        try {
            await client.connect();
            const db = client.db(process.env.MONGODB_DBNAME);
            userContacts = await db
                .collection("contacts")
                .updateOne({ userId }, { $push: { contacts: newContact } });
            res.status(200).json({
                message: "Contact added successfully.",
                newContact,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            await client.close();
        }
    }
};

const patchContact = async (req, res) => {
    const userId = middleware.getUserId(req);
    const contactId = req.params.id;
    const { firstName, lastName, phone } = req.body;

    if (!userId) {
        return res.status(401).json({ error: "User ID not found in token" });
    }
    if (!contactId) {
        return res.status(400).json({ error: "Contact ID is required." });
    }

    let updatedFields = {};
    if (firstName) {
        updatedFields.firstName = firstName;
    }
    if (lastName) {
        updatedFields.lastName = lastName;
    }
    if (phone) {
        updatedFields.phone = phone;
    }

    if (Object.keys(updatedFields).length === 0) {
        return res
            .status(400)
            .json({ error: "At least one field must be updated." });
    }

    if (
        updatedFields.phone &&
        validator.validatePhone(updatedFields.phone) === false
    ) {
        return res.status(400).json({
            error: "Phone number must be a valid phone number.",
        });
    }
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DBNAME);
        userContacts = await db
            .collection("contacts")
            .find({ userId })
            .toArray();
        console.log("Before update:", userContacts[0]);
        for (let contact of userContacts[0].contacts) {
            if (contact._id.toString() === contactId) {
                Object.assign(contact, updatedFields);
            }
        }
        console.log("After update:", userContacts[0]);
        await db
            .collection("contacts")
            .updateOne(
                { userId },
                { $set: { contacts: userContacts[0].contacts } }
            );
        res.status(200).json({
            message: "Contact updated successfully.",
            updatedContact: updatedFields,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
};

//TODO: deleteContact function

module.exports = {
    getContactsByUser,
    postContact,
    patchContact,
};
