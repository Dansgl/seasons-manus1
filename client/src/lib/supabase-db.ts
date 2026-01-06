import { supabase } from './supabase';

// ============ WAITLIST ============

export interface WaitlistSignup {
  id: number;
  email: string;
  name: string | null;
  child_age: string;
  created_at: string;
  source: string | null;
}

/**
 * Add a signup to the waitlist
 */
export async function addToWaitlist(
  email: string,
  childAge: string,
  name?: string,
  source?: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('waitlist_signups')
    .insert({
      email,
      child_age: childAge,
      name: name || null,
      source: source || null,
    });

  if (error) {
    // Check for unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return { success: false, error: 'This email is already on the waitlist!' };
    }
    console.error('Failed to add to waitlist:', error);
    return { success: false, error: 'Failed to join waitlist' };
  }

  return { success: true };
}

/**
 * Get waitlist count for social proof
 */
export async function getWaitlistCount(): Promise<number> {
  const { count, error } = await supabase
    .from('waitlist_signups')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Failed to get waitlist count:', error);
    return 0;
  }

  return count || 0;
}

// Types matching the database schema
export interface User {
  id: number;
  auth_id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  shipping_address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  status: 'active' | 'paused' | 'cancelled';
  cycle_start_date: string;
  cycle_end_date: string;
  next_billing_date: string;
  swap_window_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface Box {
  id: number;
  subscription_id: number;
  cycle_number: number;
  start_date: string;
  end_date: string;
  return_by_date: string;
  status: 'selecting' | 'confirmed' | 'shipped' | 'active' | 'swap_pending' | 'returned' | 'completed';
  label_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  sanity_product_slug: string;
  added_at: string;
}

export interface InventoryItem {
  id: number;
  sanity_product_slug: string;
  sku: string;
  state: 'available' | 'active' | 'in_transit' | 'quarantine' | 'retired';
  condition_notes: string | null;
  quarantine_until: string | null;
  retirement_reason: string | null;
  created_at: string;
  updated_at: string;
}

// ============ USER HELPERS ============

/**
 * Get the current authenticated user's local database record
 * Returns null if not authenticated or user record doesn't exist
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();

  if (error || !data) return null;
  return data as User;
}

/**
 * Get or create user record from Supabase auth
 */
export async function ensureUser(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  // Try to find existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUser.id)
    .single();

  if (existing) return existing as User;

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      auth_id: authUser.id,
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
      email: authUser.email || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
      role: 'user',
      last_signed_in: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create user:', error);
    return null;
  }

  return newUser as User;
}

// ============ CATALOG / AVAILABILITY ============

/**
 * Get available inventory counts for multiple product slugs
 */
export async function getAvailability(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};

  const { data, error } = await supabase
    .from('inventory_items')
    .select('sanity_product_slug')
    .in('sanity_product_slug', slugs)
    .eq('state', 'available')
    .or('quarantine_until.is.null,quarantine_until.lt.now()');

  if (error || !data) return {};

  // Count occurrences of each slug
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    const slug = item.sanity_product_slug;
    counts[slug] = (counts[slug] || 0) + 1;
  });

  return counts;
}

/**
 * Get available count for a single product slug
 */
export async function getAvailableCount(slug: string): Promise<number> {
  const counts = await getAvailability([slug]);
  return counts[slug] || 0;
}

// ============ CART ============

/**
 * Get all items in the user's cart (returns slugs)
 */
export async function getCart(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select('sanity_product_slug')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error || !data) return [];
  return data.map(item => item.sanity_product_slug);
}

/**
 * Get cart count
 */
export async function getCartCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return 0;
  return count || 0;
}

/**
 * Check if item is in cart
 */
export async function isInCart(slug: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { count } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('sanity_product_slug', slug);

  return (count || 0) > 0;
}

/**
 * Add item to cart
 */
