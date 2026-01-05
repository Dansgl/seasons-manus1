/**
 * Analytics tracking utilities for Umami
 *
 * Comprehensive event tracking for waitlist mode and general site usage
 */

// Extend window type for Umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Track a custom event in Umami
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  try {
    window.umami?.track(eventName, eventData);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

// ============ WAITLIST EVENTS ============

/**
 * Track when waitlist modal is opened
 */
export function trackWaitlistModalOpened(source: string) {
  trackEvent('waitlist_modal_opened', { source });
}

/**
 * Track waitlist signup
 */
export function trackWaitlistSignup(data: {
  email: string;
  hasKids: boolean;
  ageRange?: string;
  source: string;
}) {
  // Don't send actual email, just domain for privacy
  const emailDomain = data.email.split('@')[1];

  trackEvent('waitlist_signup', {
    email_domain: emailDomain,
    has_kids: data.hasKids,
    age_range: data.ageRange || 'none',
    source: data.source,
  });
}

/**
 * Track waitlist modal closed without signup
 */
export function trackWaitlistModalClosed(source: string, timeSpent?: number) {
  trackEvent('waitlist_modal_closed', {
    source,
    time_spent_seconds: timeSpent,
  });
}

// ============ PRODUCT EVENTS ============

/**
 * Track product view
 */
export function trackProductView(product: {
  slug: string;
  name: string;
  brand: string;
  category?: string;
  ageRange?: string;
  price: number;
  inStock: boolean;
}) {
  trackEvent('product_viewed', {
    product_slug: product.slug,
    product_name: product.name,
    brand: product.brand,
    category: product.category,
    age_range: product.ageRange,
    price: product.price,
    in_stock: product.inStock,
  });
}

/**
 * Track product favorited (huge for demand analytics!)
 */
export function trackProductFavorited(product: {
  slug: string;
  name: string;
  brand: string;
  category?: string;
  inStock: boolean;
  isWaitlistMode: boolean;
}) {
  trackEvent('product_favorited', {
    product_slug: product.slug,
    product_name: product.name,
    brand: product.brand,
    category: product.category,
    in_stock: product.inStock,
    waitlist_mode: product.isWaitlistMode,
  });
}

/**
 * Track product unfavorited
 */
export function trackProductUnfavorited(productSlug: string) {
  trackEvent('product_unfavorited', {
    product_slug: productSlug,
  });
}

// ============ CART EVENTS ============

/**
 * Track add to cart (or attempt in waitlist mode)
 */
export function trackAddToCart(data: {
  productSlug: string;
  productName: string;
  brand: string;
  cartCount: number;
  isWaitlistMode: boolean;
}) {
  const eventName = data.isWaitlistMode ? 'add_to_cart_attempt_waitlist' : 'add_to_cart';

  trackEvent(eventName, {
    product_slug: data.productSlug,
    product_name: data.productName,
    brand: data.brand,
    cart_count: data.cartCount,
  });
}

/**
 * Track remove from cart
 */
export function trackRemoveFromCart(productSlug: string, cartCount: number) {
  trackEvent('remove_from_cart', {
    product_slug: productSlug,
    cart_count_after: cartCount,
  });
}

/**
 * Track cart full (user tried to add 6th item)
 */
export function trackCartFull(attemptedProductSlug: string) {
  trackEvent('cart_full_attempt', {
    attempted_product: attemptedProductSlug,
  });
}

/**
 * Track proceed to checkout
 */
export function trackCheckoutStarted(data: {
  productSlugs: string[];
  totalValue: number;
}) {
  trackEvent('checkout_started', {
    product_count: data.productSlugs.length,
    total_value: data.totalValue,
  });
}

// ============ CATALOG EVENTS ============

/**
 * Track catalog filter applied
 */
export function trackCatalogFilter(filter: {
  type: 'brand' | 'category' | 'age_range' | 'season';
  value: string;
  resultCount: number;
}) {
  trackEvent('catalog_filtered', {
    filter_type: filter.type,
    filter_value: filter.value,
    result_count: filter.resultCount,
  });
}

/**
 * Track catalog filter cleared
 */
export function trackCatalogFilterCleared() {
  trackEvent('catalog_filters_cleared');
}

// ============ NAVIGATION EVENTS ============

/**
 * Track navigation to favorites page
 */
export function trackFavoritesPageVisit(favoriteCount: number) {
  trackEvent('favorites_page_visited', {
    favorite_count: favoriteCount,
  });
}

/**
 * Track navigation to cart page
 */
export function trackCartPageVisit(cartCount: number) {
  trackEvent('cart_page_visited', {
    cart_count: cartCount,
  });
}

// ============ AUTHENTICATION EVENTS ============

/**
 * Track user signup
 */
export function trackSignup(method: 'email' | 'google' | 'other') {
  trackEvent('user_signup', {
    method,
  });
}

/**
 * Track user login
 */
export function trackLogin(method: 'email' | 'google' | 'other') {
  trackEvent('user_login', {
    method,
  });
}

// ============ ENGAGEMENT EVENTS ============

/**
 * Track social media click
 */
export function trackSocialClick(platform: string) {
  trackEvent('social_clicked', {
    platform,
  });
}

/**
 * Track external link click
 */
export function trackExternalLink(url: string, label?: string) {
  trackEvent('external_link_clicked', {
    url,
    label,
  });
}

/**
 * Track email click (contact, support, etc.)
 */
export function trackEmailClick(emailType: 'contact' | 'support' | 'other') {
  trackEvent('email_clicked', {
    type: emailType,
  });
}

// ============ ERROR EVENTS ============

/**
 * Track errors for debugging
 */
export function trackError(error: {
  type: string;
  message: string;
  page?: string;
}) {
  trackEvent('error_occurred', {
    error_type: error.type,
    error_message: error.message.substring(0, 100), // Truncate for privacy
    page: error.page,
  });
}

/**
 * Track out of stock product interest
 * This is GOLD for restocking decisions!
 */
export function trackOutOfStockInterest(product: {
  slug: string;
  name: string;
  brand: string;
  category?: string;
}) {
  trackEvent('out_of_stock_interest', {
    product_slug: product.slug,
    product_name: product.name,
    brand: product.brand,
    category: product.category,
  });
}

// Helper: Format price for analytics
export function formatPrice(price: number): number {
  return Math.round(price * 100) / 100;
}
