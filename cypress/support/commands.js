Cypress.Commands.add('loginViaApi', () => {
  cy.fixture('userData').then((user) => {
    cy.request({
      method: 'POST',
      url: 'https://api.demoblaze.com/login',
      body: {
        username: user.username,
        password: btoa(user.password)
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      window.localStorage.setItem('usertoken', response.body.Authorization)
    })
  })
})