const { MongoClient, ServerApiVersion } = require("mongodb");

let client = null;
let db = null;

const getDatabase = async () => {
    if (db) return db; // Reuse existing connection

    try {
        if (!client) {
            client = new MongoClient(process.env.MONGODB_URI, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
        }

        await client.connect();
        db = client.db(process.env.MONGODB_DBNAME);
        return db;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};

module.exports = { getDatabase };
