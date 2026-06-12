Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (data ={
    firstName:'Eu',
    lastName: 'Mesmo',
    email:'eu.mesmo@gmail.com',
    phone: '123456789',
    text: 'Vai Corinthians!'

})=>{
      cy.get('#firstName').type(data.firstName)
      cy.get('#lastName').type(data.lastName)
      cy.get('#email').type(data.email)
      cy.get('#phone').type(data.email)
      cy.get('#open-text-area').type(data.text)
      cy.contains('button','Enviar').click()

})