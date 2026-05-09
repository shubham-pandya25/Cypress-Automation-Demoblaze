class LoginPage {

  get loginNavBtn() { return cy.get('#login2') }
  get loginModal() { return cy.get('#logInModal') }
  get usernameInput() { return cy.get('#loginusername') }
  get passwordInput() { return cy.get('#loginpassword') }
  get loginSubmitBtn() { return cy.get('button[onclick="logIn()"]') }
  get welcomeText() { return cy.get('#nameofuser') }
  get logoutBtn() { return cy.get('#logout2') }

  open() {
    cy.visit('/')
  }

  login(username, password) {
    this.loginNavBtn.click()
    this.loginModal.should('be.visible')
    this.usernameInput.should('be.visible').and('be.enabled')
    if (username) this.usernameInput.invoke('val', username)
    if (password) this.passwordInput.invoke('val', password)
    this.loginSubmitBtn.click()
  }

  verifyLoggedIn() {
    cy.get('#nameofuser', { timeout: 10000 }).should('be.visible', 'Welcome text should be visible after login')
  }

}

export default new LoginPage()