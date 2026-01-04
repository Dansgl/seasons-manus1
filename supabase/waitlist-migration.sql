-- Waitlist Signups Table
-- Run this migration in Supabase SQL Editor to create the waitlist table

-- Create the waitlist_signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  name TEXT,
  child_age VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source VARCHAR(50) -- track where signup came from: 'header', 'hero', 'add_to_cart', 'exit_intent', 'login'
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);

-- Create index for source analytics
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_source ON waitlist_signups(source);

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON waitlist_signups(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for public signups)
CREATE POLICY "Allow public inserts on waitlist_signups"
  ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow anyone to count total signups (for social proof)
CREATE POLICY "Allow public to count waitlist_signups"
  ON waitlist_signups
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Allow admins full access (optional - for admin dashboard)
-- Uncomment if you have an admin role set up
-- CREATE POLICY "Allow admins full access on waitlist_signups"
--   ON waitlist_signups
--   FOR ALL
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM users
--       WHERE users.auth_id = auth.uid()
--       AND users.role = 'admin'
--     )
--   );

-- Add comment for documentation
COMMENT ON TABLE waitlist_signups IS 'Stores email signups for the pre-launch waitlist';
COMMENT ON COLUMN waitlist_signups.email IS 'Email address (unique, required)';
COMMENT ON COLUMN waitlist_signups.name IS 'Optional name for personalized emails';
COMMENT ON COLUMN waitlist_signups.child_age IS 'Child age range: expecting, 0-3 months, 3-6 months, 6-12 months, 12-18 months, 18-24 months, 2-3 years';
COMMENT ON COLUMN waitlist_signups.source IS 'Source of signup: header, hero, add_to_cart, exit_intent, login';
