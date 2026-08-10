import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Request Access Spec", () => {
  it("Should log in successfully with valid data", () => {
    const requestAccessUrl = baseUrl + "/register";

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const companyName = faker.company.name();
    const email = `${firstName}.${lastName}@example.com`;
    const phoneNumber = faker.string.numeric(8);

    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    cy.visit(requestAccessUrl);

    cy.wait(1000);

    cy.get("input[type='name']").should("be.visible");
    cy.get("input[type='name']").type(fullName);
    cy.get("input[type='name']").should("have.value", fullName);

    cy.get("input[type='company']").should("be.visible");
    cy.get("input[type='company']").type(companyName);
    cy.get("input[type='company']").should("have.value", companyName);

    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='email']").should("have.value", email);

    cy.get("input[name='phone']").should("be.visible");
    cy.get("input[name='phone']").type(phoneNumber);
    cy.get("input[name='phone']").should("have.value", phoneNumber);

    cy.get("button[type='submit']").contains("Register").should("be.enabled");
    cy.get("button[type='submit']").contains("Register").click();

    cy.wait("@requestAccessRequest").its("response.statusCode").should("eq", 200);
  });

  it("Should log in failed with invalid credentials", () => {
    const requestAccessUrl = baseUrl + "/register";

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const companyName = faker.company.name();
    const email = Cypress.expose("ACCOUNT_EMAIL");
    const phoneNumber = faker.string.numeric(8);

    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    cy.visit(requestAccessUrl);

    cy.wait(1000);

    cy.get("input[type='name']").should("be.visible");
    cy.get("input[type='name']").type(fullName);
    cy.get("input[type='name']").should("have.value", fullName);

    cy.get("input[type='company']").should("be.visible");
    cy.get("input[type='company']").type(companyName);
    cy.get("input[type='company']").should("have.value", companyName);

    cy.get("input[type='email']").should("be.visible");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='email']").should("have.value", email);

    cy.get("input[name='phone']").should("be.visible");
    cy.get("input[name='phone']").type(phoneNumber);
    cy.get("input[name='phone']").should("have.value", phoneNumber);

    cy.get("button[type='submit']").contains("Register").should("be.enabled");
    cy.get("button[type='submit']").contains("Register").click();

    cy.wait("@requestAccessRequest").its("response.body").should("deep.include", {
      status: false,
      code: "email_already_taken",
    });
  });
});
