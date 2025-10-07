module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverageFrom: [
        "routes/**/*.js",
        "controllers/**/*.js",
        "!**/node_modules/**",
    ],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
