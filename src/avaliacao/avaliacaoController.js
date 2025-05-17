const prisma = require("../prisma/prismaClient");

const cadastro = async (req, res) => {
  const { id_usuario, id_filme, nota, comentario } = req.body;

  try {
    const avaliacaoExistente = await prisma.avaliacao.findUnique({
      where: {
        id_usuario_id_filme: {
          id_usuario,
          id_filme
        }
      }
    });

    if (avaliacaoExistente) {
      return res.status(400).json({ error: "Avaliação já existente para este usuário e filme." });
    }

    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        id_usuario,
        id_filme,
        nota,
        comentario
      }
    });

    res.status(201).json({ message: "Avaliação registrada com sucesso", avaliacao: novaAvaliacao });
  } catch (error) {
    console.error("Erro ao cadastrar avaliação:", error);
    res.status(500).json({ error: "Erro ao cadastrar avaliação", message: error.message });
  }
};

// Buscar todas as avaliações
const buscaAvaliacao = async (req, res) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        usuario: {
          select: { id: true, nome: true, email: true }
        },
        filme: true  // <- retorna todos os campos do filme
      }
    });

    res.status(200).json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações", message: error.message });
  }
};

// Buscar avaliações por ID de usuário
const buscaAvaliacaoIdUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        id_usuario: Number(id_usuario)
      },
      include: {
        filme: true  // Retorna todos os dados do filme vinculado
      }
    });

    res.status(200).json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações do usuário", message: error.message });
  }
};

const atualizacao = async (req, res) => {
  const { id_usuario, id_filme } = req.params;
  const { nota, comentario } = req.body;

  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: {
        id_usuario_id_filme: {
          id_usuario: Number(id_usuario),
          id_filme: Number(id_filme)
        }
      }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: {
        id_usuario_id_filme: {
          id_usuario: Number(id_usuario),
          id_filme: Number(id_filme)
        }
      },
      data: {
        nota,
        comentario
      }
    });

    res.status(200).json({ message: "Avaliação atualizada com sucesso", avaliacao: avaliacaoAtualizada });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar avaliação", message: error.message });
  }
};

module.exports = {
  cadastro,
  buscaAvaliacao,
  buscaAvaliacaoIdUsuario,
  atualizacao,
};
