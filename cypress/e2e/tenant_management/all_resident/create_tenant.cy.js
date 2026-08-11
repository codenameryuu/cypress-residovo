import { faker } from "@faker-js/faker";

describe("Create Tenant Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create tenant successfully with valid data", () => {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@example.com";
    let phoneNumber = faker.string.numeric(8);
    let note = faker.lorem.sentence();
    let street = faker.location.streetAddress();
    let houseNumber = faker.string.numeric(2);
    let postCode = faker.string.numeric(5);

    // * Click on the tenant management sidebar item
    cy.contains("a[href='/dashboard/tenant']", "Tenant Management").should("be.visible").click();
    cy.wait(3000);

    // * Intercept get list category ext
    cy.intercept("GET", "**/api/v1/dashboard/category-ext**").as("getListCategoryExt");
    cy.wait(1000);

    // * Click on the plus button
    cy.get("div.btn-multi").should("be.visible").click();
    cy.wait(2000);

    // * Wait for get list category ext API to be called
    cy.wait("@getListCategoryExt")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
        expect(response.body.data.data[0].id).to.exist;
        expect(response.body.data.data[0].buildings[0].id).to.exist;
      })
      .its("body.data.data.0")
      .then((data) => {
        cy.wrap(data.id).as("categoryId");
        cy.wrap(data.buildings[0].id).as("buildingId");
      });

    // * Click the first folder
    cy.get("#modalSelectBuildingDocument").should("be.visible").contains(".modal-category-title", "Unallocated building").click();
    cy.wait(1000);

    // * Click the first building
    cy.get("#modalSelectBuildingDocument .col-10.offset-2").should("have.length.at.least", 1).first().children("div").first().click();
    cy.wait(1000);

    // * Click on the next button
    cy.get("#modalSelectBuildingDocument button.upload-button-next").should("be.visible").click();
    cy.wait(1000);

    // * Get the building ID
    cy.get("@buildingId").then((buildingId) => {
      // * Check if the URL includes the tenant create page
      cy.url().should("include", `/dashboard/category/building/${buildingId}/tenant/create`);
    });
    cy.wait(3000);

    // * Type the first name
    cy.get("input[name='first_name']").should("be.visible").type(firstName).should("have.value", firstName);

    // * Type the last name
    cy.get("input[name='last_name']").should("be.visible").type(lastName).should("have.value", lastName);

    // * Type the email
    cy.get("input[name='email']").should("be.visible").type(email).should("have.value", email);

    // * Type the phone number
    cy.get("input[name='phone']").should("be.visible").type(phoneNumber).should("have.value", phoneNumber);

    // * Type the note in TinyMCE editor
    cy.get("iframe.tox-edit-area__iframe").then(($iframe) => {
      const $body = $iframe.contents().find("body#tinymce");
      cy.wrap($body).click({ force: true });
      cy.wait(500);
      cy.wrap($body).type(`{selectall}{backspace}${note}`, { delay: 20, force: true });
      cy.wrap($body).should("contain.text", note);
    });

    // * Click on the next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Type the street
    cy.get("input[name='street']").should("be.visible").type(street).should("have.value", street);

    // * Type the house number
    cy.get("input[name='house_number']").should("be.visible").type(houseNumber).should("have.value", houseNumber);

    // * Type the post code
    cy.get("input[name='postcode']").should("be.visible").type(postCode).should("have.value", postCode);
  });
});
