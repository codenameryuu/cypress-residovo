import { faker } from "@faker-js/faker";

describe("Create Tenant From Draft Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create tenant from draft successfully", () => {
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

    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the tenant management sidebar item
    cy.get("a[href='/dashboard/tenant']").should("exist").click();
    cy.wait(1000);

    // * Click on the all drafts sidebar item
    cy.get("a[href='/dashboard/tenant/draft']").should("exist").click();
    cy.url().should("include", "/dashboard/tenant/draft");
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

    // * Click first data on the table
    cy.get(".ag-center-cols-container .ag-row").should("have.length.at.least", 1).first().click();
    cy.url().should("match", /\/dashboard\/category\/(?:\d+\/)?building\/\d+\/tenant\/create/);
    cy.wait(5000);

    // * If first name is empty, type a new first name
    cy.get("input[name='first_name']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='first_name']").type(firstName).should("have.value", firstName);
          cy.wait(1000);
        }
      });

    // * If last name is empty, type a new last name
    cy.get("input[name='last_name']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='last_name']").type(lastName).should("have.value", lastName);
          cy.wait(1000);
        }
      });

    // * If email is empty, type a new email
    cy.get("input[name='email']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='email']").type(email).should("have.value", email);
          cy.wait(1000);
        }
      });

    // * If phone number is empty, type a new phone number
    cy.get("input[name='phone']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='phone']").type(phoneNumber).should("have.value", phoneNumber);
          cy.wait(1000);
        }
      });

    // * Wait for TinyMCE to be fully loaded
    cy.get("iframe.tox-edit-area__iframe", { timeout: 15000 }).should("exist");
    cy.window({ timeout: 15000 }).should((win) => {
      expect(win.tinymce, "tinymce global").to.exist;
      const editor = win.tinymce.activeEditor || win.tinymce.editors?.[0];
      expect(editor, "tinymce editor").to.exist;
      expect(editor.initialized, "tinymce initialized").to.eq(true);
      expect(editor.getBody(), "tinymce body").to.exist;
    });

    // * If note is empty, type a new note
    cy.window().then((win) => {
      const editor = win.tinymce.activeEditor || win.tinymce.editors[0];
      const content = (editor.getContent({ format: "text" }) || "").trim();

      if (!content) {
        cy.get("iframe.tox-edit-area__iframe").then(($iframe) => {
          const $body = $iframe.contents().find("body#tinymce");
          cy.wrap($body).click({ force: true });
          cy.wait(300);
          cy.wrap($body).type(`{selectall}{backspace}${note}`, { delay: 20, force: true });
          cy.wrap($body).should("contain.text", note);
        });

        cy.window().then((w) => {
          const ed = w.tinymce.activeEditor || w.tinymce.editors[0];
          ed.fire("change");
          ed.fire("input");
          ed.save();
        });

        cy.wait(500);
      }
    });

    // * Click on the next button
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

          // * Wait for the city modal to be visible
          cy.get("#listCityModal").should("exist").find("tbody tr").should("have.length.at.least", 1);

          // * Click on the first city in the list
          cy.get("#listCityModal tbody tr").first().click();
          cy.wait(1000);
        }
      });

    // * Click on the next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Make sure the send email checkbox is not checked
    cy.get("#tenantInvitationModal").should("exist");
    cy.get('#tenantInvitationModal img[src*="icon-checked"]').then(($checked) => {
      if ($checked.length) {
        cy.wrap($checked).first().click();
        cy.wait(1000);
      }
    });

    // * Intercept create tenant API
    cy.intercept("POST", "**/api/v1/dashboard/tenant").as("createTenant");

    // * Click on the Done button
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
