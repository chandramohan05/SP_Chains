/*
  # Add Write Policies for Support Tickets

  ## Overview
  Add INSERT, UPDATE, DELETE policies for support_tickets and ticket_responses
  to allow demo users to create and manage support tickets.

  ## Changes
  - Add public INSERT policy for support_tickets
  - Add public UPDATE policy for support_tickets
  - Add public DELETE policy for support_tickets
  - Add public INSERT policy for ticket_responses
  - Add public UPDATE policy for ticket_responses
  - Add public DELETE policy for ticket_responses

  ## Security Note
  These are demo-only policies. Remove in production.
*/

-- Support Tickets - INSERT
DROP POLICY IF EXISTS "Public can insert support tickets" ON support_tickets;
CREATE POLICY "Public can insert support tickets"
  ON support_tickets FOR INSERT
  TO public
  WITH CHECK (true);

-- Support Tickets - UPDATE
DROP POLICY IF EXISTS "Public can update support tickets" ON support_tickets;
CREATE POLICY "Public can update support tickets"
  ON support_tickets FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Support Tickets - DELETE
DROP POLICY IF EXISTS "Public can delete support tickets" ON support_tickets;
CREATE POLICY "Public can delete support tickets"
  ON support_tickets FOR DELETE
  TO public
  USING (true);

-- Ticket Responses - INSERT
DROP POLICY IF EXISTS "Public can insert ticket responses" ON ticket_responses;
CREATE POLICY "Public can insert ticket responses"
  ON ticket_responses FOR INSERT
  TO public
  WITH CHECK (true);

-- Ticket Responses - UPDATE
DROP POLICY IF EXISTS "Public can update ticket responses" ON ticket_responses;
CREATE POLICY "Public can update ticket responses"
  ON ticket_responses FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Ticket Responses - DELETE
DROP POLICY IF EXISTS "Public can delete ticket responses" ON ticket_responses;
CREATE POLICY "Public can delete ticket responses"
  ON ticket_responses FOR DELETE
  TO public
  USING (true);