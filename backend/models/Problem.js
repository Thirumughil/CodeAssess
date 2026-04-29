const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
    tags: [{ type: String }],
    acceptanceRate: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    companies: [{ type: String }],
    isPremium: { type: Boolean, default: false },
    defaultCode: {
        python: { type: String },
        java: { type: String },
        cpp: { type: String },
        c: { type: String }
    },
    testCases: [
        {
            input: { type: String, required: true },
            expectedOutput: { type: String, required: true }
        }
    ]
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
