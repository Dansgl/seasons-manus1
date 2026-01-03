# Deployment Checklist

## Before Going Live

### Sanity CMS
- [ ] Add CORS origins: https://www.sanity.io/manage/project/h83nldug/api
  - `http://localhost:3000`
  - `http://localhost:3002`
  - `https://babyseasons.ro`
  - `https://baby-seasons.vercel.app`
  - Any new domains you deploy to

### Supabase
- [ ] Add redirect URLs in Authentication > URL Configuration
  - Site URL: `https://babyseasons.ro`
  - Redirect URLs: `https://babyseasons.ro/**`
- [ ] Enable Google OAuth provider (if using)
- [ ] Run RLS policies: `/supabase/rls-policies.sql`

### Vercel
- [ ] Environment variables set (VITE_SANITY_PROJECT_ID, VITE_SUPABASE_URL, etc.)
- [ ] Domain configured

### Google OAuth (if using)
- [ ] Add redirect URI in Google Cloud Console:
  `https://shwtbcqgbveidcxwhnyi.supabase.co/auth/v1/callback`

---

**Common Issues:**
- Products not loading? → Check Sanity CORS
- Auth not working? → Check Supabase redirect URLs
- 500 errors on Vercel? → Check environment variables
