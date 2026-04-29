const express = require('express');
const router = express.Router();
const axios = require('axios');

const JUDGE0_API_URL = 'https://ce.judge0.com/submissions';

// Map our language names to Judge0 language IDs
const languageMap = {
    python: 100,      // Python 3.12.5
    javascript: 102,  // Node.js 22.08.0
    java: 91,         // Java JDK 17
    cpp: 105,         // C++ GCC 14.1.0
    c: 103            // C GCC 14.1.0
};

router.post('/', async (req, res) => {
    const { language, sourceCode, stdin } = req.body;

    if (!language || !sourceCode) {
        return res.status(400).json({ error: 'Language and source code are required' });
    }

    const langId = languageMap[language.toLowerCase()];
    if (!langId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
    }

    try {
        const payload = {
            language_id: langId,
            source_code: sourceCode,
            stdin: stdin || ""
        };

        // Submit and wait for the result
        const response = await axios.post(`${JUDGE0_API_URL}?base64_encoded=false&wait=true`, payload);
        const data = response.data;
        
        // Status ID 3 means "Accepted" (Execution completed successfully)
        const isError = data.status.id !== 3;
        
        let output = "";
        if (data.compile_output) {
            output += data.compile_output + "\n";
        }
        if (data.stderr) {
            output += data.stderr + "\n";
        }
        if (data.stdout) {
            output += data.stdout;
        }

        if (!output) {
            output = data.status.description; // e.g. "Time Limit Exceeded", "Runtime Error"
        }

        res.json({ output: output.trim(), isError });

    } catch (error) {
        console.error('Judge0 API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to execute code via Judge0' });
    }
});

module.exports = router;
