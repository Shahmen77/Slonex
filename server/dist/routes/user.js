"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to get user profile' });
    }
});
router.put('/profile', auth_1.authenticateToken, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update user profile' });
    }
});
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    var _a;
    if (!req.user)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const checks = await prisma.check.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
        });
        const stats = {
            totalChecks: checks.length,
            remainingChecks: Math.max(0, 200 - checks.length),
            lastCheckDate: ((_a = checks[0]) === null || _a === void 0 ? void 0 : _a.createdAt) || null,
        };
        return res.json(stats);
    }
    catch (error) {
        return res.status(500).json({ message: 'Ошибка при получении статистики' });
    }
});
exports.userRouter = router;
//# sourceMappingURL=user.js.map