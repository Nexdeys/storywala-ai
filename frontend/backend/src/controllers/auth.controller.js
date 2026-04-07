const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const twilio = require('twilio');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.googleLogin = async (req, res) => {
    try {
        const { googleId, email, name, avatar, deviceId } = req.body;
        const ipAddress = req.ip;

        if (!email || !googleId) return res.status(400).json({ message: 'Email and Google ID are required' });

        // 1. Multi-account on same device check
        if (deviceId) {
           const usersOnDevice = await User.find({ deviceId: deviceId });
           // If more than 1 user on this device, flag/block (simplified)
           if (usersOnDevice.length > 0 && !usersOnDevice.find(u => u.googleId === googleId)) {
               return res.status(403).json({ message: 'Security Alert: Only one account allowed per device' });
           }
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                googleId,
                email,
                name,
                avatar,
                deviceId,
                ipAddress
            });
            await user.save();
        } else {
           // Update user details if needed
           user.googleId = googleId;
           user.avatar = avatar;
           user.deviceId = deviceId;
           user.ipAddress = ipAddress;
           await user.save();
        }

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const { phone, userId } = req.body;
        if (!phone) return res.status(400).json({ message: 'Phone number is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 mins

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.phone = phone;
        await user.save();

        // 2. Integration with Twilio (placeholder/real if key provided)
        try {
           if (process.env.TWILIO_PHONE_NUMBER) {
               await twilioClient.messages.create({
                   body: `Your StoryWala AI OTP is: ${otp}`,
                   from: process.env.TWILIO_PHONE_NUMBER,
                   to: phone
               });
           }
           console.log(`[OTP SENT TO ${phone}]: ${otp}`); // For local testing
        } catch (twilioErr) {
           console.error('Twilio Error:', twilioErr);
           // Silent fail, user still gets OTP in log for testing
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp, userId } = req.body;
        const user = await User.findById(userId);

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.phoneVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Phone verified successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error: error.message });
    }
};
