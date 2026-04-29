const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// Add some sample problems if db is empty
const seedProblems = async () => {
    const count = await Problem.countDocuments();
    if (count === 0) {
        const samples = [
            {
                title: 'Two Sum',
                description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
                difficulty: 'Easy',
                tags: ['Array', 'Hash Table'],
                defaultCode: {
                    python: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
                    java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}',
                    cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};',
                    c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize){\n    // Write your code here\n}'
                },
                testCases: [{ input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' }]
            },
            {
                title: 'Reverse String',
                description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nExample:\nInput: s = ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]',
                difficulty: 'Easy',
                tags: ['String', 'Two Pointers'],
                defaultCode: {
                    python: 'def reverse_string(s):\n    # Write your code here\n    pass',
                    java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}',
                    cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n    }\n};',
                    c: 'void reverseString(char* s, int sSize){\n    // Write your code here\n}'
                },
                testCases: [{ input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' }]
            }
        ];
        await Problem.insertMany(samples);
    }
};

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || '';
        const tag = req.query.tag || '';

        const query = {};
        
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        
        if (tag) {
            query.tags = tag;
        }

        const total = await Problem.countDocuments(query);
        const problems = await Problem.find(query)
            .select('-testCases')
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            problems,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
