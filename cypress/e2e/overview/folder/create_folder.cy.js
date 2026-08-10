import { faker } from "@faker-js/faker";

describe("Create Folder Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create folder successfully with valid data", () => {
    let name = faker.company.name() + " " + faker.string.numeric(4);

    // * Click on the plus button
    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();
    cy.wait(1000);

    // * Click on the folder button
    cy.get('button[title=" Folder"]').should("be.visible").click();
    cy.wait(1000);

    // * Check if the URL includes the folder create page
    cy.url().should("include", "/dashboard/category/create");

    // * Type the name
    cy.get("input[name='name']").should("be.visible").type(name).should("have.value", name);

    // * Intercept the create category API
    cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

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
  });
});
