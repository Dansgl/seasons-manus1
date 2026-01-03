# Seasons Design System

## Brand Overview

**Seasons** is a premium baby clothing rental service based in Slovakia/Romania. The brand identity conveys warmth, sustainability, and premium quality while remaining approachable for modern parents.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Red** | `#FF3C1F` | Primary CTA buttons, logo, announcement bar, footer background, accent highlights |
| **Dark Brown** | `#5C1A11` | Headlines, primary text, strong emphasis |
| **Text Brown** | `#B85C4A` | Body text, secondary navigation, subtle text |
| **Beige** | `#F5F1ED` | Page backgrounds, form backgrounds, card backgrounds |
| **Lavender** | `#D4B8F0` | Borders, dividers, secondary accents |
| **White** | `#FFFFFF` | Cards, modals, header background |

### Extended Palette (Section Separation)

| Name | Hex | Usage |
|------|-----|-------|
| **Green** | `#157145` | Success states, eco/sustainability messaging |
| **Blue** | `#3685B5` | Info states, links |
| **Navy** | `#141B41` | Alternative dark sections |

### Usage in Code

```typescript
import { V6_COLORS as C } from "@/components/v6";

// Example usage
<div style={{ backgroundColor: C.beige, color: C.darkBrown }}>
  <button style={{ backgroundColor: C.red }}>CTA Button</button>
</div>
```

---

## Typography

### Font Stack

```css
/* Logo */
font-family: "Arial Black", sans-serif;
font-weight: 900;

/* Body */
font-family: Inter, system-ui, -apple-system, sans-serif;
```

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Logo (Desktop) | 3xl (text-3xl) | 900 | Red |
| Logo (Mobile) | 2xl (text-2xl) | 900 | Red |
| H1 | 3xl-4xl | 400 (light) | Dark Brown |
| H2 | 2xl-3xl | 600 (semibold) | Dark Brown |
| H3 | xl | 600 (semibold) | Dark Brown |
| Body | base (16px) | 400 | Text Brown |
| Small/Caption | sm (14px) | 400 | Text Brown |
| Micro | xs (12px) | 400 | Text Brown |

### Character Styling

- **Headlines:** Use `tracking-tighter` for display text
- **Logo:** Always uppercase "SEASONS"
- **No emojis** in body copy (only in special features)

---

## Spacing

### Standard Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| xs | 2 (0.5rem) | Icon margins, tight spacing |
| sm | 3-4 (0.75-1rem) | Button padding, card padding |
| md | 6 (1.5rem) | Section padding, gaps |
| lg | 8 (2rem) | Section margins |
| xl | 12 (3rem) | Major section separation |
| 2xl | 16-20 (4-5rem) | Hero sections |

### Container

```typescript
// Max width for main content
<div className="max-w-7xl mx-auto px-6">

// Max width for narrower content (forms, articles)
<div className="max-w-3xl mx-auto px-6">
```

---

## Components

### Buttons

#### Primary (CTA)
```typescript
<button
  className="px-8 py-3 text-base font-medium text-white hover:opacity-90 transition-opacity"
  style={{ backgroundColor: C.red }}
>
  Start Renting
</button>
```

#### Secondary (Outline)
```typescript
<button
  className="px-8 py-3 text-base font-medium border-2 hover:opacity-70 transition-opacity"
  style={{ borderColor: C.darkBrown, color: C.darkBrown }}
>
  Learn More
</button>
```

#### Ghost
```typescript
<button
  className="px-4 py-2 text-sm hover:opacity-70 transition-opacity"
  style={{ color: C.textBrown }}
>
  Cancel
</button>
```

### Cards

```typescript
<div className="p-6" style={{ backgroundColor: C.white }}>
  {/* Card content */}
</div>
```

### Form Inputs

```typescript
<input
  className="w-full px-4 py-3 border-2 text-sm focus:outline-none transition-colors"
  style={{ borderColor: C.lavender, color: C.darkBrown }}
/>
```

### Badges

```typescript
// Feature badge
<span className="inline-flex items-center gap-2 px-3 py-1 text-xs" style={{ backgroundColor: C.beige, color: C.textBrown }}>
  <Icon className="w-4 h-4" style={{ color: C.red }} />
  Ozone Cleaned
</span>
```

---

## Layout Patterns

### Page Structure

```typescript
<div className="min-h-screen flex flex-col" style={{ backgroundColor: C.beige }}>
  <Header />
  <main className="flex-1">
    {/* Page content */}
  </main>
  <FAQSection /> {/* Top 5 FAQs before footer */}
  <Footer />
</div>
```

### Section Pattern

