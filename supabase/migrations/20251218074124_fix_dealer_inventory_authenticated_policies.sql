/*
  # Fix Dealer Inventory RLS Policies for Authenticated Users

  1. Changes
    - Add back RLS policies for authenticated dealers to view and manage their own inventory
    - These policies were accidentally removed in a previous migration
    
  2. Security
    - Dealers can SELECT their own inventory items
    - Dealers can INSERT, UPDATE, DELETE their own inventory items
    - Policies check that auth.uid() matches dealer_id
*/

-- Add policies for authenticated dealers to manage their own inventory
CREATE POLICY "Authenticated dealers can view own inventory"
  ON dealer_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = dealer_id);

CREATE POLICY "Authenticated dealers can insert own inventory"
  ON dealer_inventory FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Authenticated dealers can update own inventory"
  ON dealer_inventory FOR UPDATE
  TO authenticated
  USING (auth.uid() = dealer_id)
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Authenticated dealers can delete own inventory"
  ON dealer_inventory FOR DELETE
  TO authenticated
  USING (auth.uid() = dealer_id);
