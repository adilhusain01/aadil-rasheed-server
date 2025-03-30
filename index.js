const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./src/utils/logger');

// Load env vars
// dotenv.config({ path: './src/config/config.env' });
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

// Morgan HTTP request logger
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/blog', require('./src/routes/blog'));
app.use('/api/blog/:blogId/comments', require('./src/routes/comment'));
app.use('/api/blog/comments', require('./src/routes/comment'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/subscription', require('./src/routes/subscription'));
app.use('/api/social', require('./src/routes/social'));
app.use('/api/gallery', require('./src/routes/gallery'));
app.use('/api/upload', require('./src/routes/upload'));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Use the dedicated error handler middleware
app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.error(err.stack);
  
  // Close server & exit process in case of critical failure
  // Commenting this out allows the server to continue running despite rejections
  // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  
  // Close server & exit process
  server.close(() => process.exit(1));
});
