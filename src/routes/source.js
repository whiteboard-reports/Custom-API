const express = require('express');
const router = express.Router();
const issues = require('../data/issues');

const DEFAULT_LIMIT = 10;

function encodeCursor(offset) {
  return Buffer.from(String(offset), 'utf8').toString('base64');
}

function decodeCursor(cursor) {
  const n = parseInt(Buffer.from(cursor, 'base64').toString('utf8'), 10);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * GET /api/source/issues
 * Fonte mock paginada usada pela rota de demonstração (/api/demo/issues).
 * Suporta as 3 estratégias sobre o mesmo dataset de issues:
 *  - offset/limit: ?offset=&limit=
 *  - cursor: ?cursor=<opaco> (resposta traz "nextCursor")
 *  - token: ?nextPageToken=<opaco> (resposta traz "nextPageToken")
 */
router.get('/', (req, res) => {
  let offset = 0;
  if (req.query.offset !== undefined) {
    offset = parseInt(req.query.offset, 10) || 0;
  } else if (req.query.cursor) {
    offset = decodeCursor(req.query.cursor);
  } else if (req.query.nextPageToken) {
    offset = decodeCursor(req.query.nextPageToken);
  }

  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  const items = issues.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  const hasMore = nextOffset < issues.length;

  res.json({
    items,
    total: issues.length,
    nextCursor: hasMore ? encodeCursor(nextOffset) : null,
    nextPageToken: hasMore ? encodeCursor(nextOffset) : null,
  });
});

module.exports = router;
