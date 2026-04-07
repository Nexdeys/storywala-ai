const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Authentication required' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

exports.isPhoneVerified = (req, res, next) => {
    if (!req.user || !req.user.phoneVerified) {
        return res.status(403).json({ 
            message: 'SECURITY ALERT: Phone OTP verification required before video generation',
            code: 'PHONE_NOT_VERIFIED'
        });
    }
    next();
};

exports.deviceCheck = async (req, res, next) => {
    // 3. Prevent multiple accounts from same device
    const deviceId = req.headers['x-device-id'];
    if (deviceId) {
       const userWithSameDevice = await User.findOne({ deviceId: deviceId, _id: { $ne: req.user?._id } });
       if (userWithSameDevice && userWithSameDevice.email !== req.user?.email) {
           return res.status(403).json({ message: 'Security: Only one account allowed per device' });
       }
    }
    next();
};

exports.isWithinQuota = (req, res, next) => {
    // FREE USAGE SYSTEM: 3 total videos limit
    if (req.user && req.user.videosGenerated >= 3) {
        return res.status(403).json({ 
            message: 'FREE QUOTA EXHAUSTED: You have reached your limit of 3 cinematic stories.',
            code: 'QUOTA_EXHAUSTED'
        });
    }
    next();
};
