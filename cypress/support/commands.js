import { faker } from "@faker-js/faker";

Cypress.Commands.add("login", (email, password) => {
  let baseUrl = Cypress.expose("BASE_URL");

  let loginUrl = baseUrl + "/login";
  let loginEmail = email || Cypress.expose("ACCOUNT_EMAIL");
  let loginPassword = password || Cypress.expose("ACCOUNT_PASSWORD");

  // * Visit login page
  cy.visit(loginUrl);
  cy.wait(1000);

  // * Click on accept button
  cy.contains("div", /^Accept$/)
    .should("exist")
    .click();
  cy.wait(500);

  // * Type the email
  cy.get("input[type='email']").should("exist").type(loginEmail).should("have.value", loginEmail);
  cy.wait(1000);

  // * Type the password
  cy.get("input[type='password']").should("exist").type(loginPassword).should("have.value", loginPassword);
  cy.wait(1000);

  // * Click on sign in button
  cy.get("button[type='submit']").should("exist").click();
  cy.url().should("include", "/dashboard/category");
  cy.wait(3000);
});

Cypress.Commands.add("createSubFolder", () => {
  let name = "Subfolder " + faker.company.name() + " " + faker.string.numeric(4);

  // * Click on plus button
  cy.get("button:has(svg.lucide-plus)").should("exist").click();
  cy.wait(1000);

  // * Intercept get list category API
  cy.intercept("GET", "**/api/v1/dashboard/list-category").as("getListCategory");

  // * Click on sub folder button
  cy.get('button:has(img[alt="subfolder"])').should("exist").click();
  cy.wait(1000);

  // * Wait for get list category API to be called
  cy.wait("@getListCategory")
    .its("response")
    .should((response) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.deep.include({ status: true });
      expect(response.body.data).to.be.an("array").and.not.be.empty;
    });

  // * Wait the modal, then click on first folder in the list
  cy.get("#modalSelectCategory").should("exist").find(".modal-category-title").should("have.length.at.least", 1).first().click();

  // * Click on next button
  cy.get("#modalSelectCategory button.upload-button-next").should("exist").click();
  cy.url().should("match", /\/dashboard\/category\/[^/]+\/subcategory\/create/);

  // * Type name
  cy.get("input[name='name']").should("exist").type(name).should("have.value", name);
  cy.wait(1000);

  // * Intercept create category API
  cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

  // * Click on done button
  cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

  // * Wait for create category API to be called
  cy.wait("@createCategory")
    .its("response")
    .should((response) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.deep.include({ status: true });
      expect(response.body.data).to.exist.and.not.be.empty;
    });
});
