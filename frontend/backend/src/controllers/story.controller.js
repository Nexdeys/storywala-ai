const Story = require('../models/story.model');
const ScriptCache = require('../models/cache.model');
const User = require('../models/user.model');
const openaiService = require('../services/openai.service');
const videoService = require('../services/video.service');
const storageService = require('../services/storage.service');

/**
 * PHASE 1: Brainstorm Script (Cost-Optimized)
 */
exports.generateStoryText = async (req, res) => {
    try {
        const { prompt, tone = 'viral', language = 'English', length = 'short' } = req.body;
        const user = await User.findById(req.user._id);

        // 1. Credit Check (5 free / day)
        const today = new Date().toDateString();
        const lastRefresh = new Date(user.lastRefreshDate).toDateString();
        
        if (today !== lastRefresh) {
            user.usageCredits = 5;
            user.lastRefreshDate = new Date();
            await user.save();
        }

        if (user.usageCredits <= 0) {
            return res.status(403).json({ 
                message: 'Daily credits exhausted (5/5). Upgrade to Pro for infinite scripts!',
                creditsLeft: 0 
            });
        }

        // 2. Cache Check (Same prompt = Zero cost)
        const cached = await ScriptCache.findOne({ prompt, tone, language, length });
        if (cached) {
            const newStory = new Story({ userId: req.user._id, prompt, title: cached.script.title, scenes: [{ text: cached.script }], status: 'pending-review' });
            await newStory.save();
            return res.status(200).json({ story: newStory, cached: true, creditsLeft: user.usageCredits });
        }

        // 3. AI Generation (Gated & Optimized)
        const storyData = await openaiService.generateStory(prompt, tone, language, length);
        
        // 4. Save Cache
        const newCache = new ScriptCache({ prompt, tone, language, length, script: storyData.script });
        await newCache.save();

        user.usageCredits -= 1;
        await user.save();

        const newStory = new Story({ userId: req.user._id, prompt, title: storyData.title, scriptText: storyData.script, status: 'pending-review' });
        await newStory.save();

        res.status(201).json({ story: newStory, creditsLeft: user.usageCredits });
    } catch (error) { 
        console.error('Brainstorm Failure:', error);
        res.status(500).json({ message: 'Brainstorm failed' }); 
    }
};

/**
 * PHASE 2: Generate Preview (Lean Mode - No Voice)
 */
exports.generatePreview = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await Story.findById(id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        
        story.status = 'previewing'; await story.save();
        const processedScenes = [];
        
        // Removed ElevenLabs voice synthesis to reduce budget overhead
        for (let i = 0; i < story.scenes.length; i++) {
            const text = story.scenes[i].text;
            const imgP = await openaiService.generateImagePrompt(text, story.prompt);
            const imgF = await openaiService.generateImage(imgP, `${story._id}_${i}`);
            processedScenes.push({ text, imageFileName: imgF, imageUrl: `/uploads/${imgF}` });
        }
        
        story.scenes = processedScenes;
        const previewFile = await videoService.mergeScenes(processedScenes, story._id, { quality: '480p', isPreview: true, hasWatermark: true });
        
        story.videoUrl = `/uploads/${previewFile}`; story.status = 'awaiting-approval'; await story.save();
        res.status(200).json(story);
    } catch (error) { res.status(500).json({ message: 'Preview failed' }); }
};
