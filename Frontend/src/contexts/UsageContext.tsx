import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type Plan =
  | 'free'
  | 'patient_basic' | 'patient_standard' | 'patient_premium'
  | 'doctor_starter' | 'doctor_professional' | 'doctor_enterprise';

export interface UsageLimits {
  cnn: number;   // -1 = unlimited
  gan: number;
  chat: number;
}

interface UsageState {
  plan: Plan;
  planStartedAt: string | null;
  planExpiresAt: string | null;
  limits: UsageLimits;
  freeLimits: UsageLimits;
  cnnUsed: number;
  ganUsed: number;
  chatUsed: number;
  canUseCNN: boolean;
  canUseGAN: boolean;
  canUseChat: boolean;
}

interface UsageContextType extends UsageState {
  loading: boolean;
  recordCNN: () => void;
  recordGAN: () => void;
  recordChat: () => void;
  upgradePlan: (p: Plan) => Promise<void>;
  cancelPlan: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const PLAN_LIMITS: Record<Plan, UsageLimits> = {
  free:                 { cnn: 0,   gan: 0,  chat: 0  },
  patient_basic:        { cnn: 30,  gan: 5,  chat: 50 },
  patient_standard:     { cnn: 100, gan: 15, chat: 100},
  patient_premium:      { cnn: -1,  gan: -1, chat: -1 },
  doctor_starter:       { cnn: 50,  gan: 10, chat: 50 },
  doctor_professional:  { cnn: 200, gan: 50, chat: 200},
  doctor_enterprise:    { cnn: -1,  gan: -1, chat: -1 },
};

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const defaultState = (role: string): UsageState => {
  const freeLimits = role === 'doctor'
    ? { cnn: 3, gan: 1, chat: 5 }
    : { cnn: 5, gan: 1, chat: 7 };
  return {
    plan: 'free',
    planStartedAt: null,
    planExpiresAt: null,
    limits: freeLimits,
    freeLimits,
    cnnUsed: 0,
    ganUsed: 0,
    chatUsed: 0,
    canUseCNN: true,
    canUseGAN: true,
    canUseChat: true,
  };
};

const UsageContext = createContext<UsageContextType | null>(null);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<UsageState>(() => defaultState(user?.role ?? 'patient'));
  const [loading, setLoading] = useState(false);

  const token = () => localStorage.getItem('token');

  const fetchUsage = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/subscription`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch {
      // backend unreachable — keep defaults so the UI still works
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Fire-and-forget record — optimistic update first, then sync backend response
  const record = useCallback(
    (type: 'cnn' | 'gan' | 'chat') => {
      if (!user) return;

      // Optimistic UI
      setState((prev) => {
        const next = { ...prev };
        if (type === 'cnn') {
          next.cnnUsed += 1;
          next.canUseCNN = next.limits.cnn === -1 ? true : next.cnnUsed < next.limits.cnn;
        } else if (type === 'gan') {
          next.ganUsed += 1;
          next.canUseGAN = next.limits.gan === -1 ? true : next.ganUsed < next.limits.gan;
        } else {
          next.chatUsed += 1;
          next.canUseChat = next.limits.chat === -1 ? true : next.chatUsed < next.limits.chat;
        }
        return next;
      });

      // Sync to backend
      fetch(`${API}/api/subscription/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ type }),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setState(data); })
        .catch(() => {/* ignore */});
    },
    [user]
  );

  const upgradePlan = useCallback(
    async (plan: Plan) => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/subscription/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (res.ok && data.subscription) setState(data.subscription);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const cancelPlan = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/subscription/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (res.ok && data.subscription) setState(data.subscription);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <UsageContext.Provider
      value={{
        ...state,
        loading,
        recordCNN:  () => record('cnn'),
        recordGAN:  () => record('gan'),
        recordChat: () => record('chat'),
        upgradePlan,
        cancelPlan,
        refresh: fetchUsage,
      }}
    >
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = () => {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error('useUsage must be used inside UsageProvider');
  return ctx;
};
