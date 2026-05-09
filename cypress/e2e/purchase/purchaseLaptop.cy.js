import homePage from '../../pages/HomePage'
import productPage from '../../pages/ProductPage'
import cartPage from '../../pages/CartPage'

describe('Laptop Purchase Flow', () => {

  let user

  beforeEach(() => {
    cy.fixture('userData').then((data) => {
      user = data
    })
    cy.loginViaApi()
    cy.visit('/')
  })

  it('to verify full purchase flow for a laptop', () => {
    homePage.navigateToLaptops()
    homePage.selectFirstProduct()
    productPage.verifyProductDetails()
    productPage.addToCart()
    homePage.goToCart()
    cartPage.getCartTotal().then((cartTotal) => {
      cartPage.placeOrder(user.orderDetails)
      cartPage.verifyOrderConfirmation(user.orderDetails, cartTotal)
    })
  })

  it('to verify purchase for a laptop from page 2', () => {
    homePage.navigateToLaptops()
    homePage.goToNextPage()
    homePage.selectFirstProduct()
    productPage.addToCart()
    homePage.goToCart()
    cartPage.getCartTotal().then((cartTotal) => {
      cartPage.placeOrder(user.orderDetails)
      cartPage.verifyOrderConfirmation(user.orderDetails, cartTotal)
    })
  })

  it('to verify purchase of 3 laptops added to cart', () => {
    homePage.navigateToLaptops()
    homePage.allProductLinks.then(($products) => {
      const productNames = [...$products].map(el => el.innerText.trim()).slice(0, 3)

      homePage.selectProduct(productNames[0])
      productPage.addToCart()
      homePage.navigateToLaptops()

      homePage.selectProduct(productNames[1])
      productPage.addToCart()
      homePage.navigateToLaptops()

      homePage.selectProduct(productNames[2])
      productPage.addToCart()

      homePage.goToCart()
      cartPage.verifyCartItemCount(3)
      cartPage.verifyCartTotal()
      cartPage.getCartTotal().then((cartTotal) => {
        cartPage.placeOrder(user.orderDetails)
        cartPage.verifyOrderConfirmation(user.orderDetails, cartTotal)
      })
    })
  })

  it('to verify same product can be added multiple times', () => {
    homePage.navigateToLaptops()
    homePage.getFirstProductName().then((productName) => {
      homePage.selectProduct(productName)
      productPage.addToCart()

      homePage.navigateToLaptops()
      homePage.selectProduct(productName)
      productPage.addToCart()

      homePage.goToCart()
      cartPage.verifyCartItemCount(2)
    })
  })

  it('to verify cart items persist after page refresh', () => {
    homePage.navigateToLaptops()
    homePage.getFirstProductName().then((productName) => {
      homePage.selectProduct(productName)
      productPage.addToCart()

      cy.reload()
      productPage.addToCartBtn.should('be.visible')

      homePage.goToCart()
      cartPage.verifyCartItemCount(1)
      cartPage.verifyCartContains(productName)
    })
  })

  it('to verify item is removed from cart when deleted', () => {
    homePage.navigateToLaptops()
    homePage.getFirstProductName().then((productName) => {
      homePage.selectProduct(productName)
      productPage.addToCart()

      homePage.goToCart()
      cartPage.verifyCartItemCount(1)
      cartPage.deleteFirstItem()
      cartPage.verifyCartIsEmpty()
    })
  })

  describe('First product purchase scenarios', () => {

    beforeEach(() => {
      homePage.navigateToLaptops()
      homePage.selectFirstProduct()
      productPage.addToCart()
      homePage.goToCart()
    })

    it('to verify purchase with different name and card details', () => {
      cartPage.getCartTotal().then((cartTotal) => {
        cartPage.placeOrder(user.alternateOrderDetails)
        cartPage.verifyOrderConfirmation(user.alternateOrderDetails, cartTotal)
      })
    })

    it('to verify purchase with only required fields filled', () => {
      cartPage.getCartTotal().then((cartTotal) => {
        cartPage.placeOrder(user.requiredOnlyDetails)
        cartPage.verifyOrderConfirmation({
          name: user.requiredOnlyDetails.name,
          creditCard: user.requiredOnlyDetails.creditCard
        }, cartTotal)
      })
    })

    it('to verify cart is empty after successful purchase', () => {
      cartPage.getCartTotal().then((cartTotal) => {
        cartPage.placeOrder(user.orderDetails)
        cartPage.verifyOrderConfirmation(user.orderDetails, cartTotal)
      })
      cy.visit('/cart.html')
      cartPage.verifyCartIsEmpty()
    })

    describe('Alert validations', () => {

      beforeEach(() => {
        cy.window().then((appWindow) => {
          cy.stub(appWindow, 'alert').as('orderAlertStub')
        })
      })

      it('to verify alert appears when name and credit card are empty', () => {
        cartPage.placeOrder(user.emptyOrderDetails)
        cy.get('@orderAlertStub').should('have.been.calledWith', 'Please fill out Name and Creditcard.')
      })

      it('to verify alert appears when only name is empty', () => {
        cartPage.placeOrder(user.missingNameDetails)
        cy.get('@orderAlertStub').should('have.been.calledWith', 'Please fill out Name and Creditcard.')
      })

      it('to verify alert appears when only credit card is empty', () => {
        cartPage.placeOrder(user.missingCardDetails)
        cy.get('@orderAlertStub').should('have.been.calledWith', 'Please fill out Name and Creditcard.')
      })

    })

  })

})