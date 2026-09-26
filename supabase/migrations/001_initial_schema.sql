-- ==============================================================================
-- PREDICATIVE MAINTENANCE FOR SOLAR & WIND ASSETS
-- Database Schema Migration (Supabase PostgreSQL)
-- ==============================================================================

-- 1. Create assets table
CREATE TABLE IF NOT EXISTS public.assets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Wind', 'Solar')),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    status TEXT NOT NULL CHECK (status IN ('HEALTHY', 'WARNING', 'CRITICAL', 'MAINTENANCE_DISPATCHED')),
    est_daily_loss NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    recommended_action TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create telemetry_logs table
CREATE TABLE IF NOT EXISTS public.telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id TEXT NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    temperature DOUBLE PRECISION NOT NULL, -- °C
    vibration DOUBLE PRECISION NOT NULL,   -- mm/s
    voltage DOUBLE PRECISION NOT NULL,     -- V
    current_amps DOUBLE PRECISION NOT NULL,-- A
    soiling_index DOUBLE PRECISION NOT NULL DEFAULT 0.0, -- % (especially for solar)
    power_output_mw DOUBLE PRECISION NOT NULL, -- MW
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for fast real-time queries and time-series aggregation
CREATE INDEX IF NOT EXISTS idx_telemetry_asset_id_ts ON public.telemetry_logs(asset_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);

-- 4. Enable Row Level Security (RLS) - Public Read & Authenticated/Anon Update for Hackathon MVP
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on assets" 
ON public.assets FOR SELECT 
USING (true);

CREATE POLICY "Allow public update access on assets" 
ON public.assets FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public insert access on assets" 
ON public.assets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access on telemetry_logs" 
ON public.telemetry_logs FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access on telemetry_logs" 
ON public.telemetry_logs FOR INSERT 
WITH CHECK (true);

-- 5. Enable Realtime Publications
-- Make sure the Supabase Realtime publication streams changes from these tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'assets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.assets;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'telemetry_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry_logs;
  END IF;
END $$;
