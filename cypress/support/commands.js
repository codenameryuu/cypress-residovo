Cypress.Commands.add("login", (email, password) => {
  const baseUrl = Cypress.expose("BASE_URL");
  const loginEmail = email || Cypress.expose("ACCOUNT_EMAIL");
  const loginPassword = password || Cypress.expose("ACCOUNT_PASSWORD");

  cy.visit(baseUrl + "/login");

  cy.wait(500);

  cy.contains("div", /^Accept$/)
    .should("be.visible")
    .click();

  cy.wait(500);

  cy.get("input[type='email']").should("be.visible").type(loginEmail).should("have.value", loginEmail);

  cy.get("input[type='password']").should("be.visible").type(loginPassword).should("have.value", loginPassword);

  cy.get("button[type='submit']").contains("Sign In").should("be.enabled").click();

  cy.wait(5000);

  cy.url().should("include", "/dashboard/category");
});
