class HomePage {

  get laptopsCategory() { return cy.contains('Laptops') }
  get cartNavBtn() { return cy.get('#cartur') }
  get nextPageBtn() { return cy.get('#next2') }
  get homeLogoBtn() { return cy.get('#nava') }
  get allProductLinks() { return cy.get('h4.card-title a.hrefch') }

navigateToLaptops() {
  this.homeLogoBtn.click()
  cy.get('h4.card-title').should('be.visible')
  cy.intercept('POST', '**/bycat').as('categoryLoad')
  this.laptopsCategory.click()
  cy.wait('@categoryLoad')
  cy.get('h4.card-title').should('be.visible')
}

  goToNextPage() {
    this.nextPageBtn.scrollIntoView().click()
    cy.get('h4.card-title').should('be.visible')
  }

  selectProduct(productName) {
    cy.contains('a.hrefch', productName).scrollIntoView().click()
  }

  getFirstProductName() {
    return this.allProductLinks.first().invoke('text').then((text) => text.trim())
  }

  selectFirstProduct() {
    this.allProductLinks.first().then(($el) => {
      cy.wrap($el.text().trim()).as('productName')
    })

    cy.get('.card-block h5').first().then(($el) => {
      cy.wrap($el.text().trim()).as('productPrice')
    })

    this.allProductLinks.first().click()
  }

  goToCart() {
    this.cartNavBtn.click()
  }

}

export default new HomePage()