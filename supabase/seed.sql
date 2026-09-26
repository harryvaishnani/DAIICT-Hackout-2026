-- ==============================================================================
-- PREDICTIVE MAINTENANCE FOR SOLAR & WIND ASSETS (GUJARAT STATE, INDIA)
-- Database Seed Data (20 Real Gujarat Renewable Assets & 24h Baseline Telemetry)
-- ==============================================================================

-- Clear existing data if resetting
TRUNCATE TABLE public.telemetry_logs CASCADE;
DELETE FROM public.assets;

-- Insert 20 Gujarat Renewable Assets (10 Wind Turbines, 10 Solar Farms)
INSERT INTO public.assets (id, name, type, latitude, longitude, health_score, status, est_daily_loss, recommended_action, updated_at) VALUES
-- 10 Wind Turbines across Kutch, Saurashtra & Coastal Gujarat
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

-- 10 Mega Solar Installations across Charanka, Dholera, Khavda & Gujarat Corridors
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

-- Also insert WT-01 to WT-06 and SP-01 to SP-06 aliases for simple fleet compatibility
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

-- Seed baseline 24-hour historical telemetry for all Gujarat assets
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
