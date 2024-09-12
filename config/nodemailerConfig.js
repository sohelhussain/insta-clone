const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,  // Log information
    debug: true,   // Include debug output
});
module.exports = transporter;