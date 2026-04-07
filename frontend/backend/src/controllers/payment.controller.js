const User = require('../models/user.model');

const PLANS = {
    BASIC: { price: 499, videos: 10, quality: '1080p', watermark: false },
    PRO: { price: 999, videos: 25, quality: '1080p', watermark: false },
    BEST_VALUE: { price: 1499, videos: 50, quality: '4K', watermark: false },
    ULTRA: { price: 1999, videos: 100, quality: '4K', watermark: false }
};

/**
 * Razorpay/Stripe Mock Implementation for Subscription Payments.
 */
exports.createSubscription = async (req, res) => {
    try {
        const { planId } = req.body; // 'BASIC', 'PRO', etc.
        const plan = PLANS[planId];
        
        if (!plan) return res.status(400).json({ message: 'Invalid plan selected' });

        // MOCK: In production, you would call Razorpay/Stripe API here
        // const subscription = await razorpay.subscriptions.create({...});
        
        const mockSubscription = {
            id: `sub_${Math.random().toString(36).substring(2, 10)}`,
            status: 'created',
            short_url: 'https://razorpay.com/pay_mock'
        };

        res.json({ subscription: mockSubscription, plan });
    } catch (err) {
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

/**
 * Webhook for payment success.
 */
exports.handlePaymentSuccess = async (req, res) => {
    try {
        const { userId, planId, subscriptionId } = req.body;
        const plan = PLANS[planId];
        
        // Update user state upon successful payment confirmation
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);

        await User.findByIdAndUpdate(userId, {
            plan: planId,
            subscriptionStatus: 'active',
            subscriptionId: subscriptionId,
            renewalDate: renewalDate,
            usageCredits: plan.videos + 3 // Added bonus for original 3
        });

        res.json({ message: `Successfully upgraded to ${planId}` });
    } catch (err) {
        res.status(500).json({ message: 'Error updating subscription' });
    }
};

exports.getBillingInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('plan subscriptionStatus usageCredits renewalDate');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Billing data lost.' });
    }
};
