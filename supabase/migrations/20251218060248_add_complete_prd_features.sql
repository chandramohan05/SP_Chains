/*
  # Complete PRD Implementation - Phase 1

  ## New Tables
  
  1. **product_images** - Multiple images per product
     - `id` (uuid, primary key)
     - `product_id` (uuid, foreign key to products)
     - `image_url` (text)
     - `display_order` (integer)
     - `is_primary` (boolean)
     - `created_at` (timestamptz)
  
  2. **support_tickets** - Customer support system
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `subject` (text)
     - `description` (text)
     - `status` (enum: open, in_progress, resolved, closed)
     - `priority` (enum: low, medium, high)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  3. **ticket_responses** - Support ticket replies
     - `id` (uuid, primary key)
     - `ticket_id` (uuid, foreign key)
     - `user_id` (uuid, foreign key)
     - `message` (text)
     - `is_staff_response` (boolean)
     - `created_at` (timestamptz)
  
  4. **activity_logs** - User activity tracking
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `activity_type` (text)
     - `entity_type` (text)
     - `entity_id` (uuid)
     - `metadata` (jsonb)
     - `duration_seconds` (integer)
     - `created_at` (timestamptz)
  
  5. **dealer_inventory** - Dealer-specific stock
     - `id` (uuid, primary key)
     - `dealer_id` (uuid, foreign key)
     - `product_id` (uuid, foreign key)
     - `size` (decimal)
     - `weight` (decimal)
     - `quantity` (integer)
     - `last_synced` (timestamptz)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  6. **delivery_tracking** - Order delivery status
     - `id` (uuid, primary key)
     - `order_id` (uuid, foreign key)
     - `status` (text)
     - `delivery_method` (enum: in_person, dealer_delivery)
     - `delivered_by` (uuid)
     - `notes` (text)
     - `updated_at` (timestamptz)
     - `created_at` (timestamptz)
  
  7. **banners** - Advertisement banners
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text)
     - `image_url` (text)
     - `link_url` (text)
     - `display_order` (integer)
     - `is_active` (boolean)
     - `start_date` (timestamptz)
     - `end_date` (timestamptz)
     - `created_at` (timestamptz)
  
  ## Product Table Updates
  - Add design_no (text)
  - Add variant (text)
  - Add weight_per_inch (decimal)
  - Add wastage_percent (decimal)
  - Add purity_percent (decimal)
  - Add baby_or_big_size (enum)
  - Add size_range_start (decimal)
  - Add size_range_end (decimal)
  - Add size_increment (decimal)
  
  ## Orders Table Updates
  - Add pure_payable (decimal)
  - Add delivery_method (text)
  
  ## Payments Table Updates
  - Add new payment modes: rtgs, silver_settlement
  
  ## Security
  - Enable RLS on all new tables
  - Add appropriate policies for authenticated users
  - Add admin-only policies for sensitive operations
*/

-- Add new columns to products table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'design_no') THEN
    ALTER TABLE products ADD COLUMN design_no text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'variant') THEN
    ALTER TABLE products ADD COLUMN variant text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'weight_per_inch') THEN
    ALTER TABLE products ADD COLUMN weight_per_inch decimal(10,3) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'wastage_percent') THEN
    ALTER TABLE products ADD COLUMN wastage_percent decimal(5,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'purity_percent') THEN
    ALTER TABLE products ADD COLUMN purity_percent decimal(5,2) DEFAULT 92.5;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'baby_or_big_size') THEN
    ALTER TABLE products ADD COLUMN baby_or_big_size text CHECK (baby_or_big_size IN ('baby', 'big'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'size_range_start') THEN
    ALTER TABLE products ADD COLUMN size_range_start decimal(4,2) DEFAULT 4.0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'size_range_end') THEN
    ALTER TABLE products ADD COLUMN size_range_end decimal(4,2) DEFAULT 12.5;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'size_increment') THEN
    ALTER TABLE products ADD COLUMN size_increment decimal(3,2) DEFAULT 0.25;
  END IF;
END $$;

-- Add new columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pure_payable') THEN
    ALTER TABLE orders ADD COLUMN pure_payable decimal(15,3) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_method') THEN
    ALTER TABLE orders ADD COLUMN delivery_method text CHECK (delivery_method IN ('in_person', 'dealer_delivery'));
  END IF;
END $$;

-- Update payments table to support new payment modes
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_payment_mode_check;
  
  -- Add new constraint with additional payment modes
  ALTER TABLE payments ADD CONSTRAINT payments_payment_mode_check 
    CHECK (payment_mode IN ('online', 'credit', 'rtgs', 'silver_settlement'));
END $$;

-- Update orders table to support new payment modes
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_mode_check;
  
  -- Add new constraint with additional payment modes
  ALTER TABLE orders ADD CONSTRAINT orders_payment_mode_check 
    CHECK (payment_mode IN ('online', 'credit', 'rtgs', 'silver_settlement'));
END $$;

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tickets"
  ON support_tickets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create ticket_responses table
CREATE TABLE IF NOT EXISTS ticket_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  is_staff_response boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ticket_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view responses for their tickets"
  ON ticket_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_responses.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add responses to own tickets"
  ON ticket_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets
      WHERE support_tickets.id = ticket_responses.ticket_id
      AND support_tickets.user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

CREATE POLICY "Admins can view all responses"
  ON ticket_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can add responses"
  ON ticket_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create dealer_inventory table
CREATE TABLE IF NOT EXISTS dealer_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  size decimal(4,2) NOT NULL,
  weight decimal(10,3) NOT NULL,
  quantity integer DEFAULT 0,
  last_synced timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(dealer_id, product_id, size)
);

ALTER TABLE dealer_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view own inventory"
  ON dealer_inventory FOR SELECT
  TO authenticated
  USING (auth.uid() = dealer_id);

CREATE POLICY "Dealers can manage own inventory"
  ON dealer_inventory FOR ALL
  TO authenticated
  USING (auth.uid() = dealer_id)
  WITH CHECK (auth.uid() = dealer_id);

CREATE POLICY "Admins can view all dealer inventory"
  ON dealer_inventory FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create delivery_tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  delivery_method text CHECK (delivery_method IN ('in_person', 'dealer_delivery')),
  delivered_by uuid REFERENCES users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view delivery for own orders"
  ON delivery_tracking FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = delivery_tracking.order_id
      AND orders.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all delivery tracking"
  ON delivery_tracking FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  link_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  TO authenticated
  USING (is_active = true AND now() >= start_date AND (end_date IS NULL OR now() <= end_date));

CREATE POLICY "Admins can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket_id ON ticket_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_dealer_id ON dealer_inventory(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_inventory_product_id ON dealer_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, start_date, end_date);