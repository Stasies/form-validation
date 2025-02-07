export default {
  testEnvironment: "jsdom", // 👈 Simulates a browser environment
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
