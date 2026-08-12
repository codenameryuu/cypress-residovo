import { faker } from "@faker-js/faker";

describe("Create Tenant From Draft Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create tenant from draft successfully", () => {
    let topic = "Test Topic " + faker.lorem.sentence();
    let message = "Test Message " + faker.lorem.sentence();

    // * Click message sidebar item
    cy.get("a[href='/dashboard/message']").should("exist").click();
    cy.url().should("include", "/dashboard/message");
    cy.wait(1000);

    // * Intercept get list draft API
    cy.intercept("GET", "**/api/v1/dashboard/draft?**").as("getListDraft");

    // * Click on the all draft messages sidebar item
    cy.get("a[href='/dashboard/message/draft']").should("exist").click();
    cy.url().should("include", "/dashboard/message/draft");
    cy.wait(3000);

    // * Wait for get list draft API to be called
    cy.wait("@getListDraft")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
        expect(response.body.data.data).to.be.an("array").and.not.be.empty;
      });

    // * Click first data on the table
    cy.get(".ag-center-cols-container .ag-row").should("have.length.at.least", 1);
    cy.get(".ag-center-cols-container .ag-row").first().find("a[href*='/dashboard/message/create']").first().click();
    cy.url().should("match", /\/dashboard\/message\/create/);
    cy.wait(3000);

    // * If recipient is empty, then choose new recipient
    cy.get("body").then(($body) => {
      if (!$body.find("span.total-resipient").length) {
        // * Click on add tenant button
        cy.get("span.add-tenant").should("exist").click();
        cy.wait(2000);

        // * Click checkbox on first item in the list
        cy.get("#listTenantModal").should("be.visible").find("tbody tr").should("have.length.at.least", 1);
        cy.get("#listTenantModal tbody tr").first().find('img[src*="icon-unselected-checkbox"]').should("exist").click();
        cy.wait(1000);

        // * Click on the next button
        cy.get("#listTenantModal button.upload-button-next").should("exist").click();
        cy.wait(1000);

        // * Make sure the send email checkbox is not checked
        cy.get("body").then(($body) => {
          const $checked = $body.find("svg.lucide-check:visible");
          if ($checked.length) {
            cy.wrap($checked).first().closest("div").click();
            cy.wait(1000);
          }
        });

        // * Click on the done button
        cy.get("#listSelectedTenantModal button.upload-button-next").should("exist").click();
        cy.wait(1000);
      }
    });

    // * If topic is empty, type a new topic
    cy.get("input[name='topic']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='topic']").type(topic).should("have.value", topic);
          cy.wait(1000);
        }
      });

    // * If message is empty, type a new message
    cy.get("input[name='message']")
      .should("exist")
      .invoke("val")
      .then((value) => {
        if (!value) {
          cy.get("input[name='message']").type(message).should("have.value", message);
          cy.wait(1000);
        }
      });

    // * Intercept create message API
    cy.intercept("POST", "**/api/v1/dashboard/broadcast-message").as("createMessage");

    // * Click on the done button
    cy.get("button.btn-send-message").should("exist").click();

    // * Wait for create category API to be called
    cy.wait("@createMessage")
      .its("response")
      .should((response) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.deep.include({ status: true });
      });
  });
});
