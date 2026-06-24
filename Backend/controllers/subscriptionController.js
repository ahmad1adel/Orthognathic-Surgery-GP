import User from "../models/User.js";

// ── Plan definitions ──────────────────────────────────────────────────────────
// cnn / gan: monthly limit for paid plans, lifetime for free (-1 = unlimited)
// chat: daily limit (-1 = unlimited)
const FREE_LIMITS = {
  patient: { cnn: 5,  gan: 1, chat: 7 },
  doctor:  { cnn: 3,  gan: 1, chat: 5 },
};

const PLAN_LIMITS = {
  free:                 { cnn: 0,   gan: 0,  chat: 0  },
  patient_basic:        { cnn: 30,  gan: 5,  chat: 50 },
  patient_standard:     { cnn: 100, gan: 15, chat: 100},
  patient_premium:      { cnn: -1,  gan: -1, chat: -1 },
  doctor_starter:       { cnn: 50,  gan: 10, chat: 50 },
  doctor_professional:  { cnn: 200, gan: 50, chat: 200},
  doctor_enterprise:    { cnn: -1,  gan: -1, chat: -1 },
};

const VALID_PLANS = Object.keys(PLAN_LIMITS).filter((p) => p !== "free");

const today      = () => new Date().toISOString().slice(0, 10);   // YYYY-MM-DD
const thisMonth  = () => new Date().toISOString().slice(0, 7);    // YYYY-MM

// Make sure monthly / daily counters are fresh; mutates the user doc in-place
function refreshCounters(user) {
  const month = thisMonth();
  const day   = today();

  if (user.usageMonth !== month) {
    user.usageMonth   = month;
    user.cnnMonthUsed = 0;
    user.ganMonthUsed = 0;
  }
  if (user.chatDate !== day) {
    user.chatDate    = day;
    user.chatDayUsed = 0;
  }
}

// Build the usage/limits payload returned to the frontend
function buildPayload(user) {
  const role      = user.role;                      // "patient" | "doctor"
  const plan      = user.plan;
  const isPaid    = plan !== "free";
  const freeLims  = FREE_LIMITS[role];
  const planLims  = isPaid ? PLAN_LIMITS[plan] : freeLims;

  const cnnUsed  = isPaid ? user.cnnMonthUsed : user.cnnFreeUsed;
  const ganUsed  = isPaid ? user.ganMonthUsed : user.ganFreeUsed;
  const chatUsed = user.chatDayUsed;

  const canUseCNN  = planLims.cnn  === -1 ? true : cnnUsed  < planLims.cnn;
  const canUseGAN  = planLims.gan  === -1 ? true : ganUsed  < planLims.gan;
  const canUseChat = planLims.chat === -1 ? true : chatUsed < planLims.chat;

  return {
    plan,
    planStartedAt: user.planStartedAt,
    planExpiresAt: user.planExpiresAt,
    limits: planLims,
    freeLimits: freeLims,
    cnnUsed,
    ganUsed,
    chatUsed,
    canUseCNN,
    canUseGAN,
    canUseChat,
  };
}

// ── GET /api/subscription ─────────────────────────────────────────────────────
export const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    refreshCounters(user);
    await user.save();
    return res.json(buildPayload(user));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── POST /api/subscription/subscribe ─────────────────────────────────────────
// body: { plan: "patient_basic" | ... }
export const subscribe = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!VALID_PLANS.includes(plan)) {
      return res.status(400).json({ message: "Invalid plan." });
    }

    // Ensure the plan matches the user's role
    const role = req.user.role;
    if (!plan.startsWith(role)) {
      return res.status(400).json({ message: `Plan '${plan}' is not available for ${role} accounts.` });
    }

    const user = await User.findById(req.user._id);
    refreshCounters(user);

    user.plan         = plan;
    user.planStartedAt = new Date();
    user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 days

    // Reset all counters on upgrade
    user.cnnFreeUsed  = 0;
    user.ganFreeUsed  = 0;
    user.cnnMonthUsed = 0;
    user.ganMonthUsed = 0;
    user.chatDayUsed  = 0;
    user.usageMonth   = thisMonth();
    user.chatDate     = today();

    await user.save();
    return res.json({ message: "Subscription updated.", subscription: buildPayload(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── POST /api/subscription/record ────────────────────────────────────────────
// body: { type: "cnn" | "gan" | "chat" }
export const recordUsage = async (req, res) => {
  try {
    const { type } = req.body;
    if (!["cnn", "gan", "chat"].includes(type)) {
      return res.status(400).json({ message: "type must be cnn, gan, or chat." });
    }

    const user = await User.findById(req.user._id);
    refreshCounters(user);

    const isPaid = user.plan !== "free";

    if (type === "cnn") {
      if (isPaid) user.cnnMonthUsed += 1;
      else        user.cnnFreeUsed  += 1;
    } else if (type === "gan") {
      if (isPaid) user.ganMonthUsed += 1;
      else        user.ganFreeUsed  += 1;
    } else {
      user.chatDayUsed += 1;
    }

    await user.save();
    return res.json(buildPayload(user));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ── POST /api/subscription/cancel ────────────────────────────────────────────
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    refreshCounters(user);
    user.plan          = "free";
    user.planStartedAt = null;
    user.planExpiresAt = null;
    // keep usage counters as-is; free limits apply going forward
    await user.save();
    return res.json({ message: "Subscription cancelled.", subscription: buildPayload(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
