const client = require("../config/db");
const validator = require("../utils/validator");
const Contact = require("../models/contact.model");

const middleware = require("../middlewares/middleware");

const getContactsOfUser = async (req, res) => {
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

const postContactsOfUser = async (req, res) => {
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
                .find({ userId })
                .toArray();
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            await client.close();
        }

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

module.exports = {
    getContactsOfUser,
    postContactsOfUser,
};
