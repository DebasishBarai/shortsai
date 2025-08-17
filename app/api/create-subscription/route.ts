import { NextResponse } from 'next/server';

// PayPal API base URL - use sandbox for testing, change to live for production
const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// PayPal credentials from environment variables
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_SECRET_KEY!;

// Plan IDs from PayPal Developer Dashboard
// You'll need to create these plans in the PayPal dashboard first
const PLAN_IDS = {
  basic: {
    monthly: process.env.PAYPAL_BASIC_MONTHLY_PLAN_ID!,
    yearly: process.env.PAYPAL_BASIC_YEARLY_PLAN_ID!
  },
  premium: {
    monthly: process.env.PAYPAL_PREMIUM_MONTHLY_PLAN_ID!,
    yearly: process.env.PAYPAL_PREMIUM_YEARLY_PLAN_ID!
  }
};

// Get access token from PayPal
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Create a subscription
async function createSubscription(planId: string, returnUrl: string, cancelUrl: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'PayPal-Request-Id': `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: 'PromoWhatsApp',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    })
  });

  return await response.json();
}

export async function POST(request: Request) {
  try {
    const { plan, billing, baseUrl } = await request.json();

    // Validate inputs
    if (!plan || !billing || !baseUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the correct plan ID
    const planId = PLAN_IDS[plan as keyof typeof PLAN_IDS]?.[billing as keyof typeof PLAN_IDS.basic];

    if (!planId) {
      return NextResponse.json(
        { error: 'Invalid plan or billing cycle' },
        { status: 400 }
      );
    }

    // Create return and cancel URLs
    const returnUrl = `${baseUrl}/payment/success?plan=${plan}&billing=${billing}`;
    const cancelUrl = `${baseUrl}/payment/cancel`;

    // Create the subscription
    const subscription = await createSubscription(planId, returnUrl, cancelUrl);

    if (subscription.id) {
      // Find the approval URL
      const approvalUrl = subscription.links.find(
        (link: any) => link.rel === 'approve'
      )?.href;

      if (approvalUrl) {
        return NextResponse.json({ approvalUrl });
      }
    }

    // If we get here, something went wrong with the PayPal response
    console.error('PayPal error:', subscription);
    return NextResponse.json(
      { error: 'Failed to create subscription', details: subscription },
      { status: 500 }
    );

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
