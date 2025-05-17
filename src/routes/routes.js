
const express = require('express');
const router = express.Router();

// Importação das rotas de cada módulo
const usuarioRoutes = require('../usuario/usuarioRoutes');
const loginRoutes = require('../login/loginRoutes');
const filmeRoutes = require('../filme/filmeRoutes');
const generoRoutes = require('../genero/generoRoutes');


// Define os prefixos das rotas
router.use('/usuarios', usuarioRoutes);
router.use('/login', loginRoutes);
router.use('/filme', filmeRoutes);
router.use('/genero', generoRoutes);


module.exports = router;
