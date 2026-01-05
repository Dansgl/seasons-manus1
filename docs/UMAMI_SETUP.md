# Umami Analytics Setup Guide

## Why Umami?

✅ **100,000 events/month FREE**
✅ Privacy-friendly (GDPR/CCPA compliant)
✅ No cookies, no tracking
✅ Lightweight (~1KB script)
✅ Simple, clean dashboard

---

## Quick Setup (5 minutes)

### Step 1: Sign Up for Umami Cloud

1. Go to **https://cloud.umami.is**
2. Click **"Get Started"** or **"Sign Up"**
3. Create an account (email + password)
4. Verify your email

### Step 2: Create Your Website

1. After logging in, click **"Add Website"**
2. Enter your website details:
   - **Name:** `Seasons Baby`
   - **Domain:** `babyseasons.ro` (or your domain)
   - **Timezone:** `Europe/Bucharest` (or your timezone)
3. Click **"Save"**

### Step 3: Get Your Website ID

1. After creating the website, you'll see a **Website ID** (looks like: `a1b2c3d4-e5f6-7890-1234-567890abcdef`)
2. Copy this ID

### Step 4: Add to Your .env File

1. Open your `.env` file
2. Add or update this line:
   ```bash
   VITE_UMAMI_WEBSITE_ID=a1b2c3d4-e5f6-7890-1234-567890abcdef
   ```
   (Replace with your actual Website ID)

### Step 5: Deploy or Restart Dev Server

**For Development:**
```bash
# Restart your dev server
# Press Ctrl+C to stop, then:
pnpm run dev
```

**For Production (Vercel):**
```bash
# Add environment variable in Vercel dashboard:
# Settings → Environment Variables
# Name: VITE_UMAMI_WEBSITE_ID
# Value: your-website-id
# Then redeploy
```

---

## ✅ Verify It's Working

1. Visit your website
2. Go to Umami dashboard: https://cloud.umami.is
3. Click on your website
4. You should see your visit appear in **Real-time** view (within ~30 seconds)

---

## 📊 What You'll See

### Dashboard Metrics:
- **Views** - Page views
- **Visitors** - Unique visitors
- **Bounce Rate** - % who leave after one page
- **Average Visit Time** - How long users stay

### Pages:
- Most visited pages
- Entry pages (where users land)
- Exit pages (where users leave)

### Traffic Sources:
- **Direct** - Typed URL or bookmark
- **Referrals** - From other websites
- **Social** - From social media
- **Search** - From Google, etc.

### Locations:
- Country-level visitor data
- No personal data or IP addresses

### Devices:
- Desktop vs Mobile
- Operating Systems
- Browsers

---

## 🎯 Track Custom Events (Optional)

You can track specific actions like "Added to Cart", "Started Checkout", etc.

Add to your code:
```typescript
// Track button click
window.umami?.track('add_to_cart', { product: 'Product Name' });

// Track page view manually
window.umami?.track('page_view', { path: '/catalog' });
```

Examples:
```typescript
// In CatalogV6.tsx
const handleAddToCart = (slug: string) => {
  // ... existing code
  window.umami?.track('add_to_cart', { product: slug });
};

// In CheckoutV6.tsx
const handleCheckout = () => {
  // ... existing code
  window.umami?.track('checkout_started');
};
```

---

## 💰 Pricing

| Plan | Events/Month | Price |
|------|--------------|-------|
| **Free** | 100,000 | $0 |
| **Pro** | 1,000,000 | $20/mo |
| **Business** | Custom | Contact |

**Note:** You're on the FREE plan. If you exceed 100k events, you'll be prompted to upgrade.

---

## 🔒 Privacy Features

✅ **No cookies** - No consent banner needed
✅ **No personal data** - IP addresses are not stored
✅ **GDPR/CCPA compliant** - By default
✅ **EU-hosted** - Data stays in Europe
✅ **Anonymous tracking** - No user profiling

---

## 🆚 vs Google Analytics

| Feature | Umami | Google Analytics |
|---------|-------|------------------|
| Privacy | ⭐⭐⭐⭐⭐ | ⭐ |
| Script Size | 1KB | 45KB+ |
| Cookies | None | Many |
| Consent Banner | Not needed | Required |
| Setup | 5 min | 30+ min |
| Data Ownership | You | Google |

---

## 🔧 Troubleshooting

### Analytics not showing up?

1. **Check browser console** for errors
2. **Verify Website ID** matches exactly
3. **Check .env file** has `VITE_` prefix
4. **Restart dev server** after adding env variable
5. **Disable ad blockers** (they might block analytics)
6. **Wait 30-60 seconds** for data to appear

### Still not working?

- Test in incognito mode
- Clear browser cache
- Check Umami status: https://status.umami.is
- Verify script is loading: View Page Source → Search for "umami"

---

## 📚 Resources

- **Umami Docs:** https://umami.is/docs
- **Dashboard:** https://cloud.umami.is
- **Support:** https://github.com/umami-software/umami/discussions
- **Status:** https://status.umami.is

---

## 🎉 You're Done!

Your privacy-friendly analytics are now set up and tracking!

Next steps:
- Monitor your launch traffic
- Track which products are popular
- See where visitors are coming from
- Optimize based on real data

**No cookies. No tracking. Just insights.** 📊
