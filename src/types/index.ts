export interface User {
  id: string;
  mobile_number: string;
  role: 'dealer' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DealerProfile {
  id: string;
  user_id: string;
  business_name: string;
  gst_number: string;
  pan_number: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  credit_limit: number;
  credit_used: number;
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  erp_product_id?: string;
  name: string;
  category: string;
  base_weight: number;
  available_sizes: string[];
  stock_quantity: number;
  making_charges: number;
  is_active: boolean;
  design_no?: string;
  variant?: string;
  weight_per_inch: number;
  wastage_percent: number;
  purity_percent: number;
  baby_or_big_size?: 'baby' | 'big';
  size_range_start: number;
  size_range_end: number;
  size_increment: number;
  created_at: string;
  updated_at: string;
}

export interface PricingConfig {
  id: string;
  mcx_rate: number;
  premium_percentage: number;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  dealer_id: string;
  status: 'placed' | 'approved' | 'rejected' | 'completed';
  gross_weight: number;
  pure_weight: number;
  wastage: number;
  making_charges: number;
  subtotal: number;
  discount_amount: number;
  final_amount: number;
  payment_mode: 'online' | 'credit' | 'rtgs' | 'silver_settlement';
  coupon_code?: string;
  pure_payable: number;
  delivery_method?: 'in_person' | 'dealer_delivery';
  approved_by?: string;
  approved_at?: string;
  rejected_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  size: string;
  quantity: number;
  unit_weight: number;
  total_weight: number;
  rate: number;
  making_charges: number;
  line_total: number;
  created_at: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_quantity: number;
  applicable_payment_modes: string[];
  expiry_date: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'offer' | 'alert' | 'gst_update';
  target_audience: 'all' | 'dealers' | 'specific';
  created_by: string;
  published_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  dealer_id: string;
  order_id: string;
  rating: number;
  review_text?: string;
  is_synced_to_erp: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface TicketResponse {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_response: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  duration_seconds: number;
  created_at: string;
}

export interface DealerInventory {
  id: string;
  dealer_id: string;
  product_id: string;
  size: number;
  weight: number;
  quantity: number;
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTracking {
  id: string;
  order_id: string;
  status: string;
  delivery_method?: 'in_person' | 'dealer_delivery';
  delivered_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}
