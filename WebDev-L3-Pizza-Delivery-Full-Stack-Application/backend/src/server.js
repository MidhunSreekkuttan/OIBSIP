import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { initStockCronJob } from './services/cronService.js';
import { seedDatabase } from './seed/seedData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'PizzaCraft Core API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start Server and Services
const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Auto-seed if empty
    await seedDatabase();

    // 3. Start low-stock inventory monitoring cron job
    initStockCronJob();

    // 4. Port error handler
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ [Server] Port ${PORT} is busy, retrying in 1.5 seconds...`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 1500);
      } else {
        console.error('Server error:', err);
      }
    });

    // 5. Start HTTP Server
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 PizzaCraft Server running on http://localhost:${PORT}`);
      console.log(`🌐 Client Origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`🍕 Ready to take orders and monitor inventory!`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();

// Graceful termination
const handleExit = () => {
  server.close(() => process.exit(0));
};
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

export { app, server };

