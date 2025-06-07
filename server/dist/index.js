"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const check_1 = require("./routes/check");
const payment_1 = require("./routes/payment");
const app = (0, express_1.default)();
const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_1.authRouter);
app.use('/api/user', user_1.userRouter);
app.use('/api/check', check_1.checkRouter);
app.use('/api/payment', payment_1.paymentRouter);
app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map