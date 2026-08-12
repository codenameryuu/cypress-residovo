import { faker } from "@faker-js/faker";

const baseUrl = Cypress.expose("BASE_URL");

describe("Request Access Spec", () => {
  it("Should request access successfully", () => {
    let requestAccessUrl = baseUrl + "/register";

    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let fullName = `${firstName} ${lastName}`;
    let companyName = faker.company.name();
    let email = `${firstName}.${lastName}@example.com`;
    let phoneNumber = faker.string.numeric(8);

    // * Visit request access page
    cy.visit(requestAccessUrl);
    cy.wait(2000);

    // * Type name
    cy.get("input[type='name']").should("exist").type(fullName).should("have.value", fullName);
    cy.wait(1000);

    // * Type company name
    cy.get("input[type='company']").should("exist").type(companyName).should("have.value", companyName);
    cy.wait(1000);

    // * Type email
    cy.get("input[type='email']").should("exist").type(email).should("have.value", email);
    cy.wait(1000);

    // * Type phone number
    cy.get("input[name='phone']").should("exist").type(phoneNumber).should("have.value", phoneNumber);
    cy.wait(1000);

    // * Intercept request access API
    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    // * Click on request access button
    cy.get("button[type='submit']").should("exist").click();

    // * Wait for request access API to be called
    cy.wait("@requestAccessRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });

  it("Should request access failed", () => {
    let requestAccessUrl = baseUrl + "/register";

    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let fullName = `${firstName} ${lastName}`;
    let companyName = faker.company.name();
    let email = Cypress.expose("ACCOUNT_EMAIL");
    let phoneNumber = faker.string.numeric(8);

    // * Visit request access page
    cy.visit(requestAccessUrl);
    cy.wait(2000);

    // * Type name
    cy.get("input[type='name']").should("exist").type(fullName).should("have.value", fullName);
    cy.wait(1000);

    // * Type company name
    cy.get("input[type='company']").should("exist").type(companyName).should("have.value", companyName);
    cy.wait(1000);

    // * Type email
    cy.get("input[type='email']").should("exist").type(email).should("have.value", email);
    cy.wait(1000);

    // * Type phone number
    cy.get("input[name='phone']").should("exist").type(phoneNumber).should("have.value", phoneNumber);
    cy.wait(1000);

    // * Intercept request access API
    cy.intercept("POST", "**/api/v1/request-access").as("requestAccessRequest");

    // * Click on request access button
    cy.get("button[type='submit']").should("exist").click();

    // * Wait for request access API to be called
    cy.wait("@requestAccessRequest")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: false, code: "email_already_taken" });
      });
  });
});
