const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '[MAIL_ADDR]',
        pass: '[MAIL_PW]',
    },
});

// 이메일 전송 함수
const sendVerificationMail = async (to, token) => {
    try {
        const mailOptions = {
            from: '[MAIL_ADDR]',
            to,
            subject: '이메일 인증 요청',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #005bac;">MoA 인증번호</h2>
        <p style="text-align: center; font-size: 16px; color: #333;">
            아래 인증번호를 입력하여 이메일 인증을 완료해주세요.
        </p>
        <div style="margin: 20px auto; padding: 15px; width: 200px; text-align: center; font-size: 24px; font-weight: bold; color: #005bac; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px;">
            ${token}
        </div>
        <p style="text-align: center; font-size: 14px; color: #666;">
            인증번호는 5분 동안 유효합니다. 인증 절차를 완료해주세요.
        </p>
        <p style="text-align: center; font-size: 12px; color: #aaa;">
            이 이메일은 MoA에서 발송되었습니다. 문의사항은 support@moa.com으로 연락주세요.
        </p>
    </div>
`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// 이메일 인증 요청
router.post('/verificationRequest', async (req, res) => {
    const { email } = req.body;
    console.log('메일');

    if (!email) {
        return res.status(400).send({ message: 'Email is required' });
    }

    const token = (parseInt(crypto.randomBytes(3).toString('hex'), 16) % 900000) + 100000;
    await sendVerificationMail(email, token);

    console.log('메일발송');
    res.send({ message: 'Verification email sent!', token: token });
});

module.exports = router;