```typescript
<section className="py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-2xl md:text-3xl mb-8" style={{ color: C.darkBrown }}>
      Section Title
    </h2>
    {/* Section content */}
  </div>
</section>
```

### Grid Patterns

```typescript
// Product grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

// Feature grid
<div className="grid md:grid-cols-3 gap-8">

// Two-column layout
<div className="grid lg:grid-cols-2 gap-12 items-center">
```

---

## Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| Default | < 768px | Mobile-first |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |

### Mobile-First Approach

Always design for mobile first:
- Single column layouts on mobile
- Hamburger menu on mobile
- Full-width buttons on mobile
- Horizontal scroll for filter chips

---

## Animation & Transitions

### Standard Transitions

```css
/* Hover states */
transition-opacity hover:opacity-90
transition-colors hover:opacity-70

/* Duration */
transition-all duration-200
```

### Loading States

```typescript
import { Loader2 } from "lucide-react";

<Loader2 className="w-8 h-8 animate-spin" style={{ color: C.textBrown }} />
```

---

## Icons

Use **Lucide React** for all icons:

```typescript
import { ShoppingBag, User, Calendar, Package, Shield, Sparkles } from "lucide-react";

// Standard icon styling
<ShoppingBag className="w-5 h-5" style={{ color: C.textBrown }} />

// Accent icon
<Shield className="w-5 h-5" style={{ color: C.red }} />
```

### Common Icons

| Icon | Usage |
|------|-------|
| ShoppingBag | Cart, products |
| User | Account, profile |
| Calendar | Dates, scheduling |
| Package | Boxes, shipping |
| Shield | Insurance, security |
| Sparkles | Cleaning, premium |
| Check | Success, selections |
| X | Close, remove |
| ArrowRight | CTAs, navigation |

---

## Image Guidelines

### Product Images

```typescript
// Square aspect ratio with cover fit
<div className="aspect-square overflow-hidden">
  <img
    src={imageUrl}
    alt={productName}
    className="w-full h-full object-cover"
  />
</div>
```

### Placeholder

```typescript
<div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: C.beige }}>
  <ShoppingBag className="w-12 h-12" style={{ color: C.lavender }} />
</div>
```

---

## Shared Components

### FAQ Section (Mini)

All pages should include a mini FAQ section above the footer with top 5 questions:

```typescript
<FAQSection faqs={TOP_5_FAQS} />
```

### Standard Page FAQs

```typescript
const TOP_5_FAQS = [
  {
    question: "How does Seasons work?",
    answer: "Select 5 designer baby items, receive them at home, use for 3 months, then return for your next box."
  },
  {
    question: "What's included in the €70/quarter price?",
    answer: "5 premium items, free shipping both ways, insurance, and professional Ozone cleaning."
  },
  {
    question: "What if items get damaged?",
    answer: "Normal wear and tear is included. We understand babies are messy!"
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! Cancel from your dashboard anytime. Just return your current items."
  },
  {
    question: "Which brands do you carry?",
    answer: "Premium European brands like Petit Bateau, Bonpoint, Tartine et Chocolat, and more."
  }
];
```

---

## File Structure

```
client/src/components/v6/
├── index.ts          # Exports all V6 components
├── colors.ts         # V6_COLORS constant
├── Header.tsx        # Site header with navigation
├── Footer.tsx        # Site footer
├── FAQSection.tsx    # Reusable FAQ component
└── [other shared components]

client/src/pages/
├── HomeV6.tsx        # Landing page
├── CatalogV6.tsx     # Product catalog
├── CheckoutV6.tsx    # Checkout flow
├── DashboardV6.tsx   # User dashboard
├── About.tsx         # About us page
├── Contact.tsx       # Contact page
├── HowItWorks.tsx    # How it works page
├── FAQ.tsx           # Full FAQ page
└── Blog.tsx          # Blog listing
```

---

## Do's and Don'ts

### Do
- Use the V6_COLORS constant for all colors
- Maintain generous whitespace
- Keep CTAs prominent with the red color
- Use inline styles for colors (style={{ color: C.darkBrown }})
- Include FAQ section on all marketing pages
- Use semantic HTML elements

### Don't
- Use rounded corners (we use sharp edges)
- Add emojis unless explicitly requested
- Use shadows (keep design flat)
- Overcrowd layouts
- Use colors outside the palette
- Add unnecessary animations

---

## Accessibility

- Maintain color contrast ratios (red on white, white on red)
- Use proper heading hierarchy (h1 → h2 → h3)
- Include alt text for all images
- Support keyboard navigation
- Use focus-visible for interactive elements

---

*Last updated: January 2025*
