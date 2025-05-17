const express = require("express");
const router = express.Router();
const filmeController = require("./filmeController");
const autenticacao = require("../middlewares/autenticacaoController");

// Apenas rotas GET
router.get("/busca_filmes", autenticacao, filmeController.buscaFilmes);
router.get("/buscar_nome", autenticacao, filmeController.buscaNome);
router.get("/buscar_diretor", autenticacao, filmeController.buscaDiretor);
router.get("/buscar_ano", autenticacao, filmeController.buscaAnoLancamento);
router.get("/buscar_duracao", autenticacao, filmeController.buscaDuracao);
router.get("/buscar_produtora", autenticacao, filmeController.buscaProdutora);
router.get("/:id", autenticacao, filmeController.buscaId);

module.exports = router;
