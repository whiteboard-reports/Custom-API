const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Health check endpoint (sem autenticação)
 */
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
