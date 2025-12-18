/*
  # Fix Demo User RLS Policies
  
  ## Changes
  - Update users table RLS policies to allow lookup by mobile number from auth metadata
  - This enables demo login to work properly by linking auth users to database users
  
  ## Security
  - Maintains authentication requirement
  - Only allows users to access their own data based on mobile number match
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Recreate policies with mobile number lookup support
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR mobile_number = (auth.jwt()->>'user_metadata')::jsonb->>'mobile_number'
  );

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM users u 
      WHERE u.mobile_number = (auth.jwt()->>'user_metadata')::jsonb->>'mobile_number'
      AND u.role = 'admin'
    )
  );