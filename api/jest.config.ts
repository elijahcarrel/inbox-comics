import type { Config } from 'jest';

export default async (): Promise<Config> => {
    return {
        clearMocks: true,
        collectCoverage: true,
        collectCoverageFrom: [
            '**/*.ts',
            '!**/node_modules/**',
            '!**/jest.config.ts',
        ],
        coverageProvider: "v8",
        coverageReporters: ['text'],
        preset: "ts-jest",
        projects: [
            {
                displayName: 'api-test',
                testMatch: ['<rootDir>/src/api-test/**/*.test.ts'],
                transform: {
                    '^.+\\.ts?$': 'ts-jest'
                },
                testEnvironment: "./src/api-test/env.ts",
            },
        ],
        testEnvironment: "node",
        testTimeout: 5 * 60 * 1000,
    };
};
