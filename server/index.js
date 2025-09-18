const express = require("express");
const app = express();
const port = 3000;

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

// Logs
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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use((req, res) => {
    return res.status(404).json({
        error: "Cannot " + req.method + " " + req.originalUrl,
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
