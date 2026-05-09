class SignUpPage {

  get signUpNavBtn() { return cy.get('#signin2') }
  get signUpModal() { return cy.get('#signInModal') }
  get usernameInput() { return cy.get('#sign-username') }
  get passwordInput() { return cy.get('#sign-password') }
  get signUpBtn() { return cy.get('button[onclick="register()"]') }

  open() { cy.visit('/') }

  signUp(username, password) {
    this.signUpNavBtn.click()
    this.signUpModal.should('be.visible')
    this.usernameInput.should('be.visible').and('be.enabled')
    if (username) this.usernameInput.invoke('val', username)
    if (password) this.passwordInput.invoke('val', password)
    this.signUpBtn.click()
  }

}

export default new SignUpPage()