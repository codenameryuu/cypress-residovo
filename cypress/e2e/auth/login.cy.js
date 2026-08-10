import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Login Spec", () => {
  it("Should log in successfully with valid credentials", () => {
    cy.login();
  });

  it("Should log in failed with invalid credentials", () => {
    const loginUrl = baseUrl + "/login";
    const email = faker.internet.email();
    const password = faker.internet.password();

    cy.intercept("POST", "**/api/auth/callback/credentials").as("loginRequest");

    cy.visit(loginUrl);

    cy.wait(1000);

    cy.get("input[type='email']").should("be.visible").type(email).should("have.value", email);

    cy.get("input[type='password']").should("be.visible").type(password).should("have.value", password);

    cy.get("button[type='submit']").contains("Sign In").should("be.enabled").click();

    cy.wait("@loginRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(401);
      });

    cy.wait(1000);

    cy.url().should("include", "/login");
  });
});
