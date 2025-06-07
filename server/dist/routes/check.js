"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const checks = await prisma.check.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(checks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get checks' });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { type, status, result } = req.body;
        const check = await prisma.check.create({
            data: {
                type,
                status,
                result,
                userId: req.user.userId,
            },
        });
        res.json(check);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create check' });
    }
});
exports.checkRouter = router;
//# sourceMappingURL=check.js.map