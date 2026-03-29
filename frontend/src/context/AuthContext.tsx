import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
  name: string;
  username: string;
  isAdmin: boolean;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lms_user');
    if (stored) {
      const u = JSON.parse(stored);
      axios.defaults.headers.common['Authorization'] = `Bearer ${u.token}`;
      return u;
    }
    return null;
  });
  const [loading] = useState(false);

  const login = async (username: string, password: string): Promise<User> => {
    const { data } = await axios.post('/api/auth/login', { username, password });
    setUser(data);
    localStorage.setItem('lms_user', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
