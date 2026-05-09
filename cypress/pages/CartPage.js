class CartPage {

  get cartItems()     { return cy.get('#tbodyid') }
  get cartTotal()     { return cy.get('#totalp') }
  get placeOrderBtn() { return cy.contains('Place Order') }

  get orderTotal()      { return cy.get('#totalm') }
  get nameInput()       { return cy.get('#name') }
  get countryInput()    { return cy.get('#country') }
  get cityInput()       { return cy.get('#city') }
  get creditCardInput() { return cy.get('#card') }
  get monthInput()      { return cy.get('#month') }
  get yearInput()       { return cy.get('#year') }
  get purchaseBtn()     { return cy.get('button[onclick="purchaseOrder()"]') }

  get confirmationTitle()   { return cy.get('.sweet-alert h2') }
  get confirmationDetails() { return cy.get('.sweet-alert p') }
  get confirmOkBtn()        { return cy.get('.confirm') }

  getCartTotal() {
    return this.cartTotal.invoke('text').then((text) => text.trim())
  }

  verifyCartItemCount(count) {
    this.cartItems.children().should('have.length', count, `Cart should have ${count} item(s)`)
  }

  verifyCartContains(productName) {
    this.cartItems.should('contain', productName, `Cart should contain "${productName}"`)
  }

  verifyCartIsEmpty() {
    this.cartItems.children().should('have.length', 0, 'Cart should be empty')
    this.cartTotal.invoke('text').should('eq', '', 'Cart total should be empty')
  }

  deleteFirstItem() {
    this.cartItems.find('tr').first().contains('Delete').click()
  }

  verifyCartTotal() {
    let calculatedTotal = 0
    this.cartItems.find('tr').each(($row) => {
      const price = parseInt($row.find('td').eq(2).text().trim())
      calculatedTotal += price
    }).then(() => {
      this.cartTotal.invoke('text').then((cartTotal) => {
        expect(parseInt(cartTotal), `Cart total should equal sum of all item prices: ${calculatedTotal}`).to.eq(calculatedTotal)
      })
    })
  }

  placeOrder(details, expectedTotal = null) {
    this.placeOrderBtn.click()
    cy.get('#orderModal').should('be.visible', 'Order modal should appear after clicking Place Order')
    if (expectedTotal) {
      this.orderTotal.should('contain', `Total: ${expectedTotal}`, `Order total should be ${expectedTotal}`)
    } else {
      this.orderTotal.should('contain', 'Total:', 'Order total should be visible')
    }
    if (details.name)       this.nameInput.type(details.name)
    if (details.country)    this.countryInput.type(details.country)
    if (details.city)       this.cityInput.type(details.city)
    if (details.creditCard) this.creditCardInput.clear().type(details.creditCard)
    if (details.month)      this.monthInput.type(details.month)
    if (details.year)       this.yearInput.type(details.year)
    this.purchaseBtn.click()
  }

  verifyOrderConfirmation(details, expectedAmount = null) {
    this.confirmationTitle.should('contain', 'Thank you for your purchase!', 'Order confirmation title should appear')
    this.confirmationDetails.should('contain', 'Id:', 'Confirmation should contain an order ID')
    if (expectedAmount) {
      this.confirmationDetails.should('contain', `Amount: ${expectedAmount} USD`, `Order amount should be ${expectedAmount} USD`)
    } else {
      this.confirmationDetails.should('contain', 'Amount:', 'Confirmation should contain an amount')
    }
    this.confirmationDetails.should('contain', `Card Number: ${details.creditCard}`, `Confirmation should show card number ${details.creditCard}`)
    this.confirmationDetails.should('contain', `Name: ${details.name}`, `Confirmation should show name ${details.name}`)
    this.confirmationDetails.should('contain', 'Date:', 'Confirmation should contain a date')
    this.confirmOkBtn.click()
  }

}

export default new CartPage()