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

    cy.get('button[title="Building"]').should("be.visible").click();

    cy.wait(1000);

    cy.url().should("include", "/dashboard/category/building/create");

    cy.get("input[name='name']").should("be.visible").type(name).should("have.value", name);

    cy.wait(500);

    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

    cy.get("input[name='street']").should("be.visible").type(street).should("have.value", street);

    cy.get("input[name='house_number']").should("be.visible").type(houseNumber).should("have.value", houseNumber);

    cy.get("input[name='postcode']").should("be.visible").type(postCode).should("have.value", postCode);

    cy.intercept("GET", "**/api/v1/master-data/city**").as("getCity");

    cy.get("div.input-custom.mt-3.py-2:visible").filter(':has(img[alt="required"])').first().click();

    cy.wait("@getCity");

    cy.get("#listCityModal").should("be.visible").find("tbody tr").should("have.length.at.least", 1);

    cy.wait(1000);

    cy.get("#listCityModal tbody tr").first().click();

    cy.wait(500);

    cy.intercept("POST", "**/api/v1/dashboard/building").as("createBuilding");

    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

    cy.wait("@createBuilding")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
