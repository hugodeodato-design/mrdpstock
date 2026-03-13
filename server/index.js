// index.js — Serveur principal MRDPSTOCK
require('dotenv').config();

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const compression = require('compression');
const morgan  = require('morgan');
const path    = require('path');
const rateLimit = require('express-rate-limit');
const { initDb, getDb } = require('./db/init');

// ─── Initialisation DB ────────────────────────────────────────────────────────
initDb();

const app  = express();
const PORT = parseInt(process.env.PORT) || 3001;

// ─── Route publique AVANT tout middleware ─────────────────────────────────────
// Doit être déclarée ici pour éviter que helmet/auth ne la bloque
app.get('/api/auth/users-list', (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare(`SELECT id, name, role, color FROM users WHERE is_active = 1 ORDER BY name`).all();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Sécurité HTTP headers ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc:     ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsing & compression ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(morgan('dev'));

// ─── Rate limiting global ─────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans une minute' },
}));

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/bases',    require('./routes/bases'));
app.use('/api/items',    require('./routes/items'));
app.use('/api/history',  require('./routes/history'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/export',   require('./routes/export'));

// ─── Healthcheck ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', uptime: Math.floor(process.uptime()) });
});

// ─── Frontend statique ────────────────────────────────────────────────────────
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── Gestion des erreurs ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========================================');
  console.log('  MRDPSTOCK v2.0 — Serveur démarré');
  console.log('========================================');
  console.log('  Adresse : http://localhost:' + PORT);
  console.log('  Base DB : ' + (process.env.DB_PATH || './data/mrdpstock.db'));
  console.log('========================================\n');
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => { console.log('\nArrêt...'); process.exit(0); });
