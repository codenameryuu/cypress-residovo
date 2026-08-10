import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Request Access Spec", () => {
  it("Should log in successfully with valid data", () => {
    let requestAccessUrl = baseUrl + "/register";

    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let fullName = `${firstName} ${lastName}`;
    let companyName = faker.company.name();
    let email = `${firstName}.${lastName}@example.com`;
    let phoneNumber = faker.string.numeric(8);

    cy.visit(requestAccessUrl);

    cy.wait(1000);

    cy.get("input[type='name']").should("be.visible").type(fullName).should("have.value", fullName);

    cy.get("input[type='company']").should("be.visible").type(companyName).should("have.value", companyName);

    cy.get("input[type='email']").should("be.visible").type(email).should("have.value", email);

    cy.get("input[name='phone']").should("be.visible").type(phoneNumber).should("have.value", phoneNumber);

    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    cy.get("button[type='submit']").contains("Register").should("be.enabled").click();

    cy.wait("@requestAccessRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });

  it("Should log in failed with invalid credentials", () => {
    let requestAccessUrl = baseUrl + "/register";

    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let fullName = `${firstName} ${lastName}`;
    let companyName = faker.company.name();
    let email = Cypress.expose("ACCOUNT_EMAIL");
    let phoneNumber = faker.string.numeric(8);

    cy.visit(requestAccessUrl);

    cy.wait(1000);

    cy.get("input[type='name']").should("be.visible").type(fullName).should("have.value", fullName);

    cy.get("input[type='company']").should("be.visible").type(companyName).should("have.value", companyName);

    cy.get("input[type='email']").should("be.visible").type(email).should("have.value", email);

    cy.get("input[name='phone']").should("be.visible").type(phoneNumber).should("have.value", phoneNumber);

    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    cy.get("button[type='submit']").contains("Register").should("be.enabled").click();

    cy.wait("@requestAccessRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: false, code: "email_already_taken" });
      });
  });
});
