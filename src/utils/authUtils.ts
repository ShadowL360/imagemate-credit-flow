
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfileData, ExtendedUser } from '@/types/auth';

// Utility functions for authentication

// Navigation helper without router dependency
export const navigateTo = (path: string) => {
  window.location.href = path;
};

// Fetch user profile data from Supabase
export const fetchUserProfile = async (userId: string): Promise<ProfileData | null> => {
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

// Handle login
export const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    toast.success('Login successful');
    navigateTo('/dashboard');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Login failed');
    throw err;
  }
};

// Handle registration
export const handleRegister = async (email: string, password: string, name?: string) => {
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
    navigateTo('/dashboard');
    return data;
  } catch (err: any) {
    toast.error(err.message || 'Registration failed');
    throw err;
  }
};

// Handle logout
export const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    toast.info('You have been logged out');
    navigateTo('/');
  } catch (err: any) {
    toast.error(err.message || 'Logout failed');
  }
};

// Update user credits
export const updateUserCredits = async (userId: string, newCredits: number) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (err: any) {
    toast.error('Failed to update credits');
    console.error('Update credits error:', err);
    return false;
  }
};
