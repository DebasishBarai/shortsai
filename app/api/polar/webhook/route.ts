// api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log("🎯 Webhook received!");
    console.log("📦 Event Type:", payload.type);
    console.log("📦 Data:", JSON.stringify(payload.data, null, 2));

  },
  onCustomerCreated: async (payload) => {
    console.log("👤 New customer:", payload.data.email);
  },

  onOrderPaid: async (payload) => {
    console.log("💰 Payment received!");
    console.log("Order ID:", payload.data.id);
    console.log("Customer:", payload.data.customer.email);
    console.log("Amount:", payload.data.netAmount, payload.data.currency);
  },
});
