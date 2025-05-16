require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/prismaClient');
const app = express();
app.use(cors()); // Habilita CORS
app.use(express.json()); // Para tratar requisições com JSON
const routes = require('./routes/routes');
const {importarFilmes} = require('./services/filmeService');
const PORT = process.env.PORT || 3000;


app.use('/api', routes);


async function checkConnection() {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

checkConnection();
importarFilmes();

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


