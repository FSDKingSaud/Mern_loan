const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const password = process.env.EMAIL_PASSWORD;
router.post('/send-email', async (req, res) => {

    const { email, subject, html } = req.body;
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: 'boctrustebusiness@gmail.com',
                pass: password
            },
        });
            
        const mailOptions = {
            from: 'Boctrust MFB Ltd',
            to: email,
            subject: subject,
            html: html

        };

        let info = await transporter.sendMail({
            from: '"Boctrust"  eBusiness@boctrustmfb.com', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: html, // plain text body
        });

        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;
