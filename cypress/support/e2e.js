import './commands'
import 'cypress-mochawesome-reporter/register'

afterEach(function () {
  const state = this.currentTest.state
  const title = this.currentTest.fullTitle().replace(/[^a-zA-Z0-9]/g, '_')
  cy.screenshot(`${state}/${title}`)
})