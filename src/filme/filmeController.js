const prisma = require("../prisma/prismaClient");

// Buscar todos os filmes
const buscaFilmes = async (req, res) => {
  try {
    const filmes = await prisma.filme.findMany({
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filmes", message: error.message });
  }
};

// Buscar por ID
const buscaId = async (req, res) => {
  const { id } = req.params;
  try {
    const filme = await prisma.filme.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    if (!filme) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }
    res.status(200).json(filme);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar filme por ID", message: error.message });
  }
};

// Buscar por nome
const buscaNome = async (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ error: "Nome não fornecido" });
  }

  try {
    const filmes = await prisma.filme.findMany({
      where: {
        nome: {
          contains: nome,
        },
      },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por nome", message: error.message });
  }
};

// Buscar por diretor
const buscaDiretor = async (req, res) => {
  const { diretor } = req.query;
  if (!diretor) {
    return res.status(400).json({ error: "Diretor não fornecido" });
  }

  try {
    const filmes = await prisma.filme.findMany({
      where: {
        diretor: {
          contains: diretor,
        },
      },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por diretor", message: error.message });
  }
};

// Buscar por ano de lançamento
const buscaAnoLancamento = async (req, res) => {
  const { ano } = req.query;
  if (!ano) {
    return res.status(400).json({ error: "Ano de lançamento não fornecido" });
  }

  try {
    const filmes = await prisma.filme.findMany({
      where: {
        ano_lancamento: {
          gte: new Date(`${ano}-01-01`),
          lt: new Date(`${Number(ano) + 1}-01-01`),
        },
      },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por ano de lançamento", message: error.message });
  }
};

// Buscar por duração
const buscaDuracao = async (req, res) => {
  const { duracao } = req.query;
  if (!duracao) {
    return res.status(400).json({ error: "Duração não fornecida" });
  }

  try {
    const filmes = await prisma.filme.findMany({
      where: {
        duracao: Number(duracao),
      },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por duração", message: error.message });
  }
};

// Buscar por produtora
const buscaProdutora = async (req, res) => {
  const { produtora } = req.query;
  if (!produtora) {
    return res.status(400).json({ error: "Produtora não fornecida" });
  }

  try {
    const filmes = await prisma.filme.findMany({
      where: {
        produtora: {
          contains: produtora,
        },
      },
      select: {
        id: true,
        nome: true,
        sinopse: true,
        diretor: true,
        ano_lancamento: true,
        duracao: true,
        produtora: true,
        classificacao: true,
        poster: true,
      },
    });
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por produtora", message: error.message });
  }
};

module.exports = {
  buscaFilmes,
  buscaId,
  buscaNome,
  buscaDiretor,
  buscaAnoLancamento,
  buscaDuracao,
  buscaProdutora,
};
