/*
  # Add Auth User Sync Trigger
  
  ## Changes
  - Create trigger to automatically sync auth.users with our users table
  - Update user ID in our table to match auth.uid when signing up
  - Simplify RLS policies
  
  ## Security
  - Maintains strict access control
  - Automatically links demo users on first login
*/

-- Create function to sync auth users with our users table
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  mobile_num text;
BEGIN
  -- Extract mobile number from metadata
  mobile_num := NEW.raw_user_meta_data->>'mobile_number';
  
  -- If mobile number exists in metadata, try to link to existing user
  IF mobile_num IS NOT NULL THEN
    -- Update existing user record with auth ID
    UPDATE users 
    SET id = NEW.id 
    WHERE mobile_number = mobile_num 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_created();

-- Simplify RLS policies now that IDs will match
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );