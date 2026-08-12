import { faker } from "@faker-js/faker";

describe("Create Message Spec", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Should create message successfully with valid data", () => {
    let topic = "Test Topic " + faker.lorem.sentence();
    let message = "Test Message " + faker.lorem.sentence();

    // * Click message sidebar item
    cy.get("a[href='/dashboard/message']").should("exist").click();
    cy.url().should("include", "/dashboard/message");
    cy.wait(3000);

    // * Click on the plus button
    cy.get("div.btn-multi").should("exist").click();
    cy.url().should("include", "/dashboard/message/create");
    cy.wait(3000);

    cy.get("span.add-tenant").should("exist").click();
    cy.wait(2000);

    // * Click checkbox on the first tenant row
    cy.get("#listTenantModal").should("be.visible").find("tbody tr").should("have.length.at.least", 1);
    cy.get("#listTenantModal tbody tr").first().find('img[src*="icon-unselected-checkbox"]').should("exist").click();
    cy.wait(1000);

    // * Click on the next button
    cy.get("#listTenantModal button.upload-button-next").should("exist").click();
    cy.wait(1000);

    // * Click on the done button
    cy.get("#listSelectedTenantModal button.upload-button-next").should("exist").click();
    cy.wait(1000);

    // * Type the topic
    cy.get("input[name='topic']").should("exist").type(topic).should("have.value", topic);
    cy.wait(1000);

    // * Type the message
    cy.get("input[name='message']").should("exist").type(message).should("have.value", message);
    cy.wait(1000);

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
