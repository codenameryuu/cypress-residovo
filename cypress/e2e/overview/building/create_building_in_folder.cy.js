import { faker } from "@faker-js/faker";

describe("Create Building in Folder Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create building in folder successfully", () => {
    let name = "Building " + faker.company.name() + " " + faker.string.numeric(4);
    let street = faker.location.streetAddress();
    let houseNumber = faker.string.numeric(2);
    let postCode = faker.string.numeric(5);

    // * Click first folder in the list
    cy.get('a[href^="/dashboard/category/"]')
      .filter((_i, el) => /^\/dashboard\/category\/\d+$/.test(el.getAttribute("href") || ""))
      .should("have.length.at.least", 1)
      .first()
      .click();
    cy.url().should("match", /\/dashboard\/category\/\d+/);
    cy.wait(3000);

    // * Click on plus button
    cy.get("button:has(svg.lucide-plus)").should("exist").click();
    cy.wait(1000);

    // * Click on building button
    cy.get('button:has(img[alt="building"])').should("exist").click();
    cy.url().should("match", /\/dashboard\/category\/[^/]+\/building\/create/);
    cy.wait(3000);

    // * Type name
    cy.get("input[name='name']").should("exist").type(name).should("have.value", name);
    cy.wait(1000);

    // * Click on next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Type street
    cy.get("input[name='street']").should("exist").type(street).should("have.value", street);
    cy.wait(1000);

    // * Type house number
    cy.get("input[name='house_number']").should("exist").type(houseNumber).should("have.value", houseNumber);
    cy.wait(1000);

    // * Type post code
    cy.get("input[name='postcode']").should("exist").type(postCode).should("have.value", postCode);
    cy.wait(1000);

    // * Intercept get city API
    cy.intercept("GET", "**/api/v1/master-data/city**").as("getCity");

    // * Click on city select button
    cy.get("div.input-custom.mt-3.py-2").filter(':has(img[alt="required"])').first().click();
    cy.wait(2000);

    // * Wait for get city API to be called
    cy.wait("@getCity")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });

    // * Wait modal, then click on first city in the list
    cy.get("#listCityModal").should("exist").find("tbody tr").should("have.length.at.least", 1);
    cy.get("#listCityModal tbody tr").first().click();
    cy.wait(1000);

    // * Intercept create building API
    cy.intercept("POST", "**/api/v1/dashboard/building").as("createBuilding");

    // * Click on done button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();

    // * Wait for create building API to be called
    cy.wait("@createBuilding")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });
  });
});
