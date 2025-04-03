
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthContextType } from '@/types/auth';
import { 
  handleLogin, 
  handleLogout, 
  handleRegister, 
  updateUserCredits 
} from '@/utils/authUtils';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    session, 
    isLoading, 
    error, 
    setUser, 
    setError, 
    setIsLoading 
  } = useAuthState();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await handleLogin(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await handleRegister(email, password, name);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await handleLogout();
  };

  const updateCredits = async (newCredits: number) => {
    if (!user) return;
    
    const success = await updateUserCredits(user.id, newCredits);
    if (success) {
      // Update the local user state with new credits
      setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isLoading, 
        error, 
        login, 
        register, 
        logout, 
        updateCredits 
      }}
    >
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
