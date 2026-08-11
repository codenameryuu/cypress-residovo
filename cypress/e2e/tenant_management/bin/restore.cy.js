import { faker } from "@faker-js/faker";

describe("Restore Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should restore data successfully with valid data", () => {
    // * Intercept get list bin API
    cy.intercept("GET", "**/api/v1/dashboard/bin?**").as("getListBin");

    // * Click on the tenant management sidebar item
    cy.contains("a[href='/dashboard/tenant']", "Tenant Management").should("be.visible").click();
    cy.wait(1000);

    // * Click on the bin sidebar item
    cy.contains("a[href='/dashboard/tenant/bin']", "Bin").should("be.visible").click();
    cy.url().should("include", "/dashboard/tenant/bin");
    cy.wait(3000);

    // * Wait for get list bin API to be called
    cy.wait("@getListBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click first data on the table
    cy.get(".ag-row .ag-selection-checkbox").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on the restore button
    cy.contains("button.button-bin", "Restore").should("exist").click();
    cy.wait(1000);

    // * Intercept restore bin API
    cy.intercept("DELETE", "**/api/v1/dashboard/restore-bin").as("restoreBin");

    // * Click on the confirm button in modal
    cy.get("#updatetConfirmModal").should("be.visible").contains("button.upload-button-next", "Restore").should("exist").click();

    // * Wait for restore bin API to be called
    cy.wait("@restoreBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
