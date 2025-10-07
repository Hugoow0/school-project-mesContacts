const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const contactsRoute = require("../../routes/contacts.route");
const { getDatabase } = require("../../config/db");

// Create express app for testing
const app = express();
app.use(express.json());
app.use("/contacts", contactsRoute);

// Mock database
jest.mock("../../config/db");

describe("Contacts Routes", () => {
    let mockDb;
    let mockCollection;
    let validToken;
    let authHeader;

    beforeEach(() => {
        mockCollection = {
            find: jest.fn(() => ({
                toArray: jest.fn().mockResolvedValue([]),
            })),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        };
        mockDb = {
            collection: jest.fn(() => mockCollection),
        };
        getDatabase.mockResolvedValue(mockDb);

        // Create a valid JWT token for testing
        validToken = jwt.sign(
            { id: "user123", email: "test@example.com" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        authHeader = `Bearer ${validToken}`;

        jest.clearAllMocks();
    });

    describe("GET /contacts", () => {
        it("should require authentication", async () => {
            const response = await request(app).get("/contacts");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Token required");
        });

        it("should reject invalid tokens", async () => {
            const response = await request(app)
                .get("/contacts")
                .set("Authorization", "Bearer invalid-token");

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Invalid token");
        });

        it("should allow authenticated requests", async () => {
            const response = await request(app)
                .get("/contacts")
                .set("Authorization", authHeader);

            expect(response.status).toBe(200);
            expect(mockCollection.find).toHaveBeenCalledWith({
                userId: "user123",
            });
        });
    });

    describe("GET /contacts/:id", () => {
        it("should require authentication", async () => {
            const response = await request(app).get("/contacts/contact1");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Token required");
        });

        it("should handle missing contacts gracefully", async () => {
            mockCollection.find().toArray.mockResolvedValue([]);

            const response = await request(app)
                .get("/contacts/contact1")
                .set("Authorization", authHeader);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("User contacts not found.");
        });
    });

    describe("POST /contacts", () => {
        it("should require authentication", async () => {
            const response = await request(app).post("/contacts").send({
                firstName: "John",
                lastName: "Doe",
                phone: "1234567890",
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Token required");
        });

        it("should require all fields", async () => {
            const response = await request(app)
                .post("/contacts")
                .set("Authorization", authHeader)
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    // missing phone
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "First name, last name, and phone number are required."
            );
        });

        it("should validate phone number length", async () => {
            const response = await request(app)
                .post("/contacts")
                .set("Authorization", authHeader)
                .send({
                    firstName: "John",
                    lastName: "Doe",
                    phone: "123", // Too short
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Phone number must be a valid phone number."
            );
        });

        it("should create contact with valid data", async () => {
            const newContact = {
                firstName: "John",
                lastName: "Doe",
                phone: "1234567890",
            };

            const response = await request(app)
                .post("/contacts")
                .set("Authorization", authHeader)
                .send(newContact);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Contact added successfully.");
            expect(response.body.newContact).toMatchObject(newContact);
        });
    });

    describe("PATCH /contacts/:id", () => {
        it("should require authentication", async () => {
            const response = await request(app)
                .patch("/contacts/contact1")
                .send({
                    firstName: "Updated John",
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Token required");
        });
    });

    describe("DELETE /contacts/:id", () => {
        it("should require authentication", async () => {
            const response = await request(app).delete("/contacts/contact1");

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Token required");
        });

        it("should reject invalid tokens", async () => {
            const response = await request(app)
                .delete("/contacts/contact1")
                .set("Authorization", "Bearer invalid-token");

            expect(response.status).toBe(403);
            expect(response.body.error).toBe("Invalid token");
        });
    });
});
