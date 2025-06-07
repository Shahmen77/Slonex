"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const google_auth_library_1 = require("google-auth-library");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const GOOGLE_CLIENT_ID = '324175832563-tij1fbggkl4eb68djht5g81jcg52phkh.apps.googleusercontent.com';
const googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
router.post('/send-code', async (req, res) => {
    try {
        const { email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.verificationCode.create({
            data: {
                email,
                code,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await (0, email_1.sendVerificationEmail)(email, code);
        return res.json({ message: 'Verification code sent' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send verification code' });
    }
});
router.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                email,
                code,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
        if (!verificationCode) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }
        let user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: '',
                    lastName: '',
                    phone: '',
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        return res.json({ token, user });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to verify code' });
    }
});
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        console.log('Google credential:', credential);
        if (!credential)
            return res.status(400).json({ error: 'No credential' });
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            return res.status(400).json({ error: 'Invalid Google token' });
        let user = await prisma.user.findUnique({ where: { email: payload.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: payload.email,
                    firstName: payload.given_name || '',
                    lastName: payload.family_name || '',
                    phone: '',
                    avatar: payload.picture || '',
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        return res.json({ token, user });
    }
    catch (error) {
        console.error('Google OAuth error:', error);
        return res.status(401).json({ error: 'Google authentication failed', details: error === null || error === void 0 ? void 0 : error.toString() });
    }
});
exports.authRouter = router;
//# sourceMappingURL=auth.js.map