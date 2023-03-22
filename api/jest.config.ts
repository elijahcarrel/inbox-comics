import type { Config } from 'jest';
import { log } from "console";

log("executing top config");

export default async (): Promise<Config> => {
    log("loading top config");

    return {
        clearMocks: true,
        collectCoverage: true,
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
            },
        ],
        testEnvironment: "node",
        testTimeout: 5 * 60 * 1000,
    };
};
