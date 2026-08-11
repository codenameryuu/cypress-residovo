// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-mochawesome-reporter/register";

// Cypress injects scripts that can trigger React SSR hydration mismatches
// (minified #418/#423). Ignore those so the suite does not fail spuriously.
// https://github.com/cypress-io/cypress/issues/27204
Cypress.on("uncaught:exception", (err) => {
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message) ||
    /Failed to execute 'removeChild' on 'Node'/.test(err.message)
  ) {
    return false;
  }
});
