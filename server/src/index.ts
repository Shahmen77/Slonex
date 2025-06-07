import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { checkRouter } from './routes/check';
import { paymentRouter } from './routes/payment';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/check', checkRouter);
app.use('/api/payment', paymentRouter);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 