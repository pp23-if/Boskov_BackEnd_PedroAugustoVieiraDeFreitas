const prisma = require("../prisma/prismaClient");

const buscaGeneros = async (req, res) => {
  try {
    const generos = await prisma.genero.findMany();
    res.status(200).json(generos);
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
    res.status(500).json({ error: "Erro ao buscar gêneros", message: error.message });
  }
};

const buscaFilmeGenero = async (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({ error: "Nome do gênero não fornecido" });
  }

  try {
    const genero = await prisma.genero.findFirst({
      where: {
        descricao: {
          equals: nome,
        },
      },
      include: {
        genero_filme: {
          include: {
            filme: true,
          },
        },
      },
    });

    if (!genero) {
      return res.status(404).json({ error: "Gênero não encontrado" });
    }

    const filmes = genero.genero_filme.map((gf) => gf.filme);

    res.status(200).json(filmes);
  } catch (error) {
    console.error("Erro ao buscar filmes por gênero:", error);
    res.status(500).json({ error: "Erro ao buscar filmes", message: error.message });
  }
};

module.exports = {
  buscaGeneros,
  buscaFilmeGenero,
};
