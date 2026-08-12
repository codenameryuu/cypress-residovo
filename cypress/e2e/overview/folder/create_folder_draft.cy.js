import { faker } from "@faker-js/faker";

describe("Create Folder Draft Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create folder draft successfully", () => {
    let name = "Folder " + faker.company.name() + " " + faker.string.numeric(4);

    // * Click on plus button
    cy.get("button:has(svg.lucide-plus)").should("exist").click();
    cy.wait(1000);

    // * Click on folder button
    cy.get('button:has(img[alt="category"])').should("exist").click();
    cy.url().should("include", "/dashboard/category/create");
    cy.wait(3000);

    // * Type name
    cy.get("input[name='name']").should("exist").type(name).should("have.value", name);
    cy.wait(1000);

    // * Intercept create draft API
    cy.intercept("POST", "**/api/v1/dashboard/draft").as("createDraft");

    // * Click on save draft button
    cy.get("button.upload-button-skip:visible:enabled").should("have.length", 1).click();

    // * Wait for create draft API to be called
    cy.wait("@createDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });
  });
});
