const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://gate.vp.ru/api/transaction/create';
const MERCHANT = '20000088';
const TERMINAL = '200000882';
const SECRET_KEY = '40ae40ff03b4fe2876d9327fc417c0609df49d6f488ade509098b95bfbb39cf8';

function generateSign(params, secretKey) {
  // Формируем строку для подписи согласно документации (поля в алфавитном порядке)
  const keys = Object.keys(params).sort();
  const signString = keys.map(key => `${key}=${params[key]}`).join('&') + secretKey;
  return crypto.createHash('sha256').update(signString).digest('hex');
}

app.post('/api/payment/sbp', async (req, res) => {
  try {
    console.log('--- Новый запрос на /api/payment/sbp ---');
    console.log('Тело запроса от фронта:', req.body);
    let { amount, description, clientBackUrl, userIp, userInfo } = req.body;
    const orderId = Date.now().toString();
    const token = Buffer.from(JSON.stringify({ userInfo })).toString('base64');
    // Приводим сумму к строке с двумя знаками после точки
    amount = parseFloat(amount).toFixed(2);

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

    const response = await axios.post(API_URL, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Ответ от шлюза:', response.data);

    res.json(response.data);
  } catch (err) {
    console.error('Ошибка при оплате через СБП:', err.message);
    if (err.response) {
      console.error('Ответ с ошибкой:', err.response.data);
    }
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`)); 