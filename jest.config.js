module.exports = {
    testEnvironment: 'jsdom', // Important for testing browser-like behavior.
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional: For setup like `@testing-library/jest-dom` matchers
};