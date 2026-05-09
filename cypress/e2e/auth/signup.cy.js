import signUpPage from '../../pages/SignUpPage'

describe('Sign Up Flow', () => {

    beforeEach(() => {
        signUpPage.open()
    })

    describe('Alert validations', () => {

        beforeEach(() => {
            cy.window().then((appWindow) => {
                cy.stub(appWindow, 'alert').as('alertStub')
            })
        })

        it('to verify sign up with a random user', () => {
            const randomUser = `user_${Math.floor(Math.random() * 999999)}`
            signUpPage.signUp(randomUser, 'Test@123')
            cy.get('@alertStub').should('have.been.calledWith', 'Sign up successful.')
        })

        it('to verify alert for already existing username', () => {
            signUpPage.signUp('shubham@25', 'Test@25')
            cy.get('@alertStub').should('have.been.calledWith', 'This user already exist.')
        })

        it('to verify alert when only username is filled', () => {
            signUpPage.signUp('someusername', '')
            cy.get('@alertStub').should('have.been.calledWith', 'Please fill out Username and Password.')
        })

        it('to verify alert when only password is filled', () => {
            signUpPage.signUp('', 'somepassword')
            cy.get('@alertStub').should('have.been.calledWith', 'Please fill out Username and Password.')
        })

    })

})