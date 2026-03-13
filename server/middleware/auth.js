// middleware/auth.js — Vérification JWT + session active
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb } = require('../db/init');

/**
 * Hash du token pour stockage sécurisé (on ne stocke jamais le token brut)
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Middleware d'authentification obligatoire
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const db = getDb();

    // Vérifier que la session existe encore en base (permet la révocation)
    const tokenHash = hashToken(token);
    const session = db.prepare(`
      SELECT s.*, u.is_active, u.role, u.name
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > datetime('now')
    `).get(tokenHash);

    if (!session || !session.is_active) {
      return res.status(401).json({ error: 'Session expirée ou révoquée' });
    }

    // Mettre à jour last_seen
    db.prepare(`UPDATE sessions SET last_seen = datetime('now') WHERE token_hash = ?`)
      .run(tokenHash);

    req.user = {
      id: payload.userId,
      name: session.name,
      role: session.role,
      sessionId: session.id,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

/**
 * Middleware : réservé aux admins uniquement
 */
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

/**
 * Middleware : interdit aux viewers (lecture seule)
 */
function requireWrite(req, res, next) {
  if (req.user?.role === 'viewer') {
    return res.status(403).json({ error: 'Accès en lecture seule' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin, requireWrite, hashToken };
