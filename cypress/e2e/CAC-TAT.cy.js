describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')

  })
  it('preenche os campos obrigatórios e envia o formulário', () => {
    //Congela o relógio para controlar o tempo durante os testes
    cy.clock()

    //Repete o texto digitado 10 vezes e armazena na variável longText
    const longText = Cypress._.repeat('abcdefghijklmnopqrstuvwxyz', 10)

    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('eu.mesmo@gmail.com')
    cy.get('#phone').type('123456789')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
    //Avança o relógio em 3 segundos para simular o tempo de exibição da mensagem de sucesso
    cy.tick(3000)

    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('svgregtegexwefxewf')
    cy.get('#phone').type('123456789')
    cy.get('#open-text-area').type('Alguma coisa')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')

  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('Eu')
    cy.get('#lastName').type('Mesmo')
    cy.get('#email').type('svgregtegexwefxewf')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Alguma coisa')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')

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
    cy.clock()

    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')

    cy.tick(3000)
    cy.get('.error').should('not.be.visible')

  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')

    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
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

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')

    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', () => {
    cy.get('#open-text-area')
      .invoke('val', 'Texto preenchido via invoke')
      .should('have.value', 'Texto preenchido via invoke')

  })


  it('faz uma requisição HTTP', () => {
    cy.request({
      method: 'GET',
      url: 'https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html',
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.statusText).to.equal('OK')
      expect(response.body).to.include('CAC TAT')
    })
  })

  it('encontra o gato escondido', () => {
    cy.get('#cat')
      .should('be.hidden')
      .invoke('show')
      .should('be.visible')
  })
})
