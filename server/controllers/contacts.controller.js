const client = require("../config/db");
const validator = require("../utils/validator");
const Contact = require("../models/contact.model");

const middleware = require("../middlewares/middleware");

const getContacts = async (req, res) => {
    const userId = middleware.getUserId(req);
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
    const { firstName, lastName, phone } = req.body ? req.body : {};

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
        let contactFound = false;
        for (let contact of userContacts[0].contacts) {
            if (contact._id.toString() === contactId) {
                Object.assign(contact, updatedFields);
                contactFound = true;
            }
        }
        if (!contactFound) {
            return res.status(404).json({ error: "Contact not found." });
        }
        await db
            .collection("contacts")
            .updateOne(
                { userId },
                { $set: { contacts: userContacts[0].contacts } }
            );
        res.status(200).json({
            message: "Contact updated successfully.",
            updatedContactId: contactId,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
};

const deleteContact = async (req, res) => {
    const userId = middleware.getUserId(req);
    const contactId = req.params.id;

    if (!contactId) {
        return res.status(400).json({ error: "Contact ID is required." });
    }

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DBNAME);
        userContacts = await db
            .collection("contacts")
            .find({ userId })
            .toArray();
        let contactFound = false;
        for (let index = 0; index < userContacts[0].contacts.length; index++) {
            let contact = userContacts[0].contacts[index];
            if (contact._id.toString() === contactId) {
                userContacts[0].contacts.splice(index, 1);
                contactFound = true;
                break;
            }
        }
        if (!contactFound) {
            return res.status(404).json({ error: "Contact not found." });
        }
        await db
            .collection("contacts")
            .updateOne(
                { userId },
                { $set: { contacts: userContacts[0].contacts } }
            );
        res.status(200).json({
            message: "Contact deleted successfully.",
            deletedContact: contactId,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
};

module.exports = {
    getContacts,
    postContact,
    patchContact,
    deleteContact,
};
