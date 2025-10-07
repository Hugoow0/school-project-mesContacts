# Project - MesContacts

# MesContacts - Contact Management Application

A full-stack contact management application built with React (frontend) and Node.js/Express (backend), using MongoDB for data storage and JWT for authentication.

## 📋 Table of Contents

-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Installation & Setup](#installation--setup)
-   [Scripts](#scripts)
-   [API Endpoints](#api-endpoints)
-   [Test Credentials](#test-credentials)
-   [Environment Variables](#environment-variables)
-   [Running Tests](#running-tests)
-   [API Documentation](#api-documentation)

## 🏗️ Project Structure

```
school-project-mesContacts/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/         # React pages/components
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js/Express backend
│   ├── config/           # Database and CORS configuration
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── tests/           # Jest test files
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
└── README.md
```

## 🛠️ Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn
-   MongoDB Atlas account (or local MongoDB instance)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd school-project-mesContacts
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DBNAME=mescontacts
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000
```

## 📜 Scripts

### Backend (server/)

```bash
# Start the server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test -- --coverage
```

### Frontend (client/)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌐 API Endpoints

### Base URL

-   **Development**: `http://localhost:5000/api`
-   **Production**: `https://efrei-project-mes-contacts-backend.vercel.app/api`

### Health Check

-   **GET** `/health` - Check API and database status

### Authentication

-   **POST** `/auth/register` - Register a new user
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
-   **POST** `/auth/login` - Login user
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```

### Contacts (Protected Routes)

All contact endpoints require Bearer token authentication.

-   **GET** `/contacts` - Get all contacts for authenticated user
-   **GET** `/contacts/:id` - Get specific contact by ID
-   **POST** `/contacts` - Create new contact
    ```json
    {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "1234567890"
    }
    ```
-   **PATCH** `/contacts/:id` - Update contact by ID
-   **DELETE** `/contacts/:id` - Delete contact by ID

### Authentication Headers

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Test Credentials

For testing purposes, you can create a test account or use these sample credentials:

### Sample Registration Data

```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

### Sample Contact Data

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890"
}
```

## 🔧 Environment Variables

### Server (.env)

| Variable         | Description               | Example             |
| ---------------- | ------------------------- | ------------------- |
| `MONGODB_URI`    | MongoDB connection string | `mongodb+srv://...` |
| `MONGODB_DBNAME` | Database name             | `mescontacts`       |
| `JWT_SECRET`     | Secret key for JWT tokens | `your_secret_key`   |

### Client (.env)

| Variable       | Description     | Example                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## 🧪 Running Tests

The project includes comprehensive Jest tests for the backend API.

```bash
cd server
npm test
```

### Test Coverage

Tests cover:

-   Authentication routes (register/login)
-   Contact CRUD operations
-   Input validation
-   JWT token authentication
-   Error handling

## 📚 API Documentation

Swagger documentation is available at:

-   **Development**: `http://localhost:5000/api/docs`
-   **Production**: `https://efrei-project-mes-contacts-backend.vercel.app/api/docs`

## 🚦 Getting Started

1. **Start the backend server:**

    ```bash
    cd server
    npm start
    ```

    Server will run on `http://localhost:5000`

2. **Start the frontend development server:**

    ```bash
    cd client
    npm run dev
    ```

    Client will run on `http://localhost:5173`

3. **Access the application:**
    - Open your browser and go to `http://localhost:5173`
    - Register a new account or login
    - Start managing your contacts!

## 🔐 Security Features

-   Password hashing using bcrypt
-   JWT token authentication
-   Protected routes
-   Input validation
-   CORS configuration
