import { faker } from "@faker-js/faker";

describe("Delete Tenant Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete tenant successfully", () => {
    // * Click tenant management sidebar menu
    cy.get("a[href='/dashboard/tenant']").should("exist").click();
    cy.url().should("include", "/dashboard/tenant");
    cy.wait(3000);

    // * Click delete button on first item in the table
    cy.get('.ag-center-cols-container .ag-row button:has(img[alt="delete"])').should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Wait modal, then click on delete button
    cy.get("#modalDeleteHausbuddyTenant").should("be.visible").find("button").last().should("exist").click();
    cy.wait(1000);
  });
});
