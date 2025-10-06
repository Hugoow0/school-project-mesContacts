const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDatabase } = require("../config/db");
const validator = require("../utils/validator");
const User = require("../models/user.model");

const register = async (req, res) => {
    const { email, password } = req.body;
    let isEmailAvailable = true;
    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required to register a user.",
        });
    }
    if (validator.validateEmail(email) === false) {
        return res.status(400).json({
            error: "Email must be a valid email address.",
        });
    }
    if (validator.validatePassword(password) === false) {
        return res.status(400).json({
            error: "Password must be at least 6 characters long.",
        });
    }

    try {
        const db = await getDatabase();
        const user = await db.collection("users").findOne({ email });
        if (user) {
            isEmailAvailable = false;
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    if (!isEmailAvailable) {
        return res.status(400).json({
            error: "Email already used.",
        });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email: email,
                password: hashedPassword,
            });
            const db = await getDatabase();
            // Insert the user first
            const userResult = await db.collection("users").insertOne(newUser);
            const userId = userResult.insertedId;

            // Create the contacts document for the new user
            const userContacts = {
                userId: userId.toString(),
                contacts: [],
            };

            // Insert the contacts document
            await db.collection("contacts").insertOne(userContacts);

            res.status(201).json({ message: "User created successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required to login a user.",
        });
    } else {
        try {
            const db = await getDatabase();
            const user = await db.collection("users").findOne({ email });
            if (!user) {
                // Changed this line
                return res.status(400).json({
                    error: "Invalid credentials.",
                });
            } else {
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!isPasswordValid) {
                    return res.status(400).json({
                        error: "Invalid credentials.",
                    });
                } else {
                    // Create JWT token
                    const token = jwt.sign(
                        { id: user._id, email: user.email },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: "Logged in successfully.",
                        token,
                    });
                }
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = {
    register,
    login,
};
