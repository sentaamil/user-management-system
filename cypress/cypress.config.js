const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: "wn5dbf",

  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      // node event listeners (if needed later)
      return config;
    },
  },

  env: {
    apiUrl: "http://localhost:5000/api",
  },
});
