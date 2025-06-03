const express = require('express')
const router = express.Router()
const usuarioController = require('./usuarioController')
const autenticacao = require("../middlewares/autenticacaoController");

router.post('/cadastro', usuarioController.cadastro);
router.patch('/:id/delecao', autenticacao, usuarioController.delecao);
router.patch('/:id/desfazerDelecao', autenticacao, usuarioController.desfazerDelecao);
router.put('/:id', autenticacao, usuarioController.atualizacao);
router.get('/busca_nome', autenticacao, usuarioController.buscaNome); 
router.get('/busca_nascimento', autenticacao, usuarioController.buscaDataNascimento);
router.get('/busca_apelido', autenticacao, usuarioController.buscaApelido);            
router.get('/busca_email', autenticacao, usuarioController.buscaEmail); 
router.get('/busca_clientes', autenticacao, usuarioController.buscaUsuariosClientes);      
router.get('/busca_usuarios', autenticacao, usuarioController.buscaUsuarios);
router.get('/busca_tipo', autenticacao, usuarioController.buscaTipoUsuario);             
router.get('/:id', autenticacao, usuarioController.buscaId); 

module.exports = router