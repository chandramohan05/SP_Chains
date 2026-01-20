/* =========================================================
   Sample Data for Testing (MySQL Version)
   Converted from Supabase add_sample_data_for_testing.sql
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;

/* ================= PRICING CONFIG ================= */
INSERT IGNORE INTO pricing_config (mcx_rate, premium_percentage)
VALUES (75.50, 2.5);

/* ================= PRODUCTS ================= */
INSERT IGNORE INTO products (
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
  JSON_ARRAY('22','24','26'),
  50,
  250,
  TRUE,
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
  JSON_ARRAY('S','M','L'),
  30,
  200,
  TRUE,
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
  JSON_ARRAY('6','7','8','9'),
  100,
  150,
  TRUE,
  'RG-001',
  'Premium',
  0.5,
  3.0,
  92.5,
  'baby',
  4.0,
  10.0,
  0.25
);

/* ================= BANNERS ================= */
INSERT IGNORE INTO banners (
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
  TRUE,
  NOW(),
  NOW() + INTERVAL 30 DAY
),
(
  'Premium Collection Launch',
  'Discover our exclusive premium silver jewelry collection',
  'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NULL,
  2,
  TRUE,
  NOW(),
  NOW() + INTERVAL 60 DAY
),
(
  'Bulk Order Discount',
  'Special prices for bulk orders above ₹50,000',
  'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=1200',
  NULL,
  3,
  TRUE,
  NOW(),
  NOW() + INTERVAL 90 DAY
);

/* ================= PRODUCT IMAGES ================= */

/* Chain Images */
INSERT IGNORE INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id,
       'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
       1,
       TRUE
FROM products WHERE erp_product_id = 'PROD001';

INSERT IGNORE INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id,
       'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
       2,
       FALSE
FROM products WHERE erp_product_id = 'PROD001';

/* Bracelet Images */
INSERT IGNORE INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id,
       'https://images.pexels.com/photos/265856/pexels-photo-265856.jpeg?auto=compress&cs=tinysrgb&w=600',
       1,
       TRUE
FROM products WHERE erp_product_id = 'PROD002';

INSERT IGNORE INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id,
       'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600',
       2,
       FALSE
FROM products WHERE erp_product_id = 'PROD002';

/* Ring Images */
INSERT IGNORE INTO product_images (product_id, image_url, display_order, is_primary)
SELECT id,
       'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=600',
       1,
       TRUE
FROM products WHERE erp_product_id = 'PROD003';

SET FOREIGN_KEY_CHECKS = 1;
