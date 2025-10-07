const request = require("supertest");
const express = require("express");
const authRoute = require("../../routes/auth.route");
const { getDatabase } = require("../../config/db");
const bcrypt = require("bcrypt");

// Create express app for testing
const app = express();
app.use(express.json());
app.use("/auth", authRoute);

// Mock database
jest.mock("../../config/db");

describe("Auth Routes", () => {
    let mockDb;
    let mockCollection;

    beforeEach(() => {
        mockCollection = {
            findOne: jest.fn(),
            insertOne: jest.fn(),
        };
        mockDb = {
            collection: jest.fn(() => mockCollection),
        };
        getDatabase.mockResolvedValue(mockDb);
        jest.clearAllMocks();
    });

    describe("POST /auth/register", () => {
        it("should register a new user successfully", async () => {
            // Mock that email doesn't exist
            mockCollection.findOne.mockResolvedValue(null);
            mockCollection.insertOne
                .mockResolvedValueOnce({ insertedId: "user123" }) // users collection
                .mockResolvedValueOnce({ insertedId: "contacts123" }); // contacts collection

            const response = await request(app).post("/auth/register").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("User created successfully");
            expect(mockCollection.findOne).toHaveBeenCalledWith({
                email: "test@example.com",
            });
            expect(mockCollection.insertOne).toHaveBeenCalledTimes(2);
        });

        it("should return 400 if email or password is missing", async () => {
            const response = await request(app)
                .post("/auth/register")
                .send({ email: "test@example.com" });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Email and password are required to register a user."
            );
        });

        it("should return 400 if email is invalid", async () => {
            const response = await request(app).post("/auth/register").send({
                email: "invalid-email",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Email must be a valid email address."
            );
        });

        it("should return 400 if password is too short", async () => {
            const response = await request(app).post("/auth/register").send({
                email: "test@example.com",
                password: "123",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Password must be at least 6 characters long."
            );
        });

        it("should return 400 if email already exists", async () => {
            mockCollection.findOne.mockResolvedValue({
                email: "test@example.com",
            });

            const response = await request(app).post("/auth/register").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Email already used.");
        });
    });

    describe("POST /auth/login", () => {
        it("should login user successfully", async () => {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const mockUser = {
                _id: "user123",
                email: "test@example.com",
                password: hashedPassword,
            };
            mockCollection.findOne.mockResolvedValue(mockUser);

            const response = await request(app).post("/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Logged in successfully.");
            expect(response.body.token).toBeDefined();
        });

        it("should return 400 if email or password is missing", async () => {
            const response = await request(app)
                .post("/auth/login")
                .send({ email: "test@example.com" });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe(
                "Email and password are required to login a user."
            );
        });

        it("should return 400 if user does not exist", async () => {
            mockCollection.findOne.mockResolvedValue(null);

            const response = await request(app).post("/auth/login").send({
                email: "nonexistent@example.com",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid credentials.");
        });

        it("should return 400 if password is incorrect", async () => {
            const hashedPassword = await bcrypt.hash("correctpassword", 10);
            const mockUser = {
                _id: "user123",
                email: "test@example.com",
                password: hashedPassword,
            };
            mockCollection.findOne.mockResolvedValue(mockUser);

            const response = await request(app).post("/auth/login").send({
                email: "test@example.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Invalid credentials.");
        });
    });
});
