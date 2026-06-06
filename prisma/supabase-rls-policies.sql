-- ============================================================
-- FASE 1: SQL untuk dijalankan di Supabase SQL Editor
-- Jalankan SETELAH prisma migrate selesai
-- ============================================================

-- ============================================================
-- 1. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- === ProductMetrics ===
ALTER TABLE "ProductMetrics" ENABLE ROW LEVEL SECURITY;

-- Semua orang bisa lihat metrics (public read)
CREATE POLICY "product_metrics_public_read" ON "ProductMetrics"
  FOR SELECT USING (true);

-- Hanya service role yang bisa insert/update (via API)
CREATE POLICY "product_metrics_service_write" ON "ProductMetrics"
  FOR ALL USING (auth.role() = 'service_role');

-- === Event ===
ALTER TABLE "Event" ENABLE ROW LEVEL SECURITY;

-- Event aktif bisa dilihat semua orang
CREATE POLICY "events_public_read" ON "Event"
  FOR SELECT USING ("isActive" = true);

-- Admin bisa CRUD semua event
CREATE POLICY "events_admin_all" ON "Event"
  FOR ALL USING (auth.role() = 'service_role');

-- === EventProduct ===
ALTER TABLE "EventProduct" ENABLE ROW LEVEL SECURITY;

-- Public read untuk event products
CREATE POLICY "event_products_public_read" ON "EventProduct"
  FOR SELECT USING (true);

-- Admin/service bisa manage
CREATE POLICY "event_products_admin_all" ON "EventProduct"
  FOR ALL USING (auth.role() = 'service_role');

-- === UserBehavior ===
ALTER TABLE "UserBehavior" ENABLE ROW LEVEL SECURITY;

-- User hanya bisa lihat behavior sendiri
CREATE POLICY "user_behavior_own_read" ON "UserBehavior"
  FOR SELECT USING (auth.uid()::text = "userId");

-- Service role bisa insert (dari API tracking)
CREATE POLICY "user_behavior_service_write" ON "UserBehavior"
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Service role bisa read semua (untuk AI engine)
CREATE POLICY "user_behavior_service_read" ON "UserBehavior"
  FOR SELECT USING (auth.role() = 'service_role');

-- === Product ===
-- Tambah policy untuk product berdasarkan status
CREATE POLICY "products_active_public_read" ON "Product"
  FOR SELECT USING ("status" = 'active');

-- Seller bisa manage produk sendiri
CREATE POLICY "products_seller_manage" ON "Product"
  FOR ALL USING (
    auth.role() = 'service_role' 
    OR "supplierId" IN (
      SELECT id FROM "Supplier" WHERE "userId" = auth.uid()::text
    )
  );

-- ============================================================
-- 2. INDEXES TAMBAHAN UNTUK PERFORMA QUERY
-- ============================================================

-- Index untuk query homepage ranking
CREATE INDEX IF NOT EXISTS idx_product_metrics_score 
  ON "ProductMetrics" (views DESC, purchases DESC, "conversionRate" DESC);

-- Index untuk event yang sedang aktif berdasarkan waktu
CREATE INDEX IF NOT EXISTS idx_event_active_time 
  ON "Event" ("isActive", "startTime", "endTime") 
  WHERE "isActive" = true;

-- Index untuk user behavior recent (30 hari terakhir)
CREATE INDEX IF NOT EXISTS idx_user_behavior_recent 
  ON "UserBehavior" ("userId", timestamp DESC);

-- Index untuk product status + created (untuk sorting newest active)
CREATE INDEX IF NOT EXISTS idx_product_active_new 
  ON "Product" (status, "createdAt" DESC) 
  WHERE status = 'active';

-- ============================================================
-- 3. DATABASE FUNCTIONS (untuk auto-update metrics)
-- ============================================================

-- Function: Auto-update conversion rate saat metrics berubah
CREATE OR REPLACE FUNCTION update_conversion_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clicks > 0 THEN
    NEW."conversionRate" = ROUND(NEW.purchases::numeric / NEW.clicks::numeric, 4);
  ELSE
    NEW."conversionRate" = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-calc conversion rate
DROP TRIGGER IF EXISTS trg_update_conversion_rate ON "ProductMetrics";
CREATE TRIGGER trg_update_conversion_rate
  BEFORE UPDATE ON "ProductMetrics"
  FOR EACH ROW
  EXECUTE FUNCTION update_conversion_rate();

-- Function: Auto-create ProductMetrics when Product is created
CREATE OR REPLACE FUNCTION auto_create_product_metrics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "ProductMetrics" (id, "productId", views, clicks, purchases, "conversionRate", "avgRating", "totalRevenue", "lastUpdated")
  VALUES (
    'pm_' || substr(md5(random()::text), 1, 24),
    NEW.id,
    0, 0, 0, 0, 0, 0, NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create metrics for new products
DROP TRIGGER IF EXISTS trg_auto_create_metrics ON "Product";
CREATE TRIGGER trg_auto_create_metrics
  AFTER INSERT ON "Product"
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_product_metrics();

-- ============================================================
-- 4. CLEANUP: Buat metrics untuk produk yang sudah ada
-- ============================================================
INSERT INTO "ProductMetrics" (id, "productId", views, clicks, purchases, "conversionRate", "avgRating", "totalRevenue", "lastUpdated")
SELECT 
  'pm_' || substr(md5(random()::text), 1, 24),
  p.id,
  FLOOR(RANDOM() * 500 + 10)::int,  -- Mock views
  FLOOR(RANDOM() * 100 + 5)::int,    -- Mock clicks
  FLOOR(RANDOM() * 50)::int,         -- Mock purchases
  0,
  ROUND((RANDOM() * 2 + 3)::numeric, 1), -- Mock rating 3.0-5.0
  0,
  NOW()
FROM "Product" p
WHERE NOT EXISTS (
  SELECT 1 FROM "ProductMetrics" pm WHERE pm."productId" = p.id
);

-- Update conversion rates for seeded data
UPDATE "ProductMetrics" 
SET "conversionRate" = CASE 
  WHEN clicks > 0 THEN ROUND(purchases::numeric / clicks::numeric, 4)
  ELSE 0 
END;

-- ============================================================
-- SELESAI! Jalankan di Supabase SQL Editor
-- ============================================================
