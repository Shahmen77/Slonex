import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authRouter } from './routes/auth';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(json());

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Middleware для проверки JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Генерация кода подтверждения
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Маршруты аутентификации
app.post('/api/auth/send-code', async (req, res) => {
  const { email } = req.body;
  const code = generateVerificationCode();

  try {
    // Сохраняем код в базе данных
    await prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 минут
      },
    });

    // Отправляем email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Код подтверждения для входа в Slonex',
      html: `
        <h1>Код подтверждения</h1>
        <p>Ваш код для входа в систему: <strong>${code}</strong></p>
        <p>Код действителен в течение 15 минут.</p>
      `,
    });

    res.json({ success: true, message: 'Код отправлен на email' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ success: false, message: 'Ошибка при отправке кода' });
  }
});

app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;

  try {
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
      return res.status(400).json({ message: 'Неверный или истекший код' });
    }

    // Удаляем использованный код
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });

    // Получаем или создаем пользователя
    let user = await prisma.user.findUnique({ where: { email } });
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

    // Генерируем JWT токен
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ message: 'Ошибка при проверке кода' });
  }
});

// Маршруты пользователя
app.get('/api/user/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении профиля' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении профиля' });
  }
});

app.get('/api/user/stats', authenticateToken, async (req: any, res) => {
  try {
    const checks = await prisma.check.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      totalChecks: checks.length,
      remainingChecks: Math.max(0, 200 - checks.length), // Пример: лимит 200 проверок
      lastCheckDate: checks[0]?.createdAt || null,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
});

app.get('/api/user/checks', authenticateToken, async (req: any, res) => {
  try {
    const checks = await prisma.check.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    res.json(checks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении проверок' });
  }
});

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 