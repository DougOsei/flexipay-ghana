const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./db');

const productsRouter = require('./routes/products');
const vendorsRouter = require('./routes/vendors');
const contractsRouter = require('./routes/contracts');
const paymentsRouter = require('./routes/payments');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FlexiPay Ghana Multi-Vendor Hire Purchase API',
    currency: 'GHS (GH₵)',
    country: 'Ghana',
    database: db.getDatabaseHealth(),
    time: new Date().toISOString()
  });
});

// Serve frontend in production if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  let targetHtml = 'index.html';
  if (req.path === '/vendor' || req.path.startsWith('/vendor/')) {
    targetHtml = path.join('vendor', 'index.html');
  } else if (req.path === '/admin' || req.path.startsWith('/admin/')) {
    targetHtml = path.join('admin', 'index.html');
  }
  const fullHtmlPath = path.join(clientDist, targetHtml);
  res.sendFile(fullHtmlPath, (err) => {
    if (err) {
      res.status(200).send('FlexiPay Ghana API is running on port ' + PORT);
    }
  });
});

// Global Express Error Handler
app.use((err, req, res, next) => {
  console.error('[Express Global Error]:', err.stack || err.message || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred'
  });
});

// Process-level unhandled exception guards
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection]:', reason);
});

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🇬🇭 FlexiPay Ghana Multi-Vendor HP Server running`);
  console.log(`   Local API URL: http://localhost:${PORT}`);
  console.log(`   Health Check:  http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => console.log('HTTP server closed.'));
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server...');
  server.close(() => console.log('HTTP server closed.'));
});
