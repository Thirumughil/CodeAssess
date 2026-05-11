const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://codeassess-backend-pa4p.onrender.com/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Auth Profile:', profile.id, profile.emails?.[0]?.value);
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            const email = profile.emails?.[0]?.value;
            if (!email) throw new Error('No email found in Google profile');

            user = await User.findOne({ email });
            if (user) {
                user.googleId = profile.id;
                user.authProvider = 'google';
                await user.save();
            } else {
                // Handle potential username collision
                let baseUsername = profile.displayName || email.split('@')[0];
                let username = baseUsername;
                let counter = 1;
                
                while (await User.findOne({ username })) {
                    username = `${baseUsername}${counter++}`;
                }

                user = await User.create({
                    username,
                    email,
                    googleId: profile.id,
                    authProvider: 'google',
                    isVerified: true
                });
            }
        }
        return done(null, user);
    } catch (err) {
        console.error('Google Strategy Error:', err);
        return done(err, null);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://codeassess-backend-pa4p.onrender.com/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('GitHub Auth Profile:', profile.id, profile.username);
        let user = await User.findOne({ githubId: profile.id });
        
        if (!user) {
            const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
            
            user = await User.findOne({ email });
            if (user) {
                user.githubId = profile.id;
                user.authProvider = 'github';
                await user.save();
            } else {
                let baseUsername = profile.username;
                let username = baseUsername;
                let counter = 1;

                while (await User.findOne({ username })) {
                    username = `${baseUsername}${counter++}`;
                }

                user = await User.create({
                    username,
                    email,
                    githubId: profile.id,
                    authProvider: 'github',
                    isVerified: true
                });
            }
        }
        return done(null, user);
    } catch (err) {
        console.error('GitHub Strategy Error:', err);
        return done(err, null);
    }
}));

module.exports = passport;
