/*
  # Complete demo user sync with all foreign keys

  1. Changes
    - Create proper user records matching auth.users IDs
    - Update ALL foreign key columns in all tables
    - Delete placeholder records
    - Update mobile numbers
    
  2. Tables updated
    - activity_logs, coupons, dealer_inventory, dealer_profiles
    - delivery_tracking, notifications, orders, pricing_config
    - reviews, support_tickets, ticket_responses
*/

DO $$
DECLARE
  dealer_auth_id uuid;
  admin_auth_id uuid;
BEGIN
  -- Get the auth user IDs
  SELECT id INTO dealer_auth_id FROM auth.users WHERE email = '8888888888@spchains.internal' LIMIT 1;
  SELECT id INTO admin_auth_id FROM auth.users WHERE email = '9999999999@spchains.internal' LIMIT 1;
  
  -- Insert correct dealer user (with temp mobile)
  IF dealer_auth_id IS NOT NULL THEN
    INSERT INTO users (id, mobile_number, role, is_active, created_at, updated_at)
    VALUES (dealer_auth_id, '8888888888_temp', 'dealer', true, now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert correct admin user (with temp mobile)
  IF admin_auth_id IS NOT NULL THEN
    INSERT INTO users (id, mobile_number, role, is_active, created_at, updated_at)
    VALUES (admin_auth_id, '9999999999_temp', 'admin', true, now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Update dealer user references
  UPDATE activity_logs SET user_id = dealer_auth_id WHERE user_id = '11111111-1111-1111-1111-111111111111';
  UPDATE dealer_inventory SET dealer_id = dealer_auth_id WHERE dealer_id = '11111111-1111-1111-1111-111111111111';
  UPDATE dealer_profiles SET user_id = dealer_auth_id WHERE user_id = '11111111-1111-1111-1111-111111111111';
  UPDATE orders SET dealer_id = dealer_auth_id WHERE dealer_id = '11111111-1111-1111-1111-111111111111';
  UPDATE support_tickets SET user_id = dealer_auth_id WHERE user_id = '11111111-1111-1111-1111-111111111111';
  UPDATE reviews SET dealer_id = dealer_auth_id WHERE dealer_id = '11111111-1111-1111-1111-111111111111';
  UPDATE ticket_responses SET user_id = dealer_auth_id WHERE user_id = '11111111-1111-1111-1111-111111111111';
  
  -- Update admin references (any placeholder admin ID)
  UPDATE activity_logs SET user_id = admin_auth_id WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE coupons SET created_by = admin_auth_id WHERE created_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE dealer_profiles SET approved_by = admin_auth_id WHERE approved_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE delivery_tracking SET delivered_by = admin_auth_id WHERE delivered_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE notifications SET created_by = admin_auth_id WHERE created_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE orders SET approved_by = admin_auth_id WHERE approved_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE pricing_config SET updated_by = admin_auth_id WHERE updated_by IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  UPDATE ticket_responses SET user_id = admin_auth_id WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222');
  
  -- Delete ALL placeholder users
  DELETE FROM users WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001'
  );
  
  -- Update mobile numbers to correct values
  UPDATE users SET mobile_number = '8888888888' WHERE id = dealer_auth_id;
  UPDATE users SET mobile_number = '9999999999' WHERE id = admin_auth_id;
END $$;
