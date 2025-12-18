/*
  # Fix RLS for Demo Login
  
  ## Changes
  - Create function to get current user's mobile from auth
  - Update RLS to allow access by mobile number match
  - Keep existing user IDs unchanged
  
  ## Security
  - Maintains strict authentication requirement
  - Allows access only to own data
*/

-- Create helper function to get mobile from current auth user
CREATE OR REPLACE FUNCTION public.get_current_user_mobile()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT raw_user_meta_data->>'mobile_number' FROM auth.users WHERE id = auth.uid()),
    ''
  );
$$;

-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Users can see their profile by ID or mobile number
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() 
    OR mobile_number = public.get_current_user_mobile()
  );

-- Admins can see all users  
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE (u.id = auth.uid() OR u.mobile_number = public.get_current_user_mobile())
      AND u.role = 'admin'
    )
  );