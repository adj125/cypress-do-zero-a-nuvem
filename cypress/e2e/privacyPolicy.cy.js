describe('página Política de Privacidade CAC-TAT', () => {
    Cypress._.times(5, () => {
        it('testa a página da política de privacidade de forma independente', () => {
            cy.visit('./src/privacy.html')
            cy.contains('h1', 'CAC TAT - Política de Privacidade')
              .should('be.visible')

        })
    })
})