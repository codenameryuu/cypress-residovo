import { faker } from "@faker-js/faker";

describe("Save Data Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should save data successfully with valid data", () => {
    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the all drafts sidebar item
    cy.contains("a[href='/dashboard/category/draft']", "All Drafts").should("be.visible").click();
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
      })
      .its("body.data.data.0")
      .then((data) => {
        cy.wrap(data.sub_type).as("subType");
      });

    // * Click first data on the table
    cy.get(".ag-center-cols-container .ag-row").should("have.length.at.least", 1).first().click();
    cy.wait(3000);

    // * Get the sub type
    cy.get("@subType").then((subType) => {
      if (subType === "building") {
        let name = "Building " + faker.company.name() + " " + faker.string.numeric(4);
        let street = faker.location.streetAddress();
        let houseNumber = faker.string.numeric(2);
        let postCode = faker.string.numeric(5);

        // * If name is empty, type a new name
        cy.get("input[name='name']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='name']").type(name).should("have.value", name);
              cy.wait(1000);
            }
          });

        // * Click on the next button
        cy.contains("button.upload-button-next:visible", "Next").should("be.enabled").scrollIntoView().click();
        cy.wait(1000);

        // * If street is empty, type a new street
        cy.get("input[name='street']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='street']").type(street).should("have.value", street);
              cy.wait(1000);
            }
          });

        // * If house number is empty, type a new house number
        cy.get("input[name='house_number']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='house_number']").type(houseNumber).should("have.value", houseNumber);
              cy.wait(1000);
            }
          });

        // * If post code is empty, type a new post code
        cy.get("input[name='postcode']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='postcode']").type(postCode).should("have.value", postCode);
              cy.wait(1000);
            }
          });

        // * If city is empty, select a city
        cy.get("input[name='city']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              // * Intercept get city API
              cy.intercept("GET", "**/api/v1/master-data/city**").as("getCity");

              // * Click on city select button
              cy.get("div.input-custom.mt-3.py-2:visible").filter(':has(img[alt="required"])').first().click();
              cy.wait(2000);

              // * Wait for get city API to be called
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
              cy.wait(1000);
            }
          });

        // * Intercept create building API
        cy.intercept("POST", "**/api/v1/dashboard/building").as("createBuilding");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

        // * Wait for create building API to be called
        cy.wait("@createBuilding")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });
      }

      if (subType === "category") {
        let name = "Folder " + faker.company.name() + " " + faker.string.numeric(4);

        // * If name is empty, type a new name
        cy.get("input[name='name']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='name']").type(name).should("have.value", name);
              cy.wait(1000);
            }
          });

        // * Intercept create category API
        cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

        // * Intercept delete draft API
        cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

        // * Wait for create category API to be called
        cy.wait("@createCategory")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });

        // * Wait for delete draft API to be called
        cy.wait("@deleteDraft")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
          });
      }

      if (subType === "subcategory") {
        let name = "Subfolder " + faker.company.name() + " " + faker.string.numeric(4);

        // * If name is empty, type a new name
        cy.get("input[name='name']")
          .should("be.visible")
          .invoke("val")
          .then((value) => {
            if (!value) {
              cy.get("input[name='name']").type(name).should("have.value", name);
              cy.wait(1000);
            }
          });

        // * Intercept create category API
        cy.intercept("POST", "**/api/v1/dashboard/category").as("createCategory");

        // * Intercept delete draft API
        cy.intercept("DELETE", "**/api/v1/dashboard/delete-draft").as("deleteDraft");

        // * Click on the Done button
        cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).scrollIntoView().click();

        // * Wait for create category API to be called
        cy.wait("@createCategory")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
            expect(response.body.data).to.exist.and.not.be.empty;
          });

        // * Wait for delete draft API to be called
        cy.wait("@deleteDraft")
          .its("response")
          .should((response) => {
            expect(response.statusCode).to.eq(200);
            expect(response.body).to.deep.include({ status: true });
          });
      }
    });
  });
});
