import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface AuthGateContextType {
  /**
   * Gate an action behind authentication.
   * - If the user is logged in: runs `action` (if given) and returns true.
   * - If not: opens the "Sign up to continue" popup and returns false.
   */
  requireAuth: (action?: () => void) => boolean;
}

const AuthGateContext = createContext<AuthGateContextType | undefined>(undefined);

export const useAuthGate = () => {
  const ctx = useContext(AuthGateContext);
  if (!ctx) {
    throw new Error('useAuthGate must be used within an AuthGateProvider');
  }
  return ctx;
};

interface AuthGateProviderProps {
  children: ReactNode;
}

export const AuthGateProvider: React.FC<AuthGateProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const requireAuth = (action?: () => void) => {
    if (isAuthenticated) {
      action?.();
      return true;
    }
    setOpen(true);
    return false;
  };

  const goTo = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <AuthGateContext.Provider value={{ requireAuth }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sign up to continue
            </DialogTitle>
            <DialogDescription>
              You need an account to use this feature. Create a free account or
              log in to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button className="w-full sm:flex-1" onClick={() => goTo('/signup')}>
              Sign Up
            </Button>
            <Button
              variant="outline"
              className="w-full sm:flex-1"
              onClick={() => goTo('/login')}
            >
              Log In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGateContext.Provider>
  );
};
