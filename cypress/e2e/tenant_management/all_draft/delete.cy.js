import { faker } from "@faker-js/faker";

describe("Delete Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete data successfully with valid data", () => {
    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the tenant management sidebar item
    cy.get("a[href='/dashboard/tenant']").should("exist").click();
    cy.wait(1000);

    // * Click on the all drafts sidebar item
    cy.get("a[href='/dashboard/tenant/draft']").should("exist").click();
    cy.url().should("include", "/dashboard/tenant/draft");
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

    // * Click on the delete button (may be clipped by overflow parent)
    cy.get("button.button-bin:has(svg.lucide-trash2)").should("exist").click();
    cy.wait(1000);

    // * Intercept delete draft API
    cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

    // * Click on the confirm button in modal
    cy.get("#updatetConfirmModal").should("exist").find("button.btn-danger").should("exist").click();

    // * Wait for delete draft API to be called
    cy.wait("@deleteDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
