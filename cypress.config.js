const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "4qt9bt",
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "Cypress Mycondo Residovo",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    viewportWidth: 1600,
    viewportHeight: 900,
    expose: {
      BASE_URL: "https://mycondofe.kuningan.de",
      BASE_URL_MYCONDO: "https://mycondofe.kuningan.de",
      BASE_URL_RESIDOVO: "https://stg.residovo.com",
      ACCOUNT_EMAIL: "mycondosite@gmail.com",
      ACCOUNT_PASSWORD: "Mycondo12321!",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
});
