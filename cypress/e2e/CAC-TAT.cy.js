describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

  })
  it('preenche os campos obrigatórios e envia o formulário', () => {
    //Repete o texto digitado 10 vezes e armazena na variável longText
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 10)

    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('eu.mesmo@gmail.com')
    cy.get('#phone').type('123456789')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')

  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('svgregtegexwefxewf')
    cy.get('#phone').type('123456789')
    cy.get('#open-text-area').type('Alguma coisa')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('svgregtegexwefxewf')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Alguma coisa')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

  })

  it('campo Telefone deve ficar vazio quando digitado um valor não numérico', () => {
    cy.get('#phone')
      .type('asrwerfwef')
      .should('have.value', '')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Eu')
      .should('have.value', 'Eu')
      .clear()
      .should('have.value', '')

    cy.get('#lastName').type('Mesmo')
      .should('have.value', 'Mesmo')
      .clear()
      .should('have.value', '')

    cy.get('#email').type('eu.mesmo@gmail.com')
      .should('have.value', 'eu.mesmo@gmail.com')
      .clear()
      .should('have.value', '')

    cy.get('#phone').type('123456789')
      .should('have.value', '123456789')
      .clear()
      .should('have.value', '')

  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })


  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')

  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each((TypeofService => {
        cy.wrap(TypeofService)
          .check()
          .should('be.checked')
      }))
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]').check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })


  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/password.jpg')
      .should(input => {
        expect(input[0].files[0].name).to.equal('password.jpg')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('password.jpg', { encoding: null }).as('passwordFile')
    cy.get('input[type="file"]')
      .selectFile('@passwordFile')
      .should(input => {
        expect(input[0].files[0].name).to.equal('password.jpg')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a[href="privacy.html"]')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade')
      .should('be.visible')
  })

})
