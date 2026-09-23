import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole as rbac } from '../../middleware/rbac.middleware';
import { prisma } from '../../config/database';
import { AppError } from '../../utils/appError';

const router = Router();

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, displayName: true, role: true, avatarUrl: true, createdAt: true }
    });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, rbac('ADMIN'), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, displayName: true, role: true, isActive: true }
    });
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
});

export default router;
