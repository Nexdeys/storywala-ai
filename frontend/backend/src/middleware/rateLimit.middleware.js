const rateLimit = require('express-rate-limit');

/**
 * Standard API Rate Limiter
 * Restricts to 100 requests every 15 minutes per IP.
 */
exports.standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { message: 'Too many requests. Peak usage reached.' },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict Video Generation Limiter (Prevents SPAM)
 * Restricts to 1 generation every 30 seconds.
 */
exports.generationLimiter = rateLimit({
    windowMs: 30 * 1000, 
    max: 1, 
    message: { message: 'Rendering in progress. Please wait.' },
    keyGenerator: (req) => req.user?._id || req.ip,
});

/**
 * Login/OTP Limiter (Security)
 * Restricts to 5 attempts every hour.
 */
exports.authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Security alert: Too many auth attempts.' }
});
