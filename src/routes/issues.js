const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const issues = require('../data/issues');

/**
 * GET /api/issues
 * Retorna lista de issues (requer autenticação)
 */
router.get('/', authenticate, (req, res) => {
  res.json(issues);
});

module.exports = router;
