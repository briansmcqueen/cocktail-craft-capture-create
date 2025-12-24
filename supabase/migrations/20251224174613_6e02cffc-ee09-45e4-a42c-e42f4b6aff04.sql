-- Restrict product_mappings to authenticated users only
-- This protects affiliate URLs, commission rates, and pricing strategies from public access

DROP POLICY IF EXISTS "Product mappings are viewable by everyone" ON product_mappings;

CREATE POLICY "Authenticated users can view products"
ON product_mappings FOR SELECT TO authenticated
USING (true);