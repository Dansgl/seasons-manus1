# Vercel + Stripe Connection Issues

> Research conducted 2026-01-05 to investigate StripeConnectionError on Vercel serverless functions.

## The Problem

Error message:
```
StripeConnectionError: An error occurred with our connection to Stripe. Request was retried 2 times
```

This occurred when trying to use Stripe serverless functions on Vercel Hobby plan.

## Root Causes Identified

### 1. Cold Start Timeout Issues (Most Likely)

On the Vercel **Hobby plan**, the default timeout is **10 seconds**. During a cold start:
- The serverless function container needs to initialize
- The Node.js runtime loads
- The Stripe SDK is initialized
- A TLS connection to `api.stripe.com` is established

If this combined process exceeds 10 seconds, the function times out. The Stripe SDK's default retry behavior (2 retries with exponential backoff) can consume significant time.

### 2. Missing Function Configuration

The `vercel.json` had no `functions` configuration specifying:
- `maxDuration` (timeout limit)
- `regions` (function deployment region)
- `memory` allocation

### 3. Stripe SDK Configuration Issues

The code initialized Stripe without explicit timeout or retry configuration:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

Without configured timeouts, retries may exhaust the function's execution time.

### 4. Known Vercel + Stripe Live API Issue

There have been [critical reports on the Vercel Community](https://community.vercel.com/t/critical-stripe-live-api-connectivity-issue-connection/23103) of connectivity issues between Vercel Functions and Stripe's Live API. This appears to be an intermittent infrastructure issue.

### 5. Region Mismatch

Functions deploy to **US East (iad1)** by default. If users are in a different region (e.g., Europe), network latency can contribute to timeouts.

---

## Recommended Fixes

### Fix 1: Add Function Configuration to vercel.json

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

**Note:** `maxDuration: 30` requires at least a **Pro plan**. Hobby is limited to 10 seconds.

### Fix 2: Configure Stripe SDK with Explicit Timeout and Retries

```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  timeout: 8000, // 8 seconds per request
  maxNetworkRetries: 1, // Reduce retries to fit within timeout
});
```

Total time formula: `timeout * (maxNetworkRetries + 1) + overhead < maxDuration`

### Fix 3: Enable Vercel Fluid Compute

Vercel's Fluid Compute:
- Has higher default timeout limits (up to 800s on Pro)
- Reduces cold starts through optimized concurrency
- Is more cost-efficient for I/O-bound workloads

Enable in Vercel project settings.

### Fix 4: Initialize Stripe Client at Module Level

Reduces cold start overhead:
```typescript
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      timeout: 8000,
      maxNetworkRetries: 1,
    })
  : null;

export default async function handler(req, res) {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }
  // ... rest of handler
}
```

### Fix 5: Set Function Region Closer to Users

For European users, deploy to a European region:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30,
      "regions": ["fra1"]  // Frankfurt
    }
  }
}
```

---

## Debugging Steps

1. **Check Vercel Function Logs**: Functions > Logs in Vercel dashboard
2. **Test with simple Stripe call**: `stripe.customers.list({ limit: 1 })`
3. **Verify Environment Variables**: Project Settings > Environment Variables (redeploy after changes)
4. **Check Stripe Dashboard**: Developers > Logs to see if requests reach Stripe

---

## Our Solution

We opted to use **Stripe Payment Links** instead of serverless functions. This approach:
- Requires no server-side code
- No timeout issues (direct redirect to Stripe)
- Works on any hosting plan
- Simpler implementation

Payment link in CheckoutV6.tsx redirects directly to Stripe-hosted checkout.

---

## Sources

- [Critical Stripe Live API Connectivity Issue - Vercel Community](https://community.vercel.com/t/critical-stripe-live-api-connectivity-issue-connection/23103)
- [What can I do about Vercel serverless functions timing out?](https://vercel.com/kb/guide/what-can-i-do-about-vercel-serverless-functions-timing-out)
- [How can I improve function cold start performance on Vercel?](https://vercel.com/kb/guide/how-can-i-improve-serverless-function-lambda-cold-start-performance-on-vercel)
- [StripeConnectionError Issue #650 - stripe/stripe-node](https://github.com/stripe/stripe-node/issues/650)
- [Stripe Node.js Library - maxNetworkRetries configuration](https://www.npmjs.com/package/stripe)
- [Advanced error handling - Stripe Documentation](https://docs.stripe.com/error-low-level)
- [FUNCTION_INVOCATION_TIMEOUT - Vercel Docs](https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT)

---

*Last updated: 2026-01-05*
