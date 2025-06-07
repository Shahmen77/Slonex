import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/email';
import { OAuth2Client } from 'google-auth-library';

const router = Router();
const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = '324175832563-tij1fbggkl4eb68djht5g81jcg52phkh.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Send verification code
router.post('/send-code', async (req, res) => {
  try {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    await sendVerificationEmail(email, code);
    
    return res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Verify code and login
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

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    console.log('Google credential:', credential);
    if (!credential) return res.status(400).json({ error: 'No credential' });

    // Валидация токена Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).json({ error: 'Invalid Google token' });

    // Найти или создать пользователя
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

    // JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(401).json({ error: 'Google authentication failed', details: error?.toString() });
  }
});

export const authRouter = router; 