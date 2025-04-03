
import { User, Session } from '@supabase/supabase-js';

// Define a ProfileData type to match our Supabase profile structure
export type ProfileData = {
  id: string;
  name: string | null;
  credits: number;
  created_at: string;
  updated_at: string;
};

// Extend the User type to include our additional properties
export type ExtendedUser = User & {
  name?: string;
  credits?: number;
};

// Types for the auth context
export type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCredits: (newCredits: number) => Promise<void>;
};
