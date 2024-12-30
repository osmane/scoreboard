module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/../$1",
      "^@/(.*)$": "<rootDir>/../$1",
    },
  };
  