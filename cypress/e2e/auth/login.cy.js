import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Login Spec", () => {
  it("Should login successfully", () => {
    cy.login();
  });

  it("Should login failed", () => {
    let loginUrl = baseUrl + "/login";

    let email = faker.internet.email();
    let password = faker.internet.password();

    // * Intercept login request
    cy.intercept("POST", "**/api/auth/callback/credentials").as("loginRequest");

    // * Visit login page
    cy.visit(loginUrl);
    cy.wait(2000);

    // * Type email
    cy.get("input[type='email']").should("exist").type(email).should("have.value", email);
    cy.wait(1000);

    // * Type password
    cy.get("input[type='password']").should("exist").type(password).should("have.value", password);
    cy.wait(1000);

    // * Click on sign in button
    cy.get("button[type='submit']").should("exist").click();
    cy.url().should("include", "/login");

    // * Wait for get login API to be called
    cy.wait("@loginRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(401);
      });
  });
});
