import "./commands";
import "cypress-mochawesome-reporter/register";

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    const screenshotFileName = `${runnable.parent.title} -- ${test.title} (failed).png`;
    cy.screenshot(screenshotFileName);
  }
});
