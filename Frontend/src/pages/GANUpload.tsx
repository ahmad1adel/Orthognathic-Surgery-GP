import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ImageIcon, Lock } from 'lucide-react';
import { useAuthGate } from '@/contexts/AuthGate';
import { useAuth } from '@/contexts/AuthContext';
import { useUsage } from '@/contexts/UsageContext';
import PaywallModal from '@/components/PaywallModal';

const GANUpload: React.FC = () => {
  const { requireAuth } = useAuthGate();
  const { user } = useAuth();
  const { canUseGAN, ganUsed, limits, recordGAN } = useUsage();
  const [paywallOpen, setPaywallOpen] = React.useState(false);

  const role = user?.role ?? 'patient';
  const limitDisplay = limits.gan === -1 ? '∞' : String(limits.gan);

  const handleGenerate = () => {
    requireAuth(() => {
      if (!canUseGAN) {
        setPaywallOpen(true);
        return;
      }
      // GAN backend not wired yet — just record usage
      recordGAN();
      alert('GAN restoration submitted! (backend integration pending)');
    });
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-4">GAN Jaw Restoration</h1>

        {/* Usage indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-secondary/60 rounded-full px-5 py-2 text-sm">
            {canUseGAN ? (
              <>
                <span className="text-muted-foreground">Restorations used:</span>
                <span className="font-semibold text-foreground">{ganUsed} / {limitDisplay}</span>
                <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: limits.gan === -1 ? '10%' : `${Math.min((ganUsed / limits.gan) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-medium">
                  Free limit reached (1 restoration)
                </span>
              </>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Upload X-Ray for Restoration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload X-ray for AI-powered restoration</p>
              {!canUseGAN && (
                <p className="text-sm text-destructive mt-2 font-medium">
                  Upgrade your plan to generate more restorations.
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              variant={canUseGAN ? 'default' : 'secondary'}
            >
              {canUseGAN ? (
                'Generate Restoration'
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Upgrade to Generate
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        feature="GAN Restoration"
        reason="You've used your 1 free GAN restoration. Upgrade your plan to generate more jaw restoration images."
      />
    </div>
  );
};

export default GANUpload;
