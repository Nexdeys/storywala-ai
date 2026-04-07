const mongoose = require('mongoose');

const scriptCacheSchema = new mongoose.Schema({
    prompt: { type: String, required: true },
    tone: { type: String, required: true },
    language: { type: String, required: true },
    length: { type: String, required: true },
    script: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 604800 } // Cache expires in 7 days
});

// Compound index for fast lookup
scriptCacheSchema.index({ prompt: 1, tone: 1, language: 1, length: 1 }, { unique: true });

module.exports = mongoose.model('ScriptCache', scriptCacheSchema);
