import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, MOCK_USERS } from '../lib/mockData';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: User['role']) => void;
  signup: (name: string, email: string, role: User['role']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  const login = (email: string, role: User['role']) => {
    // Simple mock login
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role) || {
      id: Math.random().toString(),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(foundUser as User);
    setLocation('/dashboard');
  };

  const signup = (name: string, email: string, role: User['role']) => {
    const newUser: User = {
      id: Math.random().toString(),
      name,
      email,
      role
    };
    setUser(newUser);
    setLocation('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setLocation('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
