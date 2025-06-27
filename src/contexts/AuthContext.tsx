import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/api';

interface User {
  userID: number;
  email: string;
  role: 'Admin' | 'Company' | 'Employee' | 'Chef' | 'DeliveryPerson';
  admin: any | null;
  corporateCompany: any | null;
  employee: any | null;
  homeChef: any | null;
  deliveryPerson: any | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT token validation function
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Extract user data from JWT token
const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Extract user data from JWT claims
    const userData: User = {
      userID: parseInt(payload.sub || payload.userId || payload.id),
      email: payload.email,
      role: payload.role,
      admin: payload.admin ? JSON.parse(payload.admin) : null,
      corporateCompany: payload.corporateCompany ? JSON.parse(payload.corporateCompany) : null,
      employee: payload.employee ? JSON.parse(payload.employee) : null,
      homeChef: payload.homeChef ? JSON.parse(payload.homeChef) : null,
      deliveryPerson: payload.deliveryPerson ? JSON.parse(payload.deliveryPerson) : null,
    };
    
    return userData;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && isTokenValid(token)) {
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
          console.log("✅ Set user from token:", userData);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        // Token is expired or invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid or expired, remove it
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

    const token = response.data.token;
    localStorage.setItem('token', token);
    
    // Extract user data from token
    const userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
      return userData;
    } else {
      throw new Error('Invalid token received');
    }
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