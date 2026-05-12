const nodemailer = require('nodemailer');

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

    // 2. Production Mode (Brevo SMTP)
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: 'thirumughils@gmail.com', // Your Brevo login email
                pass: process.env.BREVO_API_KEY, // The xsmtpsib- key you just added
            }
        });

        const mailOptions = {
            from: '"CodePractice" <thirumughils@gmail.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully via Brevo SMTP:', info.messageId);
        return info;
    } catch (error) {
        console.error('Brevo SMTP Error:', error.message);
        throw new Error('Email delivery failed');
    }
};

module.exports = sendEmail;
