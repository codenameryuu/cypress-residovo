import { faker } from "@faker-js/faker";

describe("Delete From Draft Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete from draft successfully", () => {
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

    // * Click checkbox on first draft item
    cy.get(".ag-row .ag-selection-checkbox").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on delete button
    cy.get("button.button-bin:has(svg.lucide-trash2)").should("exist").click();
    cy.wait(1000);

    // * Intercept delete draft API
    cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

    // * Wait modal, then click on confirm button
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
