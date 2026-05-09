import loginPage from '../../pages/LoginPage'

describe('Login Flow', () => {

  let user

  beforeEach(() => {
    cy.fixture('userData').then((data) => {
      user = data
    })
    loginPage.open()
  })

  it('to verify login successfully with valid credentials', () => {
    loginPage.login(user.username, user.password)
    loginPage.verifyLoggedIn()
    loginPage.welcomeText.should('contain', user.username)
  })

  it('to verify logout successfully', () => {
    loginPage.login(user.username, user.password)
    loginPage.verifyLoggedIn()
    loginPage.logoutBtn.click()
    loginPage.loginNavBtn.should('be.visible')
  })

  describe('Alert validations', () => {

    beforeEach(() => {
      cy.window().then((appWindow) => {
        cy.stub(appWindow, 'alert').as('alertStub')
      })
    })

    it('to verify case sensitivity for username', () => {
      loginPage.login(user.username.toUpperCase(), user.password)
      cy.get('@alertStub').should('have.been.calledWith', 'User does not exist.')
    })

    it('to verify alert for non existing user', () => {
      loginPage.login('usernotexist123', 'somepassword')
      cy.get('@alertStub').should('have.been.calledWith', 'User does not exist.')
    })

    it('to verify alert for wrong password', () => {
      loginPage.login(user.username, 'wrongpassword')
      cy.get('@alertStub').should('have.been.calledWith', 'Wrong password.')
    })

    it('to verify alert when both fields are empty', () => {
      loginPage.login('', '')
      cy.get('@alertStub').should('have.been.calledWith', 'Please fill out Username and Password.')
    })

    it('to verify alert when only username is empty', () => {
      loginPage.login('', 'anypassword')
      cy.get('@alertStub').should('have.been.calledWith', 'Please fill out Username and Password.')
    })

    it('to verify alert when only password is empty', () => {
      loginPage.login('anyusername', '')
      cy.get('@alertStub').should('have.been.calledWith', 'Please fill out Username and Password.')
    })

  })

})