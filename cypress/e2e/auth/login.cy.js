import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Login Spec", () => {
  it("Should log in successfully with valid credentials", () => {
    const loginUrl = baseUrl + "/login";

    const email = Cypress.expose("ACCOUNT_EMAIL");
    const password = Cypress.expose("ACCOUNT_PASSWORD");

    cy.visit(loginUrl);

    cy.wait(1000);

    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='email']").should("have.value", email);

    cy.get("input[type='password']").should("be.visible");
    cy.get("input[type='password']").type(password);
    cy.get("input[type='password']").should("have.value", password);

    cy.get("button[type='submit']").contains("Sign In").should("be.enabled");
    cy.get("button[type='submit']").contains("Sign In").click();

    cy.wait(3000);

    cy.url().should("include", "/dashboard/category");
  });

  it("Should log in failed with invalid credentials", () => {
    const loginUrl = baseUrl + "/login";
    const email = faker.internet.email();
    const password = faker.internet.password();

    cy.intercept("POST", "**/api/auth/callback/credentials").as("loginRequest");

    cy.visit(loginUrl);

    cy.wait(1000);

    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='email']").should("have.value", email);

    cy.get("input[type='password']").should("be.visible");
    cy.get("input[type='password']").type(password);
    cy.get("input[type='password']").should("have.value", password);

    cy.get("button[type='submit']").contains("Sign In").should("be.enabled");
    cy.get("button[type='submit']").contains("Sign In").click();

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 401);
    cy.url().should("include", "/login");
  });
});
