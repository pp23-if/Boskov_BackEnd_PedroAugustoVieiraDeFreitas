const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        token: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (!usuario.status) {
      return res.status(403).json({ error: 'Este usuário está desativado.' });
    }

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.status(200).json({
      message: 'Login bem-sucedido',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        apelido: usuario.apelido,
        data_nascimento: usuario.data_nascimento,
        tipo_usuario: usuario.tipo_usuario,
        data_criacao: usuario.data_criacao,
        data_atualizacao: usuario.data_atualizacao,
        status: usuario.status,
        token: usuario.token,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login', message: error.message });
  }
};

module.exports = { login };
