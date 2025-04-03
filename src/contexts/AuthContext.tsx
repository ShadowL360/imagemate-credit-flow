
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

// Define a ProfileData type to match our Supabase profile structure
type ProfileData = {
  id: string;
  name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
};

// Extend the User type to include our additional properties
type ExtendedUser = User & {
  name?: string;
  credits?: number;
};

// Types
type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCredits: (newCredits: number) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data as ProfileData;
    } catch (err) {
      console.error('Exception fetching user profile:', err);
      return null;
    }
  };

  // Update user state with profile data
  const updateUserWithProfile = async (currentUser: User) => {
    const profile = await fetchUserProfile(currentUser.id);
    if (profile) {
      setUser({
        ...currentUser,
        name: profile.name || currentUser.email?.split('@')[0] || '',
        credits: profile.credits
      });
    } else {
      setUser(currentUser);
    }
  };

  // Initialize auth state from Supabase
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent potential recursive issues with Supabase client
          setTimeout(async () => {
            await updateUserWithProfile(currentSession.user);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        await updateUserWithProfile(currentSession.user);
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('You have been logged out');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    }
  };

  const updateCredits = async (newCredits: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update the local user state with new credits
      setUser(prevUser => prevUser ? { ...prevUser, credits: newCredits } : null);
    } catch (err: any) {
      toast.error('Failed to update credits');
      console.error('Update credits error:', err);
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
