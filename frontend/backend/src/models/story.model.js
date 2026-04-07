const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    scenes: [{
        text: String,
        imageUrl: String,
        voiceUrl: String,
        startTime: Number,
        endTime: Number
    }],
    videoUrl: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Story', storySchema);
