const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For local testing/simulating if no SMTP is provided
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('--- EMAIL SIMULATION ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('------------------------');
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // SSL
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 45000, // 45 seconds
            greetingTimeout: 45000,
            socketTimeout: 45000,
        });

        const mailOptions = {
            from: `"CodePractice" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

module.exports = sendEmail;
