import { Router, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Get user's checks
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const checks = await prisma.check.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(checks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get checks' });
  }
});

// Create new check
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, status, result } = req.body;
    
    const check = await prisma.check.create({
      data: {
        type,
        status,
        result,
        userId: req.user!.userId,
      },
    });

    res.json(check);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create check' });
  }
});

export const checkRouter = router; 