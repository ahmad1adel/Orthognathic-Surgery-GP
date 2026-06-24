import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUsage, Plan, PLAN_LIMITS } from '@/contexts/UsageContext';
import { Check, Sparkles, Zap, Building2, Star, Crown } from 'lucide-react';

interface PlanDef {
  id: Plan;
  name: string;
  price: number;
  icon: React.ElementType;
  color: string;
  badge?: string;
  cnn: string;
  gan: string;
  chat: string;
  extras: string[];
}

const PATIENT_PLANS: PlanDef[] = [
  {
    id: 'patient_basic',
    name: 'Basic',
    price: 9,
    icon: Zap,
    color: 'text-blue-500',
    cnn: '30 analyses / month',
    gan: '5 restorations / month',
    chat: '50 messages / day',
    extras: ['Email support', 'Result history', 'PDF export'],
  },
  {
    id: 'patient_standard',
    name: 'Standard',
    price: 19,
    icon: Sparkles,
    color: 'text-primary',
    badge: 'Most Popular',
    cnn: '100 analyses / month',
    gan: '15 restorations / month',
    chat: '100 messages / day',
    extras: ['Priority support', 'Result history', 'PDF export', 'Find nearby clinics'],
  },
  {
    id: 'patient_premium',
    name: 'Premium',
    price: 39,
    icon: Crown,
    color: 'text-yellow-500',
    cnn: 'Unlimited analyses',
    gan: 'Unlimited restorations',
    chat: 'Unlimited messages',
    extras: ['24/7 priority support', 'Full history', 'PDF & DICOM export', 'Clinic booking', 'Early access features'],
  },
];

const DOCTOR_PLANS: PlanDef[] = [
  {
    id: 'doctor_starter',
    name: 'Starter',
    price: 29,
    icon: Zap,
    color: 'text-blue-500',
    cnn: '50 analyses / month',
    gan: '10 restorations / month',
    chat: '50 messages / day',
    extras: ['Email support', 'Patient report export', 'RAG chatbot access'],
  },
  {
    id: 'doctor_professional',
    name: 'Professional',
    price: 59,
    icon: Star,
    color: 'text-primary',
    badge: 'Most Popular',
    cnn: '200 analyses / month',
    gan: '50 restorations / month',
    chat: '200 messages / day',
    extras: ['Priority support', 'Bulk patient reports', 'RAG chatbot + sources', 'API access'],
  },
  {
    id: 'doctor_enterprise',
    name: 'Enterprise',
    price: 99,
    icon: Building2,
    color: 'text-yellow-500',
    cnn: 'Unlimited analyses',
    gan: 'Unlimited restorations',
    chat: 'Unlimited messages',
    extras: ['Dedicated support', 'Team accounts', 'DICOM integration', 'Custom reports', 'SLA guarantee'],
  },
];

const PlanCard: React.FC<{
  plan: PlanDef;
  current: Plan;
  onSelect: (id: Plan) => void;
  loading: boolean;
}> = ({ plan, current, onSelect, loading }) => {
  const isActive = current === plan.id;
  const Icon = plan.icon;

  return (
    <Card
      className={`relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        plan.badge
          ? 'border-2 border-primary shadow-md'
          : 'border border-border'
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow">
            {plan.badge}
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-4 pt-8">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary mx-auto mb-3 ${plan.color}`}>
          <Icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="mt-3">
          <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
          <span className="text-muted-foreground text-sm">/month</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-5">
        {/* Feature limits */}
        <div className="space-y-2 bg-secondary/40 rounded-xl p-4">
          <FeatureRow label="CNN Analyses" value={plan.cnn} />
          <FeatureRow label="GAN Restorations" value={plan.gan} />
          <FeatureRow label="AI Chat" value={plan.chat} />
        </div>

        {/* Extras */}
        <ul className="space-y-2 flex-1">
          {plan.extras.map((e, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-primary flex-shrink-0" />
              {e}
            </li>
          ))}
        </ul>

        <Button
          className="w-full mt-auto"
          variant={isActive ? 'secondary' : plan.badge ? 'default' : 'outline'}
          disabled={isActive || loading}
          onClick={() => onSelect(plan.id)}
        >
          {isActive ? 'Current Plan' : loading ? 'Processing…' : 'Subscribe'}
        </Button>
      </CardContent>
    </Card>
  );
};

const FeatureRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground text-right">{value}</span>
  </div>
);

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { plan: currentPlan, upgradePlan, cnnUsed, ganUsed, chatUsed, limits } = useUsage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const role = user?.role ?? 'patient';
  const plans = role === 'doctor' ? DOCTOR_PLANS : PATIENT_PLANS;

  const freeLimits =
    role === 'doctor'
      ? { cnn: 3, gan: 1, chat: 5 }
      : { cnn: 5, gan: 1, chat: 7 };

  const handleSelect = (id: Plan) => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      upgradePlan(id);
      setLoading(false);
      const name = plans.find((p) => p.id === id)?.name ?? id;
      setSuccess(`You are now on the ${name} plan!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
            Pricing
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {role === 'doctor' ? 'Doctor Plans' : 'Patient Plans'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {role === 'doctor'
              ? 'Tools designed for clinical workflows — more analyses, source-grounded RAG, and team features.'
              : 'Affordable plans to help you understand and monitor your jaw health with AI.'}
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="mb-10 text-center bg-success/10 border border-success/30 rounded-xl py-4 px-6 text-success font-medium">
            ✓ {success}
            <Button variant="link" className="ml-3 text-success" onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        )}

        {/* Current usage (only when on free plan) */}
        {currentPlan === 'free' && (
          <div className="mb-10 p-5 bg-secondary/40 border border-border rounded-2xl">
            <p className="font-semibold text-foreground mb-4">Your Free Usage</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <UsageBar label="CNN Analyses" used={cnnUsed} max={freeLimits.cnn} />
              <UsageBar label="GAN Restorations" used={ganUsed} max={freeLimits.gan} />
              <UsageBar label="AI Chat (today)" used={chatUsed} max={freeLimits.chat} />
            </div>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={currentPlan}
              onSelect={handleSelect}
              loading={loading}
            />
          ))}
        </div>

        {/* Free tier note */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a{' '}
          <span className="font-semibold text-foreground">
            free tier
          </span>{' '}
          —{' '}
          {role === 'doctor'
            ? `${freeLimits.cnn} CNN analyses, ${freeLimits.gan} GAN restoration, ${freeLimits.chat} chat messages/day`
            : `${freeLimits.cnn} CNN analyses, ${freeLimits.gan} GAN restoration, ${freeLimits.chat} chat messages/day`}
          {' '}with no credit card required.
        </div>
      </div>
    </div>
  );
};

const UsageBar: React.FC<{ label: string; used: number; max: number }> = ({ label, used, max }) => {
  const pct = Math.min((used / max) * 100, 100);
  const color = pct >= 100 ? 'bg-destructive' : pct >= 70 ? 'bg-warning' : 'bg-primary';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">
          {used} / {max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default Pricing;
