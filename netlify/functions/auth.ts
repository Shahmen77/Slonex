import { Handler } from '@netlify/functions';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const GOOGLE_CLIENT_ID = '324175832563-tij1fbggkl4eb68djht5g81jcg52phkh.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const handler: Handler = async (event, context) => {
  const { path, httpMethod, body } = event;
  const data = body ? JSON.parse(body) : {};

  // Отправка кода
  if (path.endsWith('/send-code') && httpMethod === 'POST') {
    const { email } = data;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query(
      'INSERT INTO verification_code (email, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'10 minutes\')',
      [email, code]
    );
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Verification Code',
      html: `<h1>Your Verification Code</h1><p>Your code: <strong>${code}</strong></p>`,
    });
    return { statusCode: 200, body: JSON.stringify({ message: 'Verification code sent' }) };
  }

  // Проверка кода и логин
  if (path.endsWith('/verify-code') && httpMethod === 'POST') {
    const { email, code } = data;
    const { rows } = await pool.query(
      'SELECT * FROM verification_code WHERE email = $1 AND code = $2 AND expires_at > NOW()',
      [email, code]
    );
    if (!rows.length) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or expired code' }) };

    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user.rows.length) {
      user = await pool.query(
        'INSERT INTO users (email) VALUES ($1) RETURNING *',
        [email]
      );
    }
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { statusCode: 200, body: JSON.stringify({ token, user: user.rows[0] }) };
  }

  // Google OAuth
  if (path.endsWith('/google') && httpMethod === 'POST') {
    const { credential } = data;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Google token' }) };

    let user = await pool.query('SELECT * FROM users WHERE email = $1', [payload.email]);
    if (!user.rows.length) {
      user = await pool.query(
        'INSERT INTO users (email, first_name, last_name, avatar) VALUES ($1, $2, $3, $4) RETURNING *',
        [payload.email, payload.given_name || '', payload.family_name || '', payload.picture || '']
      );
    }
    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { statusCode: 200, body: JSON.stringify({ token, user: user.rows[0] }) };
  }

  return { statusCode: 404, body: 'Not found' };
}; 