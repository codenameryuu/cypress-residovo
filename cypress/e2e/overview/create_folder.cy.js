import { faker } from "@faker-js/faker";

describe("Create Building Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create building successfully with valid data", () => {
    const name = faker.company.name() + " " + faker.string.numeric(4);
    const street = faker.location.streetAddress();
    const houseNumber = faker.string.numeric(2);
    const postCode = faker.string.numeric(5);

    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();

    cy.wait(1000);

    cy.get('button[title=" Folder"]').should("be.visible").click();

    cy.wait(1000);

    cy.url().should("include", "/dashboard/category/create");

    cy.get("input[name='name']").should("be.visible").type(name).should("have.value", name);

    cy.wait(500);

    cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

    cy.wait("@createCategory")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
