const { getDatabase } = require("../config/db");

const healthCheck = async (req, res) => {
    try {
        const db = await getDatabase();
        // Send a ping to confirm a successful connection
        await db.command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
        return res.status(200).json({ "api-status": "ok", "db-status": "ok" });
    } catch (err) {
        return res
            .status(500)
            .json({ status_api: "ok", status_db: "ko", error: err.message });
    }
};

module.exports = {
    healthCheck,
};
