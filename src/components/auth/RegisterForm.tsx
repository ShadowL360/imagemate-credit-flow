
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Create an Account</h2>
        <p className="text-muted-foreground">Sign up to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input 
            id="name"
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your name"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            disabled={isLoading}
            placeholder="At least 8 characters"
            minLength={8}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
            Sign in
          </Button>
        </p>
      </div>
      
      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          By signing up, you agree to our
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Button variant="link" className="p-0 h-auto">Terms of Service</Button>
          <span className="text-muted-foreground">and</span>
          <Button variant="link" className="p-0 h-auto">Privacy Policy</Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
