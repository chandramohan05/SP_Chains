/*
  # Add Sample Data for Testing

  ## Sample Data Created
  1. Sample banners for testing the banner system
  2. Sample pricing configuration
  3. Sample products with complete information
  
  ## Note
  - This is test data for demonstration purposes
  - Users are already created via demo login
*/

-- Insert sample pricing configuration
INSERT INTO pricing_config (mcx_rate, premium_percentage)
VALUES (75.50, 2.5)
ON CONFLICT DO NOTHING;

-- Insert sample products with new fields
INSERT INTO products (
  erp_product_id,
  name,
  category,
  base_weight,
  available_sizes,
  stock_quantity,
  making_charges,
  is_active,
  design_no,
  variant,
  weight_per_inch,
  wastage_percent,
  purity_percent,
  baby_or_big_size,
  size_range_start,
  size_range_end,
  size_increment
) VALUES
(
  'PROD001',
  'Silver Chain 24 inch',
  'Chains',
  15.5,
  '["22", "24", "26"]'::jsonb,
  50,
  250,
  true,
  'CH-001',
  'Classic',
  2.5,
  5.0,
  92.5,
  'big',
  4.0,
  12.5,
  0.25
),
(
  'PROD002',
  'Silver Bracelet',
  'Bracelets',
  12.3,
  '["S", "M", "L"]'::jsonb,
  30,
  200,
  true,
  'BR-001',
  'Designer',
  1.8,
  4.5,
  92.5,
  'baby',
  4.0,
  8.0,
  0.25
),
(
  'PROD003',
  'Silver Ring',
  'Rings',
  8.5,
  '["6", "7", "8", "9"]'::jsonb,
  100,
  150,
  true,
  'RG-001',
  'Premium',
  0.5,
  3.0,
  92.5,
  'baby',
  4.0,
  10.0,
  0.25
)
ON CONFLICT (erp_product_id) DO NOTHING;

-- Insert sample banners
INSERT INTO banners (
  title,
  description,
  image_url,
  link_url,
  display_order,
  is_active,
  start_date,
  end_date
) VALUES
(
  'New Year Special Offer',
  'Get 15% off on all silver chains this month!',
  'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NULL,
  1,
  true,
  now(),
  now() + interval '30 days'
),
(
  'Premium Collection Launch',
  'Discover our exclusive premium silver jewelry collection',
  'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NULL,
  2,
  true,
  now(),
  now() + interval '60 days'
),
(
  'Bulk Order Discount',
  'Special prices for bulk orders above ₹50,000',
  'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NULL,
  3,
  true,
  now(),
  now() + interval '90 days'
)
ON CONFLICT DO NOTHING;

-- Insert sample product images
DO $$
DECLARE
  product_id_chain uuid;
  product_id_bracelet uuid;
  product_id_ring uuid;
BEGIN
  -- Get product IDs
  SELECT id INTO product_id_chain FROM products WHERE erp_product_id = 'PROD001';
  SELECT id INTO product_id_bracelet FROM products WHERE erp_product_id = 'PROD002';
  SELECT id INTO product_id_ring FROM products WHERE erp_product_id = 'PROD003';

  -- Insert product images for chain
  IF product_id_chain IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, display_order, is_primary)
    VALUES
      (product_id_chain, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 1, true),
      (product_id_chain, 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600', 2, false)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert product images for bracelet
  IF product_id_bracelet IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, display_order, is_primary)
    VALUES
      (product_id_bracelet, 'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600', 1, true),
      (product_id_bracelet, 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600', 2, false)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Insert product images for ring
  IF product_id_ring IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, display_order, is_primary)
    VALUES
      (product_id_ring, 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600', 1, true)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;