const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "Cypress Residovo",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    viewportWidth: 1600,
    viewportHeight: 900,
    expose: {
      BASE_URL: "https://stg.residovo.com",
      ACCOUNT_EMAIL: "mycondosite@gmail.com",
      ACCOUNT_PASSWORD: "Mycondo12321!",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
