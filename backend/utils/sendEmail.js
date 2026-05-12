const sendEmail = async (options) => {
    // 1. Simulation / Debug Mode
    // We trigger simulation if API Key is missing or is the placeholder
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123456789') {
        console.log('--------------------------------------------------');
        console.log('🚀 [SIMULATION MODE] Verification Email');
        console.log(`📧 To: ${options.email}`);
        console.log(`📝 Subject: ${options.subject}`);
        console.log(`🔢 Message: ${options.message}`);
        console.log('--------------------------------------------------');
        return { id: 'sim_' + Date.now(), simulated: true };
    }

    // 2. Production Mode (Resend)
    try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'CodePractice <onboarding@resend.dev>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(error.message);
        }

        return data;
    } catch (err) {
        console.error('Email Dispatch Failure:', err);
        // Even if production fails, let's log the message so the user can see it in Render logs
        console.log('CRITICAL: Production email failed, but here is the code for debugging:');
        console.log(`>>> ${options.message}`);
        throw err;
    }
};

module.exports = sendEmail;
