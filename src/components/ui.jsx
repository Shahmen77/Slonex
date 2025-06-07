import React, { useState } from 'react';
import { paymentAPI } from '../client/api';

export function SBPButton() {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    try {
      const orderData = {
        orderId: Date.now().toString(),
        amount: '10.01',
        terminal: '200001541',
        merchant: '20000154',
        description: 'Оплата через СБП',
        clientBackUrl: window.location.origin + '/back-from-pay',
        userIp: '127.0.0.1',
        tokenType: 'SBP',
        token: btoa(JSON.stringify({
        userInfo: {
          language: 'ru-RU',
          colorDepth: '24',
          userAgent: navigator.userAgent,
          browserAccept: navigator.language,
          timezone: new Date().getTimezoneOffset(),
          screenHeight: window.screen.height,
          screenWidth: window.screen.width,
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
          javaEnabled: navigator.javaEnabled ? 'true' : 'false',
          javaScriptEnabled: 'true'
        }
        })),
      };
      const data = await paymentAPI.paySBP(orderData);
      setQr(data.qrCodeContent);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handlePay}>Запросить цены</button>
      {qr && <img src={`data:image/png;base64,${qr}`} alt="QR для оплаты СБП" />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
} 

export function Button(props) { return <button {...props} />; }
export function Card(props) { return <div {...props} />; }
export function CardContent(props) { return <div {...props} />; }
export function CardHeader(props) { return <div {...props} />; }
export function CardTitle(props) { return <h2 {...props} />; }
export function Input(props) { return <input {...props} />; } 