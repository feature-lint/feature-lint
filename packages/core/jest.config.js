export default {
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["<rootDir>/src/**/*.test.ts"],

  preset: "ts-jest/presets/default-esm",

  globals: {
    "ts-jest": {
      useESM: true,
      // isolatedModules: true,
    },
  },

  moduleNameMapper: {
    "(.*)\\.js$": "$1",
  },
};
