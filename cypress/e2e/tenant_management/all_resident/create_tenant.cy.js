import { faker } from "@faker-js/faker";

describe("Create Tenant Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create tenant successfully", () => {
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

    // * Click tenant management sidebar item
    cy.get("a[href='/dashboard/tenant']").should("exist").click();
    cy.url().should("include", "/dashboard/tenant");
    cy.wait(3000);

    // * Intercept get list category ext
    cy.intercept("GET", "**/api/v1/dashboard/category-ext**").as("getListCategoryExt");

    // * Click on plus button
    cy.get("div.btn-multi").should("exist").click();
    cy.wait(2000);

    // * Wait for get list category ext API to be called
    cy.wait("@getListCategoryExt")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Wait modal, then click on first item in the list
    cy.get("#modalSelectBuildingDocument").should("exist").find(".modal-category-title").should("have.length.at.least", 1).first().click();
    cy.wait(1000);

    // * Click on first building checkbox
    cy.get("#modalSelectBuildingDocument .col-10.offset-2").should("have.length.at.least", 1).first().find("div").first().click();
    cy.wait(500);

    // * Confirm selection and wait for create tenant page
    cy.get("#modalSelectBuildingDocument button.upload-button-next").should("exist").click();
    cy.url().should("match", /\/dashboard\/category\/building\/\d+\/tenant\/create/);
    cy.wait(5000);

    // * Type first name
    cy.get("input[name='first_name']").should("exist").type(firstName).should("have.value", firstName);
    cy.wait(1000);

    // * Type last name
    cy.get("input[name='last_name']").should("exist").type(lastName).should("have.value", lastName);
    cy.wait(1000);

    // * Type email
    cy.get("input[name='email']").should("exist").type(email).should("have.value", email);
    cy.wait(1000);

    // * Type phone number
    cy.get("input[name='phone']").should("exist").type(phoneNumber).should("have.value", phoneNumber);
    cy.wait(1000);

    // * Wait for TinyMCE to be fully loaded, then type note
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

    // * Wait for city modal to be visible
    cy.get("#listCityModal").should("exist").find("tbody tr").should("have.length.at.least", 1);

    // * Click on first item in the list
    cy.get("#listCityModal tbody tr").first().click();
    cy.wait(1000);

    // * Type floor
    cy.get("input[name='floor']").should("exist").type(floor).should("have.value", floor);
    cy.wait(1000);

    // * Type unit
    cy.get("input[name='unit']").should("exist").type(unit).should("have.value", unit);
    cy.wait(1000);

    // * Click on done button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Intercept create tenant API
    cy.intercept("POST", "**/api/v1/dashboard/tenant").as("createTenant");

    // * Click on confirm button
    cy.get("#tenantInvitationModal button.upload-button-next").should("exist").click();

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
