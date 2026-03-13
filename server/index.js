// index.js — Serveur principal MRDPSTOCK
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { initDb } = require('./db/init');

// ─── Initialisation DB ────────────────────────────────────────────────────────
initDb();

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// ─── Sécurité HTTP headers ────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: isProd ? false : allowedOrigins, // En prod, même domaine → pas de CORS
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsing & compression ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' })); // Pour les photos base64
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// ─── Logging ─────────────────────────────────────────────────────────────────
if (!isProd) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Rate limiting global ─────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 300,             // 300 requêtes/min par IP
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
  res.json({
    status: 'ok',
    version: require('./package.json').version,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ─── Frontend statique (production) ───────────────────────────────────────────
if (isProd) {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ─── Gestion des erreurs ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    error: isProd ? 'Erreur interne du serveur' : err.message,
  });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 MRDPSTOCK Server v2.0`);
  console.log(`   Port      : ${PORT}`);
  console.log(`   Mode      : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Base DB   : ${process.env.DB_PATH || './data/mrdpstock.db'}`);
  console.log(`   API       : http://localhost:${PORT}/api/health\n`);
});

// ─── Gestion propre de l'arrêt ────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt propre...');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('\nArrêt...');
  process.exit(0);
});
