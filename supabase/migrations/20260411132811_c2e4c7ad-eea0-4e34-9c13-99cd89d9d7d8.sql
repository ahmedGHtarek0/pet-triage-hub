
-- Add quantity type fields to products
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS quantity_type text NOT NULL DEFAULT 'unit',
  ADD COLUMN IF NOT EXISTS price_per_kg numeric DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS weight_options text[] DEFAULT '{}';

-- Add order details fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS weight_option text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_screenshot_url text DEFAULT NULL;

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public upload to payment-screenshots
CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow public read of payment screenshots
CREATE POLICY "Anyone can view payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-screenshots');
