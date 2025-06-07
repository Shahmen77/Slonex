import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
      },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
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

    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении статистики' });
  }
});

export const userRouter = router; 