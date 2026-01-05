-- Create user_favorites table for wishlist/favorites functionality
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sanity_product_slug VARCHAR(255) NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Prevent duplicate favorites
  UNIQUE(user_id, sanity_product_slug)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_slug ON user_favorites(sanity_product_slug);

COMMENT ON TABLE user_favorites IS 'User wishlist/favorites for demand analytics and UX';
