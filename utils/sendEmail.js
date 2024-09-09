const transporter = require('../config/nodemailerConfig');

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Your email address
            to: to,
            subject: subject,
            text: text
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response); // Log the response from the email server
    } catch (error) {
        console.error('Error sending email:', error.message); // Log the error message
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;