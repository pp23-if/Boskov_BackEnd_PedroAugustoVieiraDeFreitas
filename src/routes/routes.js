
const express = require('express');
const router = express.Router();

// Importação das rotas de cada módulo
const usuarioRoutes = require('../usuario/usuarioRoutes');
const loginRoutes = require('../login/loginRoutes');


// Define os prefixos das rotas
router.use('/usuarios', usuarioRoutes);
router.use('/login', loginRoutes);


module.exports = router;
