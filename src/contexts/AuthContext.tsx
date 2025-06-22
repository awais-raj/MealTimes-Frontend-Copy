import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api';

interface User {
  userID: number;
  email: string;
  role: 'Admin' | 'Company' | 'Employee' | 'Chef';
  admin: any | null;
  corporateCompany: any | null;
  employee: any | null;
  homeChef: any | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await auth.getCurrentUser();
        if (userData.isSuccess && userData.data?.userDto) {
          setUser(userData.data.userDto);
          console.log("✅ Set user in context:", userData.data.userDto);
        }
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await auth.login(email, password);
    
    if (!response.isSuccess || !response.data?.userDto) {
      throw new Error('Login failed');
    }

    localStorage.setItem('token', response.data.token);
    setUser(response.data.userDto);
    return response.data.userDto;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};