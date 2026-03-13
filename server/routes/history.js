// routes/history.js — Historique des actions
const router = require('express').Router();
const { getDb } = require('../db/init');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// ─── GET /api/history?base_id=&search=&limit=&offset= ────────────────────────
router.get('/', (req, res) => {
  const { base_id, search, limit = 100, offset = 0 } = req.query;
  const db = getDb();

  let query = `SELECT * FROM history WHERE 1=1`;
  const params = [];

  if (base_id) { query += ` AND base_id = ?`; params.push(base_id); }
  if (search) {
    query += ` AND (user_name LIKE ? OR action LIKE ? OR detail LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  // Total pour pagination
  const countResult = db.prepare(`SELECT COUNT(*) as total FROM (${query})`).get(...params);

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  const rows = db.prepare(query).all(...params);

  res.json({ total: countResult.total, rows });
});

module.exports = router;
