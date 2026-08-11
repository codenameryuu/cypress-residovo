Cypress.Commands.add("login", (email, password) => {
  let baseUrl = Cypress.expose("BASE_URL");

  let loginUrl = baseUrl + "/login";
  let loginEmail = email || Cypress.expose("ACCOUNT_EMAIL");
  let loginPassword = password || Cypress.expose("ACCOUNT_PASSWORD");

  // * Visit login page
  cy.visit(loginUrl);
  cy.wait(2000);

  // * Click on accept button
  cy.contains("div", /^Accept$/)
    .should("be.visible")
    .click();
  cy.wait(500);

  // * Type the email
  cy.get("input[type='email']").should("be.visible").type(loginEmail).should("have.value", loginEmail);
  cy.wait(1000);

  // * Type the password
  cy.get("input[type='password']").should("be.visible").type(loginPassword).should("have.value", loginPassword);
  cy.wait(1000);

  // * Click on sign in button
  cy.get("button[type='submit']").contains("Sign In").should("be.enabled").scrollIntoView().click();
  cy.url().should("include", "/dashboard/category");
  cy.wait(5000);
});
