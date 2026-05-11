const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.findOneAndUpdate({ email }, { code: otp }, { upsert: true, new: true });
        
        await sendEmail({
            email,
            subject: 'CodePractice Verification Code',
            message: `Your verification code is: ${otp}. It will expire in 5 minutes.`
        });

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, code } = req.body;
    try {
        const validOtp = await OTP.findOne({ email, code });
        if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });
        
        // Mark as verified session (in a real app, you might use a signed cookie or temporary token)
        res.json({ message: 'Email verified' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password, otp } = req.body;
    try {
        // Verify OTP again before registration
        const validOtp = await OTP.findOne({ email, code: otp });
        if (!validOtp) return res.status(400).json({ message: 'Email not verified' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const user = await User.create({ username, email, password, isVerified: true });
        await OTP.deleteOne({ email }); // Clear OTP after use

        res.status(201).json({
            _id: user._id, username: user.username, email: user.email, token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST api/auth/social-auth
router.post('/social-auth', async (req, res) => {
    const { provider, email, username, googleId, githubId } = req.body;
    try {
        let user = await User.findOne({ email });
        
        if (user) {
            // Update social IDs if they don't exist
            if (googleId) user.googleId = googleId;
            if (githubId) user.githubId = githubId;
            user.authProvider = provider;
            await user.save();
        } else {
            // Create new social user
            user = await User.create({
                username: username || email.split('@')[0],
                email,
                googleId,
                githubId,
                authProvider: provider,
                isVerified: true
            });
        }

        res.json({
            _id: user._id, 
            username: user.username, 
            email: user.email, 
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const passport = require('passport');

// ... (previous routes)

// @route   GET api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @route   GET api/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${JSON.stringify({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    })}`);
});

// @route   GET api/auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET api/auth/github/callback
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}&user=${JSON.stringify({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    })}`);
});

module.exports = router;
