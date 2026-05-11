const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/submissions
// @desc    Create a new submission
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { problemId, language, code, isCorrect, timeComplexity, spaceComplexity, score } = req.body;

        const submission = await Submission.create({
            user: req.user._id,
            problem: problemId,
            language,
            code,
            isCorrect,
            timeComplexity,
            spaceComplexity,
            score
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET api/submissions/user/:userId
// @desc    Get all successful submissions for a user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ 
            user: req.params.userId,
            isCorrect: true 
        }).populate('problem', 'title difficulty');

        // Filter to unique problems (only latest submission per problem)
        const uniqueSolved = {};
        submissions.forEach(sub => {
            if (!uniqueSolved[sub.problem._id] || new Date(sub.solvedAt) > new Date(uniqueSolved[sub.problem._id].solvedAt)) {
                uniqueSolved[sub.problem._id] = {
                    problemId: sub.problem._id,
                    title: sub.problem.title,
                    difficulty: sub.problem.difficulty,
                    timeComplexity: sub.timeComplexity,
                    spaceComplexity: sub.spaceComplexity,
                    solvedAt: sub.solvedAt,
                    score: sub.score
                };
            }
        });

        res.json(Object.values(uniqueSolved));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
