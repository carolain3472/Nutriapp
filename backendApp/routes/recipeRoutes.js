const express = require('express');
const router = express.Router();
const { getRecipes } = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de recetas
router.use(authMiddleware);

// GET /api/recipes -> devuelve recetas (potencialmente filtradas por búsqueda)
router.get('/', getRecipes);

module.exports = router; 