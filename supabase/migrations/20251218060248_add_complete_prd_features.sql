/* =========================================================
   SP Chains – Phase 1 PRD (MySQL Version)
   Converted from Supabase add_complete_prd_features.sql
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;

/* ================= PRODUCT TABLE UPDATES ================= */
ALTER TABLE products
  ADD COLUMN design_no VARCHAR(100),
  ADD COLUMN variant VARCHAR(100),
  ADD COLUMN weight_per_inch DECIMAL(10,3) DEFAULT 0,
  ADD COLUMN wastage_percent DECIMAL(5,2) DEFAULT 0,
  ADD COLUMN purity_percent DECIMAL(5,2) DEFAULT 92.5,
  ADD COLUMN baby_or_big_size ENUM('baby','big'),
  ADD COLUMN size_range_start DECIMAL(4,2) DEFAULT 4.0,
  ADD COLUMN size_range_end DECIMAL(4,2) DEFAULT 12.5,
  ADD COLUMN size_increment DECIMAL(3,2) DEFAULT 0.25;

/* ================= ORDERS TABLE UPDATES ================= */
ALTER TABLE orders
  ADD COLUMN pure_payable DECIMAL(15,3) DEFAULT 0,
  ADD COLUMN delivery_method ENUM('in_person','dealer_delivery');

/* ================= PAYMENTS TABLE UPDATE ================= */
ALTER TABLE payments
  MODIFY payment_mode ENUM('online','credit','rtgs','silver_settlement') NOT NULL;

/* ================= ORDERS PAYMENT MODE UPDATE ================= */
ALTER TABLE orders
  MODIFY payment_mode ENUM('online','credit','rtgs','silver_settlement') NOT NULL;

/* ================= PRODUCT IMAGES ================= */
CREATE TABLE product_images (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

/* ================= SUPPORT TICKETS ================= */
CREATE TABLE support_tickets (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
  priority ENUM('low','medium','high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ================= TICKET RESPONSES ================= */
CREATE TABLE ticket_responses (
  id CHAR(36) PRIMARY KEY,
  ticket_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  message TEXT NOT NULL,
  is_staff_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ================= ACTIVITY LOGS ================= */
CREATE TABLE activity_logs (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id CHAR(36),
  metadata JSON,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

/* ================= DEALER INVENTORY ================= */
CREATE TABLE dealer_inventory (
  id CHAR(36) PRIMARY KEY,
  dealer_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  size DECIMAL(4,2) NOT NULL,
  weight DECIMAL(10,3) NOT NULL,
  quantity INT DEFAULT 0,
  last_synced TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (dealer_id, product_id, size),
  FOREIGN KEY (dealer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

/* ================= DELIVERY TRACKING ================= */
CREATE TABLE delivery_tracking (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  status VARCHAR(100) NOT NULL,
  delivery_method ENUM('in_person','dealer_delivery'),
  delivered_by CHAR(36),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (delivered_by) REFERENCES users(id)
);

/* ================= BANNERS ================= */
CREATE TABLE banners (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ================= INDEXES ================= */
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_ticket_responses_ticket ON ticket_responses(ticket_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX idx_dealer_inventory_dealer ON dealer_inventory(dealer_id);
CREATE INDEX idx_dealer_inventory_product ON dealer_inventory(product_id);
CREATE INDEX idx_delivery_tracking_order ON delivery_tracking(order_id);
CREATE INDEX idx_banners_active ON banners(is_active, start_date, end_date);

SET FOREIGN_KEY_CHECKS = 1;
