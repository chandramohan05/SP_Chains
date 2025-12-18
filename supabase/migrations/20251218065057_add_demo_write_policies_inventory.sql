/*
  # Add Demo Write Policies for Dealer Inventory

  ## Overview
  Add INSERT, UPDATE, and DELETE policies for dealer_inventory table
  to allow demo users to manage their inventory without authentication.

  ## Changes
  - Add public INSERT policy for dealer_inventory
  - Add public UPDATE policy for dealer_inventory
  - Add public DELETE policy for dealer_inventory

  ## Security Note
  These are demo-only policies. Remove in production.
*/

-- Allow public to insert inventory
DROP POLICY IF EXISTS "Public can insert dealer inventory" ON dealer_inventory;
CREATE POLICY "Public can insert dealer inventory"
  ON dealer_inventory FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to update inventory
DROP POLICY IF EXISTS "Public can update dealer inventory" ON dealer_inventory;
CREATE POLICY "Public can update dealer inventory"
  ON dealer_inventory FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Allow public to delete inventory
DROP POLICY IF EXISTS "Public can delete dealer inventory" ON dealer_inventory;
CREATE POLICY "Public can delete dealer inventory"
  ON dealer_inventory FOR DELETE
  TO public
  USING (true);

-- Add sample inventory data for the demo dealer
DO $$
DECLARE
  dealer_user_id uuid := '11111111-1111-1111-1111-111111111111';
  product_chain_id uuid;
  product_bracelet_id uuid;
BEGIN
  -- Get product IDs
  SELECT id INTO product_chain_id FROM products WHERE erp_product_id = 'PROD001';
  SELECT id INTO product_bracelet_id FROM products WHERE erp_product_id = 'PROD002';

  -- Insert sample inventory for demo dealer
  IF product_chain_id IS NOT NULL THEN
    INSERT INTO dealer_inventory (dealer_id, product_id, size, weight, quantity, last_synced)
    VALUES 
      (dealer_user_id, product_chain_id, 24.0, 15.5, 10, now()),
      (dealer_user_id, product_chain_id, 22.0, 14.2, 5, now())
    ON CONFLICT DO NOTHING;
  END IF;

  IF product_bracelet_id IS NOT NULL THEN
    INSERT INTO dealer_inventory (dealer_id, product_id, size, weight, quantity, last_synced)
    VALUES 
      (dealer_user_id, product_bracelet_id, 8.0, 12.3, 8, now())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;