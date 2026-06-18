const express = require('express');
const router = express.Router();
const projects = require('../data/projects');

/**
 * GET /api/public/projects
 * Retorna lista de projetos (sem autenticação)
 */
router.get('/', (req, res) => {
  res.json(projects);
});

module.exports = router;
