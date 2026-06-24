import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type Plan =
  | 'free'
  // patient plans
  | 'patient_basic'
  | 'patient_standard'
  | 'patient_premium'
  // doctor plans
  | 'doctor_starter'
  | 'doctor_professional'
  | 'doctor_enterprise';

export interface UsageLimits {
  cnn: number;   // -1 = unlimited
  gan: number;   // -1 = unlimited
  chat: number;  // -1 = unlimited (per day)
}

interface StoredUsage {
  plan: Plan;
  cnnUsed: number;        // total free uses (resets on upgrade)
  ganUsed: number;        // total free uses (resets on upgrade)
  chatDate: string;       // YYYY-MM-DD
  chatUsed: number;       // resets daily
  planMonth: string;      // YYYY-MM for monthly paid resets
  cnnMonthUsed: number;   // paid plan monthly counter
  ganMonthUsed: number;   // paid plan monthly counter
}

interface UsageContextType {
  plan: Plan;
  cnnUsed: number;
  ganUsed: number;
  chatUsed: number;
  limits: UsageLimits;
  canUseCNN: boolean;
  canUseGAN: boolean;
  canUseChat: boolean;
  recordCNN: () => void;
  recordGAN: () => void;
  recordChat: () => void;
  upgradePlan: (p: Plan) => void;
}

const FREE_LIMITS: Record<'patient' | 'doctor', UsageLimits> = {
  patient: { cnn: 5, gan: 1, chat: 7 },
  doctor:  { cnn: 3, gan: 1, chat: 5 },
};

export const PLAN_LIMITS: Record<Plan, UsageLimits> = {
  free:                   { cnn: 0,  gan: 0,  chat: 0  },   // used as sentinel; real free limits come from role
  patient_basic:          { cnn: 30, gan: 5,  chat: 50 },
  patient_standard:       { cnn: 100,gan: 15, chat: 100},
  patient_premium:        { cnn: -1, gan: -1, chat: -1 },
  doctor_starter:         { cnn: 50, gan: 10, chat: 50 },
  doctor_professional:    { cnn: 200,gan: 50, chat: 200},
  doctor_enterprise:      { cnn: -1, gan: -1, chat: -1 },
};

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);

const defaultStored = (): StoredUsage => ({
  plan: 'free',
  cnnUsed: 0,
  ganUsed: 0,
  chatDate: today(),
  chatUsed: 0,
  planMonth: thisMonth(),
  cnnMonthUsed: 0,
  ganMonthUsed: 0,
});

const storageKey = (userId: string) => `usage_${userId}`;

function load(userId: string): StoredUsage {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return defaultStored();
    const parsed: StoredUsage = JSON.parse(raw);
    // reset daily chat counter if date changed
    if (parsed.chatDate !== today()) {
      parsed.chatDate = today();
      parsed.chatUsed = 0;
    }
    // reset monthly counters if month changed
    if (parsed.planMonth !== thisMonth()) {
      parsed.planMonth = thisMonth();
      parsed.cnnMonthUsed = 0;
      parsed.ganMonthUsed = 0;
    }
    return parsed;
  } catch {
    return defaultStored();
  }
}

function save(userId: string, data: StoredUsage) {
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
}

const UsageContext = createContext<UsageContextType | null>(null);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stored, setStored] = useState<StoredUsage>(defaultStored);

  useEffect(() => {
    if (user) setStored(load(user._id));
  }, [user]);

  const persist = useCallback(
    (updated: StoredUsage) => {
      if (!user) return;
      setStored(updated);
      save(user._id, updated);
    },
    [user]
  );

  const role = (user?.role ?? 'patient') as 'patient' | 'doctor';
  const freeLimits = FREE_LIMITS[role];
  const isPaid = stored.plan !== 'free';

  const limits: UsageLimits = isPaid ? PLAN_LIMITS[stored.plan] : freeLimits;

  // for paid plans compare against monthly counter; for free compare against total counter
  const canUseCNN =
    limits.cnn === -1
      ? true
      : isPaid
      ? stored.cnnMonthUsed < limits.cnn
      : stored.cnnUsed < limits.cnn;

  const canUseGAN =
    limits.gan === -1
      ? true
      : isPaid
      ? stored.ganMonthUsed < limits.gan
      : stored.ganUsed < limits.gan;

  const canUseChat =
    limits.chat === -1 ? true : stored.chatUsed < limits.chat;

  const recordCNN = useCallback(() => {
    persist({
      ...stored,
      cnnUsed: stored.cnnUsed + 1,
      cnnMonthUsed: stored.cnnMonthUsed + 1,
    });
  }, [stored, persist]);

  const recordGAN = useCallback(() => {
    persist({
      ...stored,
      ganUsed: stored.ganUsed + 1,
      ganMonthUsed: stored.ganMonthUsed + 1,
    });
  }, [stored, persist]);

  const recordChat = useCallback(() => {
    persist({
      ...stored,
      chatDate: today(),
      chatUsed: stored.chatUsed + 1,
    });
  }, [stored, persist]);

  const upgradePlan = useCallback(
    (p: Plan) => {
      persist({
        ...stored,
        plan: p,
        // reset counters on upgrade
        cnnUsed: 0,
        ganUsed: 0,
        chatUsed: 0,
        planMonth: thisMonth(),
        cnnMonthUsed: 0,
        ganMonthUsed: 0,
      });
    },
    [stored, persist]
  );

  // current usage numbers to display
  const cnnUsed = isPaid ? stored.cnnMonthUsed : stored.cnnUsed;
  const ganUsed = isPaid ? stored.ganMonthUsed : stored.ganUsed;
  const chatUsed = stored.chatUsed;

  return (
    <UsageContext.Provider
      value={{
        plan: stored.plan,
        cnnUsed,
        ganUsed,
        chatUsed,
        limits,
        canUseCNN,
        canUseGAN,
        canUseChat,
        recordCNN,
        recordGAN,
        recordChat,
        upgradePlan,
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
