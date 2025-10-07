// Mock environment variables
process.env.JWT_SECRET = "test-jwt-secret";

// Mock MongoDB database
jest.mock("../config/db", () => ({
    getDatabase: jest.fn(() =>
        Promise.resolve({
            collection: jest.fn(() => ({
                findOne: jest.fn(),
                find: jest.fn(() => ({
                    toArray: jest.fn(),
                })),
                insertOne: jest.fn(),
                updateOne: jest.fn(),
            })),
        })
    ),
}));
