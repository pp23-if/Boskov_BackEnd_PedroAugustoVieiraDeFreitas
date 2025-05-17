const express = require('express');
const router = express.Router();
const generoController = require('./generoController');
const autenticacao = require("../middlewares/autenticacaoController");

router.get('/', autenticacao, generoController.buscaGeneros);
router.get('/filmes', autenticacao, generoController.buscaFilmeGenero);

module.exports = router;
