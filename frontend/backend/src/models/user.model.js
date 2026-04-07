const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    googleId: String,
    phone: String,
    phoneVerified: { type: Boolean, default: false },
    deviceId: String,
    ip: String,
    videosGenerated: { type: Number, default: 0 },
    
    // Subscription & Plan Tracking
    plan: { 
        type: String, 
        enum: ['FREE', 'BASIC', 'PRO', 'BEST_VALUE', 'ULTRA'], 
        default: 'FREE' 
    },
    subscriptionId: String,
    subscriptionStatus: { 
        type: String, 
        enum: ['active', 'inactive', 'past_due', 'canceled'], 
        default: 'inactive' 
    },
    renewalDate: Date,
    usageCredits: { type: Number, default: 5 }, // Free tier starts with 5 credits/day
    lastRefreshDate: { type: Date, default: Date.now },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
