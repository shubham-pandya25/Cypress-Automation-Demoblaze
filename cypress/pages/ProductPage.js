class ProductPage {

  get productName()  { return cy.get('h2.name') }
  get productPrice() { return cy.get('h3.price-container') }
  get addToCartBtn() { return cy.get('.btn-success') }

  verifyProductDetails() {
    cy.get('@productName').then((name) => {
      this.productName.should('contain', name, `Product name should contain "${name}"`)
    })
    cy.get('@productPrice').then((price) => {
      this.productPrice.should('contain', price, `Product price should contain "${price}"`)
    })
  }

  addToCart() {
    cy.window().then((appWindow) => {
      cy.stub(appWindow, 'alert').as('addToCartAlert')
    })
    this.addToCartBtn.click()
    cy.get('@addToCartAlert').should('have.been.calledWith', 'Product added')
  }

}

export default new ProductPage()