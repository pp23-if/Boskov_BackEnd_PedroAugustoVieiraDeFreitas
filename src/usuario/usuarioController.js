const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cadastrar um usuário com transação
const cadastro = async (req, res) => {
  const { nome, email, senha, apelido, data_nascimento, tipo_usuario } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ error: "Email já em uso" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = await prisma.$transaction(async (tx) => {
      const novoUsuario = await tx.usuario.create({
        data: {
          nome,
          email,
          senha: senhaCriptografada,
          apelido,
          data_nascimento: new Date(data_nascimento),
          data_criacao: new Date(),
          data_atualizacao: new Date(),
          tipo_usuario: tipo_usuario || "cliente",
        },
      });

      const token = jwt.sign(
        { id: novoUsuario.id, email: novoUsuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      await tx.token.create({
        data: {
          usuario_id: novoUsuario.id,
          token,
        },
      });

      return { novoUsuario, token };
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", usuario: resultado.novoUsuario, token: resultado.token });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro ao registrar usuário", message: error.message });
  }
};

// Buscar todos os usuários (com atributos limitados)
const buscaUsuarios = async (req, res) => {
  try {
    const filtro = req.usuario?.tipo === "cliente" ? { status: true } : {};

    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários", message: error.message });
  }
};

// Buscar usuário por ID (com atributos limitados)
const buscaId = async (req, res) => {
  const { id } = req.params;

  try {
    const filtro = {
      id: Number(id),
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuario = await prisma.usuario.findFirst({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar por ID:", error);
    res.status(500).json({ error: "Erro ao buscar usuário por ID", message: error.message });
  }
};


const buscaNome = async (req, res) => {
  const { nome } = req.query;

  if (!nome) {
    return res.status(400).json({ error: "Nome não fornecido" });
  }

  try {
    const filtro = {
      nome: { contains: nome, mode: 'insensitive' },
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por nome", message: error.message });
  }
};

// Buscar por email
const buscaEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email não fornecido" });
  }

  try {
    const filtro = {
      email,
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuario = await prisma.usuario.findFirst({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por email", message: error.message });
  }
};

// Buscar por apelido
const buscaApelido = async (req, res) => {
  const { apelido } = req.query;

  if (!apelido) {
    return res.status(400).json({ error: "Apelido não fornecido" });
  }

  try {
    const filtro = {
      apelido: { contains: apelido, mode: 'insensitive' },
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por apelido", message: error.message });
  }
};

// Buscar por data de nascimento
const buscaDataNascimento = async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ error: "Data não fornecida" });
  }

  try {
    const inicio = new Date(data + "T00:00:00.000Z");
    const fim = new Date(data + "T23:59:59.999Z");

    const filtro = {
      data_nascimento: {
        gte: inicio,
        lte: fim,
      },
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por data de nascimento", message: error.message });
  }
};

// Buscar por tipo de usuário
const buscaTipoUsuario = async (req, res) => {
  const { tipo } = req.query;

  if (!tipo) {
    return res.status(400).json({ error: "Tipo de usuário não fornecido" });
  }

  try {
    const filtro = {
      tipo_usuario: tipo,
      ...(req.usuario?.tipo === "cliente" && { status: true }),
    };

    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar por tipo de usuário", message: error.message });
  }
};

// Deletar (desativar) um usuário por ID
const delecao = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        status: false,
        data_atualizacao: new Date(),
      },
    });

    res.status(200).json({ message: "Usuário desativado com sucesso" });
  } catch (error) {
    console.error("Erro ao desativar usuário:", error);
    res.status(500).json({ error: "Erro ao desativar usuário", message: error.message });
  }
};


// Atualizar usuário
const atualizacao = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, apelido, data_nascimento, tipo_usuario } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    let dadosAtualizados = {
      data_atualizacao: new Date(),
    };

    if (nome) dadosAtualizados.nome = nome;
    if (email) dadosAtualizados.email = email;
    if (apelido) dadosAtualizados.apelido = apelido;
    if (data_nascimento) dadosAtualizados.data_nascimento = new Date(data_nascimento);
    if (tipo_usuario) dadosAtualizados.tipo_usuario = tipo_usuario;
    if (senha) {
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      dadosAtualizados.senha = senhaCriptografada;
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosAtualizados,
      select: {
        id: true,
        nome: true,
        email: true,
        apelido: true,
        data_nascimento: true,
        tipo_usuario: true,
      },
    });

    res.status(200).json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário", message: error.message });
  }
};

module.exports = {
  cadastro,
  buscaUsuarios,
  buscaId,
  atualizacao,
  buscaNome,
  buscaEmail,
  buscaApelido,
  buscaDataNascimento,
  buscaTipoUsuario,
  delecao,
};
