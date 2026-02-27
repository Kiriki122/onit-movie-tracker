module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json",
                isolatedModules: true,
            },
        ],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
};
