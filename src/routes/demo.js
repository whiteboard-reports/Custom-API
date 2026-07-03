const express = require('express');
const router = express.Router();
const { fetchAllPages } = require('../lib/paginatedFetch');

const VALID_TYPES = ['offset_limit', 'cursor', 'token'];

function buildPaginationConfig(type, pageSize) {
  switch (type) {
    case 'offset_limit':
      return {
        type: 'offset_limit',
        offset_param: 'offset',
        limit_param: 'limit',
        limit_value: pageSize,
      };
    case 'cursor':
      return {
        type: 'cursor',
        cursor_param: 'cursor',
        cursor_response_path: 'nextCursor',
        limit_param: 'limit',
        limit_value: pageSize,
      };
    case 'token':
      return {
        type: 'token',
        token_response_path: 'nextPageToken',
      };
    default:
      return null;
  }
}

/**
 * GET /api/demo/issues?type=offset_limit|cursor|token&pageSize=
 * Consome /api/source/issues via fetchAllPages, exercitando as 3 estratégias
 * de paginação por HTTP dentro deste próprio server.
 */
router.get('/', async (req, res) => {
  const { type = 'offset_limit' } = req.query;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      error: `type inválido: "${type}". Valores aceitos: ${VALID_TYPES.join(', ')}`,
    });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}/api/source/issues`;
  const pagination = buildPaginationConfig(type, pageSize);

  try {
    const items = await fetchAllPages(baseUrl, { data_path: 'items', pagination });
    res.json({ type, pageSize, count: items.length, items });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
