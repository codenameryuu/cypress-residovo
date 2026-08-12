import { faker } from "@faker-js/faker";

describe("Delete From Bin Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should delete from bin successfully", () => {
    // * Intercept get list bin API
    cy.intercept("GET", "**/api/v1/dashboard/bin?**").as("getListBin");

    // * Click on bin sidebar item
    cy.get("a[href='/dashboard/category/bin']").should("exist").click();
    cy.url().should("include", "/dashboard/category/bin");
    cy.wait(3000);

    // * Wait for get list bin API to be called
    cy.wait("@getListBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click checkbox on first bin item
    cy.get(".ag-row .ag-selection-checkbox").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on delete button
    cy.get("button.button-bin:has(svg.lucide-trash2)").should("exist").click();
    cy.wait(1000);

    // * Intercept delete bin API
    cy.intercept("DELETE", "**/api/v1/dashboard/delete-bin").as("deleteBin");

    // * Wait modal, then click on confirm button
    cy.get("#updatetConfirmModal").should("exist").find("button.btn-danger").should("exist").click();

    // * Wait for delete bin API to be called
    cy.wait("@deleteBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
