# Lessons Learned - Baby Seasons Development

A collection of gotchas, pitfalls, and solutions discovered during development.

---

## Vercel Environment Variables

### Trailing Newline Characters
**Problem**: When adding env vars via CLI or copy-paste, trailing `\n` characters can be included.

**Symptom**: Feature doesn't work even though env var appears to be set correctly.

**Example**:
```
VITE_WAITLIST_MODE="true\n"  # BAD - won't match === "true"
VITE_WAITLIST_MODE="true"    # GOOD
```

**Solution**: Use `echo -n` when piping to Vercel CLI:
```bash
echo -n "true" | vercel env add VITE_WAITLIST_MODE production
```

**Detection**: Pull env and inspect:
```bash
vercel env pull /tmp/check.txt --environment=production
cat /tmp/check.txt | grep VARIABLE_NAME
```

---

## Vercel + Stripe Serverless Functions

### Connection Timeout on Hobby Plan
**Problem**: Stripe API calls timeout on Vercel Hobby plan (10s limit).

**Cause**: Cold start + TLS handshake + Stripe retries exceed timeout.

**Solution**: Use **Stripe Payment Links** instead of serverless functions. Direct redirect, no server needed.

**Full documentation**: See `docs/VERCEL-STRIPE-CONNECTION-ISSUES.md`

---

## Safari Mobile Compatibility

### fetchPriority Attribute
**Problem**: `fetchPriority="high"` on `<img>` tags crashes Safari mobile.

**Solution**: Don't use `fetchPriority` - Safari doesn't support it well.

### Image Loading Attributes
**Problem**: While `loading="lazy"` is technically supported, combinations of React + dynamic images + Safari can cause issues.

**Solution**: Test on Safari mobile before deploying image optimizations. When in doubt, keep images simple without extra attributes.

---

## Content Security Policy (CSP)

### Sanity CMS
**Required domains**:
```
script-src: https://cdn.sanity.io
connect-src: https://cdn.sanity.io https://*.sanity.io https://PROJECT_ID.api.sanity.io https://PROJECT_ID.apicdn.sanity.io
img-src: https://cdn.sanity.io
```

### Sanity CORS Issues
**Problem**: Sanity API returns 403 CORS errors when `useCdn: false`.

**Symptom**:
- Products/brands don't load
- Console shows: `403 Forbidden` or CORS policy errors
- Network tab shows requests to `PROJECT_ID.api.sanity.io` failing

**Why it happens**:
- `useCdn: false` → requests go to `PROJECT_ID.api.sanity.io` (strict CORS)
- `useCdn: true` → requests go to `PROJECT_ID.apicdn.sanity.io` (relaxed CORS)
- Even with correct CORS origins in Sanity dashboard, API mode can still fail

**Solution**:
```typescript
// In sanity.ts
export const sanityClient = createClient({
  projectId: "your-project-id",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,  // <-- ALWAYS use true for client-side
});
```

**When to use `useCdn: false`**:
- Server-side only (not browser)
- When you need real-time data (no cache)
- When doing mutations (writes)

**For this project**: Always `useCdn: true` - we only read data client-side.

### Umami Analytics
**Required domains**:
```
script-src: https://cloud.umami.is
connect-src: https://cloud.umami.is https://api-gateway.umami.dev
```

### Stripe
**Required domains**:
```
script-src: https://js.stripe.com
connect-src: https://api.stripe.com
img-src: https://*.stripe.com
frame-src: https://js.stripe.com https://hooks.stripe.com
```

---

## Analytics & Ad Blockers

### Umami Blocked by Ad Blockers
**Problem**: uBlock Origin, Brave, etc. block `cloud.umami.is/script.js`.

**Symptom**: `net::ERR_BLOCKED_BY_CLIENT` in console.

**Solution**:
1. Accept that ~30% of users won't be tracked
2. Test with ad blocker disabled
3. (Optional) Self-host Umami and proxy through your domain

---

## React SPA Performance

### Lighthouse Mobile Scores
**Reality**: React SPAs typically score 40-60 on Lighthouse mobile performance.

**Why**:
- Large JS bundle must download and parse
- Hydration blocks interactivity
- No server-side rendering

**To get 80+**: Would need Next.js/Astro with SSR/SSG.

**What helps marginally**:
- Preconnect to CDN origins
- Lazy load below-fold images
- Code splitting

**What we have**:
- Performance: 42-52 (acceptable)
- SEO: 100 (excellent)
- Best Practices: 96 (excellent)

---

## DNS & Domain Configuration

### www vs non-www
**Problem**: www.domain.com showing old/different content than domain.com.

**Solution**: Both need CNAME records pointing to Vercel:
```
@     CNAME  cname.vercel-dns.com
www   CNAME  cname.vercel-dns.com
```

**Verification**: Vercel dashboard shows both domains assigned to same deployment.

---

## Image Handling

### Sanity Images vs External URLs
**Problem**: Products can have Sanity-uploaded images OR external URLs (Unsplash).

**Solution**: Use helper function that handles both:
```typescript
export function getProductImageUrl(product: SanityProduct): string | null {
  if (product.mainImage) {
    return urlFor(product.mainImage).width(800).url();
  }
  if (product.externalImageUrl) {
    return product.externalImageUrl;
  }
  return null;
}
```

---

## Favicon Optimization

### Large Logo Files
**Problem**: Using full logo as favicon = 4.8MB download.

**Solution**: Create dedicated favicon sizes:
- 32x32 PNG (~2KB)
- 64x64 PNG (~4KB)

**Don't**: Use ICO format (larger, unnecessary for modern browsers).

---

*Last updated: 2026-01-05*
