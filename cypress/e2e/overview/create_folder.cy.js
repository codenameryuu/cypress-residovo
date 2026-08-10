import { faker } from "@faker-js/faker";

describe("Create Folder Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create folder successfully with valid data", () => {
    let name = faker.company.name() + " " + faker.string.numeric(4);

    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();

    cy.wait(1000);

    cy.get('button[title=" Folder"]').should("be.visible").click();

    cy.wait(1000);

    cy.url().should("include", "/dashboard/category/create");

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
