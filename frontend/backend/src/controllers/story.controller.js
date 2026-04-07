const Story = require('../models/story.model');
const ScriptCache = require('../models/cache.model');
const User = require('../models/user.model');
const gemini = require('../services/gemini.service');

exports.generateStoryText = async (req, res) => {
        try {
                    const { prompt, tone, language, length } = req.body;
                    const user = await User.findById(req.user._id);
                    if (!user) return res.status(404).json({ message: 'User not found' });

            const today = new Date().toDateString();
                    if (new Date(user.lastRefreshDate).toDateString() !== today) {
                                    user.usageCredits = 5;
                                    user.lastRefreshDate = new Date();
                    }

            if (user.usageCredits <= 0) return res.status(403).json({ message: 'Credits exhausted (5/5).' });

            const cached = await ScriptCache.findOne({ prompt, tone, language, length });
                    if (cached) return res.status(200).json({ story: { scriptText: cached.script }, cached: true });

            const data = await gemini.generateStory(prompt, tone, language, length);
                    await new ScriptCache({ prompt, tone, language, length, script: data.script }).save();

            user.usageCredits -= 1;
                    await user.save();

            res.status(201).json({ story: { scriptText: data.script }, creditsLeft: user.usageCredits });
        } catch (e) { res.status(500).json({ message: 'Gemini Error' }); }
};

exports.generatePreview = async (req, res) => {
        res.status(200).json({ message: 'Script ready! Copy it from above.' });
};
