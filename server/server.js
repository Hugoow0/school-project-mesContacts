const express = require("express");
const app = express();
const port = 5000;

require("dotenv").config();
app.use(express.json());
const cors = require("./config/cors");
app.use(cors);
const { requestLogger } = require("./utils/logger");

// Logs every request
app.use(requestLogger);

// Import routes
const routes = require("./routes");
app.use("/api", routes);

app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
});
