
const express = require('express');
const router = express.Router();

// Importação das rotas de cada módulo
const usuarioRoutes = require('../usuario/usuarioRoutes');


// Define os prefixos das rotas
router.use('/usuarios', usuarioRoutes);


module.exports = router;
