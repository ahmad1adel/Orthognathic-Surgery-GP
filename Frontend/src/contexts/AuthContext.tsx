import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest, getToken, setToken, clearToken } from '@/lib/api';

type UserRole = 'patient' | 'doctor';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a stored token on first load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiRequest<{ user: User }>('/auth/me', { auth: true })
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password, role },
    });
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const data = await apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: { name, email, password, role },
    });
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
