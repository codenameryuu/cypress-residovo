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
