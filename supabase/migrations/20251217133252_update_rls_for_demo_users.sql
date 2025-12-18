/*
  # Update RLS for Demo Users
  
  ## Changes
  - Update users table RLS policies to support demo login
  - Allow lookup by mobile number from auth.users metadata
  
  ## Security
  - Maintains authentication requirement
  - Only allows users to access their own data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Allow users to see their own profile by ID or mobile number from auth metadata
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR mobile_number = (
      SELECT raw_user_meta_data->>'mobile_number' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );

-- Allow admins to see all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE (
        u.id = auth.uid() 
        OR u.mobile_number = (
          SELECT raw_user_meta_data->>'mobile_number' 
          FROM auth.users 
          WHERE id = auth.uid()
        )
      )
      AND u.role = 'admin'
    )
  );