export async function addToCart(slug: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check if cart is full
  const cartCount = await getCartCount();
  if (cartCount >= 5) {
    return { success: false, error: 'Cart is full. You can only select 5 items.' };
  }

  // Check if item is available
  const available = await getAvailableCount(slug);
  if (available === 0) {
    return { success: false, error: 'This item is currently out of stock.' };
  }

  // Check if already in cart
  const inCart = await isInCart(slug);
  if (inCart) {
    return { success: false, error: 'This item is already in your box.' };
  }

  // Add to cart
  const { error } = await supabase
    .from('cart_items')
    .insert({ user_id: user.id, sanity_product_slug: slug });

  if (error) {
    console.error('Failed to add to cart:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }

  return { success: true };
}

/**
 * Remove item from cart
 */
export async function removeFromCart(slug: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('sanity_product_slug', slug);

  if (error) {
    console.error('Failed to remove from cart:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }

  return { success: true };
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to clear cart:', error);
    return { success: false, error: 'Failed to clear cart' };
  }

  return { success: true };
}

// ============ FAVORITES (WISHLIST) ============

/**
 * Get all items in the user's favorites (returns slugs)
 */
export async function getFavorites(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_favorites')
    .select('sanity_product_slug')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error || !data) return [];
  return data.map(item => item.sanity_product_slug);
}

/**
 * Get favorites count
 */
export async function getFavoritesCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) return 0;
  return count || 0;
}

/**
 * Check if item is in favorites
 */
export async function isInFavorites(slug: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { count } = await supabase
    .from('user_favorites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('sanity_product_slug', slug);

  return (count || 0) > 0;
}

/**
 * Add item to favorites
 */
export async function addToFavorites(slug: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check if already in favorites
  const inFavorites = await isInFavorites(slug);
  if (inFavorites) {
    return { success: false, error: 'This item is already in your favorites.' };
  }

  // Add to favorites
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: user.id, sanity_product_slug: slug });

  if (error) {
    console.error('Failed to add to favorites:', error);
    return { success: false, error: 'Failed to add item to favorites' };
  }

  return { success: true };
}

/**
 * Remove item from favorites
 */
export async function removeFromFavorites(slug: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('sanity_product_slug', slug);

  if (error) {
    console.error('Failed to remove from favorites:', error);
    return { success: false, error: 'Failed to remove item from favorites' };
  }

  return { success: true };
}

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 */
export async function toggleFavorite(slug: string): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
  const inFavorites = await isInFavorites(slug);

  if (inFavorites) {
    const result = await removeFromFavorites(slug);
    return { ...result, isFavorited: false };
  } else {
    const result = await addToFavorites(slug);
    return { ...result, isFavorited: true };
  }
}

// ============ SUBSCRIPTION ============

/**
 * Get user's subscription
 */
export async function getSubscription(): Promise<Subscription | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error || !data) return null;
  return data as Subscription;
}

/**
 * Create subscription from cart items
 */
