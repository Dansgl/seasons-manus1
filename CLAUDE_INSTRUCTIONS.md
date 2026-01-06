# Claude Code Instructions - Baby Seasons Project

## Read This First
When starting a new session, always read `SESSION_LOG.md` to understand what was done previously.

## Project Overview
**Baby Seasons** - Premium baby clothing rental subscription service
- Website: https://babyseasons.ro
- Price: 350 RON / quarter (3 months) for 5 items

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js (local dev only - Vercel is static)
- **Database**: Supabase (PostgreSQL + Auth)
- **CMS**: Sanity
- **Hosting**: Vercel (static deployment)
- **Payments**: Stripe Payment Links
- **Analytics**: Umami

## Key Files
- `client/src/pages/CheckoutV6.tsx` - Checkout with Stripe redirect
- `client/src/pages/DashboardV6.tsx` - User dashboard
- `client/src/components/v6/` - V6 design system components
- `vercel.json` - Vercel config with CSP headers
- `.env` - Environment variables (never commit real secrets)

## Important Notes

### Stripe
- Using **Payment Links** (not serverless functions - they timeout on Vercel Hobby)
- Test payment link in CheckoutV6.tsx
- When going live: create live payment link and update the URL

### Vercel Limitations
- Hobby plan = 10 second function timeout
- Serverless functions can't reliably connect to Stripe
- Solution: Use client-side redirects to Stripe Payment Links

### Deployment
```bash
git add -A && git commit -m "message" && git push origin main && vercel --prod
```

## Session Workflow
1. Read `SESSION_LOG.md` for context
2. Read `docs/LESSONS_LEARNED.md` to avoid repeating mistakes
3. Ask user what they want to work on
4. **At end of session** (or when user says "done", "log", "wrap up"):
   - Update `SESSION_LOG.md` with what was done
   - Add any new lessons to `docs/LESSONS_LEARNED.md`

## Automatic Logging Rules
- **When a bug is fixed**: Add to LESSONS_LEARNED if it could happen again
- **When something breaks unexpectedly**: Document the cause and fix
- **When a workaround is needed**: Document why the normal approach didn't work
- **When an env var issue is found**: Always document the exact fix
- **When CSP blocks something**: Add the required domains to lessons
- **When Safari/mobile breaks**: Document what caused it

## Lessons Learned Categories
When adding to `docs/LESSONS_LEARNED.md`, use these categories:
- Vercel Environment Variables
- Vercel Serverless Functions
- Safari/Mobile Compatibility
- Content Security Policy (CSP)
- Analytics & Ad Blockers
- React SPA Performance
- DNS & Domain Configuration
- Image Handling
- Other Gotchas

## Current Status (as of 2026-01-05)
- Stripe payment flow: WORKING (test mode)
- Price: 350 RON / quarter
- Checkout success message: WORKING
- Waitlist mode: Can be enabled via `VITE_WAITLIST_MODE=true`
