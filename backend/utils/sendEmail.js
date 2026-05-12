const axios = require('axios');

const sendEmail = async (options) => {
    // 1. Simulation Check
    if (!process.env.BREVO_API_KEY || process.env.BREVO_API_KEY === 'your_brevo_key_here') {
        console.log('==================================================');
        console.log('🚀 [SIMULATION MODE] Verification Email');
        console.log(`📧 To: ${options.email}`);
        console.log(`🔢 Code: ${options.message}`);
        console.log('==================================================');
        return { simulated: true };
    }

    // 2. Production Mode (Brevo API)
    try {
        const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: { 
                name: "CodePractice", 
                email: "thirumughils@gmail.com" // Your registered Brevo email
            },
            to: [{ email: options.email }],
            subject: options.subject,
            textContent: options.message,
        }, {
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            }
        });

        console.log('Email sent successfully via Brevo:', response.data.messageId);
        return response.data;
    } catch (error) {
        console.error('Brevo API Error:', error.response ? error.response.data : error.message);
        throw new Error('Email delivery failed');
    }
};

module.exports = sendEmail;
