import { faker } from "@faker-js/faker";

describe("Save Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should save data successfully with valid data", () => {
    // * Intercept the list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the all drafts sidebar item
    cy.contains("a[href='/dashboard/category/draft']", "All Drafts").should("be.visible").click();
    cy.wait(1000);

    // * Wait for the list draft API to be called
    cy.wait("@getListDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
        expect(response.body.data.data[0].sub_type).to.exist;
      })
      .its("body.data.data.0.sub_type")
      .as("subType");

    // * Click first data on the table
    cy.get(".ag-center-cols-container .ag-row").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Get the sub type
    cy.get("@subType").then((subType) => {
      if (subType === "building") {
        // * Intercept the create building API
        cy.intercept("POST", "**/api/v1/dashboard/building").as("createBuilding");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

        // * Wait for the create building API to be called
        cy.wait("@createBuilding")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });
      }

      if (subType === "category") {
        // * Intercept the create category API
        cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

        // * Intercept the delete draft API
        cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

        // * Wait for the create category API to be called
        cy.wait("@createCategory")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });

        // * Wait for the delete draft API to be called
        cy.wait("@deleteDraft")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
          });
      }

      if (subType === "subcategory") {
        // * Intercept the create category API
        cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

        // * Intercept the delete draft API
        cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

        // * Wait for the create category API to be called
        cy.wait("@createCategory")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });

        // * Wait for the delete draft API to be called
        cy.wait("@deleteDraft")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
          });
      }
    });
  });
});
