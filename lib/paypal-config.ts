export const paypalOptions = {
  clientId: process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '')
    : (process.env.NEXT_PUBLIC_SANDBOX_PAYPAL_CLIENT_ID || ''),
  currency: "USD",
  intent: "capture",
  components: ["buttons"],
  "enable-funding": ["paylater", "venmo"],
  "disable-funding": ["card", "credit"],
};

export const PLAN_PRICES = {
  basic: 19,
  premium: 29,
} as const; 