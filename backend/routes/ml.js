const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/verify', async (req, res) => {
    const { problemDescription, language, code, output } = req.body;

    if (!problemDescription || !language || !code) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback if API key is not configured
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return res.json({
            isCorrect: false,
            feedback: "⚠️ ML Verification is currently disabled because the Google Gemini API Key is missing. Please add your key to the backend .env file to enable AI-powered correctness checking."
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
You are an expert programming instructor and code evaluator.
I will provide you with a problem description, the user's source code in a specific language, and the standard output generated when their code was executed.
Your task is to determine whether the user's code correctly and fully solves the problem.

Problem Description:
${problemDescription}

Language: ${language}

User's Code:
\`\`\`${language}
${code}
\`\`\`

Execution Output / Error:
${output || '(No output)'}

Analyze the logic of the code and the output. Does it correctly solve the problem? 
If there are minor edge cases missed, be lenient unless they are critical.
If the code is incomplete (e.g. just the boilerplate) or clearly fails to solve the core problem, it is incorrect.
Respond strictly in JSON format without any markdown wrappers or code blocks.
The JSON must have this exact structure:
{
  "isCorrect": boolean,
  "feedback": "string explaining why it is correct or incorrect. Keep it under 3 sentences and be encouraging."
}
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Clean up markdown formatting if Gemini includes it
        text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        try {
            const parsed = JSON.parse(text);
            return res.json(parsed);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            return res.status(500).json({ error: 'Failed to parse ML response' });
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Failed to verify code with ML' });
    }
});

module.exports = router;
