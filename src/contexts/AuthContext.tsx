import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../client/api';

interface AuthContextType {
  user: any | null;
  login: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Здесь можно добавить проверку токена и загрузку данных пользователя
      // Например, через API
    }
  }, []);

  const login = async (email: string, code: string) => {
    const response = await authAPI.verifyCode(email, code);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 