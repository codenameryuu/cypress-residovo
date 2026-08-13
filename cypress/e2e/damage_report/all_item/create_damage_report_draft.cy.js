import { faker } from "@faker-js/faker";

describe("Create Damage Report Draft Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create damage report draft successfully", () => {
    let title = faker.lorem.sentence(2);
    let description = faker.lorem.sentence();

    // * Click damage report sidebar menu
    cy.get("a[href='/dashboard/damage-report']").should("exist").click();
    cy.url().should("include", "/dashboard/damage-report");
    cy.wait(3000);

    // * Click on create button
    cy.get("div.btn-multi").should("exist").click();
    cy.url().should("contain", "/dashboard/damage-report/create");
    cy.wait(3000);

    // * Type title
    cy.get("input[name='title']").should("exist").type(title).should("have.value", title);
    cy.wait(1000);

    // * Wait for TinyMCE to be fully loaded, then type description
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
      cy.wrap($body).type(`{selectall}{backspace}${description}`, { delay: 20, force: true });
      cy.wrap($body).should("contain.text", description);
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

    // * Click to choose tenant
    cy.get('img[src*="icon-empty-tenant"]').should("exist").click();
    cy.wait(2000);

    // * Wait modal, then click on first item in the table
    cy.get("#listTenantModalSingleSelect").should("be.visible").find("tbody tr").should("have.length.at.least", 1);
    cy.get("#listTenantModalSingleSelect tbody tr").first().find("div.radio-outline").should("exist").click();
    cy.wait(1000);

    // * Click on next button
    cy.get("#listTenantModalSingleSelect button.upload-button-next").should("exist").and("not.be.disabled").click();
    cy.wait(1000);

    // * Click on next button
    cy.get("button.upload-button-next:visible:enabled").should("have.length", 1).click();
    cy.wait(1000);

    // * Click to choose service provider
    cy.get('img[src*="icon-empty-service-provider"]').should("exist").click();
    cy.wait(2000);

    // * Wait modal, then click on first item in the table
    cy.get("#listServiceProviderModalSingleSelect").should("be.visible").find("tbody tr").should("have.length.at.least", 1);
    cy.get("#listServiceProviderModalSingleSelect tbody tr").first().find("div.radio-outline").should("exist").click();
    cy.wait(1000);

    // * Click on next button
    cy.get("#listServiceProviderModalSingleSelect button.upload-button-next").should("exist").and("not.be.disabled").click();
    cy.wait(1000);

    // * Intercept create draft API
    cy.intercept("POST", "**/api/v1/dashboard/draft").as("createDraft");

    // * Click on save draft button
    cy.get("button.upload-button-skip:visible:enabled").should("have.length", 1).click();

    // * Wait for create draft API to be called
    cy.wait("@createDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data).to.exist.and.not.be.empty;
      });
  });
});
