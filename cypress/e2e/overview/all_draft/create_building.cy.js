import { faker } from "@faker-js/faker";

describe("Create Building From Draft Spec", () => {
  beforeEach(() => {
    cy.login();
    cy.createBuildingDraft();
    cy.wait(3000);
  });

  it("Should create building from draft successfully", () => {
    let name = "Building " + faker.company.name() + " " + faker.string.numeric(4);
    let street = faker.location.streetAddress();
    let houseNumber = faker.string.numeric(2);
    let postCode = faker.string.numeric(5);

    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on all drafts sidebar item
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

    // * Click first building draft
    cy.get('.ag-center-cols-container .ag-row a[href*="/dashboard/category/building/create"]').should("have.length.at.least", 1).first().click();
    cy.url().should("include", "/dashboard/category/building/create");
    cy.wait(3000);

    // * If name is empty, type a new name
    cy.get("input[name='name']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='name']").type(name).should("have.value", name);
          cy.wait(1000);
        }
      });

    // * Click on next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * If street is empty, type a new street
    cy.get("input[name='street']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='street']").type(street).should("have.value", street);
          cy.wait(1000);
        }
      });

    // * If house number is empty, type a new house number
    cy.get("input[name='house_number']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='house_number']").type(houseNumber).should("have.value", houseNumber);
          cy.wait(1000);
        }
      });

    // * If post code is empty, type a new post code
    cy.get("input[name='postcode']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='postcode']").type(postCode).should("have.value", postCode);
          cy.wait(1000);
        }
      });

    // * If city is empty, select a city
    cy.get("input[name='city']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
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

          // * Wait the modal, then click on first city in the list
          cy.get("#listCityModal").should("exist").find("tbody tr").should("have.length.at.least", 1);
          cy.get("#listCityModal tbody tr").first().click();
          cy.wait(1000);
        }
      });

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
