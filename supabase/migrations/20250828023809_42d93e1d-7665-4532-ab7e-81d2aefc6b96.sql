-- Create retailers table
CREATE TABLE public.retailers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  base_url TEXT NOT NULL,
  affiliate_id TEXT NOT NULL,
  commission_rate DECIMAL(4,2),
  supports_api BOOLEAN DEFAULT false,
  min_order_for_delivery INTEGER,
  delivery_fee_cents INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product mappings table
CREATE TABLE public.product_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id TEXT NOT NULL,
  retailer_id TEXT NOT NULL REFERENCES public.retailers(id),
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  price_cents INTEGER,
  size_ml INTEGER,
  size_description TEXT,
  affiliate_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shopping sessions table for attribution
CREATE TABLE public.shopping_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  retailer_id TEXT NOT NULL REFERENCES public.retailers(id),
  recipe_ids TEXT[],
  ingredient_ids TEXT[],
  estimated_total_cents INTEGER,
  affiliate_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create affiliate conversions table
CREATE TABLE public.affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopping_session_id UUID NOT NULL REFERENCES public.shopping_sessions(id),
  order_id TEXT,
  actual_total_cents INTEGER,
  commission_cents INTEGER,
  conversion_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Create policies for retailers (public read)
CREATE POLICY "Retailers are viewable by everyone" ON public.retailers
  FOR SELECT USING (true);

-- Create policies for product mappings (public read)
CREATE POLICY "Product mappings are viewable by everyone" ON public.product_mappings
  FOR SELECT USING (true);

-- Create policies for shopping sessions
CREATE POLICY "Users can view their own shopping sessions" ON public.shopping_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own shopping sessions" ON public.shopping_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own shopping sessions" ON public.shopping_sessions
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for affiliate conversions (admin only for now)
CREATE POLICY "Affiliate conversions viewable by admins" ON public.affiliate_conversions
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_product_mappings_ingredient_id ON public.product_mappings(ingredient_id);
CREATE INDEX idx_product_mappings_retailer_id ON public.product_mappings(retailer_id);
CREATE INDEX idx_shopping_sessions_user_id ON public.shopping_sessions(user_id);
CREATE INDEX idx_shopping_sessions_status ON public.shopping_sessions(status);

-- Insert initial retailer data for Total Wine (MVP)
INSERT INTO public.retailers (id, name, logo_url, base_url, affiliate_id, commission_rate, supports_api) VALUES
('total-wine', 'Total Wine & More', 'https://www.totalwine.com/favicon.ico', 'https://www.totalwine.com', 'YOUR_AFFILIATE_ID', 5.50, false);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_retailers_updated_at BEFORE UPDATE ON public.retailers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_mappings_updated_at BEFORE UPDATE ON public.product_mappings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();