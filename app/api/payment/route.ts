import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NODE_ENV === 'production'
  ? process.env.PAYPAL_CLIENT_ID
  : process.env.SANDBOX_PAYPAL_CLIENT_ID;

const PAYPAL_SECRET_KEY = process.env.NODE_ENV === 'production'
  ? process.env.PAYPAL_SECRET_KEY
  : process.env.PAYPAL_SANDBOX_SECRET_KEY;

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

// Create PayPal order for credits
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('🔵 Initiating credit payment for user:', session?.user?.email);

    if (!session?.user?.id) {
      console.log('🔴 Unauthorized payment attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { credits, price } = await request.json();
    console.log('🔵 Credits to purchase:', credits, 'Price:', price);

    if (!credits || !price || typeof credits !== 'number' || typeof price !== 'number' || credits <= 0 || price <= 0) {
      console.log('🔴 Invalid credits or price:', credits, price);
      return NextResponse.json(
        { error: "Invalid credits or price" },
        { status: 400 }
      );
    }

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
              value: price.toFixed(2),
            },
            description: `${credits} AI Video Credits`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/payment/success?credits=${credits}&price=${price}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
          user_action: 'PAY_NOW',
          brand_name: 'ShortsAI',
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

// Capture PayPal payment for credits
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('🔵 Processing credit payment completion for user:', session?.user?.email);

    if (!session?.user?.id) {
      console.log('🔴 Unauthorized payment completion attempt');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderID, credits } = await request.json();
    console.log('🔵 Capturing payment for order:', orderID, 'Credits:', credits);

    if (!orderID || !credits || typeof credits !== 'number' || credits <= 0) {
      return NextResponse.json(
        { error: "Invalid orderID or credits" },
        { status: 400 }
      );
    }

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
      console.log(`✅ Adding ${credits} credits to user ${session.user.email}`);

      // Add credits to user
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          credits: {
            increment: credits
          }
        },
      });

      console.log('✅ User credits updated successfully');
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
