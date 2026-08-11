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
    let floor = faker.string.numeric(1);
    let unit = faker.string.numeric(1);

    // * Open tenant management page first, then wait for table data
    cy.contains("a[href='/dashboard/tenant']", "Tenant Management").should("be.visible").click();
    cy.url().should("include", "/dashboard/tenant");
    cy.wait(3000);

    // * Intercept get list category ext
    cy.intercept("GET", "**/api/v1/dashboard/category-ext**").as("getListCategoryExt");

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
      })
      .its("body.data.data")
      .then((categories) => {
        const firstCategory = categories[0];
        expect(firstCategory.buildings).to.be.an("array").and.not.be.empty;
        cy.wrap(firstCategory.id ?? null).as("categoryId");
        cy.wrap(firstCategory.buildings[0].id).as("buildingId");
      });

    // * Click the first category in the list
    cy.get("#modalSelectBuildingDocument").should("be.visible").find(".modal-category-title").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Select the first building checkbox
    cy.get("#modalSelectBuildingDocument .col-10.offset-2").should("have.length.at.least", 1).first().find("div").first().click();
    cy.wait(500);

    // * Confirm selection and wait for create tenant page
    cy.get("#modalSelectBuildingDocument button.upload-button-next").should("be.visible").and("be.enabled").click();

    // * Get the category and building ID
    cy.get("@categoryId").then((categoryId) => {
      cy.get("@buildingId").then((buildingId) => {
        const expectedPath = categoryId
          ? `/dashboard/category/${categoryId}/building/${buildingId}/tenant/create`
          : `/dashboard/category/building/${buildingId}/tenant/create`;
        cy.url({ timeout: 15000 }).should("include", expectedPath);
      });
    });

    cy.wait(5000);

    // * Type the first name
    cy.get("input[name='first_name']").should("be.visible").type(firstName).should("have.value", firstName);
    cy.wait(1000);

    // * Type the last name
    cy.get("input[name='last_name']").should("be.visible").type(lastName).should("have.value", lastName);
    cy.wait(1000);

    // * Type the email
    cy.get("input[name='email']").should("be.visible").type(email).should("have.value", email);
    cy.wait(1000);

    // * Type the phone number
    cy.get("input[name='phone']").should("be.visible").type(phoneNumber).should("have.value", phoneNumber);
    cy.wait(1000);

    // * Wait for TinyMCE to be fully loaded, then type the note
    cy.get("iframe.tox-edit-area__iframe", { timeout: 15000 }).should("exist");
    cy.window({ timeout: 15000 }).should((win) => {
      expect(win.tinymce, "tinymce global").to.exist;
      const editor = win.tinymce.activeEditor || win.tinymce.editors?.[0];
      expect(editor, "tinymce editor").to.exist;
      expect(editor.initialized, "tinymce initialized").to.eq(true);
      expect(editor.getBody(), "tinymce body").to.exist;
    });

    cy.get("iframe.tox-edit-area__iframe").then(($iframe) => {
      const $body = $iframe.contents().find("body#tinymce");
      cy.wrap($body).click({ force: true });
      cy.wait(300);
      cy.wrap($body).type(`{selectall}{backspace}${note}`, { delay: 20, force: true });
      cy.wrap($body).should("contain.text", note);
    });

    cy.window().then((win) => {
      const editor = win.tinymce.activeEditor || win.tinymce.editors[0];
      editor.fire("change");
      editor.fire("input");
      editor.save();
    });

    cy.wait(500);

    // * Click on the next button once enabled
    cy.get("button.upload-button-next:visible").should("be.enabled").and("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Type the street
    cy.get("input[name='street']").should("be.visible").type(street).should("have.value", street);
    cy.wait(1000);

    // * Type the house number
    cy.get("input[name='house_number']").should("be.visible").type(houseNumber).should("have.value", houseNumber);
    cy.wait(1000);

    // * Type the post code
    cy.get("input[name='postcode']").should("be.visible").type(postCode).should("have.value", postCode);
    cy.wait(1000);

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

    // * Type the floor
    cy.get("input[name='floor']").should("be.visible").type(floor).should("have.value", floor);
    cy.wait(1000);

    // * Type the unit
    cy.get("input[name='unit']").should("be.visible").type(unit).should("have.value", unit);
    cy.wait(1000);

    // * Click on the next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Intercept create tenant API
    cy.intercept("POST", "**/api/v1/dashboard/tenant").as("createTenant");

    // * Click on the next button
    cy.get("#tenantInvitationModal button.upload-button-next").should("be.visible").click();

    // * Wait for create tenant API to be called
    cy.wait("@createTenant")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });
  });
});
