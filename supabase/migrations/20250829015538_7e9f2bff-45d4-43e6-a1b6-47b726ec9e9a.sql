-- Ensure retailers table has proper public access and add sample data
-- Update retailers RLS policy to ensure public access
DROP POLICY IF EXISTS "Retailers are viewable by everyone" ON retailers;

CREATE POLICY "Retailers are viewable by everyone"
ON retailers FOR SELECT
USING (true);

-- Ensure we have at least one retailer for testing
INSERT INTO retailers (id, name, base_url, affiliate_id, commission_rate, supports_api, min_order_for_delivery, delivery_fee_cents)
VALUES 
  ('total-wine', 'Total Wine & More', 'https://www.totalwine.com', 'barbook_affiliate', 0.05, false, 5000, 999)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_url = EXCLUDED.base_url,
  affiliate_id = EXCLUDED.affiliate_id,
  commission_rate = EXCLUDED.commission_rate,
  supports_api = EXCLUDED.supports_api,
  min_order_for_delivery = EXCLUDED.min_order_for_delivery,
  delivery_fee_cents = EXCLUDED.delivery_fee_cents,
  updated_at = now();

-- Add a few more sample retailers for better testing
INSERT INTO retailers (id, name, base_url, affiliate_id, commission_rate, supports_api, min_order_for_delivery, delivery_fee_cents)
VALUES 
  ('wine-com', 'Wine.com', 'https://www.wine.com', 'barbook_wine', 0.06, false, 5900, 1299),
  ('drizly', 'Drizly', 'https://drizly.com', 'barbook_drizly', 0.08, true, 3000, 199)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  base_url = EXCLUDED.base_url,
  affiliate_id = EXCLUDED.affiliate_id,
  commission_rate = EXCLUDED.commission_rate,
  supports_api = EXCLUDED.supports_api,
  min_order_for_delivery = EXCLUDED.min_order_for_delivery,
  delivery_fee_cents = EXCLUDED.delivery_fee_cents,
  updated_at = now();

-- Add some sample product mappings to make the cart work
INSERT INTO product_mappings (
  ingredient_id, retailer_id, product_id, product_name, product_url, 
  price_cents, size_ml, size_description, affiliate_url, in_stock, priority
) VALUES 
  ('gin', 'total-wine', 'bombay-sapphire-750ml', 'Bombay Sapphire Gin', 'https://www.totalwine.com/spirits/gin/bombay-sapphire', 
   2499, 750, '750ml', 'https://www.totalwine.com/spirits/gin/bombay-sapphire?ref=barbook_affiliate', true, 1),
  ('vodka', 'total-wine', 'grey-goose-750ml', 'Grey Goose Vodka', 'https://www.totalwine.com/spirits/vodka/grey-goose', 
   4999, 750, '750ml', 'https://www.totalwine.com/spirits/vodka/grey-goose?ref=barbook_affiliate', true, 1),
  ('whiskey', 'total-wine', 'jameson-750ml', 'Jameson Irish Whiskey', 'https://www.totalwine.com/spirits/whiskey/jameson', 
   2999, 750, '750ml', 'https://www.totalwine.com/spirits/whiskey/jameson?ref=barbook_affiliate', true, 1),
  ('rum', 'total-wine', 'bacardi-white-750ml', 'Bacardi Superior White Rum', 'https://www.totalwine.com/spirits/rum/bacardi-superior', 
   1999, 750, '750ml', 'https://www.totalwine.com/spirits/rum/bacardi-superior?ref=barbook_affiliate', true, 1),
  ('tequila', 'total-wine', 'patron-silver-750ml', 'Patrón Silver Tequila', 'https://www.totalwine.com/spirits/tequila/patron-silver', 
   4999, 750, '750ml', 'https://www.totalwine.com/spirits/tequila/patron-silver?ref=barbook_affiliate', true, 1)
ON CONFLICT DO NOTHING;