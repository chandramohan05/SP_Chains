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
  payment_mode: 'online' | 'credit';
  coupon_code?: string;
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
