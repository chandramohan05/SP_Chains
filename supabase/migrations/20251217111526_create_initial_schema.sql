/*
  # SP Chains - Initial Database Schema
  
  ## Overview
  Complete database schema for SP Chains B2B Silver Trading Application
  
  ## New Tables
  
  ### 1. users
  Core user authentication and role management
  - `id` (uuid, primary key) - Unique user identifier
  - `mobile_number` (text, unique) - User's mobile number (used for login)
  - `role` (text) - User role: 'dealer' or 'admin'
  - `is_active` (boolean) - Account active status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. dealer_profiles
  Detailed dealer business information
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to users table
  - `business_name` (text) - Registered business name
  - `gst_number` (text, unique) - GST identification number
  - `pan_number` (text, unique) - PAN card number
  - `approval_status` (text) - Status: 'pending', 'approved', 'rejected'
  - `credit_limit` (decimal) - Available credit limit for dealer
  - `credit_used` (decimal) - Currently used credit
  - `approved_by` (uuid, nullable) - Admin who approved
  - `approved_at` (timestamptz, nullable) - Approval timestamp
  - `rejected_reason` (text, nullable) - Reason for rejection
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. otp_logs
  OTP verification tracking
  - `id` (uuid, primary key)
  - `mobile_number` (text) - Mobile number for OTP
  - `otp_code` (text) - Generated OTP code
  - `is_verified` (boolean) - Verification status
  - `expires_at` (timestamptz) - OTP expiry time
  - `created_at` (timestamptz)
  
  ### 4. products
  Product catalogue cached from ERP
  - `id` (uuid, primary key)
  - `erp_product_id` (text, unique) - Product ID from ERP system
  - `name` (text) - Product name
  - `category` (text) - Product category
  - `base_weight` (decimal) - Base weight in grams
  - `available_sizes` (jsonb) - Array of available sizes
  - `stock_quantity` (integer) - Available stock
  - `making_charges` (decimal) - Making charges per unit
  - `is_active` (boolean) - Product availability
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. pricing_config
  MCX pricing and premium configuration
  - `id` (uuid, primary key)
  - `mcx_rate` (decimal) - Current MCX silver rate
  - `premium_percentage` (decimal) - Premium percentage to add
  - `updated_by` (uuid) - Admin who updated
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. orders
  Order master records
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Generated order number
  - `dealer_id` (uuid) - Dealer who placed order
  - `status` (text) - Order status: 'placed', 'approved', 'rejected', 'completed'
  - `gross_weight` (decimal) - Total gross weight
  - `pure_weight` (decimal) - Total pure weight
  - `wastage` (decimal) - Wastage amount
  - `making_charges` (decimal) - Total making charges
  - `subtotal` (decimal) - Subtotal before discount
  - `discount_amount` (decimal) - Discount applied
  - `final_amount` (decimal) - Final payable amount
  - `payment_mode` (text) - Payment mode: 'online', 'credit'
  - `coupon_code` (text, nullable) - Applied coupon code
  - `approved_by` (uuid, nullable) - Admin who approved
  - `approved_at` (timestamptz, nullable)
  - `rejected_reason` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 7. order_items
  Individual items in each order
  - `id` (uuid, primary key)
  - `order_id` (uuid) - Parent order
  - `product_id` (uuid) - Product reference
  - `size` (text) - Selected size
  - `quantity` (integer) - Quantity ordered
  - `unit_weight` (decimal) - Weight per unit
  - `total_weight` (decimal) - Total weight for line item
  - `rate` (decimal) - Rate per gram
  - `making_charges` (decimal) - Making charges for line item
  - `line_total` (decimal) - Line item total
  - `created_at` (timestamptz)
  
  ### 8. payments
  Payment transaction records
  - `id` (uuid, primary key)
  - `order_id` (uuid, unique) - Related order
  - `amount` (decimal) - Payment amount
  - `payment_mode` (text) - Payment mode used
  - `payment_status` (text) - Status: 'pending', 'completed', 'failed'
  - `transaction_id` (text, nullable) - External transaction ID
  - `credit_approved` (boolean) - Credit approval status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 9. coupons
  Discount coupon management
  - `id` (uuid, primary key)
  - `code` (text, unique) - Coupon code
  - `discount_type` (text) - Type: 'percentage', 'fixed'
  - `discount_value` (decimal) - Discount value
  - `min_quantity` (integer) - Minimum quantity required
  - `applicable_payment_modes` (jsonb) - Array of valid payment modes
  - `expiry_date` (timestamptz) - Coupon expiry
  - `is_active` (boolean) - Active status
  - `created_by` (uuid) - Admin who created
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 10. notifications
  System notifications and announcements
  - `id` (uuid, primary key)
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `type` (text) - Type: 'offer', 'alert', 'gst_update'
  - `target_audience` (text) - Audience: 'all', 'dealers', 'specific'
  - `created_by` (uuid) - Admin who created
  - `published_at` (timestamptz, nullable) - Publication timestamp
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)
  
  ### 11. reviews
  Product reviews and ratings
  - `id` (uuid, primary key)
  - `product_id` (uuid) - Reviewed product
  - `dealer_id` (uuid) - Dealer who reviewed
  - `order_id` (uuid) - Related order
  - `rating` (integer) - Rating 1-5
  - `review_text` (text, nullable) - Review content
  - `is_synced_to_erp` (boolean) - ERP sync status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Policies enforce role-based access control
  - Dealers can only access their own data
  - Admins have full access
  - Authentication required for all operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'dealer' CHECK (role IN ('dealer', 'admin')),
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dealer_profiles table
CREATE TABLE IF NOT EXISTS dealer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name text NOT NULL,
  gst_number text UNIQUE NOT NULL,
  pan_number text UNIQUE NOT NULL,
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  credit_limit decimal(15,2) DEFAULT 0,
  credit_used decimal(15,2) DEFAULT 0,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  rejected_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create otp_logs table
CREATE TABLE IF NOT EXISTS otp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number text NOT NULL,
  otp_code text NOT NULL,
  is_verified boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  base_weight decimal(10,3) NOT NULL,
  available_sizes jsonb DEFAULT '[]'::jsonb,
  stock_quantity integer DEFAULT 0,
  making_charges decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pricing_config table
CREATE TABLE IF NOT EXISTS pricing_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mcx_rate decimal(10,2) NOT NULL,
  premium_percentage decimal(5,2) DEFAULT 0,
  updated_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  dealer_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'placed' CHECK (status IN ('placed', 'approved', 'rejected', 'completed')),
  gross_weight decimal(10,3) DEFAULT 0,
  pure_weight decimal(10,3) DEFAULT 0,
  wastage decimal(10,3) DEFAULT 0,
  making_charges decimal(10,2) DEFAULT 0,
  subtotal decimal(15,2) DEFAULT 0,
  discount_amount decimal(15,2) DEFAULT 0,
  final_amount decimal(15,2) NOT NULL,
  payment_mode text NOT NULL CHECK (payment_mode IN ('online', 'credit')),
  coupon_code text,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  rejected_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  size text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_weight decimal(10,3) NOT NULL,
  total_weight decimal(10,3) NOT NULL,
  rate decimal(10,2) NOT NULL,
  making_charges decimal(10,2) DEFAULT 0,
  line_total decimal(15,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) UNIQUE NOT NULL,
  amount decimal(15,2) NOT NULL,
  payment_mode text NOT NULL CHECK (payment_mode IN ('online', 'credit')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  transaction_id text,
  credit_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL,
  min_quantity integer DEFAULT 1,
  applicable_payment_modes jsonb DEFAULT '["online", "credit"]'::jsonb,
  expiry_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('offer', 'alert', 'gst_update')),
  target_audience text DEFAULT 'all' CHECK (target_audience IN ('all', 'dealers', 'specific')),
  created_by uuid REFERENCES users(id),
  published_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  dealer_id uuid REFERENCES users(id) NOT NULL,
  order_id uuid REFERENCES orders(id) NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  is_synced_to_erp boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, dealer_id, order_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies for dealer_profiles table
CREATE POLICY "Dealers can view own profile"
  ON dealer_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all dealer profiles"
  ON dealer_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Dealers can update own profile"
  ON dealer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update dealer profiles"
  ON dealer_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for products table
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for pricing_config table
CREATE POLICY "Anyone can view pricing"
  ON pricing_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage pricing"
  ON pricing_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for orders table
CREATE POLICY "Dealers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (dealer_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Dealers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (dealer_id = auth.uid());

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for order_items table
CREATE POLICY "Dealers can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Dealers can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.dealer_id = auth.uid()
    )
  );

-- RLS Policies for payments table
CREATE POLICY "Dealers can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.dealer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Dealers can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id AND orders.dealer_id = auth.uid()
    )
  );

-- RLS Policies for coupons table
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (is_active = true AND expiry_date > now());

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for notifications table
CREATE POLICY "Anyone can view active notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (is_active = true AND published_at IS NOT NULL);

CREATE POLICY "Admins can manage notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for reviews table
CREATE POLICY "Dealers can view all reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dealers can create own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (dealer_id = auth.uid());

CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_dealer_profiles_user_id ON dealer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_profiles_approval_status ON dealer_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_erp_id ON products(erp_product_id);
CREATE INDEX IF NOT EXISTS idx_orders_dealer_id ON orders(dealer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_dealer_id ON reviews(dealer_id);