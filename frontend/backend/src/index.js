require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const winston = require('winston');

// 1. Initialize Logging (Winston)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'src/logs/combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

const app = express();

// 2. Load Workers (BullMQ Background Processing)
// This must be started once the app launches
require('./workers/video.worker');

// 3. Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: '*' })); // Enable CORS
app.use(morgan('dev')); // HTTP Logging
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/storywala')
    .then(() => logger.info('🔥 MongoDB Connected'))
    .catch((err) => logger.error('❌ MongoDB Connection Error:', err));

// 5. Routes Orchestration
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stories', require('./routes/story.routes'));
app.use('/api/billing', require('./routes/billing.routes')); // New Payment/Billing routes

// 6. Global Error Handler (Production-Ready)
app.use((err, req, res, next) => {
    logger.error(`[ERROR] ${req.method} ${req.url}: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`🚀 StoryWala AI Backend running at http://localhost:${PORT}`);
});
