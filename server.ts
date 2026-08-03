import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routers
import projectsRouter from './routes/projects';
import analyseRouter from './routes/analyse';
import emailsRouter from './routes/emails';
import dqeRouter from './routes/dqe';
import devisRouter from './routes/devis';
import assistantRouter from './routes/assistant';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiter when behind Cloud Run / Nginx reverse proxies
  app.set('trust proxy', 1);

  // Apply standard security headers via Helmet
  // Adjust contentSecurityPolicy to support Vite inline scripts and dev server in development
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Configure CORS permissively to ensure deployed applets, previews, and local dev never throw CORS 400/500 errors on refresh or API calls
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parser with 50mb limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Global rate limiter with proxy validation disabled to prevent 400 Bad Request on Cloud Run / proxies
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Trop de requêtes. Veuillez réessayer dans 15 minutes.' },
});

// Strict rate limiter for analysis
const analyseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
  message: { error: 'Limite d\'analyses atteinte. Maximum 50 requêtes par heure.' },
});

// Apply global rate limit to API routes
app.use('/api/', globalLimiter);

// Apply rate limit specifically on the analyse endpoint
app.use('/api/analyse', analyseLimiter);

// Mount API routers BEFORE Vite middleware
app.use('/api/projects', projectsRouter);
app.use('/api/analyse', analyseRouter);
app.use('/api/emails', emailsRouter);
app.use('/api/dqe', dqeRouter);
app.use('/api/devis', devisRouter);
app.use('/api/assistant', assistantRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vite development middleware vs Static Production serving with SPA fallback
if (process.env.NODE_ENV !== 'production') {
  console.log('Loading Vite Dev Middleware...');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  // SPA fallback for dev server
  app.use('*', async (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    try {
      const url = req.originalUrl;
      const fs = await import('fs');
      let template = await fs.promises.readFile(path.resolve(process.cwd(), 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  console.log('Serving production static build...');
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  
  // Single-Page Application (SPA) catch-all handler for production
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Métrio Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
export default {};
