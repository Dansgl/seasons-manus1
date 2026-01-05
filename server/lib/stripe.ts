/**
 * Stripe client configuration
 *
 * Handles payment processing for quarterly rental subscriptions
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

/**
 * Quarterly rental box product
 * Price: €70 per quarter (5 items)
 */
export const RENTAL_BOX_PRICE = 70_00; // €70 in cents

/**
 * Create a Stripe checkout session for quarterly rental subscription
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: params.customerId,
    customer_email: params.customerId ? undefined : params.customerEmail,
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
            interval_count: 3, // Every 3 months = quarterly
          },
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata || {},
    subscription_data: {
      metadata: params.metadata || {},
    },
  });

  return session;
}

/**
 * Retrieve a Stripe checkout session
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

/**
 * Construct event from webhook payload (for webhook signature verification)
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
