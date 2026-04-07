const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

router.post('/google', authController.googleLogin);
router.post('/otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

router.get('/profile', isAuthenticated, (req, res) => res.json({ user: req.user }));

module.exports = router;
