// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './', // Path to Next.js app
});

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom', // For testing React components
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup for testing library
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // Aliases for imports
    },
};

module.exports = createJestConfig(customJestConfig);
