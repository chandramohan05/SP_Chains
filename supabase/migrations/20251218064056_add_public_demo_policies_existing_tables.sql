/*
  # Add Public Demo Policies for Existing Tables

  ## Overview
  Add read-only public access to all existing tables for demo mode.
  This allows the admin panel to function without authentication.

  ## Tables Updated
  - products
  - product_images
  - orders
  - order_items
  - payments
  - coupons
  - notifications
  - reviews
  - pricing_config
  - banners
  - support_tickets
  - ticket_responses
  - delivery_tracking
  - dealer_inventory
  - activity_logs
  - otp_logs

  ## Security Note
  These are demo-only policies. Remove in production.
*/

-- Products
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Product Images
DROP POLICY IF EXISTS "Public can view product images" ON product_images;
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

-- Orders
DROP POLICY IF EXISTS "Public can view orders" ON orders;
CREATE POLICY "Public can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

-- Order Items
DROP POLICY IF EXISTS "Public can view order items" ON order_items;
CREATE POLICY "Public can view order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

-- Payments
DROP POLICY IF EXISTS "Public can view payments" ON payments;
CREATE POLICY "Public can view payments"
  ON payments FOR SELECT
  TO public
  USING (true);

-- Coupons
DROP POLICY IF EXISTS "Public can view coupons" ON coupons;
CREATE POLICY "Public can view coupons"
  ON coupons FOR SELECT
  TO public
  USING (true);

-- Notifications
DROP POLICY IF EXISTS "Public can view notifications" ON notifications;
CREATE POLICY "Public can view notifications"
  ON notifications FOR SELECT
  TO public
  USING (true);

-- Reviews
DROP POLICY IF EXISTS "Public can view reviews" ON reviews;
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

-- Pricing Config
DROP POLICY IF EXISTS "Public can view pricing config" ON pricing_config;
CREATE POLICY "Public can view pricing config"
  ON pricing_config FOR SELECT
  TO public
  USING (true);

-- Banners
DROP POLICY IF EXISTS "Public can view banners" ON banners;
CREATE POLICY "Public can view banners"
  ON banners FOR SELECT
  TO public
  USING (true);

-- Support Tickets
DROP POLICY IF EXISTS "Public can view support tickets" ON support_tickets;
CREATE POLICY "Public can view support tickets"
  ON support_tickets FOR SELECT
  TO public
  USING (true);

-- Ticket Responses
DROP POLICY IF EXISTS "Public can view ticket responses" ON ticket_responses;
CREATE POLICY "Public can view ticket responses"
  ON ticket_responses FOR SELECT
  TO public
  USING (true);

-- Delivery Tracking
DROP POLICY IF EXISTS "Public can view delivery tracking" ON delivery_tracking;
CREATE POLICY "Public can view delivery tracking"
  ON delivery_tracking FOR SELECT
  TO public
  USING (true);

-- Dealer Inventory
DROP POLICY IF EXISTS "Public can view dealer inventory" ON dealer_inventory;
CREATE POLICY "Public can view dealer inventory"
  ON dealer_inventory FOR SELECT
  TO public
  USING (true);

-- Activity Logs
DROP POLICY IF EXISTS "Public can view activity logs" ON activity_logs;
CREATE POLICY "Public can view activity logs"
  ON activity_logs FOR SELECT
  TO public
  USING (true);

-- OTP Logs
DROP POLICY IF EXISTS "Public can view otp logs" ON otp_logs;
CREATE POLICY "Public can view otp logs"
  ON otp_logs FOR SELECT
  TO public
  USING (true);