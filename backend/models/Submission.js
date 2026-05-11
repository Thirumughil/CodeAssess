const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    timeComplexity: {
        type: String
    },
    spaceComplexity: {
        type: String
    },
    score: {
        type: Number
    },
    solvedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent multiple "Solved" entries for the same user/problem if we only want to track the latest/best
// But for now, let's just allow multiple submissions and we can filter for "unique solved" in the query.

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