export async function createSubscription(
  shippingAddress: string,
  phone?: string
): Promise<{ success: boolean; subscriptionId?: number; boxId?: number; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Check existing subscription
  const existing = await getSubscription();
  if (existing && existing.status === 'active') {
    return { success: false, error: 'You already have an active subscription.' };
  }

  // Check cart has exactly 5 items
  const cartCount = await getCartCount();
  if (cartCount !== 5) {
    return { success: false, error: 'You must select exactly 5 items to subscribe.' };
  }

  // Get cart items
  const cartSlugs = await getCart();

  // Update user's shipping address
  await supabase
    .from('users')
    .update({
      shipping_address: shippingAddress,
      phone: phone || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  // Calculate dates
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);
  const returnByDate = new Date(endDate);
  returnByDate.setDate(returnByDate.getDate() + 7);

  // Create subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      status: 'active',
      cycle_start_date: startDate.toISOString().split('T')[0],
      cycle_end_date: endDate.toISOString().split('T')[0],
      next_billing_date: endDate.toISOString().split('T')[0],
      swap_window_open: false,
    })
    .select()
    .single();

  if (subError || !subscription) {
    console.error('Failed to create subscription:', subError);
    return { success: false, error: 'Failed to create subscription' };
  }

  // Create first box
  const { data: box, error: boxError } = await supabase
    .from('boxes')
    .insert({
      subscription_id: subscription.id,
      cycle_number: 1,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      return_by_date: returnByDate.toISOString().split('T')[0],
      status: 'confirmed',
    })
    .select()
    .single();

  if (boxError || !box) {
    console.error('Failed to create box:', boxError);
    return { success: false, error: 'Failed to create box' };
  }

  // Reserve inventory for each cart item using atomic RPC to prevent race conditions
  for (const slug of cartSlugs) {
    // Use atomic RPC function to find, lock, and reserve inventory in one transaction
    const { data: inventoryId, error: rpcError } = await supabase
      .rpc('reserve_inventory_item', {
        p_box_id: box.id,
        p_sanity_product_slug: slug
      });

    if (rpcError) {
      console.error('Failed to reserve inventory via RPC:', rpcError);
      // Fallback to non-atomic method if RPC doesn't exist yet
      const { data: inventoryItem } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('sanity_product_slug', slug)
        .eq('state', 'available')
        .or('quarantine_until.is.null,quarantine_until.lt.now()')
        .limit(1)
        .single();

      if (inventoryItem) {
        await supabase
          .from('box_items')
          .insert({ box_id: box.id, inventory_item_id: inventoryItem.id });

        await supabase
          .from('inventory_items')
          .update({ state: 'active', updated_at: new Date().toISOString() })
          .eq('id', inventoryItem.id);
      }
    }
    // If RPC succeeded and returned null, item was out of stock - continue anyway
  }

  // Clear cart
  await clearCart();

  return { success: true, subscriptionId: subscription.id, boxId: box.id };
}

// DEPRECATED: Pause subscription removed - doesn't work with physical products
// export async function pauseSubscription(): Promise<{ success: boolean; error?: string }> {
//   const subscription = await getSubscription();
//   if (!subscription) return { success: false, error: 'No subscription found.' };
//   const { error } = await supabase
//     .from('subscriptions')
//     .update({ status: 'paused', updated_at: new Date().toISOString() })
//     .eq('id', subscription.id);
//   if (error) return { success: false, error: 'Failed to pause subscription' };
//   return { success: true };
// }

/**
 * Cancel subscription
 */
export async function cancelSubscription(): Promise<{ success: boolean; error?: string }> {
  const subscription = await getSubscription();
  if (!subscription) return { success: false, error: 'No subscription found.' };

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', subscription.id);

  if (error) return { success: false, error: 'Failed to cancel subscription' };
  return { success: true };
}

// ============ BOX ============

/**
 * Get current box with items
 */
export async function getCurrentBox(): Promise<(Box & { items: InventoryItem[] }) | null> {
  const subscription = await getSubscription();
  if (!subscription) return null;

  const { data: box, error } = await supabase
    .from('boxes')
    .select('*')
    .eq('subscription_id', subscription.id)
    .in('status', ['active', 'shipped', 'selecting', 'confirmed'])
    .limit(1)
    .single();

  if (error || !box) return null;

  // Get box items
  const { data: boxItems } = await supabase
    .from('box_items')
    .select('inventory_item_id')
    .eq('box_id', box.id);

  if (!boxItems || boxItems.length === 0) {
    return { ...(box as Box), items: [] };
  }

  // Get inventory items
  const inventoryIds = boxItems.map(bi => bi.inventory_item_id);
  const { data: inventoryItems } = await supabase
    .from('inventory_items')
    .select('*')
    .in('id', inventoryIds);

  return { ...(box as Box), items: (inventoryItems || []) as InventoryItem[] };
}

/**
 * Get box history
 */
export async function getBoxHistory(): Promise<Box[]> {
  const subscription = await getSubscription();
  if (!subscription) return [];

  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .eq('subscription_id', subscription.id)
    .order('cycle_number', { ascending: false });

  if (error || !data) return [];
  return data as Box[];
}

