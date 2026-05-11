const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const session = require('express-session');
const passport = require('./config/passport');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Session and Passport middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/ml', require('./routes/ml'));
app.use('/api/submissions', require('./routes/submissions'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
