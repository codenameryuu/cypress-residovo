import { faker } from "@faker-js/faker";

describe("Create Subfolder Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create subfolder successfully with valid data", () => {
    let name = faker.company.name() + " " + faker.string.numeric(4);

    // * Click on the plus button
    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();
    cy.wait(1000);

    // * Intercept the list category API
    cy.intercept("GET", "**/api/v1/dashboard/list-category").as("getListCategory");

    // * Click on the subfolder button
    cy.get('button[title="Subfolder"]').should("be.visible").click();
    cy.wait(1000);

    // * Wait for the list category API to be called
    cy.wait("@getListCategory")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data[0].id).to.exist;
      })
      .its("body.data.0.id")
      .as("categoryId");

    // * Click on the first category in the list
    cy.get("#modalSelectCategory").should("be.visible").find(".modal-category-title").should("have.length.at.least", 1).first().click();

    // * Click on the next button
    cy.get("#modalSelectCategory button.upload-button-next").should("be.visible").click();
    cy.wait(1000);

    // * Get the category ID
    cy.get("@categoryId").then((categoryId) => {
      // * Check if the URL includes the subfolder create page
      cy.url().should("include", `/dashboard/category/${categoryId}/subcategory/create`);
    });

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