// ============ SWAP ============

/**
 * Get swap selection items
 */
export async function getSwapItems(): Promise<string[]> {
  const subscription = await getSubscription();
  if (!subscription) return [];

  const { data, error } = await supabase
    .from('swap_items')
    .select('sanity_product_slug')
    .eq('subscription_id', subscription.id)
    .order('added_at', { ascending: false });

  if (error || !data) return [];
  return data.map(item => item.sanity_product_slug);
}

/**
 * Get swap count
 */
export async function getSwapCount(): Promise<number> {
  const subscription = await getSubscription();
  if (!subscription) return 0;

  const { count } = await supabase
    .from('swap_items')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_id', subscription.id);

  return count || 0;
}

/**
 * Add item to swap selection
 */
export async function addToSwap(slug: string): Promise<{ success: boolean; error?: string }> {
  const subscription = await getSubscription();
  if (!subscription) return { success: false, error: 'No subscription found.' };

  // Check swap window is open (within 10 days of cycle end)
  const cycleEnd = new Date(subscription.cycle_end_date);
  const today = new Date();
  const daysRemaining = Math.ceil((cycleEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysRemaining > 10) {
    return { success: false, error: 'Swap window is not open yet.' };
  }

  // Check if already has 5 items
  const swapCount = await getSwapCount();
  if (swapCount >= 5) {
    return { success: false, error: "You've already selected 5 items for your next box." };
  }

  // Check availability
  const available = await getAvailableCount(slug);
  if (available === 0) {
    return { success: false, error: 'This item is currently out of stock.' };
  }

  // Check if already in swap
  const { count } = await supabase
    .from('swap_items')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_id', subscription.id)
    .eq('sanity_product_slug', slug);

  if ((count || 0) > 0) {
    return { success: false, error: 'This item is already in your swap selection.' };
  }

  const { error } = await supabase
    .from('swap_items')
    .insert({ subscription_id: subscription.id, sanity_product_slug: slug });

  if (error) return { success: false, error: 'Failed to add item to swap' };
  return { success: true };
}

/**
 * Remove item from swap selection
 */
export async function removeFromSwap(slug: string): Promise<{ success: boolean; error?: string }> {
  const subscription = await getSubscription();
  if (!subscription) return { success: false, error: 'No subscription found.' };

  const { error } = await supabase
    .from('swap_items')
    .delete()
    .eq('subscription_id', subscription.id)
    .eq('sanity_product_slug', slug);

  if (error) return { success: false, error: 'Failed to remove item from swap' };
  return { success: true };
}

/**
 * Confirm swap and create new box
 */
export async function confirmSwap(): Promise<{ success: boolean; boxId?: number; error?: string }> {
  const subscription = await getSubscription();
  if (!subscription) return { success: false, error: 'No subscription found.' };

  // Check we have exactly 5 items
  const swapCount = await getSwapCount();
  if (swapCount !== 5) {
    return { success: false, error: 'You must select exactly 5 items for your next box.' };
  }

  const swapSlugs = await getSwapItems();

  // Calculate new cycle dates
  const startDate = new Date(subscription.cycle_end_date);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);
  const returnByDate = new Date(endDate);
  returnByDate.setDate(returnByDate.getDate() + 7);

  // Get existing box count
  const boxes = await getBoxHistory();
  const cycleNumber = boxes.length + 1;

  // Create new box
  const { data: box, error: boxError } = await supabase
    .from('boxes')
    .insert({
      subscription_id: subscription.id,
      cycle_number: cycleNumber,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      return_by_date: returnByDate.toISOString().split('T')[0],
      status: 'confirmed',
    })
    .select()
    .single();

  if (boxError || !box) {
    return { success: false, error: 'Failed to create new box' };
  }

  // Reserve inventory for each swap item using atomic RPC to prevent race conditions
  for (const slug of swapSlugs) {
    const { data: inventoryId, error: rpcError } = await supabase
      .rpc('reserve_inventory_item', {
        p_box_id: box.id,
        p_sanity_product_slug: slug
      });

    if (rpcError) {
      console.error('Failed to reserve inventory via RPC:', rpcError);
      // Fallback to non-atomic method if RPC doesn't exist yet
      const { data: inventoryItem } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('sanity_product_slug', slug)
        .eq('state', 'available')
        .or('quarantine_until.is.null,quarantine_until.lt.now()')
        .limit(1)
        .single();

      if (inventoryItem) {
        await supabase
          .from('box_items')
          .insert({ box_id: box.id, inventory_item_id: inventoryItem.id });

        await supabase
          .from('inventory_items')
          .update({ state: 'active', updated_at: new Date().toISOString() })
          .eq('id', inventoryItem.id);
      }
    }
  }

  // Clear swap items
  await supabase
    .from('swap_items')
    .delete()
    .eq('subscription_id', subscription.id);

  return { success: true, boxId: box.id };
}

