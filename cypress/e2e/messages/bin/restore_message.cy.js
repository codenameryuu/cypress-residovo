import { faker } from "@faker-js/faker";

describe("Restore Message From Bin Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should restore message from bin successfully", () => {
    // * Intercept get list bin API
    cy.intercept("GET", "**/api/v1/dashboard/bin?**").as("getListBin");

    // * Click on the message sidebar item
    cy.get("a[href='/dashboard/message']").should("exist").click();
    cy.wait(1000);

    // * Click on the bin sidebar item
    cy.get("a[href='/dashboard/message/bin']").should("exist").click();
    cy.url().should("include", "/dashboard/message/bin");
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
    cy.get("button.button-bin:has(svg.lucide-archive-restore)").should("exist").click();
    cy.wait(1000);

    // * Intercept restore bin API
    cy.intercept("DELETE", "**/api/v1/dashboard/restore-bin").as("restoreBin");

    // * Click on the confirm button in modal
    cy.get("#updatetConfirmModal").should("exist").find("button.upload-button-next").should("exist").click();

    // * Wait for restore bin API to be called
    cy.wait("@restoreBin")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
