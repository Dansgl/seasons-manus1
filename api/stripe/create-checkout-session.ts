import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const RENTAL_BOX_PRICE = 70_00; // €70 in cents

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe key is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  // Initialize Stripe inside handler to ensure env is loaded
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { email, cartItems } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const baseUrl = process.env.APP_URL || 'https://babyseasons.ro';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Seasons Rental Box',
              description: '5 premium baby clothing items per quarter',
            },
            unit_amount: RENTAL_BOX_PRICE,
            recurring: {
              interval: 'month',
              interval_count: 3, // Quarterly
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?checkout=canceled`,
      metadata: {
        cartItems: JSON.stringify(cartItems || []),
      },
      subscription_data: {
        metadata: {
          cartItems: JSON.stringify(cartItems || []),
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout session error:', JSON.stringify(err, null, 2));
    return res.status(500).json({
      error: 'Failed to create checkout session',
      details: err?.message,
      type: err?.type,
      code: err?.code,
      statusCode: err?.statusCode
    });
  }
}
