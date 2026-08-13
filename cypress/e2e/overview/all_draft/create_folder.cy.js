import { faker } from "@faker-js/faker";

describe("Create Folder From Draft Spec", () => {
  beforeEach(() => {
    cy.login();
    cy.createFolderDraft();
    cy.wait(3000);
  });

  it("Should create folder from draft successfully", () => {
    let name = "Folder " + faker.company.name() + " " + faker.string.numeric(4);

    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on all drafts sidebar menu
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
        expect(response.body.data.data[0].sub_type).to.exist;
      });

    // * Click first folder draft
    cy.get('.ag-center-cols-container .ag-row a[href*="/dashboard/category/create"]').should("have.length.at.least", 1).first().click();
    cy.url().should("include", "/dashboard/category/create");
    cy.wait(3000);

    // * If name is empty, type name
    cy.get("input[name='name']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='name']").type(name).should("have.value", name);
          cy.wait(1000);
        }
      });

    // * Intercept create category API
    cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

    // * Intercept delete draft API
    cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

    // * Click on done button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

    // * Wait for create category API to be called
    cy.wait("@createCategory")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });

    // * Wait for delete draft API to be called
    cy.wait("@deleteDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
