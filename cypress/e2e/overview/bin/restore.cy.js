import { faker } from "@faker-js/faker";

describe("Restore Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should restore data successfully with valid data", () => {
    // * Intercept get list bin API
    cy.intercept("GET", "**/api/v1/dashboard/bin?**").as("getListBin");

    // * Click on the all drafts sidebar item
    cy.contains("a[href='/dashboard/category/bin']", "Bin").should("be.visible").click();
    cy.wait(1000);

    // * Wait for get list bin API to be called
    cy.wait("@getListBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click first data on the table
    cy.get(".ag-center-cols-container .ag-row").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on the restore button
    cy.contains("button.button-bin", "Restore").scrollIntoView().should("be.visible").click();
    cy.wait(1000);

    // * Intercept restore bin API
    cy.intercept("DELETE", "**/api/v1/dashboard/restore-bin").as("restoreBin");

    // * Click on the confirm button in modal
    cy.get("#updatetConfirmModal").should("be.visible").contains("button.upload-button-next", "Restore").should("be.visible").click();

    // * Wait for restore bin API to be called
    cy.wait("@restoreBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
