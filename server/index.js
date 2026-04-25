const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

const LAKSHAY_EMAIL = 'lakshaysharma866@gmail.com';

// Professional HTML Template for Lakshay
const getLakshayEmailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #000000; color: #888888; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #050505; border: 1px solid #111111; padding: 50px; border-radius: 4px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
        .header { border-bottom: 1px solid #9e1b1b; padding-bottom: 30px; margin-bottom: 40px; text-align: center; }
        .logo { color: #ffffff; font-weight: 900; font-size: 24px; letter-spacing: 8px; }
        .title { font-size: 16px; font-weight: 900; margin-bottom: 40px; color: #444444; letter-spacing: 3px; text-align: center; text-transform: uppercase; }
        .field { margin-bottom: 40px; }
        .label { font-size: 8px; color: #9e1b1b; letter-spacing: 4px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px; }
        .value { font-size: 15px; color: #bbbbbb; line-height: 1.6; font-weight: 400; }
        .footer { margin-top: 60px; font-size: 8px; color: #222; text-align: center; border-top: 1px solid #111; padding-top: 30px; letter-spacing: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">LAKSHAY SHARMA</div>
        </div>
        <div class="title">Project Transmission Received</div>
        <div class="field">
            <div class="label">IDENTIFIER</div>
            <div class="value">${name}</div>
        </div>
        <div class="field">
            <div class="label">COORDINATES</div>
            <div class="value">${email}</div>
        </div>
        <div class="field">
            <div class="label">SPECIFICATIONS</div>
            <div class="value">${message}</div>
        </div>
        <div class="footer">
            SYSTEM_SECURE_TRANSMISSION // LS-v2.0
        </div>
    </div>
</body>
</html>
`;

// Professional HTML Template for the User
const getUserEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #000000; color: #888888; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #050505; border: 1px solid #111111; padding: 50px; border-radius: 4px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
        .header { border-bottom: 1px solid #9e1b1b; padding-bottom: 30px; margin-bottom: 40px; text-align: center; }
        .logo { color: #ffffff; font-weight: 900; font-size: 24px; letter-spacing: 8px; }
        .greeting { font-size: 20px; font-weight: 900; margin-bottom: 25px; color: #ffffff; letter-spacing: -0.5px; text-align: center; }
        .message { font-size: 14px; color: #666666; line-height: 2; margin-bottom: 40px; text-align: center; }
        .highlight { color: #9e1b1b; font-weight: 700; }
        .cta-box { background: #000000; border: 1px solid #111; padding: 30px; border-radius: 2px; text-align: center; }
        .cta-text { font-size: 9px; color: #9e1b1b; letter-spacing: 4px; font-weight: 900; }
        .footer { margin-top: 60px; font-size: 8px; color: #222; text-align: center; border-top: 1px solid #111; padding-top: 30px; letter-spacing: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">LAKSHAY SHARMA</div>
        </div>
        <div class="greeting">HELLO ${name.toUpperCase()}</div>
        <div class="message">
            Your project inquiry has been successfully logged. I am currently analyzing the specifications provided.
            <br /><br />
            A personal transmission will follow <span class="highlight">within 24 hours</span> to discuss the potential of this collaboration.
        </div>
        <div class="cta-box">
            <div class="cta-text">EXPECT CONTACT SHORTLY</div>
        </div>
        <div class="footer">
            DIGITAL CRAFTSMAN • CREATIVE TECHNOLOGIST
        </div>
    </div>
</body>
</html>
`;

app.post('/api/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`>>> Incoming inquiry from: ${name} (${email})`);

    try {
        // 1. Send to Lakshay (Critical)
        console.log('Sending notification to Lakshay...');
        const adminMail = await resend.emails.send({
            from: 'Lakshay Sharma <onboarding@resend.dev>',
            to: LAKSHAY_EMAIL,
            subject: `[NEW PROJECT] ${name.toUpperCase()}`,
            html: getLakshayEmailTemplate(name, email, message),
        });
        console.log('Admin mail response:', adminMail);

        // 2. Send to User (Auto-reply)
        console.log(`Attempting auto-reply to ${email}...`);
        try {
            const userMail = await resend.emails.send({
                from: 'Lakshay Sharma <onboarding@resend.dev>',
                to: email,
                subject: 'Project Transmission Received - Lakshay Sharma',
                html: getUserEmailTemplate(name),
            });
            console.log('User auto-reply response:', userMail);
        } catch (userError) {
            console.warn('Auto-reply blocked (Resend onboarding restriction):', userError.message);
        }

        res.status(200).json({ success: true, message: 'Inquiry received' });
    } catch (error) {
        console.error('Critical Server Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
