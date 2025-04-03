
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedUser } from '@/types/auth';
import { fetchUserProfile } from '@/utils/authUtils';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update user state with profile data
  const updateUserWithProfile = async (currentUser: ExtendedUser) => {
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
    console.log("AuthProvider: Initializing auth state");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthProvider: Auth state changed", event);
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
      console.log("AuthProvider: Getting session", currentSession ? "found" : "not found");
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

  return { user, session, isLoading, error, setUser, setError, setIsLoading };
};
