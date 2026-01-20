/* =========================================================
   SP Chains – MySQL Initial Schema
   Converted from Supabase (PostgreSQL)
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;

/* ===================== USERS ===================== */
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  mobile_number VARCHAR(20) UNIQUE NOT NULL,
  role ENUM('dealer','admin') DEFAULT 'dealer',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* ================= DEALER PROFILES ================= */
CREATE TABLE dealer_profiles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  gst_number VARCHAR(50) UNIQUE NOT NULL,
  pan_number VARCHAR(50) UNIQUE NOT NULL,
  approval_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  credit_limit DECIMAL(15,2) DEFAULT 0,
  credit_used DECIMAL(15,2) DEFAULT 0,
  approved_by CHAR(36),
  approved_at TIMESTAMP NULL,
  rejected_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

/* ================= OTP LOGS ================= */
CREATE TABLE otp_logs (
  id CHAR(36) PRIMARY KEY,
  mobile_number VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ================= PRODUCTS ================= */
CREATE TABLE products (
  id CHAR(36) PRIMARY KEY,
  erp_product_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  base_weight DECIMAL(10,3) NOT NULL,
  available_sizes JSON,
  stock_quantity INT DEFAULT 0,
  making_charges DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* ================= PRICING CONFIG ================= */
CREATE TABLE pricing_config (
  id CHAR(36) PRIMARY KEY,
  mcx_rate DECIMAL(10,2) NOT NULL,
  premium_percentage DECIMAL(5,2) DEFAULT 0,
  updated_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

/* ================= ORDERS ================= */
CREATE TABLE orders (
  id CHAR(36) PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  dealer_id CHAR(36) NOT NULL,
  status ENUM('placed','approved','rejected','completed') DEFAULT 'placed',
  gross_weight DECIMAL(10,3) DEFAULT 0,
  pure_weight DECIMAL(10,3) DEFAULT 0,
  wastage DECIMAL(10,3) DEFAULT 0,
  making_charges DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  final_amount DECIMAL(15,2) NOT NULL,
  payment_mode ENUM('online','credit') NOT NULL,
  coupon_code VARCHAR(50),
  approved_by CHAR(36),
  approved_at TIMESTAMP NULL,
  rejected_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dealer_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

/* ================= ORDER ITEMS ================= */
CREATE TABLE order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  size VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit_weight DECIMAL(10,3) NOT NULL,
  total_weight DECIMAL(10,3) NOT NULL,
  rate DECIMAL(10,2) NOT NULL,
  making_charges DECIMAL(10,2) DEFAULT 0,
  line_total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

/* ================= PAYMENTS ================= */
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_mode ENUM('online','credit') NOT NULL,
  payment_status ENUM('pending','completed','failed') DEFAULT 'pending',
  transaction_id VARCHAR(255),
  credit_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

/* ================= COUPONS ================= */
CREATE TABLE coupons (
  id CHAR(36) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_quantity INT DEFAULT 1,
  applicable_payment_modes JSON,
  expiry_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

/* ================= NOTIFICATIONS ================= */
CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('offer','alert','gst_update') NOT NULL,
  target_audience ENUM('all','dealers','specific') DEFAULT 'all',
  created_by CHAR(36),
  published_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

/* ================= REVIEWS ================= */
CREATE TABLE reviews (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36) NOT NULL,
  dealer_id CHAR(36) NOT NULL,
  order_id CHAR(36) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_synced_to_erp BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (product_id, dealer_id, order_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (dealer_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

/* ================= INDEXES ================= */
CREATE INDEX idx_users_mobile ON users(mobile_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_dealer_profiles_user ON dealer_profiles(user_id);
CREATE INDEX idx_dealer_profiles_status ON dealer_profiles(approval_status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_dealer ON orders(dealer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_dealer ON reviews(dealer_id);

SET FOREIGN_KEY_CHECKS = 1;