// ============ ADMIN ============

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Get all inventory items (admin only)
 */
export async function getAllInventory(): Promise<InventoryItem[]> {
  if (!await isAdmin()) return [];

  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as InventoryItem[];
}

/**
 * Get inventory stats (admin only)
 */
export async function getInventoryStats(): Promise<{
  total: number;
  available: number;
  active: number;
  inTransit: number;
  quarantine: number;
  retired: number;
}> {
  if (!await isAdmin()) {
    return { total: 0, available: 0, active: 0, inTransit: 0, quarantine: 0, retired: 0 };
  }

  const { data, error } = await supabase
    .from('inventory_items')
    .select('state');

  if (error || !data) {
    return { total: 0, available: 0, active: 0, inTransit: 0, quarantine: 0, retired: 0 };
  }

  const stats = {
    total: data.length,
    available: 0,
    active: 0,
    inTransit: 0,
    quarantine: 0,
    retired: 0,
  };

  data.forEach(item => {
    if (item.state === 'available') stats.available++;
    if (item.state === 'active') stats.active++;
    if (item.state === 'in_transit') stats.inTransit++;
    if (item.state === 'quarantine') stats.quarantine++;
    if (item.state === 'retired') stats.retired++;
  });

  return stats;
}

/**
 * Update inventory item state (admin only)
 */
export async function updateInventoryState(
  itemId: number,
  state: InventoryItem['state'],
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  if (!await isAdmin()) return { success: false, error: 'Admin access required' };

  const updateData: any = { state, updated_at: new Date().toISOString() };

  if (state === 'quarantine') {
    const quarantineDate = new Date();
    quarantineDate.setDate(quarantineDate.getDate() + 5);
    updateData.quarantine_until = quarantineDate.toISOString().split('T')[0];
  }

  if (notes) {
    updateData.condition_notes = notes;
  }

  const { error } = await supabase
    .from('inventory_items')
    .update(updateData)
    .eq('id', itemId);

  if (error) return { success: false, error: 'Failed to update inventory item' };
  return { success: true };
}

/**
 * Create inventory item (admin only)
 */
export async function createInventoryItem(
  sanityProductSlug: string,
  sku: string
): Promise<{ success: boolean; error?: string }> {
  if (!await isAdmin()) return { success: false, error: 'Admin access required' };

  const { error } = await supabase
    .from('inventory_items')
    .insert({
      sanity_product_slug: sanityProductSlug,
      sku,
      state: 'available',
    });

  if (error) return { success: false, error: 'Failed to create inventory item' };
  return { success: true };
}

/**
 * Get all subscriptions with user info (admin only)
 */
export async function getAllSubscriptions(): Promise<Array<Subscription & { user: User | null }>> {
  if (!await isAdmin()) return [];

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      users (*)
    `);

  if (error || !data) return [];

  return data.map((sub: any) => ({
    ...sub,
    user: sub.users || null,
  }));
}
