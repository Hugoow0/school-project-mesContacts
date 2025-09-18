const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
app.use(express.json());

const requireAuth = require("./middleware").authenticateToken;

// Add CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
// Logs every request
app.use((req, res, next) => {
    const t0 = Date.now();
    res.on("finish", () => {
        const t1 = Date.now();
        const duration = t1 - t0;
        console.log(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
        );
    });
    next();
});

const mongoDbUri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoDbUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("mycontacts-db").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/health", (req, res) => {
    res.send("Hello World!");
});

// Connect to the database and try adding a user to the "users" collection in the "mycontacts-db" database
app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;
    let isEmailValid = true;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required to register a user.",
        });
    }
    if (!email.includes("@")) {
        return res.status(400).json({
            error: "Email must be a valid email address.",
        });
    }

    try {
        await client.connect();
        const db = client.db("mycontacts-db");
        const user = await db.collection("users").find({ email }).toArray();
        if (user.length > 0) {
            isEmailValid = false;
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }

    if (!isEmailValid) {
        return res.status(400).json({
            error: "Email already used.",
        });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.connect();
            const db = client.db("mycontacts-db");
            const result = await db.collection("users").insertOne({
                email,
                password: hashedPassword,
                createdAt: new Date(),
            });
            res.status(201).json({ insertedId: result.insertedId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            await client.close();
        }
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required to login a user.",
        });
    } else {
        try {
            await client.connect();
            const db = client.db("mycontacts-db");
            const user = await db.collection("users").find({ email }).toArray();
            if (user.length === 0) {
                return res.status(400).json({
                    error: "No user found with this email.",
                });
            } else {
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user[0].password
                );
                if (!isPasswordValid) {
                    return res.status(400).json({
                        error: "Invalid password.",
                    });
                } else {
                    // Create JWT token
                    const token = jwt.sign(
                        { email: user[0].email, id: user[0]._id },
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
});

app.get("/protected", requireAuth, (req, res) => {
    return res.status(200).json({ message: "This is a protected route" });
});

app.use((req, res) => {
    return res.status(404).json({
        error: "Cannot " + req.method + " " + req.originalUrl,
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
