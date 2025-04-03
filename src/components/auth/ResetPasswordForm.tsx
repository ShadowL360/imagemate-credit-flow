
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
  onBack: () => void;
}

const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/dashboard?reset=true`,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-muted-foreground">
            We've sent password reset instructions to {email}
          </p>
        </div>
        
        <div className="p-6 bg-muted/30 rounded-lg text-center space-y-4">
          <p>Please check your inbox and follow the link to reset your password.</p>
          <p className="text-sm text-muted-foreground">
            If you don't see the email, check your spam folder.
          </p>
        </div>
        
        <Button 
          onClick={onBack}
          variant="outline" 
          className="w-full mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Reset Your Password</h2>
        <p className="text-muted-foreground">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input 
            id="reset-email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending instructions...
            </>
          ) : (
            'Send Reset Instructions'
          )}
        </Button>
      </form>
      
      <Button 
        onClick={onBack} 
        variant="link" 
        className="w-full mt-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Login
      </Button>
    </div>
  );
};

export default ResetPasswordForm;
