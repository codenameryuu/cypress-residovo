import { faker } from "@faker-js/faker";

describe("Delete Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete data successfully with valid data", () => {
    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the all drafts sidebar item
    cy.get("a[href='/dashboard/category/draft']").should("exist").click();
    cy.url().should("include", "/dashboard/category/draft");
    cy.wait(3000);

    // * Wait for get list draft API to be called
    cy.wait("@getListDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click checkbox on the first row
    cy.get(".ag-row .ag-selection-checkbox").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on the delete button
    cy.contains("button.button-bin", "Delete").should("exist").click();
    cy.wait(1000);

    // * Intercept delete draft API
    cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

    // * Click on the confirm button in modal
    cy.get("#updatetConfirmModal").should("be.visible").contains("button.btn-danger", "Delete").should("exist").click();

    // * Wait for delete draft API to be called
    cy.wait("@deleteDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
