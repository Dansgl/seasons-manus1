# Seasons Pre-Launch Checklist

Things to do before going live.

---

## Authentication

- [ ] **Transfer Google OAuth to founder's Gmail** - Currently set up on Dan's personal email. Needs to be moved to Ioana's Gmail account before launch.
  - Go to Google Cloud Console
  - Transfer project ownership or recreate OAuth credentials under Ioana's account
  - Update Client ID and Secret in Supabase

---

## Payments

- [ ] **Set up Stripe** - Currently skipped, add before launch

---

## Domain & Hosting

- [ ] **Buy domain** - Options checked (all available):
  - seasonsbox.ro ⭐ (brand + subscription model)
  - seasonsbaby.ro (brand + target)
  - myseasons.ro (brand + personal)
  - babyseasons.ro
  - Buy from: Namecheap or Porkbun

- [ ] **Deploy to Vercel**
  - Push to GitHub
  - Import project on vercel.com
  - Add environment variables (Supabase URL, Sanity project ID, etc.)
  - Connect custom domain after purchase

---

## Content

- [ ] TBD

---

*Last updated: 2026-01-03*
