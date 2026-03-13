// routes/auth.js — Authentification
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const { getDb } = require('../db/init');
const { requireAuth, hashToken } = require('../middleware/auth');

// ─── Rate limiting sur le login (5 tentatives / 15 min) ──────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  }

  const db = getDb();
  const user = db.prepare(`SELECT * FROM users WHERE id = ? AND is_active = 1`).get(userId);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    // Délai artificiel pour ralentir le brute-force
    return setTimeout(() => {
      res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }, 500);
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // Calculer la date d'expiration
  const expiresMs = expiresIn.endsWith('h')
    ? parseInt(expiresIn) * 3600 * 1000
    : 8 * 3600 * 1000;
  const expiresAt = new Date(Date.now() + expiresMs).toISOString().replace('T', ' ').slice(0, 19);

  // Enregistrer la session
  const sessionId = uuidv4();
  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    sessionId,
    user.id,
    hashToken(token),
    expiresAt,
    req.ip,
    req.headers['user-agent']?.slice(0, 200) || ''
  );

  // Mettre à jour last_login
  db.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).run(user.id);

  // Enregistrer dans l'historique
  db.prepare(`
    INSERT INTO history (id, user_id, user_name, action, detail, ip_address)
    VALUES (?, ?, ?, 'Connexion', 'Connexion réussie', ?)
  `).run(uuidv4(), user.id, user.name, req.ip);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      color: user.color,
      mustChangePassword: !!user.must_change_password,
    },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', requireAuth, (req, res) => {
  const db = getDb();
  const authHeader = req.headers['authorization'];
  const token = authHeader?.slice(7);

  if (token) {
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(hashToken(token));
  }

  db.prepare(`
    INSERT INTO history (id, user_id, user_name, action, ip_address)
    VALUES (?, ?, ?, 'Déconnexion', ?)
  `).run(uuidv4(), req.user.id, req.user.name, req.ip);

  res.json({ success: true });
});

// ─── POST /api/auth/change-password ──────────────────────────────────────────
router.post('/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
  }

  const db = getDb();
  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.user.id);

  // Les admins qui doivent changer leur mdp initial n'ont pas besoin de l'ancien
  if (!user.must_change_password) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }
  }

  const newHash = bcrypt.hashSync(newPassword, 12);
  db.prepare(`
    UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?
  `).run(newHash, req.user.id);

  // Révoquer toutes les autres sessions (sécurité)
  const currentToken = req.headers['authorization']?.slice(7);
  if (currentToken) {
    db.prepare(`
      DELETE FROM sessions WHERE user_id = ? AND token_hash != ?
    `).run(req.user.id, hashToken(currentToken));
  }

  db.prepare(`
    INSERT INTO history (id, user_id, user_name, action, ip_address)
    VALUES (?, ?, ?, 'Changement de mot de passe', ?)
  `).run(uuidv4(), req.user.id, req.user.name, req.ip);

  res.json({ success: true });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare(`
    SELECT id, name, role, color, must_change_password, last_login, created_at
    FROM users WHERE id = ?
  `).get(req.user.id);

  res.json(user);
});

// ─── GET /api/auth/sessions ───────────────────────────────────────────────────
router.get('/sessions', requireAuth, (req, res) => {
  const db = getDb();
  const sessions = db.prepare(`
    SELECT id, created_at, last_seen, ip_address, user_agent, expires_at
    FROM sessions WHERE user_id = ? ORDER BY last_seen DESC
  `).all(req.user.id);

  res.json(sessions);
});

// ─── DELETE /api/auth/sessions/:id ───────────────────────────────────────────
router.delete('/sessions/:id', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare(`DELETE FROM sessions WHERE id = ? AND user_id = ?`)
    .run(req.params.id, req.user.id);
  res.json({ success: true });
});

module.exports = router;
