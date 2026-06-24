import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  feature: 'CNN Analysis' | 'GAN Restoration' | 'AI Chatbot';
  reason: string;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ open, onClose, feature, reason }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">Free Limit Reached</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            {reason}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-secondary/50 rounded-xl border border-border">
          <div className="flex items-center gap-2 justify-center mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Upgrade to continue using {feature}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose a plan that fits your needs — starting from just $9/month.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleUpgrade} className="w-full gap-2">
            View Pricing Plans
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallModal;
