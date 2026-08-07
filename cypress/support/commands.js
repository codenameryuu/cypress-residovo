Cypress.Commands.add("login", () => {
  const apiUrl = Cypress.expose("API_URL");
  const url = apiUrl + "/auth/login";

  const email = "fikri@kemang.sg";
  const password = "fikrisabriansyah123@";

  cy.request({
    method: "POST",
    url: url,
    body: {
      email: email,
      password: password,
      language: "en",
    },
  }).then((res) => {
    window.localStorage.setItem("access_token", res.body.data.access_token);
  });
});
