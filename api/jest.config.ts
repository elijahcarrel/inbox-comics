module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageProvider: "v8",
    coverageReporters: ['text'],
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/test/**/*.test.ts"],
    testTimeout: 5 * 60 * 1000,
    transform: {
        "node_modules/(uuid)/.+\\.(j|t)sx?$": "ts-jest"
    },
    transformIgnorePatterns: [
        "node_modules/(?!(uuid)/)"
    ]
};
