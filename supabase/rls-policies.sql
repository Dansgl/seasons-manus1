-- Row Level Security Policies for Baby Seasons
-- Run this in the Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- ============ USERS TABLE ============
-- Users can read their own record
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid()::text = auth_id);

-- Users can update their own record
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid()::text = auth_id);

-- Allow inserts for new users (during registration)
CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = auth_id);

-- ============ CART_ITEMS TABLE ============
-- Users can read their own cart items
CREATE POLICY "cart_select_own" ON cart_items
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- Users can insert their own cart items
CREATE POLICY "cart_insert_own" ON cart_items
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- Users can delete their own cart items
CREATE POLICY "cart_delete_own" ON cart_items
  FOR DELETE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- ============ SUBSCRIPTIONS TABLE ============
-- Users can read their own subscription
CREATE POLICY "subscriptions_select_own" ON subscriptions
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- Users can insert their own subscription
CREATE POLICY "subscriptions_insert_own" ON subscriptions
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- Users can update their own subscription (pause/cancel)
CREATE POLICY "subscriptions_update_own" ON subscriptions
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
  );

-- ============ BOXES TABLE ============
-- Users can read boxes that belong to their subscription
CREATE POLICY "boxes_select_own" ON boxes
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM subscriptions
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
    )
  );

-- Users can insert boxes (when creating subscription or swap)
CREATE POLICY "boxes_insert_own" ON boxes
  FOR INSERT WITH CHECK (
    subscription_id IN (
      SELECT id FROM subscriptions
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
    )
  );

-- ============ BOX_ITEMS TABLE ============
-- Users can read box items for their boxes
CREATE POLICY "box_items_select_own" ON box_items
  FOR SELECT USING (
    box_id IN (
      SELECT id FROM boxes WHERE subscription_id IN (
        SELECT id FROM subscriptions
        WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
      )
    )
  );

-- Users can insert box items when creating a box
CREATE POLICY "box_items_insert_own" ON box_items
  FOR INSERT WITH CHECK (
    box_id IN (
      SELECT id FROM boxes WHERE subscription_id IN (
        SELECT id FROM subscriptions
        WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
      )
    )
  );

-- ============ SWAP_ITEMS TABLE ============
-- Users can read their own swap items
CREATE POLICY "swap_select_own" ON swap_items
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM subscriptions
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
    )
  );

-- Users can insert swap items
CREATE POLICY "swap_insert_own" ON swap_items
  FOR INSERT WITH CHECK (
    subscription_id IN (
      SELECT id FROM subscriptions
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
    )
  );

-- Users can delete their swap items
CREATE POLICY "swap_delete_own" ON swap_items
  FOR DELETE USING (
    subscription_id IN (
      SELECT id FROM subscriptions
      WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()::text)
    )
  );

-- ============ INVENTORY_ITEMS TABLE ============
-- Anyone can read inventory items (needed for availability checking)
CREATE POLICY "inventory_select_all" ON inventory_items
  FOR SELECT USING (true);

-- Only admins can update inventory items
CREATE POLICY "inventory_update_admin" ON inventory_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()::text AND role = 'admin'
    )
  );

-- Only admins can insert inventory items
CREATE POLICY "inventory_insert_admin" ON inventory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============ HELPER FUNCTION ============
-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()::text AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
