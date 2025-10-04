const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../config/db");
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
        await client.connect();
        const db = client.db(process.env.MONGODB_DBNAME);
        const user = await db.collection("users").find({ email }).toArray();
        if (user.length > 0) {
            isEmailAvailable = false;
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
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
            await client.connect();
            const db = client.db(process.env.MONGODB_DBNAME);
            await db.collection("users").insertOne(newUser);
            res.status(201).json({ message: "User created successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            await client.close();
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
            await client.connect();
            const db = client.db(process.env.MONGODB_DBNAME);
            const user = await db.collection("users").find({ email }).toArray();
            if (user.length === 0) {
                return res.status(400).json({
                    error: "Invalid credentials.",
                });
            } else {
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user[0].password
                );
                if (!isPasswordValid) {
                    return res.status(400).json({
                        error: "Invalid credentials.",
                    });
                } else {
                    // Create JWT token
                    const token = jwt.sign(
                        { id: user[0]._id, email: user[0].email },
                        process.env.JWT_SECRET,
                        { expiresIn: "1h" }
                    );
                    return res.status(200).json({
                        message: "Login successful.",
                        token,
                    });
                }
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            await client.close();
        }
    }
};

module.exports = {
    register,
    login,
};
