const client = require("../config/db");

const healthCheck = async (req, res) => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("mycontacts-db").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
        return res.status(200).json({ "api-status": "ok", "db-status": "ok" });
    } catch (err) {
        return res
            .status(500)
            .json({ status_api: "ok", status_db: "ko", error: err.message });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
};

module.exports = {
    healthCheck,
};
