
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
type User = {
  id: string;
  email: string;
  name?: string;
  credits: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
};

// Mock users database for demo
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    credits: 5,
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('imagemate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Omit password when setting the user
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('imagemate_user', JSON.stringify(userWithoutPassword));
      toast.success('Login successful');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('User already exists with this email');
      }
      
      // In a real app, we would create the user in a database
      // For this demo, we'll pretend we created a user and return mock data
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        name: name || email.split('@')[0],
        credits: 3, // New users get 3 free credits
      };
      
      // In a real app we would save the user to the database here
      // For demo, we'll just update our local state
      MOCK_USERS.push({ ...newUser, password });
      
      setUser(newUser);
      localStorage.setItem('imagemate_user', JSON.stringify(newUser));
      toast.success('Registration successful');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('imagemate_user');
    toast.info('You have been logged out');
  };

  const updateCredits = (newCredits: number) => {
    if (user) {
      const updatedUser = { ...user, credits: newCredits };
      setUser(updatedUser);
      localStorage.setItem('imagemate_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, updateCredits }}>
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
