const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const autenticacao = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado no header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const tokenDB = await prisma.token.findFirst({
      where: {
        token: token,
        usuario_id: decoded.id,
      },
      include: {
        usuario: true,
      },
    });

    if (!tokenDB) {
      return res.status(401).json({ error: "Token inválido ou não encontrado" });
    }

    const usuario = tokenDB.usuario;

    if (!usuario.status) {
      return res.status(403).json({ error: "Usuário desativado" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = autenticacao;
