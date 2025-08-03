import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Use appropriate credentials based on environment
const PAYPAL_CLIENT_ID = process.env.NODE_ENV === 'production'
  ? process.env.PAYPAL_CLIENT_ID
  : process.env.SANDBOX_PAYPAL_CLIENT_ID;

const PAYPAL_SECRET_KEY = process.env.NODE_ENV === 'production'
  ? process.env.PAYPAL_SECRET_KEY
  : process.env.PAYPAL_SANDBOX_SECRET_KEY;

type PlanType = 'basic' | 'premium';

const PLAN_PRICES: Record<PlanType, number> = {
  basic: 19,
  premium: 29,
} as const;

async function getPayPalAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error('PayPal credentials are not configured');
    }

    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`
    ).toString('base64');

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal token error response:', data);
      throw new Error(data.error_description || 'Failed to get access token');
    }

    return data.access_token;
  } catch (error) {
    console.error('PayPal token error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('🔵 Initiating payment process for user:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('🔴 Unauthorized payment attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan } = await request.json();
    console.log('🔵 Selected plan:', plan);

    if (!plan || !['basic', 'premium'].includes(plan)) {
      console.log('🔴 Invalid plan selected:', plan);
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const selectedPlan = plan as PlanType;

    // Get PayPal access token
    console.log('🔵 Getting PayPal access token...');
    const accessToken = await getPayPalAccessToken();
    console.log('✅ PayPal access token obtained');

    // Create PayPal order
    console.log('🔵 Creating PayPal order...');
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: PLAN_PRICES[selectedPlan].toString(),
            },
            description: `RemindMe ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
          user_action: 'PAY_NOW',
          brand_name: 'RemindMe',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 PayPal API error:', data);
      throw new Error(data.message || 'Failed to create PayPal order');
    }

    console.log('✅ PayPal order created successfully:', data.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔴 Payment initialization error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('🔵 Processing payment completion for user:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('🔴 Unauthorized payment completion attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderID, plan } = await request.json();
    console.log('🔵 Capturing payment for order:', orderID);

    // Get PayPal access token
    console.log('🔵 Getting PayPal access token for capture...');
    const accessToken = await getPayPalAccessToken();
    console.log('✅ PayPal access token obtained for capture');

    // Capture the payment
    console.log('🔵 Capturing PayPal payment...');
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('🔴 PayPal capture error:', data);
      throw new Error(data.message || 'Payment verification failed');
    }

    if (data.status === 'COMPLETED') {
      console.log('✅ Payment completed successfully');
      console.log(`✅ Upgrading user ${session.user.email} to ${plan} plan`);

      // Update user subscription
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          subscriptionType: plan.toUpperCase(),
          subscriptionEndDate: null,
        },
      });

      console.log('✅ User subscription updated successfully');
      return NextResponse.json({ success: true });
    } else {
      console.log('🔴 Payment status not completed:', data.status);
      throw new Error('Payment not completed');
    }
  } catch (error) {
    console.error('🔴 Payment verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 500 }
    );
  }
} 
