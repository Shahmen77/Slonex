"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Missing SMTP configuration. Please check your .env file.');
    process.exit(1);
}
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendVerificationEmail = async (email, code) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your Verification Code',
            html: `
        <h1>Your Verification Code</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send verification email');
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
//# sourceMappingURL=email.js.map