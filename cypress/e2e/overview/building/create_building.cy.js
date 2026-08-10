import { faker } from "@faker-js/faker";

describe("Create Building Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create building successfully with valid data", () => {
    let name = faker.company.name() + " " + faker.string.numeric(4);
    let street = faker.location.streetAddress();
    let houseNumber = faker.string.numeric(2);
    let postCode = faker.string.numeric(5);

    // * Click on the plus button
    cy.get("button:has(svg.lucide-plus)").should("be.visible").click();
    cy.wait(1000);

    // * Click on the building button
    cy.get('button[title="Building"]').should("be.visible").click();
    cy.wait(1000);

    // * Check if the URL includes the building create page
    cy.url().should("include", "/dashboard/category/building/create");

    // * Type the name
    cy.get("input[name='name']").should("be.visible").type(name).should("have.value", name);

    // * Click on the next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

    // * Type the street
    cy.get("input[name='street']").should("be.visible").type(street).should("have.value", street);

    // * Type the house number
    cy.get("input[name='house_number']").should("be.visible").type(houseNumber).should("have.value", houseNumber);

    // * Type the post code
    cy.get("input[name='postcode']").should("be.visible").type(postCode).should("have.value", postCode);

    // * Intercept the get city API
    cy.intercept("GET", "**/api/v1/master-data/city**").as("getCity");

    // * Click on city select button
    cy.get("div.input-custom.mt-3.py-2:visible").filter(':has(img[alt="required"])').first().click();
    cy.wait(1000);

    // * Wait for the city API to be called
    cy.wait("@getCity")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });

    // * Wait for the city modal to be visible
    cy.get("#listCityModal").should("be.visible").find("tbody tr").should("have.length.at.least", 1);

    // * Click on the first city in the list
    cy.get("#listCityModal tbody tr").first().click();
    cy.wait(500);

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
  });
});
