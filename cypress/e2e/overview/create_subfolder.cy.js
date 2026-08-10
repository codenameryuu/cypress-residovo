import { faker } from "@faker-js/faker";

describe("Create Subfolder Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create subfolder successfully with valid data", () => {
    let name = faker.company.name() + " " + faker.string.numeric(4);

    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();

    cy.wait(1000);

    cy.intercept("GET", "**/api/v1/dashboard/list-category").as("getListCategory");

    cy.get('button[title="Subfolder"]').should("be.visible").click();

    cy.wait("@getListCategory")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data[0].id).to.exist;
      })
      .its("body.data.0.id")
      .as("categoryId");

    cy.wait(1000);

    cy.get("#modalSelectCategory").should("be.visible").find(".modal-category-title").should("have.length.at.least", 1).first().click();

    cy.get("#modalSelectCategory button.upload-button-next").should("be.visible").click();

    cy.wait(1000);

    cy.get("@categoryId").then((categoryId) => {
      cy.url().should("include", `/dashboard/category/${categoryId}/subcategory/create`);
    });

    cy.get("input[name='name']").should("be.visible").type(name).should("have.value", name);

    cy.wait(500);

    cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

    cy.wait("@createCategory")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
