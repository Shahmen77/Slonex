import axios from 'axios';

/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для автоматического добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Типы данных
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
}

export interface VerificationRoesponse {
  success: boolean;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Check {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  result?: any;
}

export interface UserStats {
  totalChecks: number;
  remainingChecks: number;
  lastCheckDate: string;
}

// API методы
export const authAPI = {
  sendVerificationCode: async (email: string) => {
    const response = await apiClient.post('/auth/send-code', { email });
    return response.data;
  },
  verifyCode: async (email: string, code: string) => {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  },
  verifyGoogleToken: async (credential: string) => {
    const response = await apiClient.post('/auth/google', { credential });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/user/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/user/profile', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/user/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
  getChecks: async () => {
    const response = await apiClient.get('/check', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  },
};

// Оплата через СБП (пример для метода 4.2.13)
export const paymentAPI = {
  paySBP: async (params: {
    orderId: string;
    amount: string;
    terminal: string;
    merchant: string;
    description?: string;
    email?: string;
    phone?: string;
    clientBackUrl?: string;
    userIp?: string;
    tokenType?: string;
    token?: string;
    sign?: string;
  }) => {
    const response = await apiClient.post('/payment/sbp', params);
    return response.data;
  },
}; 