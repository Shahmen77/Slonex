"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
const API_URL = 'https://gate.vp.ru/api/transaction/create';
const MERCHANT = '20000088';
const TERMINAL = '200000882';
router.post('/sbp', async (req, res) => {
    var _a;
    try {
        let { amount, description, clientBackUrl, userIp, userInfo } = req.body;
        const orderId = Date.now().toString();
        amount = parseFloat(amount).toFixed(2);
        const token = Buffer.from(JSON.stringify({ userInfo })).toString('base64');
        const payload = {
            orderId,
            amount,
            terminal: TERMINAL,
            merchant: MERCHANT,
            description,
            clientBackUrl,
            userIp,
            tokenType: 'SBP',
            token,
        };
        console.log('Payload для шлюза:', payload);
        const response = await axios_1.default.post(API_URL, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Ответ от шлюза:', response.data);
        return res.json(response.data);
    }
    catch (err) {
        console.error('Ошибка при оплате через СБП:', err.message);
        if (err.response) {
            console.error('Ответ с ошибкой:', err.response.data);
        }
        return res.status(500).json({ error: err.message, details: (_a = err.response) === null || _a === void 0 ? void 0 : _a.data });
    }
});
exports.paymentRouter = router;
//# sourceMappingURL=payment.js.map