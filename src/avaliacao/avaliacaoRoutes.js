
const express = require("express");
const router = express.Router();
const avaliacaoController = require("./avaliacaoController");
const autenticacao = require("../middlewares/autenticacaoController");

router.post("/cadastro", autenticacao, avaliacaoController.cadastro);
router.get("/busca_avaliacoes", autenticacao, avaliacaoController.buscaAvaliacao);
router.get("/:id_usuario", autenticacao, avaliacaoController.buscaAvaliacaoIdUsuario);
router.put("/atualizacao/:id_usuario/:id_filme", autenticacao, avaliacaoController.atualizacao);

module.exports = router;
