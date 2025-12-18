/*
  # Fix Demo RLS Policies

  ## Overview
  Add permissive RLS policies to allow demo access without authentication.
  This is necessary because the demo login doesn't create real auth sessions.

  ## Changes
  1. Add public read access to dealer_profiles for demo mode
  2. Add public read access to users table for demo mode
  3. Maintain existing auth-based policies

  ## Security Note
  These policies allow read-only access for demo purposes.
  In production, remove these public policies and require proper authentication.
*/

-- Add permissive policy for dealer_profiles
DROP POLICY IF EXISTS "Public can view dealer profiles for demo" ON dealer_profiles;
CREATE POLICY "Public can view dealer profiles for demo"
  ON dealer_profiles FOR SELECT
  TO public
  USING (true);

-- Add permissive policy for users table
DROP POLICY IF EXISTS "Public can view users for demo" ON users;
CREATE POLICY "Public can view users for demo"
  ON users FOR SELECT
  TO public
  USING (true);

-- Ensure demo admin user exists with correct data
INSERT INTO users (
  id,
  mobile_number,
  role,
  is_active
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '9999999999',
  'admin',
  true
)
ON CONFLICT (id) 
DO UPDATE SET 
  mobile_number = EXCLUDED.mobile_number,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Ensure dealer profile exists for demo dealer
INSERT INTO dealer_profiles (
  id,
  user_id,
  business_name,
  gst_number,
  pan_number,
  approval_status,
  credit_limit,
  credit_used,
  approved_by,
  approved_at
)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Silver Star Jewellers',
  '27AABCU9603R1ZV',
  'AABCU9603R',
  'approved',
  100000,
  15000,
  '00000000-0000-0000-0000-000000000001',
  now()
)
ON CONFLICT (user_id) 
DO UPDATE SET
  business_name = EXCLUDED.business_name,
  approval_status = EXCLUDED.approval_status,
  credit_limit = EXCLUDED.credit_limit,
  approved_by = EXCLUDED.approved_by,
  approved_at = EXCLUDED.approved_at;