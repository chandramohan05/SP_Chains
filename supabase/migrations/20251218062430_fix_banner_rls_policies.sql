/*
  # Fix Banner RLS Policies

  ## Changes
  - Update RLS policies to allow admins to view all banners
  - Keep dealer access restricted to active banners only
  - Ensure proper admin access for banner management

  ## Security
  - Admins can view and manage all banners
  - Dealers can only view active banners within date range
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active banners" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;

-- Create new policies with proper admin access

-- Admins can view ALL banners (for management)
CREATE POLICY "Admins can view all banners"
  ON banners FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Dealers can view active banners only
CREATE POLICY "Dealers can view active banners"
  ON banners FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    AND now() >= start_date 
    AND (end_date IS NULL OR now() <= end_date)
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'dealer'
    )
  );

-- Admins can insert banners
CREATE POLICY "Admins can create banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update banners
CREATE POLICY "Admins can update banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can delete banners
CREATE POLICY "Admins can delete banners"
  ON banners FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );