import signUpPage from '../../pages/SignUpPage'
import loginPage from '../../pages/LoginPage'
import homePage from '../../pages/HomePage'
import productPage from '../../pages/ProductPage'
import cartPage from '../../pages/CartPage'

describe('Full User Journey', () => {
  it('to verify complete journey from sign up to order confirmation', () => {
    
    const randomUser = `u_${Date.now()}`
    const password = 'Test@123'

    cy.fixture('userData').then((user) => {
      signUpPage.open()

      cy.window().then((appWindow) => {
        cy.stub(appWindow, 'alert').as('alertStub')
      })

      signUpPage.signUp(randomUser, password)
      cy.get('@alertStub').should('have.been.calledWith', 'Sign up successful.')

      signUpPage.signUpModal.should('not.be.visible')

      loginPage.loginNavBtn.click()
      loginPage.loginModal.should('be.visible')
      loginPage.usernameInput.invoke('val', randomUser)
      loginPage.passwordInput.invoke('val', password)
      loginPage.loginSubmitBtn.click()

      loginPage.verifyLoggedIn()
      loginPage.welcomeText.should('contain', randomUser)

      homePage.navigateToLaptops()
      homePage.selectFirstProduct()
      productPage.verifyProductDetails()

      cy.intercept('POST', '**/addtocart').as('addToCart')
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('addToCartAlert')
      })
      productPage.addToCartBtn.click()
      cy.wait('@addToCart')
      cy.get('@addToCartAlert').should('have.been.calledWith', 'Product added.')

      homePage.goToCart()

      cartPage.getCartTotal().then((cartTotal) => {
        cartPage.placeOrder(user.orderDetails)
        cartPage.verifyOrderConfirmation(user.orderDetails, cartTotal)
      })
    })
  })
})