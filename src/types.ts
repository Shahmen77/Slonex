export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  isActive?: boolean;
  permissions?: string[];
}

export interface Check {
  id: string;
  userId: string;
  type: string;
  status: 'completed' | 'failed' | 'in_progress';
  createdAt: string;
  updatedAt: string;
  result?: any;
}

export interface Stats {
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  averageResponseTime: number;
  lastCheckDate?: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  isSubmitting: boolean;
  error?: string;
  success?: boolean;
} 