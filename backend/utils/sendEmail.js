const { Resend } = require('resend');

const sendEmail = async (options) => {
    // 1. Check for API Key
    // 1. Check for API Key or Placeholder
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123456789') {
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('------------------------');
        return { simulated: true, id: 'sim_123' };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'CodePractice <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }

        console.log('Email sent successfully via Resend:', data.id);
        return data;
    } catch (error) {
        console.error('Email Dispatch Error:', error);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

module.exports = sendEmail;
