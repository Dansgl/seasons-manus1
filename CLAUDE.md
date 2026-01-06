# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

Always read `SESSION_LOG.md` at session start and `docs/LESSONS_LEARNED.md` to avoid repeating mistakes.

## Commands

```bash
# Development
pnpm run dev              # Start dev server (Express + Vite)
pnpm run build            # Build frontend + backend
pnpm run build:frontend   # Build frontend only (Vercel uses this)
pnpm run check            # TypeScript type check

# Database (Drizzle + Supabase PostgreSQL)
DATABASE_URL="..." pnpm run db:push    # Generate and run migrations
pnpm run db:studio                      # Open Drizzle Studio

# Sanity CMS
pnpm run sanity:dev       # Start Sanity Studio locally
pnpm run sanity:deploy    # Deploy Sanity Studio

# Deployment
git add -A && git commit -m "message" && git push origin main && vercel --prod
```

## Architecture

**Stack**: React 19 + Vite + Tailwind | Express (local only) | Supabase (PostgreSQL + Auth) | Sanity CMS | Vercel (static) | Stripe Payment Links

```
client/src/
├── pages/           # Route components (HomeV6, CatalogV6, CheckoutV6, DashboardV6)
├── components/v6/   # V6 design system (Header, Footer, colors.ts)
├── components/ui/   # shadcn/ui primitives
├── lib/
│   ├── sanity.ts    # Sanity client + queries (useCdn: true required)
│   └── supabase-db.ts # Database operations

server/
├── _core/index.ts   # Express server (dev only - not used in production)
└── db.ts            # Database schema types

drizzle/
└── schema.ts        # PostgreSQL schema (users, subscriptions, orders, etc.)

sanity/schemas/      # CMS content types (product, brand, post, siteSettings)
```

## Critical Knowledge

### Vercel Hobby Plan Limitations
- 10-second function timeout - Stripe API calls fail
- Solution: Use Stripe Payment Links (client-side redirect), not serverless functions
- See `docs/VERCEL-STRIPE-CONNECTION-ISSUES.md` for details

### Sanity Client
Always use `useCdn: true` in browser - API mode (`useCdn: false`) causes CORS 403 errors.

### Design System
Import colors from `@/components/v6`:
```typescript
import { V6_COLORS as C } from "@/components/v6";
// C.red, C.darkBrown, C.textBrown, C.beige, C.lavender, C.white
```
See `DESIGN_SYSTEM.md` for full reference.

### Environment Variables
- Client-side vars must be prefixed with `VITE_`
- Watch for trailing newlines in Vercel env vars - use `echo -n "value" | vercel env add VAR production`

### Feature Flags
- `VITE_WAITLIST_MODE=true` enables pre-launch waitlist mode

## Session Workflow

1. Read `SESSION_LOG.md` and `docs/LESSONS_LEARNED.md`
2. When session ends or user says "done"/"log": update both files
3. Log any bugs fixed, workarounds needed, or CSP/Safari issues discovered
