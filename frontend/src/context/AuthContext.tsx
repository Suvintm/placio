import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'STUDENT' | 'COLLEGE' | 'COMPANY' | null;

interface User {
  id: string;
  email: string;
  role: Role;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  signup: (userData: any, role: Role) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('placio_user');
    const token = localStorage.getItem('placio_token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    if (!role) throw new Error("Role is required for login");
    
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const endpoint = `${API_URL}/auth/login/${role.toLowerCase()}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      const message = typeof error.detail === 'string' 
        ? error.detail 
        : (Array.isArray(error.detail) ? error.detail[0].msg : 'Login failed');
      throw new Error(message);
    }

    const data = await response.json();
    const newUser = {
      id: data.user.id.toString(),
      email: data.user.email,
      role: data.user.role,
      full_name: data.user.full_name,
    };

    setUser(newUser);
    localStorage.setItem('placio_token', data.access_token);
    localStorage.setItem('placio_user', JSON.stringify(newUser));
  };

  const signup = async (userData: any, role: Role) => {
    if (!role) throw new Error("Role is required for signup");
    
    const endpoint = `${API_URL}/auth/signup/${role.toLowerCase()}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      // Handle FastAPI validation errors (array of objects)
      const message = typeof error.detail === 'string' 
        ? error.detail 
        : (Array.isArray(error.detail) ? `Validation Error: ${error.detail[0].loc[1]} - ${error.detail[0].msg}` : 'Signup failed');
      throw new Error(message);
    }

    // After signup, we automatically log them in
    await login(userData.email, userData.password, role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('placio_user');
    localStorage.removeItem('placio_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
