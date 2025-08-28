-- Insert sample product mappings for common cocktail ingredients
-- These are example mappings for Total Wine - in a real implementation, these would be scraped or maintained via API

-- Gin products
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('gin', 'total-wine', 'TW-GIN-001', 'Tanqueray London Dry Gin', 'https://www.totalwine.com/spirits/gin/london-dry-gin/tanqueray-london-dry-gin/p/1388750', 2499, 750, '750ml bottle', 'https://www.totalwine.com/spirits/gin/london-dry-gin/tanqueray-london-dry-gin/p/1388750?ref=YOUR_AFFILIATE_ID', 10),
('gin', 'total-wine', 'TW-GIN-002', 'Bombay Sapphire Gin', 'https://www.totalwine.com/spirits/gin/london-dry-gin/bombay-sapphire-gin/p/1389750', 2799, 750, '750ml bottle', 'https://www.totalwine.com/spirits/gin/london-dry-gin/bombay-sapphire-gin/p/1389750?ref=YOUR_AFFILIATE_ID', 20);

-- Vodka products  
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('vodka', 'total-wine', 'TW-VOD-001', 'Tito''s Handmade Vodka', 'https://www.totalwine.com/spirits/vodka/titos-handmade-vodka/p/115695750', 2199, 750, '750ml bottle', 'https://www.totalwine.com/spirits/vodka/titos-handmade-vodka/p/115695750?ref=YOUR_AFFILIATE_ID', 10),
('vodka', 'total-wine', 'TW-VOD-002', 'Grey Goose Vodka', 'https://www.totalwine.com/spirits/vodka/grey-goose-vodka/p/1334750', 4999, 750, '750ml bottle', 'https://www.totalwine.com/spirits/vodka/grey-goose-vodka/p/1334750?ref=YOUR_AFFILIATE_ID', 30);

-- Whiskey products
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('bourbon whiskey', 'total-wine', 'TW-BOU-001', 'Buffalo Trace Bourbon', 'https://www.totalwine.com/spirits/american-whiskey/bourbon/buffalo-trace-bourbon/p/18506750', 2599, 750, '750ml bottle', 'https://www.totalwine.com/spirits/american-whiskey/bourbon/buffalo-trace-bourbon/p/18506750?ref=YOUR_AFFILIATE_ID', 10),
('rye whiskey', 'total-wine', 'TW-RYE-001', 'Rittenhouse Rye Whiskey', 'https://www.totalwine.com/spirits/american-whiskey/rye-whiskey/rittenhouse-rye-whiskey/p/18507750', 2899, 750, '750ml bottle', 'https://www.totalwine.com/spirits/american-whiskey/rye-whiskey/rittenhouse-rye-whiskey/p/18507750?ref=YOUR_AFFILIATE_ID', 10);

-- Liqueurs
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('triple sec', 'total-wine', 'TW-TRI-001', 'Cointreau Triple Sec', 'https://www.totalwine.com/spirits/liqueur/orange/cointreau/p/1335375', 3999, 375, '375ml bottle', 'https://www.totalwine.com/spirits/liqueur/orange/cointreau/p/1335375?ref=YOUR_AFFILIATE_ID', 10),
('dry vermouth', 'total-wine', 'TW-VER-001', 'Dolin Dry Vermouth', 'https://www.totalwine.com/wine/white-wine/vermouth/dolin-dry-vermouth/p/111214375', 1199, 375, '375ml bottle', 'https://www.totalwine.com/wine/white-wine/vermouth/dolin-dry-vermouth/p/111214375?ref=YOUR_AFFILIATE_ID', 10),
('sweet vermouth', 'total-wine', 'TW-VER-002', 'Carpano Antica Formula', 'https://www.totalwine.com/wine/red-wine/vermouth/carpano-antica-formula/p/111215750', 2899, 750, '750ml bottle', 'https://www.totalwine.com/wine/red-wine/vermouth/carpano-antica-formula/p/111215750?ref=YOUR_AFFILIATE_ID', 10);

-- Bitters and modifiers
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('angostura bitters', 'total-wine', 'TW-BIT-001', 'Angostura Aromatic Bitters', 'https://www.totalwine.com/spirits/bitters/angostura-aromatic-bitters/p/111216118', 899, 118, '4oz bottle', 'https://www.totalwine.com/spirits/bitters/angostura-aromatic-bitters/p/111216118?ref=YOUR_AFFILIATE_ID', 10),
('simple syrup', 'total-wine', 'TW-SYR-001', 'Monin Simple Syrup', 'https://www.totalwine.com/accessories/bar-mixers/monin-simple-syrup/p/111217750', 899, 750, '750ml bottle', 'https://www.totalwine.com/accessories/bar-mixers/monin-simple-syrup/p/111217750?ref=YOUR_AFFILIATE_ID', 10);

-- Tequila
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('silver tequila', 'total-wine', 'TW-TEQ-001', 'Espolòn Tequila Blanco', 'https://www.totalwine.com/spirits/tequila/blanco-silver/espolon-tequila-blanco/p/119218750', 2199, 750, '750ml bottle', 'https://www.totalwine.com/spirits/tequila/blanco-silver/espolon-tequila-blanco/p/119218750?ref=YOUR_AFFILIATE_ID', 10),
('reposado tequila', 'total-wine', 'TW-TEQ-002', 'Espolòn Tequila Reposado', 'https://www.totalwine.com/spirits/tequila/reposado/espolon-tequila-reposado/p/119219750', 2399, 750, '750ml bottle', 'https://www.totalwine.com/spirits/tequila/reposado/espolon-tequila-reposado/p/119219750?ref=YOUR_AFFILIATE_ID', 20);

-- Rum  
INSERT INTO public.product_mappings (ingredient_id, retailer_id, product_id, product_name, product_url, price_cents, size_ml, size_description, affiliate_url, priority) VALUES
('white rum', 'total-wine', 'TW-RUM-001', 'Bacardi Superior White Rum', 'https://www.totalwine.com/spirits/rum/white-rum/bacardi-superior/p/1156750', 1799, 750, '750ml bottle', 'https://www.totalwine.com/spirits/rum/white-rum/bacardi-superior/p/1156750?ref=YOUR_AFFILIATE_ID', 10),
('dark rum', 'total-wine', 'TW-RUM-002', 'Goslings Black Seal Rum', 'https://www.totalwine.com/spirits/rum/dark-rum/goslings-black-seal-rum/p/1157750', 2199, 750, '750ml bottle', 'https://www.totalwine.com/spirits/rum/dark-rum/goslings-black-seal-rum/p/1157750?ref=YOUR_AFFILIATE_ID', 10);