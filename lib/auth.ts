import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { VerificationEmail } from '@/components/email-templates/verify-email';
import { Resend } from 'resend';
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { polar as polarClient } from "./polar";

const resend = new Resend(process.env.RESEND_API_KEY);

const PRODUCT_CONFIGS = {
  [process.env.POLAR_STARTER_PRODUCT_ID as string]: {
    name: 'Starter Pack',
    credits: 60,
    slug: 'starter'
  },
  [process.env.POLAR_CREATOR_PRODUCT_ID as string]: {
    name: 'Creator Pack',
    credits: 160, // Adjust as needed
    slug: 'creator'
  },
  [process.env.POLAR_PRO_PRODUCT_ID as string]: {
    name: 'Pro Pack',
    credits: 360, // Adjust as needed
    slug: 'pro'
  }
};

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
  plugins: [
    nextCookies(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: process.env.POLAR_STARTER_PRODUCT_ID as string,
              slug: "starter",
            },
            {
              productId: process.env.POLAR_CREATOR_PRODUCT_ID as string,
              slug: "creator",
            },
            {
              productId: process.env.POLAR_PRO_PRODUCT_ID as string,
              slug: "pro",
            },
          ],
          successUrl: "/payment-success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET as string,
          onOrderPaid: async (payload) => {
            try {
              console.log("Order paid:", payload);
              const { data } = payload

              // Verify order is actually paid
              if (!data.paid || data.status !== 'paid') {
                console.log('Order not fully paid, skipping credit update');
                return;
              }

              // Get product configuration
              const productConfig = PRODUCT_CONFIGS[data.productId];

              if (!productConfig) {
                console.error(`Unknown product ID: ${data.productId}`);
                return;
              }

              // Find user by the customer's externalId (which is the BetterAuth user ID)
              const user = await prisma.user.findFirst({
                where: {
                  id: data.customer.externalId!
                }
              });

              if (!user) {
                console.error(`User not found for externalId: ${data.customer.externalId}`);
                return;
              }

              // Update user credits and store Polar customer ID
              const updatedUser = await prisma.user.update({
                where: {
                  id: user.id
                },
                data: {
                  credits: {
                    increment: productConfig.credits
                  },

                  // Store Polar customer ID for future reference if not already set
                  ...(user.polarCustomerId !== data.customerId && {
                    polarCustomerId: data.customerId
                  })
                }
              });

              console.log(`✅ Successfully updated user ${user.email}:`);
              console.log(`   Product: ${productConfig.name}`);
              console.log(`   Credits added: ${productConfig.credits}`);
              console.log(`   New balance: ${updatedUser.credits}`);
              console.log(`   Order ID: ${data.id}`);
            } catch (error) {
              console.error('❌ Error processing order payment:', error);

              // Log the full payload for debugging
              console.error('Payload that failed:', JSON.stringify(payload, null, 2));

            }


          }
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
