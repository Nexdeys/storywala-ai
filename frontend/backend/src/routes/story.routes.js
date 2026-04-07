const express = require('express');
const router = express.Router();
const storyController = require('../controllers/story.controller');
const { isAuthenticated, isPhoneVerified, deviceCheck, isWithinQuota } = require('../middleware/auth.middleware');

// PHASE 1: Brainstorm Script (English, Hindi, Hinglish)
router.post('/generate', isAuthenticated, isPhoneVerified, deviceCheck, isWithinQuota, storyController.generateStoryText);

// PHASE 2: Generate Fast 480p Preview
router.post('/:id/preview', isAuthenticated, isPhoneVerified, deviceCheck, isWithinQuota, storyController.generatePreview);

// PHASE 3: Confirm and Generate High-Quality Final Export
router.post('/:id/export', isAuthenticated, isPhoneVerified, deviceCheck, isWithinQuota, storyController.generateFinalExport);

router.get('/user/:userId', isAuthenticated, storyController.getStories);
router.get('/:id', isAuthenticated, storyController.getStoryById);

module.exports = router;
