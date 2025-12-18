/*
  # Remove All Recursive Admin Policies for Demo Mode

  ## Overview
  Remove all policies that query the users table to check for admin role.
  This prevents infinite recursion errors when tables join with users table.

  ## Changes
  - Drop all policies that contain `EXISTS (SELECT FROM users WHERE role = 'admin')`
  - Replace with simple public policies for demo mode
  
  ## Tables Affected
  - activity_logs, banners, coupons, dealer_profiles, delivery_tracking
  - notifications, order_items, orders, payments, pricing_config
  - product_images, products, reviews, support_tickets, ticket_responses

  ## Security Note
  These are demo-only policies. In production, implement proper role-based access control.
*/

-- Activity Logs
DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;

-- Banners
DROP POLICY IF EXISTS "Admins can create banners" ON banners;
DROP POLICY IF EXISTS "Admins can delete banners" ON banners;
DROP POLICY IF EXISTS "Admins can update banners" ON banners;
DROP POLICY IF EXISTS "Admins can view all banners" ON banners;
DROP POLICY IF EXISTS "Dealers can view active banners" ON banners;

CREATE POLICY "Public can insert banners" ON banners FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update banners" ON banners FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete banners" ON banners FOR DELETE TO public USING (true);

-- Coupons
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;

CREATE POLICY "Public can insert coupons" ON coupons FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update coupons" ON coupons FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete coupons" ON coupons FOR DELETE TO public USING (true);

-- Dealer Profiles
DROP POLICY IF EXISTS "Admins can update dealer profiles" ON dealer_profiles;
DROP POLICY IF EXISTS "Admins can view all dealer profiles" ON dealer_profiles;
DROP POLICY IF EXISTS "Dealers can update own profile" ON dealer_profiles;
DROP POLICY IF EXISTS "Dealers can view own profile" ON dealer_profiles;

CREATE POLICY "Public can insert dealer profiles" ON dealer_profiles FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update dealer profiles" ON dealer_profiles FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete dealer profiles" ON dealer_profiles FOR DELETE TO public USING (true);

-- Delivery Tracking
DROP POLICY IF EXISTS "Admins can manage all delivery tracking" ON delivery_tracking;
DROP POLICY IF EXISTS "Users can view delivery for own orders" ON delivery_tracking;

CREATE POLICY "Public can insert delivery tracking" ON delivery_tracking FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update delivery tracking" ON delivery_tracking FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete delivery tracking" ON delivery_tracking FOR DELETE TO public USING (true);

-- Notifications
DROP POLICY IF EXISTS "Admins can manage notifications" ON notifications;
DROP POLICY IF EXISTS "Anyone can view active notifications" ON notifications;

CREATE POLICY "Public can insert notifications" ON notifications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update notifications" ON notifications FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete notifications" ON notifications FOR DELETE TO public USING (true);

-- Order Items
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Dealers can create order items" ON order_items;
DROP POLICY IF EXISTS "Dealers can view own order items" ON order_items;

CREATE POLICY "Public can insert order items" ON order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update order items" ON order_items FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete order items" ON order_items FOR DELETE TO public USING (true);

-- Orders
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Dealers can create orders" ON orders;
DROP POLICY IF EXISTS "Dealers can view own orders" ON orders;

CREATE POLICY "Public can insert orders" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update orders" ON orders FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete orders" ON orders FOR DELETE TO public USING (true);

-- Payments
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
DROP POLICY IF EXISTS "Dealers can create payments" ON payments;
DROP POLICY IF EXISTS "Dealers can view own payments" ON payments;

CREATE POLICY "Public can insert payments" ON payments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update payments" ON payments FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete payments" ON payments FOR DELETE TO public USING (true);

-- Pricing Config
DROP POLICY IF EXISTS "Admins can manage pricing" ON pricing_config;
DROP POLICY IF EXISTS "Anyone can view pricing" ON pricing_config;

CREATE POLICY "Public can insert pricing config" ON pricing_config FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update pricing config" ON pricing_config FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete pricing config" ON pricing_config FOR DELETE TO public USING (true);

-- Product Images
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
DROP POLICY IF EXISTS "Anyone can view product images" ON product_images;

CREATE POLICY "Public can insert product images" ON product_images FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update product images" ON product_images FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete product images" ON product_images FOR DELETE TO public USING (true);

-- Products
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

CREATE POLICY "Public can insert products" ON products FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update products" ON products FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete products" ON products FOR DELETE TO public USING (true);

-- Reviews
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
DROP POLICY IF EXISTS "Dealers can create own reviews" ON reviews;
DROP POLICY IF EXISTS "Dealers can view all reviews" ON reviews;

CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update reviews" ON reviews FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete reviews" ON reviews FOR DELETE TO public USING (true);

-- Support Tickets (keep some existing public policies)
DROP POLICY IF EXISTS "Admins can update tickets" ON support_tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;

-- Ticket Responses
DROP POLICY IF EXISTS "Admins can add responses" ON ticket_responses;
DROP POLICY IF EXISTS "Admins can view all responses" ON ticket_responses;
DROP POLICY IF EXISTS "Users can add responses to own tickets" ON ticket_responses;
DROP POLICY IF EXISTS "Users can view responses for their tickets" ON ticket_responses;

-- Activity Logs
DROP POLICY IF EXISTS "Users can create activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;

CREATE POLICY "Public can insert activity logs" ON activity_logs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update activity logs" ON activity_logs FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete activity logs" ON activity_logs FOR DELETE TO public USING (true);

-- Dealer Inventory (keep existing public policies, remove conflicting ones)
DROP POLICY IF EXISTS "Admins can view all dealer inventory" ON dealer_inventory;
DROP POLICY IF EXISTS "Dealers can manage own inventory" ON dealer_inventory;
DROP POLICY IF EXISTS "Dealers can view own inventory" ON dealer_inventory;