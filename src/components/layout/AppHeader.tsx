
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';
import AuthModal from '../auth/AuthModal';
import CreditDisplay from '../credits/CreditDisplay';

const AppHeader = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl flex items-center">
            <span className="bg-gradient-to-r from-imagemate-purple to-imagemate-blue bg-clip-text text-transparent">
              ImageMate
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <CreditDisplay />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <span className="mr-2">{user.name || user.email.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
