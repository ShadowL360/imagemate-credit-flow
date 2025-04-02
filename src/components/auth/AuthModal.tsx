
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthModalProps {
  trigger?: React.ReactNode;
  defaultView?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthModal = ({ 
  trigger, 
  defaultView = 'login',
  onSuccess 
}: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'login' | 'register'>(defaultView);

  const handleSuccess = () => {
    setIsOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {view === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onSwitchToRegister={() => setView('register')} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess} 
            onSwitchToLogin={() => setView('login')} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
