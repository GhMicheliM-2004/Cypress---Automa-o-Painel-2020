describe('Testes de Login - Painel2020', () => {
    const url = 'https://painel2020.vivaintra.com.dev.vivaweb.net/user/login'
  
    beforeEach(() => {
        // Acessa a página de login antes de cada teste
        cy.visit(url)
    })
  
    it('Should display the login page correctly', () => { // Arrow Function 
        // Verifica se os campos e botões estão presentes
        cy.get('[type="text"]')
            .should('be.visible')
        cy.get('[type="password"]')
            .should('be.visible')
        cy.get('.btn')
            .contains('Entrar')
            .should('be.visible')
    })
  
    it('Should realize login with right credencials', () => {
        // Insere credenciais válidas
        // Informações inválidas por proteção dos dados de login
        cy.get('[type="text"]')
            .type('email@teste.com')
        cy.get('[type="password"]')
            .type('password123')
        cy.get('.btn')
            .click()
  
        // Verifica se redirecionou para a página inicial
        cy.url()
            .should('be.eq', 'https://painel2020.vivaintra.com.dev.vivaweb.net/admin/gestor/apps') 
            // URL deve ser igual à /admin/gestor/apps
    })
  
    it('Should display error message for wrong credentials', () => {
        // Insere credenciais inválidas
        cy.get('[type="text"]')
            .type('teste@vivawworks.com')
        cy.get('[type="password"]')
            .type('senha123')
        cy.get('.btn')
            .click()

        // Verifica se a mensagem de erro é exibida
        cy.contains('Usuário e/ou Senha inválido(s)')
            .should('be.visible')
    })
  
    it('Should check required all forms', () => {
        // Tenta enviar o formulário sem preencher os campos
        cy.get('.btn')
            .click()
    
        // Verifica mensagens de erro para campos obrigatórios
        cy.get('.help-block')
        // Não é possível usar .contains neste caso, pois o método retorna apenas um elemento, e não dois como neste caso
            .should('be.visible')
            .and('have.length', 2)
            .and('contain', "Value is required and can't be empty")
            // E deve ter quantidade de elementos igual a 2
        
    })
  })

describe('Testes de Módulo Configurações - Painel2020', () => {
    const url = 'https://painel2020.vivaintra.com.dev.vivaweb.net/admin/gestor/apps'

    beforeEach('Login', () => {
        // Acessa a página de login antes de cada teste
        cy.visit(url)
        // Informações inválidas por proteção dos dados de login
        cy.get('[type="text"]')
            .type('email@teste.com')
        cy.get('[type="password"]')
            .type('password123')
        cy.get('.btn')
            .click()

        // Acessa o módulo Configurações antes de cada teste  
        cy.get('[title="Configurações"]')
            .click()
    })

    it('Should display the module page corretly', () => {
        // Verifica se os campos e relatórios estão presentes
        cy.url()
            .should('be.eq', 'https://painel2020.vivaintra.com.dev.vivaweb.net/admin/users')

        // Forma mais segura de verificar se algo está contido no corpo da página
        cy.get('.col-md-10 > .panel > .panel-heading > .col-md-8')
            .should('contain', 'Relatório de Usuários')

        cy.get('.col-md-2 > .panel > .panel-heading')
            .should('contain', 'Usuários')
    })

    it('Should add user', () => {
        // Verifica se é existe o campo Adicionar Usuário
        cy.get('[title="Adicionar Usuário"]')
            .click()
        
        // Verifica se redirecionou para a página de formulário de usuário
        cy.url()
            .should('include', '/manter')

        // Cadastra todas as informações do usuário
        cy.get(':nth-child(2) > .col-sm-9 > .span5')
            .type('Teste')

        cy.get(':nth-child(3) > .col-sm-9 > .span5')
            .type('teste@teste.com')

        cy.get(':nth-child(4) > .col-sm-9 > .span5')
            .select('Comercial')

        cy.get(':nth-child(5) > .col-sm-9 > .span3')
            .type('123mudar')

        cy.get(':nth-child(6) > .col-sm-9 > .span3')
            .type('123mudar')

        cy.get('.checkbox > .span3')
            .click()

        cy.get(':nth-child(8) > div > .btn')
            .click()

        // Verifica se foi possível ver o alerta de cadastro realizado com sucesso
        cy.get('.alert')
            .should('contain', 'Novo registro realizado com sucesso.')

    })

    it('Should edit', () => {
        // Verifica um usuário e clica em editar
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .btn')
            .click()
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .dropdown-menu > :nth-child(1)')
            .click()

        // Edita as informações do usuário
        cy.get('[name="fullName"]').clear()
            .type('Teste editado')
        cy.get('[name="email"]').clear()
            .type('email@teste.com')
        cy.get('[name="role')
            .select('Comercial')
        cy.get('[name="password')
            .type('123mudar')
        cy.get('[name="password-confirm')
            .type('123mudar')

        // Clica em Salvar
        cy.get('[name="submit"]')
            .click()

        // Verifica se o alerta foi exibido    
        cy.get('.alert')
            .should('contain', 'Novo registro realizado com sucesso.')
    })

    it('Should desative user', () => {
        // Verifica o usuário criado anteriormente e clica em desativar
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .btn')
            .click()
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .dropdown-menu > :nth-child(3)')
            .click()

        // Confirma a desativação
        cy.get('#ict-reg > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
            .click()

        // Verifica se a tag do usuário foi trocada para Inativo e se o alerta foi exibido
        cy.get(':nth-child(4) > .text-center > .label') 
            .should('have.text', 'Inativo')
        cy.get('.alert')
            .should('contain', 'Registro foi atualizado com sucesso')
    })

    it('Should exclude user', () => {
        // Verifica o usuário criado anteriormente e clica em excluir
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .btn')
            .click()
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .dropdown-menu > :nth-child(2)')            
            .click()

        // Confirma a exclusão
        cy.get('#del-reg > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
            .click()

        // Verifica se o usuário excluído sumiu do relatório e se o alerta foi exibido
        cy.get('tbody > :nth-child(4) > :nth-child(2)') 
        cy.get('tbody > :nth-child(4) > :nth-child(3)')           
            .should('not.be.equal', ['Teste', 'Comercial'])
        cy.get('.alert')
            .should('contain', 'Registro removido com sucesso.')
    })

    it('Should active user', () => {
        // Verifica qualquer usuário e clica em desativar
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .btn')
            .click()
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .dropdown-menu > :nth-child(3)')
            .click()

        // Confirma a desativação
        cy.get('#ict-reg > .modal-dialog > .modal-content > .modal-footer > .btn-primary')
            .click()

            // Verifica qualquer usuário e clica em ativar
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .btn')
            .click()
        cy.get(':nth-child(4) > :nth-child(4) > .btn-group > .dropdown-menu > :nth-child(3)')
            .click()

        // Verifica se a tag do usuário foi trocada para Ativo e se o alerta foi exibido
        cy.get(':nth-child(4) > .text-center > .label') 
            .should('have.text', 'Ativo')
        cy.get('.alert')
            .should('contain', 'Registro foi atualizado com sucesso')
    })

    it('Should search by name', () => {
        // Busca no filtro do módulo
        cy.get('[name="fullName"]')
            .type('Vivaweb');
        cy.get('[name="submit"]')
            .click();
        
        // Seleciona todas as células na primeira coluna
        cy.get('tbody > tr > :nth-child(1)').each(($el) => {
            // Encapsula $el, o transforma em um objeto gerenciado pelo Cypress e verifica se cada célula tem o texto "Vivaweb"
            cy.wrap($el).should('contain.text', 'Vivaweb');
        });
    });
  })