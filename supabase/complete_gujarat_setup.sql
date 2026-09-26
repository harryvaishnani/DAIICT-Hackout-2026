-- ==============================================================================
-- PREDICTIVE MAINTENANCE PLATFORM (GUJARAT STATE, INDIA)
-- COMPLETE SUPABASE POSTGRESQL MIGRATION & SEED SCRIPT
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Navigate to "SQL Editor" -> "New query"
-- 3. Paste this entire file and click "Run" (or press Ctrl+Enter / Cmd+Enter)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. DDL: Create Tables (assets, telemetry_logs, work_orders)
-- ------------------------------------------------------------------------------

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

-- Optional Work Orders / Maintenance Kanban Table with 24h retention
CREATE TABLE IF NOT EXISTS public.work_orders (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MODERATE', 'LOW')),
    status TEXT NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'RESOLVED')),
    assigned_tech TEXT,
    description TEXT,
    recommended_action TEXT,
    parts_used JSONB DEFAULT '[]'::jsonb,
    labor_hours NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 2. Indexes for High-Performance Queries & Time-Series Aggregations
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_telemetry_asset_id_ts ON public.telemetry_logs(asset_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON public.work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_resolved_at ON public.work_orders(resolved_at) WHERE status = 'RESOLVED';

-- ------------------------------------------------------------------------------
-- 3. Enable Row Level Security (RLS) & Policies
-- ------------------------------------------------------------------------------

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Allow public read access on telemetry_logs" ON public.telemetry_logs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on work_orders" ON public.work_orders FOR SELECT USING (true);

-- Allow public insert/update for dashboard operations
CREATE POLICY "Allow public insert on assets" ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on assets" ON public.assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on assets" ON public.assets FOR DELETE USING (true);

CREATE POLICY "Allow public insert on telemetry_logs" ON public.telemetry_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on telemetry_logs" ON public.telemetry_logs FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert on work_orders" ON public.work_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on work_orders" ON public.work_orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on work_orders" ON public.work_orders FOR DELETE USING (true);

-- ------------------------------------------------------------------------------
-- 4. Enable Supabase Realtime Publication
-- ------------------------------------------------------------------------------

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

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'work_orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.work_orders;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. 24-Hour Automatic Purge Function & Query for Resolved Work Orders
-- ------------------------------------------------------------------------------

-- Function to permanently delete work orders that have been resolved for >= 24 hours
CREATE OR REPLACE FUNCTION public.purge_expired_resolved_work_orders()
RETURNS integer AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.work_orders
  WHERE status = 'RESOLVED'
    AND resolved_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 6. DML: Seed Authentic Gujarat Renewable Assets & Realtime Telemetry
-- ------------------------------------------------------------------------------

-- Clean tables before fresh seed
TRUNCATE TABLE public.telemetry_logs CASCADE;
TRUNCATE TABLE public.work_orders CASCADE;
DELETE FROM public.assets;

-- Insert 20 Major Gujarat Renewable Energy Assets
INSERT INTO public.assets (id, name, type, latitude, longitude, health_score, status, est_daily_loss, recommended_action, updated_at) VALUES
-- 10 Gujarat Wind Turbines (Kutch, Saurashtra & Arabian Sea Coast)
('TURBINE-001', 'Kutch Khavda Wind Unit 1', 'Wind', 23.8512, 69.7541, 98, 'HEALTHY', 0.00, 'Routine blade inspection in 45 days. Pitch bearing lubrication nominal.', NOW()),
('TURBINE-002', 'Jakhau Coastal Wind Turbine 2', 'Wind', 23.2340, 68.6920, 95, 'HEALTHY', 0.00, 'Optimal aerodynamic balance. Nacelle yaw alignment healthy.', NOW()),
('TURBINE-003', 'Mahuva Bay Wind Generator 3', 'Wind', 21.0915, 71.7630, 91, 'HEALTHY', 0.00, 'Pitch control calibration scheduled on quarterly cycle.', NOW()),
('TURBINE-004', 'Dwarka Offshore Wind Turbine 4', 'Wind', 22.2442, 68.9685, 94, 'HEALTHY', 0.00, 'Main gearbox lubrication level adequate. Vibration within IEEE limits.', NOW()),
('TURBINE-005', 'Porbandar Marine Wind Unit 5', 'Wind', 21.6420, 69.6010, 88, 'HEALTHY', 0.00, 'Yaw gear drive test passed. Generator stator temperature steady at 62°C.', NOW()),
('TURBINE-006', 'Jafrabad Coastal Wind Turbine 6', 'Wind', 20.8710, 71.3640, 96, 'HEALTHY', 0.00, 'Blade harmonic dampeners nominal. Transformer insulation optimal.', NOW()),
('TURBINE-007', 'Jamnagar Wind Array Alpha 7', 'Wind', 22.4707, 70.0577, 89, 'HEALTHY', 0.00, 'Inverter grid synchronizer verified. Peak power efficiency 98.4%.', NOW()),
('TURBINE-008', 'Rajkot Wind Energy Station 8', 'Wind', 22.3039, 70.8022, 93, 'HEALTHY', 0.00, 'Hydraulic disc brake pressure at 185 bar. Systems optimal.', NOW()),
('TURBINE-009', 'Mundra Port Wind Generator 9', 'Wind', 22.8385, 69.7042, 91, 'HEALTHY', 0.00, 'Nacelle ultrasonic anemometer calibrated with SCADA substation.', NOW()),
('TURBINE-010', 'Mandvi Beach Wind Turbine 10', 'Wind', 22.8320, 69.3550, 97, 'HEALTHY', 0.00, 'Tower structural resonance nominal under high Arabian Sea gusts.', NOW()),

-- 10 Gujarat Mega Solar Installations (Charanka, Dholera, Khavda, Radhanpur, Surat, Bhavnagar)
('SOLAR-001', 'Charanka Solar Park Phase 1', 'Solar', 23.9042, 71.2025, 97, 'HEALTHY', 0.00, 'Central inverters operating at 99.1% MPPT efficiency. Dust layer minimal.', NOW()),
('SOLAR-002', 'Charanka Solar Park Phase 2', 'Solar', 23.9110, 71.2100, 96, 'HEALTHY', 0.00, 'Single-axis tracker tracking solar azimuth with < 0.2 deg error.', NOW()),
('SOLAR-003', 'Dholera Ultra Mega Solar Block A', 'Solar', 22.2470, 72.1930, 94, 'HEALTHY', 0.00, 'Bifacial panel rear-albedo irradiance gain optimal at +12.1%.', NOW()),
('SOLAR-004', 'Dholera Ultra Mega Solar Block B', 'Solar', 22.2530, 72.2010, 90, 'HEALTHY', 0.00, 'DC combiner box string voltages balanced within 0.4%.', NOW()),
('SOLAR-005', 'Radhanpur Solar Complex Unit 1', 'Solar', 23.8340, 71.6050, 95, 'HEALTHY', 0.00, 'Thermal UAV drone scan completed. Zero hotspot signatures.', NOW()),
('SOLAR-006', 'Khavda Hybrid Solar Array S1', 'Solar', 23.8620, 69.7680, 98, 'HEALTHY', 0.00, 'Automated robotic dry-cleaning cycle completed. Optimal glass reflectance.', NOW()),
('SOLAR-007', 'Khavda Hybrid Solar Array S2', 'Solar', 23.8690, 69.7750, 93, 'HEALTHY', 0.00, 'High-voltage step-up transformer dielectric fluid test normal.', NOW()),
('SOLAR-008', 'Surat Hazira Industrial Solar PV', 'Solar', 21.1120, 72.6580, 92, 'HEALTHY', 0.00, 'Anti-reflective coating clean. String level current monitoring nominal.', NOW()),
('SOLAR-009', 'Bhavnagar Coastal Solar Station', 'Solar', 21.7645, 72.1519, 96, 'HEALTHY', 0.00, 'Substation grounding resistance measured at 1.7 ohms. Well within CEIG spec.', NOW()),
('SOLAR-010', 'Surendranagar Solar Farm Alpha', 'Solar', 22.7280, 71.6370, 94, 'HEALTHY', 0.00, 'Grid tie synchronized at 50.02 Hz. Active power factor 0.99.', NOW()),

-- Compatible Aliases for WT-01..WT-06 and SP-01..SP-06
('WT-01', 'Khavda Wind Turbine Unit 1 (WT-01)', 'Wind', 23.8512, 69.7541, 98, 'HEALTHY', 0.00, 'All mechanical components nominal. Rotor balance optimal.', NOW()),
('WT-02', 'Jakhau Coastal Turbine Unit 2 (WT-02)', 'Wind', 23.2340, 68.6920, 95, 'HEALTHY', 0.00, 'Minor harmonics detected on secondary drive; well within tolerance.', NOW()),
('WT-03', 'Mahuva Bay Wind Generator 3 (WT-03)', 'Wind', 21.0915, 71.7630, 91, 'HEALTHY', 0.00, 'Yaw control calibration verified. Pitch actuators operating nominal.', NOW()),
('WT-04', 'Dwarka Offshore Wind Turbine 4 (WT-04)', 'Wind', 22.2442, 68.9685, 42, 'CRITICAL', 1840.00, 'Vibration spike (4.8 mm/s) on inner-ring bearing. Immediate service required.', NOW()),
('WT-05', 'Jafrabad Marine Turbine 5 (WT-05)', 'Wind', 20.8710, 71.3640, 96, 'HEALTHY', 0.00, 'Pitch bearing grease purge normal. Generator stator temp at 59°C.', NOW()),
('WT-06', 'Mandvi Beach Wind Generator 6 (WT-06)', 'Wind', 22.8320, 69.3550, 97, 'HEALTHY', 0.00, 'Nacelle anemometer synchronized with GUVNL regional dispatch.', NOW()),
('SP-01', 'Charanka Solar Array Unit 1 (SP-01)', 'Solar', 23.9042, 71.2025, 97, 'HEALTHY', 0.00, 'Inverter DC-to-AC conversion efficiency at 99.2%. Surface clean.', NOW()),
('SP-02', 'Charanka High-Yield Array 2 (SP-02)', 'Solar', 23.9110, 71.2100, 58, 'WARNING', 620.00, 'Heavy dust layer detected (45% soiling). Automated wash needed.', NOW()),
('SP-03', 'Dholera Ultra Mega Solar Block 1 (SP-03)', 'Solar', 22.2470, 72.1930, 94, 'HEALTHY', 0.00, 'Single-axis tracker tracking solar azimuth with < 0.2 deg error.', NOW()),
('SP-04', 'Dholera Ultra Mega Solar Block 2 (SP-04)', 'Solar', 22.2530, 72.2010, 90, 'HEALTHY', 0.00, 'String diode check passed. Inverter cabinet ventilation optimal.', NOW()),
('SP-05', 'Radhanpur Solar Complex Unit 5 (SP-05)', 'Solar', 23.8340, 71.6050, 95, 'HEALTHY', 0.00, 'Uniform cell temperature distribution across all string circuits.', NOW()),
('SP-06', 'Khavda Solar PV Station 6 (SP-06)', 'Solar', 23.8620, 69.7680, 98, 'HEALTHY', 0.00, 'Highest generation efficiency in cluster. Zero hotspot thermal signatures.', NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    type = EXCLUDED.type,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    health_score = EXCLUDED.health_score,
    status = EXCLUDED.status,
    est_daily_loss = EXCLUDED.est_daily_loss,
    recommended_action = EXCLUDED.recommended_action,
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 7. Seed 24-Hour Historical Telemetry for all Gujarat Assets
-- ------------------------------------------------------------------------------

INSERT INTO public.telemetry_logs (asset_id, temperature, vibration, voltage, current_amps, soiling_index, power_output_mw, timestamp)
SELECT 
    a.id,
    CASE 
        WHEN a.id = 'WT-04' THEN ROUND((88.0 + (random() * 7.0))::numeric, 2)
        WHEN a.type = 'Wind' THEN ROUND((58.0 + (random() * 8.0))::numeric, 2)
        ELSE ROUND((42.0 + (random() * 10.0))::numeric, 2)
    END as temperature,
    CASE 
        WHEN a.id = 'WT-04' THEN ROUND((4.5 + (random() * 0.6))::numeric, 2)
        WHEN a.type = 'Wind' THEN ROUND((1.2 + (random() * 0.8))::numeric, 2)
        ELSE ROUND((0.1 + (random() * 0.1))::numeric, 2)
    END as vibration,
    ROUND((685.0 + (random() * 15.0))::numeric, 2) as voltage,
    CASE
        WHEN a.type = 'Wind' THEN ROUND((1200.0 + (random() * 150.0))::numeric, 2)
        ELSE ROUND((800.0 + (random() * 80.0))::numeric, 2)
    END as current_amps,
    CASE 
        WHEN a.id = 'SP-02' THEN ROUND((42.0 + (random() * 6.0))::numeric, 2)
        WHEN a.type = 'Solar' THEN ROUND((3.0 + (random() * 6.0))::numeric, 2)
        ELSE 0.0
    END as soiling_index,
    CASE 
        WHEN a.type = 'Wind' THEN ROUND((2.4 + (random() * 1.2))::numeric, 2)
        ELSE ROUND((1.9 + (random() * 1.1))::numeric, 2)
    END as power_output_mw,
    NOW() - (interval '1 hour' * s.step) as timestamp
FROM public.assets a
CROSS JOIN generate_series(0, 24) as s(step);

-- ------------------------------------------------------------------------------
-- 8. Seed Initial Work Orders (Demonstrating 24h Auto-Retention)
-- ------------------------------------------------------------------------------

INSERT INTO public.work_orders (id, asset_id, title, severity, status, assigned_tech, description, recommended_action, parts_used, labor_hours, created_at, resolved_at) VALUES
('TICK-101', 'WT-04', 'Dwarka Turbine Bearing Spalling Remediation', 'CRITICAL', 'TODO', NULL, 'Bearing vibration reached 4.8 mm/s with thermal escalation to 92.5°C.', 'Replace inner-ring bearing assembly with SKF-7200 cartridge.', '[]'::jsonb, 0.0, NOW() - INTERVAL '2 hours', NULL),
('TICK-102', 'SP-02', 'Charanka Solar De-dusting & Bypass Diode Scan', 'MODERATE', 'TODO', NULL, 'Soiling index at 45.0%. Power derate calculated at 4.2 MWh/day.', 'Deploy automated robotic crawler wash rig and test bypass diodes.', '[]'::jsonb, 0.0, NOW() - INTERVAL '1 hour', NULL),
('TICK-103', 'WT-01', 'Khavda Unit 1 Quarterly Pitch Actuator Servicing', 'LOW', 'IN_PROGRESS', 'Aarav Patel', 'Routine quarterly hydraulic pressure check and pitch calibration.', 'Torque check on pitch bearing fasteners.', '["Synthetic Hydraulic Fluid Mobil DTE 10"]'::jsonb, 1.5, NOW() - INTERVAL '4 hours', NULL),
-- Recently resolved ticket (within 24 hours - active in Kanban with countdown)
('TICK-104', 'SP-01', 'Charanka Inverter Filter Replacement', 'LOW', 'RESOLVED', 'Vikram Mehta', 'Cleaned central inverter cabinet intake filters and verified terminal torque.', 'Biannual inspection completed successfully.', '["HEPA Intake Filter C-4"]'::jsonb, 2.0, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;
