import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { VerificationEmail } from '@/components/email-templates/verify-email';
import { Resend } from 'resend';
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { polar as polarClient } from "./polar";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url },) => {
      try {
        await resend.emails.send({
          from: "Shorts AI <no-reply@debasishbarai.com>",
          to: [`${user.email}`],
          subject: "Verify your email address",
          react: VerificationEmail({ userEmail: `${user.email}`, verificationUrl: `${url}` }),
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
    sendOnSignUp: true,
  },
  plugins: [nextCookies(),
  polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    use: [
      checkout({
        products: [
          {
            productId: process.env.POLAR_SANDBOX_STARTER_PRODUCT_ID as string,
            slug: "starter",
          },
          {
            productId: process.env.POLAR_SANDBOX_CREATOR_PRODUCT_ID as string,
            slug: "creator",
          },
          {
            productId: process.env.POLAR_SANDBOX_PRO_PRODUCT_ID as string,
            slug: "pro",
          },
        ],
        successUrl: "/success?checkout_id={CHECKOUT_ID}",
        authenticatedUsersOnly: true
      }),
      portal(),
      usage(),
      webhooks({
        secret: process.env.POLAR_WEBHOOK_SECRET as string,
        onOrderPaid: async (payload) => { }
      }),
    ]
  })
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 30, // 30 days
  }
});

export type Session = typeof auth.$Infer.Session
