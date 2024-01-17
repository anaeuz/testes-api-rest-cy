/// <reference types="cypress" />
import contrato from '../contracts/ususarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
      })

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'
      }).then((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
          expect(response.duration).to.be.lessThan(20)
      })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
     let usuarios = `Usuario${Math.floor(Math.random() * 100000000)}`
     cy.request({
         method: 'POST',
         url: 'usuarios',
         body: {
             "nome": usuarios,
             "email": "ana@test.com",
             "password": "mudar@123",
             "administrador": "Ana"
         },
         headers: { authorization: token }
     }).then((response) => {
         expect(response.status).to.equal(201)
         expect(response.body.message).to.equal('Cadastro realizado com sucesso')
     })
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarUsuario(token, usuarios, "anapaula@net.com", "teste123", "ana")
     .then((response) => {
         expect(response.status).to.equal(400)
         expect(response.body.message).to.equal('Este email já está sendo usado')
     })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     cy.request('usuarios').then(response => {
          let id = response.body.usuarios[0]._id
          cy.request({
              method: 'PUT', 
              url: `usuarios/${id}`,
              headers: {authorization: token}, 
              body: 
              {
               "nome": usuarios,
               "email": "ana@test.com",
               "password": "mudar@123",
               "administrador": "Ana"
               }
          }).then(response => {
              expect(response.body.message).to.equal('Registro alterado com sucesso')
          })
      })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     let usuarios = `Usuario${Math.floor(Math.random() * 100000000)}`
     cy.cadastrarUsuario(token, usuarios, "ana@123.net", "teste123", "eu")
     .then(response => {
         let id = response.body._id
         cy.request({
             method: 'DELETE',
             url: `usuarios/${id}`,
             headers: {authorization: token}
         }).then(response =>{
             expect(response.body.message).to.equal('Registro excluído com sucesso')
             expect(response.status).to.equal(200)
         })
     })
 });
    });


});
