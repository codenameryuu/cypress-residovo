import { faker } from "@faker-js/faker";

describe("Delete Message Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete message successfully", () => {
    // * Click message sidebar menu
    cy.get("a[href='/dashboard/message']").should("exist").click();
    cy.url().should("include", "/dashboard/message");
    cy.wait(3000);

    // * Intercept get list message API
    cy.intercept("GET", "**/api/v1/dashboard/chat?**").as("getListChat");

    // * Click checkbox on first item in the table
    cy.get(".ag-row .ag-selection-checkbox").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Wait for get list message API to be called
    cy.wait("@getListChat")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click on delete button
    cy.get("button.button-bin:has(svg.lucide-trash2)").should("exist").click();
    cy.wait(1000);

    // * Intercept delete message API
    cy.intercept("PATCH", "**/api/v1/dashboard/delete-chat/**").as("deleteMessage");

    // * Click on delete button in modal
    cy.get("#updatetConfirmModal").should("exist").find("button.btn-danger").should("exist").click();

    // * Wait for delete message API to be called
    cy.wait("@deleteMessage")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
