const express = require('express')
const router = express.Router()
const usuarioController = require('./usuarioController')
//const autenticacao = require("../middlewares/autenticacaoController");

router.post('/cadastro', usuarioController.cadastro);
router.patch('/:id_usuario', usuarioController.delecao);
router.put('/:id_usuario', usuarioController.atualizacao);
router.get('/busca_nome', usuarioController.buscaNome); 
router.get('/busca_nascimento', usuarioController.buscaDataNascimento);
router.get('/busca_apelido', usuarioController.buscaApelido);            
router.get('/busca_email', usuarioController.buscaEmail);       
router.get('/busca_usuarios',  usuarioController.buscaUsuarios);
router.get('/busca_tipo',  usuarioController.buscaTipoUsuario);             
router.get('/:id_usuario', usuarioController.buscaId); 

module.exports = router