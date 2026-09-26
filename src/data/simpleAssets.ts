import type { Firm, UserProfile, KanbanTicket, AlertRule, AuditLogEntry, TwinComponent } from '../types';

export type AssetType = 'Wind' | 'Solar';
export type RiskLevel = 'HIGH' | 'MODERATE' | 'NORMAL' | 'SERVICED';

export interface SensorValues {
  vibration: number;    // mm/s (Normal: < 2.5, Moderate: 2.5-4.0, High: > 4.0)
  temperature: number;  // °C (Normal: < 70, Moderate: 70-85, High: > 85)
  current: number;      // Amps (Wind: ~1200A, Solar: ~800A)
  soiling: number;      // % (Normal: < 15, Moderate: 15-35, High: > 35)
}

export interface SensorThreshold {
  normal: number;
  warning: number;
  critical: number;
}

export interface SensorThresholds {
  vibration: SensorThreshold;
  temperature: SensorThreshold;
  current: SensorThreshold;
  soiling: SensorThreshold;
}

export const WIND_THRESHOLDS: SensorThresholds = {
  vibration:   { normal: 2.5,  warning: 3.5,  critical: 4.5  },
  temperature: { normal: 70,   warning: 80,   critical: 90   },
  current:     { normal: 900,  warning: 800,  critical: 700  },
  soiling:     { normal: 5,    warning: 10,   critical: 15   },
};

export const SOLAR_THRESHOLDS: SensorThresholds = {
  vibration:   { normal: 0.5,  warning: 1.0,  critical: 1.5  },
  temperature: { normal: 50,   warning: 65,   critical: 75   },
  current:     { normal: 700,  warning: 600,  critical: 500  },
  soiling:     { normal: 15,   warning: 30,   critical: 40   },
};

export interface ForecastPoint {
  day: string;
  actual?: number;
  predicted: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface SimpleAsset {
  id: string;
  firmId: string;
  name: string;
  type: AssetType;
  modelNumber?: string;
  firmwareVersion?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  risk: RiskLevel;
  sensors: SensorValues;
  thresholds: SensorThresholds;
  energyLossMWh: number;
  revenueLossUSD: number;
  revenueLossINR?: number;
  energyAtRiskMWh?: number;
  estimatedRepairINR?: number;
  failureProbability?: number;
  confidenceScore?: number;
  rulHours?: number;
  rulDays?: number;
  expectedFailureWindow?: string;
  diagnosis: string;
  recommendedAction: string;
  requiredTools: string[];
  estimatedRepairHours: number;
  scheduledTechnician?: string;
  explainableEvidence?: {
    metric: string;
    change: string;
    weight: number;
    isPrimary?: boolean;
    isSecondary?: boolean;
  }[];
  modelAgreement?: {
    agreedCount: number;
    totalModels: number;
    models: string[];
  };
  components?: TwinComponent[];
  history: {
    day: string;
    primarySensorValue: number;
  }[];
  forecast?: ForecastPoint[];
}


// ──────────────────────────────────────────────
// Predefined Multi-Tenant Organizations (Gujarat, India)
// ──────────────────────────────────────────────
export const DEFAULT_FIRMS: Firm[] = [
  {
    id: 'firm-apex',
    name: 'Gujarat Urja Vikas Nigam (GUVNL)',
    logoType: 'Hybrid',
    primaryColor: '#0284c7',
    region: 'Kutch & Saurashtra Renewable Grid, Gujarat',
    assetCount: 12,
  },
  {
    id: 'firm-helios',
    name: 'Torrent Power Green (Gujarat)',
    logoType: 'Solar',
    primaryColor: '#f59e0b',
    region: 'Charanka & Dholera Solar Corridor, Gujarat',
    assetCount: 6,
  },
];

// ──────────────────────────────────────────────
// Predefined User Profiles (RBAC - Indian Roles)
// ──────────────────────────────────────────────
export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-elena',
    name: 'Priya Sharma',
    email: 'priya.sharma@guvnl.gujarat.gov.in',
    role: 'EXECUTIVE',
    firmId: 'firm-apex',
    title: 'VP of Renewable Operations',
    avatarInitials: 'PS',
  },
  {
    id: 'user-marcus',
    name: 'Aarav Patel',
    email: 'aarav.patel@guvnl.gujarat.gov.in',
    role: 'TECHNICIAN',
    firmId: 'firm-apex',
    assignedZone: 'Kutch Wind Resource Corridor, Gujarat',
    title: 'Senior Field Operations Lead',
    avatarInitials: 'AP',
  },
  {
    id: 'user-sophia',
    name: 'Rajesh Dave',
    email: 'rajesh.dave@torrentpower.com',
    role: 'EXECUTIVE',
    firmId: 'firm-helios',
    title: 'Chief Operating Officer',
    avatarInitials: 'RD',
  },
];

// ──────────────────────────────────────────────
// WT-04 14-Day Predictive Forecast ("Crystal Ball")
// ──────────────────────────────────────────────
export const WT04_FORECAST: ForecastPoint[] = [
  { day: 'Day -6', actual: 2.1, predicted: 2.1, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: 'Day -4', actual: 2.8, predicted: 2.8, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: 'Day -2', actual: 3.6, predicted: 3.6, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: 'Today', actual: 4.8, predicted: 4.8, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: '+3d', predicted: 5.1, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: '+7d', predicted: 5.5, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: '+10d', predicted: 6.0, warningThreshold: 3.5, criticalThreshold: 4.5 },
  { day: '+14d (Catastrophic)', predicted: 6.8, warningThreshold: 3.5, criticalThreshold: 4.5 },
];

export const SP02_FORECAST: ForecastPoint[] = [
  { day: 'Day -6', actual: 12.0, predicted: 12.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: 'Day -4', actual: 20.0, predicted: 20.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: 'Day -2', actual: 32.0, predicted: 32.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: 'Today', actual: 45.0, predicted: 45.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: '+3d', predicted: 52.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: '+7d', predicted: 58.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
  { day: '+14d', predicted: 65.0, warningThreshold: 30.0, criticalThreshold: 40.0 },
];

// Helper to generate healthy forecasts
export function generateHealthyForecast(currentVal: number, warn: number, crit: number): ForecastPoint[] {
  return [
    { day: 'Day -6', actual: currentVal * 0.95, predicted: currentVal * 0.95, warningThreshold: warn, criticalThreshold: crit },
    { day: 'Day -4', actual: currentVal * 0.98, predicted: currentVal * 0.98, warningThreshold: warn, criticalThreshold: crit },
    { day: 'Day -2', actual: currentVal * 1.02, predicted: currentVal * 1.02, warningThreshold: warn, criticalThreshold: crit },
    { day: 'Today', actual: currentVal, predicted: currentVal, warningThreshold: warn, criticalThreshold: crit },
    { day: '+3d', predicted: currentVal * 1.03, warningThreshold: warn, criticalThreshold: crit },
    { day: '+7d', predicted: currentVal * 1.05, warningThreshold: warn, criticalThreshold: crit },
    { day: '+14d', predicted: currentVal * 1.06, warningThreshold: warn, criticalThreshold: crit },
  ];
}

// ──────────────────────────────────────────────
// What-If Failure Progression Timeline Stages
// ──────────────────────────────────────────────
export interface ProgressionStage {
  timeOffset: string;
  condition: string;
  healthPct: number;
  vibrationMmS?: number;
  tempC: number;
  soilingPct?: number;
  criticalEvent?: string;
  isTriggerPoint?: boolean;
}

export const WT04_FAILURE_STAGES: ProgressionStage[] = [
  { timeOffset: 'NOW', condition: 'Micro-spalling in inner race', healthPct: 28, vibrationMmS: 4.8, tempC: 92.5, criticalEvent: 'Early warning detected' },
  { timeOffset: '+6 HOURS', condition: 'Spalling accelerates, race pitting', healthPct: 19, vibrationMmS: 5.6, tempC: 98.2, criticalEvent: 'Bearing cage fatigue' },
  { timeOffset: '+12 HOURS', condition: 'Thermal runaway & lubrication breakdown', healthPct: 11, vibrationMmS: 6.9, tempC: 104.5, isTriggerPoint: true, criticalEvent: 'Temperature > 100°C' },
  { timeOffset: '+18 HOURS', condition: 'Vibration trip & forced emergency stop', healthPct: 5, vibrationMmS: 8.2, tempC: 112.0, criticalEvent: 'Grid trip / forced shutdown' },
  { timeOffset: '+3.4 DAYS', condition: 'Catastrophic bearing seizure & shaft scoring', healthPct: 0, vibrationMmS: 12.5, tempC: 130.0, criticalEvent: 'Major mechanical destruction' },
];

export const SP02_FAILURE_STAGES: ProgressionStage[] = [
  { timeOffset: 'NOW', condition: 'Desert dust particulate accumulation', healthPct: 55, tempC: 68.0, soilingPct: 45.0, criticalEvent: 'Yield derated by 28%' },
  { timeOffset: '+24 HOURS', condition: 'Hotspots forming on lower bypass strings', healthPct: 44, tempC: 76.5, soilingPct: 52.0, criticalEvent: 'Thermal hotspots spreading' },
  { timeOffset: '+48 HOURS', condition: 'Bypass diode reverse-bias thermal stress', healthPct: 32, tempC: 84.0, soilingPct: 59.0, isTriggerPoint: true, criticalEvent: 'String 4 diode failure' },
  { timeOffset: '+3 DAYS', condition: 'Severe module delamination & permanent degradation', healthPct: 18, tempC: 92.0, soilingPct: 65.0, criticalEvent: 'String lockout' },
  { timeOffset: '+7 DAYS', condition: 'Inverter DC ground fault & multi-string failure', healthPct: 8, tempC: 98.0, soilingPct: 72.0, criticalEvent: 'Sub-array shutdown' },
];

// ──────────────────────────────────────────────
// AI Maintenance Decision & Logistics Optimization
// ──────────────────────────────────────────────
export const OPTIMAL_MAINTENANCE_WINDOW = {
  recommendedSlot: 'Today 14:00 – 18:30 IST',
  expectedSavingsINR: 184000,
  expectedSavingsUSD: 2240,
  reasons: [
    'Low wind velocity forecast (14–18 km/h): Generation curtailment loss is minimized to <₹18K.',
    'Senior Field Lead Aarav Patel is on-site and clear of competing dispatch.',
    'Spare SKF bearing cartridge is in transit from Ahmedabad Depot with 2h 15m ETA.',
    'Thermal degradation is at 92.5°C — repair window prevents irreversible shaft scoring at >100°C.',
    'Avoids high-tariff peak evening export window (19:00 – 23:00 IST).'
  ]
};

export const WT04_PARTS_READINESS = [
  { id: 'PART-1', name: 'SKF Main Bearing Cartridge 7200', required: 1, available: 1, location: 'Ahmedabad Central Depot', eta: '2h 15m (In Transit)', status: 'DEPOT_TRANSIT' as const },
  { id: 'PART-2', name: 'Synthetic Gear Oil Mobil SHC 634 (ISO VG 320)', required: 4, available: 18, location: 'Dwarka Field Store', eta: 'Immediate (On Site)', status: 'IN_STOCK' as const },
  { id: 'PART-3', name: 'Certified Rigging & Mechanical Technicians', required: 2, available: 3, location: 'Dwarka Regional Hub', eta: '1h 45m', status: 'IN_STOCK' as const },
  { id: 'PART-4', name: 'Hydraulic Torque Multiplier (10,000 Nm)', required: 1, available: 2, location: 'Dwarka Field Tooling', eta: 'Immediate (On Site)', status: 'IN_STOCK' as const },
];

// ──────────────────────────────────────────────
// Digital Twin Component Models
// ──────────────────────────────────────────────
export function getWindTurbineTwinComponents(asset: SimpleAsset): TwinComponent[] {
  const isHighRisk = asset.id === 'WT-04' || asset.risk === 'HIGH';
  return [
    {
      id: 'main-bearing',
      name: 'Main Drive Bearing Cartridge',
      subsystem: 'MECHANICAL',
      status: isHighRisk ? 'CRITICAL' : 'HEALTHY',
      healthScore: isHighRisk ? 28 : 94,
      temperature: isHighRisk ? asset.sensors.temperature : 60.0,
      vibration: isHighRisk ? asset.sensors.vibration : 1.2,
      failureProbability: isHighRisk ? 87 : 8,
      confidence: 91,
      rulHours: isHighRisk ? 8.6 : 1420,
      diagnosis: isHighRisk
        ? 'INNER-RING SPALLING: High-frequency raceway flaking detected. Acoustic emission confirms micro-fractures.'
        : 'Hydrodynamic oil film nominal. Raceway vibration baseline optimal.',
      recommendedAction: isHighRisk
        ? 'Immediate cartridge swap. Drain and refill ISO VG 320 lubricant.'
        : 'Standard grease purge in 90 days.',
      specs: {
        'Manufacturer': 'SKF Heavy Duty 7200',
        'Max Radial Load': '1,450 kN',
        'Lubrication': 'Mobil SHC 634 Synthetic',
        'RPM Rating': '1,800 RPM',
      },
    },
    {
      id: 'gearbox',
      name: 'Planetary Gearbox Stage',
      subsystem: 'MECHANICAL',
      status: isHighRisk ? 'WARNING' : 'HEALTHY',
      healthScore: isHighRisk ? 68 : 92,
      temperature: isHighRisk ? 76.5 : 62.0,
      vibration: isHighRisk ? 2.8 : 1.3,
      failureProbability: isHighRisk ? 34 : 6,
      confidence: 89,
      rulHours: isHighRisk ? 120 : 2800,
      diagnosis: isHighRisk
        ? 'Secondary vibration resonance coupled from main bearing imbalance.'
        : 'Tooth contact pattern nominal. Gear backlash within 0.08mm tolerance.',
      recommendedAction: isHighRisk
        ? 'Inspect planetary sun gear during main bearing downtime.'
        : 'Next oil sampling in 6 months.',
      specs: {
        'Gear Ratio': '1:104.5',
        'Stages': '1 Planetary + 2 Helical',
        'Oil Temp Limit': '85.0°C',
      },
    },
    {
      id: 'generator',
      name: '3.3 MW Asynchronous Generator',
      subsystem: 'ELECTRICAL',
      status: 'HEALTHY',
      healthScore: 88,
      temperature: 66.0,
      current: asset.sensors.current,
      failureProbability: 14,
      confidence: 93,
      rulHours: 3400,
      diagnosis: 'Stator winding insulation resistance > 100 MΩ. Slip ring brush wear nominal.',
      recommendedAction: 'No immediate action required.',
      specs: {
        'Rated Voltage': '690 V AC',
        'Rated Current': '1,240 A',
        'Stator Temp Limit': '125°C',
      },
    },
    {
      id: 'hub-blades',
      name: 'Rotor Hub & Pitch Actuators',
      subsystem: 'MECHANICAL',
      status: 'HEALTHY',
      healthScore: 84,
      temperature: 42.0,
      failureProbability: 18,
      confidence: 86,
      rulHours: 1900,
      diagnosis: 'Electromechanical blade pitch synchronization within 0.2 degrees. Hydraulic pressure optimal.',
      recommendedAction: 'Inspect pitch cylinder seals in 45 days.',
      specs: {
        'Rotor Diameter': '144 meters',
        'Pitch Range': '-5° to +90° feather',
        'Swept Area': '16,286 m²',
      },
    },
    {
      id: 'nacelle-yaw',
      name: 'Nacelle & Yaw Drive System',
      subsystem: 'STRUCTURAL',
      status: 'HEALTHY',
      healthScore: 92,
      temperature: 38.0,
      failureProbability: 11,
      confidence: 90,
      rulHours: 4200,
      diagnosis: 'Wind vane tracking alignment accurate. Yaw brake calipers engaged at proper hydraulic hold.',
      recommendedAction: 'Verify yaw ring gear lubrication next quarter.',
      specs: {
        'Yaw Motors': '4x 5.5 kW Inverter Drives',
        'Brake System': 'Active Hydraulic Disc',
      },
    },
    {
      id: 'tower-foundation',
      name: 'Tubular Steel Tower & Foundation',
      subsystem: 'STRUCTURAL',
      status: 'HEALTHY',
      healthScore: 98,
      temperature: 32.0,
      vibration: 0.3,
      failureProbability: 4,
      confidence: 96,
      rulHours: 8500,
      diagnosis: 'Tower natural frequency oscillation nominal. Anchor bolt preload torque verified.',
      recommendedAction: 'Annual ultrasonic bolt scan.',
      specs: {
        'Hub Height': '120 meters',
        'Foundation Type': 'Reinforced Gravity Base',
      },
    },
  ];
}

export function getSolarArrayTwinComponents(asset: SimpleAsset): TwinComponent[] {
  const isHighRisk = asset.id === 'SP-02' || asset.risk === 'MODERATE' || asset.risk === 'HIGH';
  return [
    {
      id: 'pv-strings',
      name: 'Bifacial Photovoltaic String Array',
      subsystem: 'OPTICAL',
      status: isHighRisk ? 'WARNING' : 'HEALTHY',
      healthScore: isHighRisk ? 46 : 94,
      temperature: isHighRisk ? asset.sensors.temperature : 44.0,
      soiling: isHighRisk ? asset.sensors.soiling : 5.0,
      failureProbability: isHighRisk ? 64 : 9,
      confidence: 88,
      rulDays: isHighRisk ? 19 : 450,
      diagnosis: isHighRisk
        ? 'SURFACE SOILING DEGRADATION: Heavy Patan desert sand deposit derating MPPT string harvest by 28%.'
        : 'PV front and rear glass clean. Spectral transmission >98.2%.',
      recommendedAction: isHighRisk
        ? 'Deploy crawler wash bot. Clean strings 1 through 8.'
        : 'Routine drone thermography in 60 days.',
      specs: {
        'Cell Technology': 'Bifacial N-Type TOPCon 540W',
        'Strings Connected': '32 Strings in Parallel',
        'Open Circuit Voltage': '1,500 V DC',
      },
    },
    {
      id: 'central-inverter',
      name: '2.5 MW Central Inverter Station',
      subsystem: 'ELECTRICAL',
      status: isHighRisk ? 'WARNING' : 'HEALTHY',
      healthScore: isHighRisk ? 72 : 95,
      temperature: isHighRisk ? 62.0 : 46.0,
      current: asset.sensors.current,
      failureProbability: isHighRisk ? 42 : 8,
      confidence: 92,
      rulDays: isHighRisk ? 38 : 620,
      diagnosis: isHighRisk
        ? 'IGBT bridge thermal gradient elevated due to intake filter dust clogging.'
        : 'MPPT tracking efficiency at 99.1%. Harmonic distortion <2%.',
      recommendedAction: isHighRisk
        ? 'Vacuum and replace intake air filter mesh.'
        : 'Inspect DC disconnect contacts in 90 days.',
      specs: {
        'Rated Power': '2,500 kVA',
        'Cooling System': 'Forced Air + Heat Pipe',
        'Efficiency': '98.8%',
      },
    },
    {
      id: 'tracking-actuator',
      name: 'Single-Axis Solar Trackers',
      subsystem: 'MECHANICAL',
      status: 'HEALTHY',
      healthScore: 89,
      temperature: 39.0,
      failureProbability: 12,
      confidence: 87,
      rulDays: 320,
      diagnosis: 'Astronomical algorithm alignment tracking within ±0.5 degrees. Motor torque normal.',
      recommendedAction: 'Grease slew drive gear in 4 months.',
      specs: {
        'Drive Type': 'Slew Drive + Linear Actuator',
        'Tilt Range': '±55 degrees East-West',
      },
    },
    {
      id: 'dc-combiner',
      name: 'Smart DC Combiner & Diodes',
      subsystem: 'ELECTRICAL',
      status: isHighRisk ? 'WARNING' : 'HEALTHY',
      healthScore: isHighRisk ? 65 : 92,
      temperature: isHighRisk ? 54.0 : 42.0,
      failureProbability: isHighRisk ? 38 : 7,
      confidence: 85,
      rulDays: isHighRisk ? 28 : 500,
      diagnosis: isHighRisk
        ? 'String 4 bypass diode reverse leakage current slightly above nominal threshold.'
        : 'All string fuses and surge suppression cartridges intact.',
      recommendedAction: isHighRisk
        ? 'Test string 4 bypass diode forward voltage drop.'
        : 'Inspect lightning protection arresters.',
      specs: {
        'Input Channels': '16 DC Channels with Fuses',
        'Surge Protection': 'Type II 1500V DC SPD',
      },
    },
    {
      id: 'grid-transformer',
      name: '33kV Step-Up Grid Transformer',
      subsystem: 'ELECTRICAL',
      status: 'HEALTHY',
      healthScore: 96,
      temperature: 48.0,
      failureProbability: 5,
      confidence: 95,
      rulDays: 980,
      diagnosis: 'Dielectric mineral oil breakdown voltage > 65 kV. Winding temperature nominal.',
      recommendedAction: 'Annual dissolved gas analysis (DGA).',
      specs: {
        'Rating': '3,150 kVA',
        'Primary/Secondary': '0.69 kV / 33 kV',
      },
    },
  ];
}


// ──────────────────────────────────────────────
// Initial Fleet Assets (Gujarat, India)
// ──────────────────────────────────────────────
export const INITIAL_SIMPLE_ASSETS: SimpleAsset[] = [
  // Wind Turbines (GUVNL - Gujarat State)
  {
    id: 'WT-01',
    firmId: 'firm-apex',
    name: 'Khavda Wind Turbine Unit 1',
    type: 'Wind',
    modelNumber: 'Suzlon S144-3.15 MW',
    firmwareVersion: 'v4.18.2-prod',
    location: 'Khavda Renewable Energy Park, Kutch, Gujarat',
    coordinates: { lat: 23.8512, lng: 69.7541 },
    risk: 'NORMAL',
    sensors: {
      vibration: 1.2,
      temperature: 58.0,
      current: 1240,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    revenueLossINR: 21000,
    energyAtRiskMWh: 2.1,
    estimatedRepairINR: 12000,
    failureProbability: 12,
    confidenceScore: 94,
    rulDays: 9,
    expectedFailureWindow: 'In 9 Days (Pitch Actuator Service)',
    diagnosis: 'All mechanical components nominal. Rotor balance and gearbox oil pressure optimal.',
    recommendedAction: 'Standard routine inspection in 60 days.',
    requiredTools: ['Torque Wrench', 'Visual Inspection Kit'],
    estimatedRepairHours: 2,
    history: [
      { day: 'Mon', primarySensorValue: 1.1 },
      { day: 'Tue', primarySensorValue: 1.3 },
      { day: 'Wed', primarySensorValue: 1.2 },
      { day: 'Thu', primarySensorValue: 1.4 },
      { day: 'Fri', primarySensorValue: 1.2 },
      { day: 'Sat', primarySensorValue: 1.1 },
      { day: 'Sun', primarySensorValue: 1.2 },
    ],
    forecast: generateHealthyForecast(1.2, 3.5, 4.5),
  },
  {
    id: 'WT-02',
    firmId: 'firm-apex',
    name: 'Jakhau Coastal Turbine Unit 2',
    type: 'Wind',
    modelNumber: 'Suzlon S144-3.15 MW',
    firmwareVersion: 'v4.18.2-prod',
    location: 'Jakhau Wind Farm, Kutch, Gujarat',
    coordinates: { lat: 23.2340, lng: 68.6920 },
    risk: 'NORMAL',
    sensors: {
      vibration: 1.4,
      temperature: 61.5,
      current: 1215,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    failureProbability: 18,
    confidenceScore: 92,
    rulDays: 42,
    expectedFailureWindow: 'In 42 Days',
    diagnosis: 'Minor harmonics detected on secondary drive stage; well within design tolerances.',
    recommendedAction: 'Continue remote telemetry sampling at 10-second cadence.',
    requiredTools: ['Laser Alignment Tool'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 1.3 },
      { day: 'Tue', primarySensorValue: 1.5 },
      { day: 'Wed', primarySensorValue: 1.4 },
      { day: 'Thu', primarySensorValue: 1.6 },
      { day: 'Fri', primarySensorValue: 1.3 },
      { day: 'Sat', primarySensorValue: 1.4 },
      { day: 'Sun', primarySensorValue: 1.4 },
    ],
    forecast: generateHealthyForecast(1.4, 3.5, 4.5),
  },
  {
    id: 'WT-03',
    firmId: 'firm-apex',
    name: 'Mahuva Bay Wind Generator 3',
    type: 'Wind',
    modelNumber: 'Inox Wind DF 3.3 MW',
    firmwareVersion: 'v5.02.1-lts',
    location: 'Mahuva Coastal Grid, Bhavnagar, Gujarat',
    coordinates: { lat: 21.0915, lng: 71.7630 },
    risk: 'NORMAL',
    sensors: {
      vibration: 1.5,
      temperature: 64.0,
      current: 1190,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    failureProbability: 15,
    confidenceScore: 90,
    rulDays: 58,
    diagnosis: 'Yaw control calibration verified. Pitch actuators operating at peak efficiency.',
    recommendedAction: 'No maintenance action required.',
    requiredTools: ['Digital Multimeter'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 1.4 },
      { day: 'Tue', primarySensorValue: 1.5 },
      { day: 'Wed', primarySensorValue: 1.6 },
      { day: 'Thu', primarySensorValue: 1.5 },
      { day: 'Fri', primarySensorValue: 1.4 },
      { day: 'Sat', primarySensorValue: 1.5 },
      { day: 'Sun', primarySensorValue: 1.5 },
    ],
    forecast: generateHealthyForecast(1.5, 3.5, 4.5),
  },
  {
    id: 'WT-04',
    firmId: 'firm-apex',
    name: 'Dwarka Offshore Wind Turbine 4',
    type: 'Wind',
    modelNumber: 'Inox Wind DF 3.3 MW',
    firmwareVersion: 'v5.02.1-lts',
    location: 'Dwarka Wind Resource Area, Devbhumi Dwarka, Gujarat',
    coordinates: { lat: 22.2442, lng: 68.9685 },
    risk: 'HIGH',
    sensors: {
      vibration: 4.8,
      temperature: 92.5,
      current: 740,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 3.2,
    revenueLossUSD: 1840,
    revenueLossINR: 482000,
    energyAtRiskMWh: 31.7,
    estimatedRepairINR: 135000,
    failureProbability: 87,
    confidenceScore: 91,
    rulHours: 8.6,
    expectedFailureWindow: 'Today 17:00 – 23:00 (6–14h)',
    diagnosis: 'Inner-ring bearing spalling detected. High-frequency vibration spike at 4.8 mm/s with thermal escalation.',
    recommendedAction: 'Immediate dispatch required. Inspect main bearing assembly, replace lubricant, and recalibrate drive shaft.',
    requiredTools: ['Bearing Puller Kit', 'Vibration Analyzer', 'Synthetic Gear Oil (ISO VG 320)', 'Torque Multiplier'],
    estimatedRepairHours: 4.5,
    scheduledTechnician: 'Aarav Patel',
    explainableEvidence: [
      { metric: 'Vibration Exceeded Baseline', change: '+34%', weight: 34, isPrimary: true },
      { metric: 'Thermal Rise in Bearing Race', change: '+22%', weight: 22, isSecondary: true },
      { metric: 'Current Harmonic Distortion', change: '+11%', weight: 11 },
      { metric: 'Historical Failure Pattern Match', change: '+18%', weight: 18 },
    ],
    modelAgreement: {
      agreedCount: 3,
      totalModels: 3,
      models: [
        'Random Forest Anomaly Detector (93% conf)',
        'LSTM Time-Series Predictor (89% conf)',
        'Physics-Informed Neural Net (91% conf)',
      ],
    },
    history: [
      { day: 'Mon', primarySensorValue: 2.1 },
      { day: 'Tue', primarySensorValue: 2.4 },
      { day: 'Wed', primarySensorValue: 2.9 },
      { day: 'Thu', primarySensorValue: 3.6 },
      { day: 'Fri', primarySensorValue: 4.1 },
      { day: 'Sat', primarySensorValue: 4.5 },
      { day: 'Sun', primarySensorValue: 4.8 },
    ],
    forecast: WT04_FORECAST,
  },

  {
    id: 'WT-05',
    firmId: 'firm-apex',
    name: 'Jafrabad Marine Turbine 5',
    type: 'Wind',
    modelNumber: 'Envision EN-156 3.3 MW',
    firmwareVersion: 'v3.9.0',
    location: 'Jafrabad Energy Zone, Amreli, Gujarat',
    coordinates: { lat: 20.8710, lng: 71.3640 },
    risk: 'NORMAL',
    sensors: {
      vibration: 1.3,
      temperature: 59.0,
      current: 1220,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'All subsystems verified healthy. Pitch bearing grease purge completed.',
    recommendedAction: 'Routine monitoring active.',
    requiredTools: ['General Rigging Set'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 1.2 },
      { day: 'Tue', primarySensorValue: 1.3 },
      { day: 'Wed', primarySensorValue: 1.3 },
      { day: 'Thu', primarySensorValue: 1.4 },
      { day: 'Fri', primarySensorValue: 1.2 },
      { day: 'Sat', primarySensorValue: 1.3 },
      { day: 'Sun', primarySensorValue: 1.3 },
    ],
    forecast: generateHealthyForecast(1.3, 3.5, 4.5),
  },
  {
    id: 'WT-06',
    firmId: 'firm-apex',
    name: 'Mandvi Beach Wind Generator 6',
    type: 'Wind',
    modelNumber: 'Envision EN-156 3.3 MW',
    firmwareVersion: 'v3.9.0',
    location: 'Mandvi Shoreline Sector, Kutch, Gujarat',
    coordinates: { lat: 22.8320, lng: 69.3550 },
    risk: 'NORMAL',
    sensors: {
      vibration: 1.1,
      temperature: 56.5,
      current: 1260,
      soiling: 0,
    },
    thresholds: WIND_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Nacelle anemometer and blade pitch calibrated for optimal Arabian Sea sea-breeze yield.',
    recommendedAction: 'Standard monitoring schedule.',
    requiredTools: ['Diagnostic Laptop'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 1.0 },
      { day: 'Tue', primarySensorValue: 1.1 },
      { day: 'Wed', primarySensorValue: 1.2 },
      { day: 'Thu', primarySensorValue: 1.1 },
      { day: 'Fri', primarySensorValue: 1.1 },
      { day: 'Sat', primarySensorValue: 1.0 },
      { day: 'Sun', primarySensorValue: 1.1 },
    ],
    forecast: generateHealthyForecast(1.1, 3.5, 4.5),
  },

  // Solar Assets (GUVNL - Gujarat State)
  {
    id: 'SP-01',
    firmId: 'firm-apex',
    name: 'Charanka Solar Array Unit 1',
    type: 'Solar',
    modelNumber: 'Tata Power Solar TP-540',
    firmwareVersion: 'v2.1.0',
    location: 'Charanka Solar Park, Patan, Gujarat',
    coordinates: { lat: 23.9042, lng: 71.2025 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 44.0,
      current: 825,
      soiling: 5.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'PV cell surface clear. Inverter conversion efficiency at 99.2%.',
    recommendedAction: 'Routine visual inspection in 30 days.',
    requiredTools: ['Thermal Camera', 'Dust Meter'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 4.0 },
      { day: 'Tue', primarySensorValue: 4.5 },
      { day: 'Wed', primarySensorValue: 5.0 },
      { day: 'Thu', primarySensorValue: 4.8 },
      { day: 'Fri', primarySensorValue: 5.2 },
      { day: 'Sat', primarySensorValue: 5.0 },
      { day: 'Sun', primarySensorValue: 5.0 },
    ],
    forecast: generateHealthyForecast(5.0, 30.0, 40.0),
  },
  {
    id: 'SP-02',
    firmId: 'firm-apex',
    name: 'Charanka High-Yield Array 2',
    type: 'Solar',
    modelNumber: 'Tata Power Solar TP-540',
    firmwareVersion: 'v2.1.0',
    location: 'Charanka Solar Park, Patan, Gujarat',
    coordinates: { lat: 23.9110, lng: 71.2100 },
    risk: 'MODERATE',
    sensors: {
      vibration: 0.1,
      temperature: 68.0,
      current: 580,
      soiling: 45.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 4.2,
    revenueLossUSD: 620,
    revenueLossINR: 54000,
    energyAtRiskMWh: 8.4,
    estimatedRepairINR: 18000,
    failureProbability: 64,
    confidenceScore: 88,
    rulDays: 2.5,
    expectedFailureWindow: 'In 2–3 Days',
    diagnosis: 'Heavy dust accumulation from Patan desert winds. Power output degraded by 28%.',
    recommendedAction: 'Dispatch automated robotic dry-cleaning crew. Inspect bypass diodes on string 4.',
    requiredTools: ['Robotic Cleaning Drone', 'Bypass Diode Tester', 'Panel Surface Wiper Kit'],
    estimatedRepairHours: 2.0,
    scheduledTechnician: 'Aarav Patel',
    explainableEvidence: [
      { metric: 'Surface Particulate Soiling', change: '+45%', weight: 45, isPrimary: true },
      { metric: 'Cell Hotspot Thermal Rise', change: '+18%', weight: 18, isSecondary: true },
      { metric: 'Inverter MPPT Derating', change: '+14%', weight: 14 },
      { metric: 'Patan Dust Storm Telemetry', change: '+23%', weight: 23 },
    ],
    modelAgreement: {
      agreedCount: 3,
      totalModels: 3,
      models: [
        'Optical Soiling Classifier (90% conf)',
        'PV Thermal Gradient Model (86% conf)',
        'Spectral Yield Predictor (88% conf)',
      ],
    },
    history: [
      { day: 'Mon', primarySensorValue: 12.0 },
      { day: 'Tue', primarySensorValue: 18.5 },
      { day: 'Wed', primarySensorValue: 25.0 },
      { day: 'Thu', primarySensorValue: 33.0 },
      { day: 'Fri', primarySensorValue: 39.0 },
      { day: 'Sat', primarySensorValue: 42.5 },
      { day: 'Sun', primarySensorValue: 45.0 },
    ],
    forecast: SP02_FORECAST,
  },

  {
    id: 'SP-03',
    firmId: 'firm-apex',
    name: 'Dholera Ultra Mega Solar Block 1',
    type: 'Solar',
    modelNumber: 'Adani Solar Bifacial 600W',
    firmwareVersion: 'v2.0.4',
    location: 'Dholera SIR Solar Park, Ahmedabad, Gujarat',
    coordinates: { lat: 22.2470, lng: 72.1930 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 46.0,
      current: 810,
      soiling: 8.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Tracker azimuth calibration synchronized. High bifacial rear-side albedo gain.',
    recommendedAction: 'Standard quarterly maintenance.',
    requiredTools: ['PV Curve Tracer'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 6.0 },
      { day: 'Tue', primarySensorValue: 6.5 },
      { day: 'Wed', primarySensorValue: 7.0 },
      { day: 'Thu', primarySensorValue: 7.5 },
      { day: 'Fri', primarySensorValue: 7.8 },
      { day: 'Sat', primarySensorValue: 8.0 },
      { day: 'Sun', primarySensorValue: 8.0 },
    ],
    forecast: generateHealthyForecast(8.0, 30.0, 40.0),
  },
  {
    id: 'SP-04',
    firmId: 'firm-apex',
    name: 'Dholera Ultra Mega Solar Block 2',
    type: 'Solar',
    modelNumber: 'Adani Solar Bifacial 600W',
    firmwareVersion: 'v2.0.4',
    location: 'Dholera SIR Solar Park, Ahmedabad, Gujarat',
    coordinates: { lat: 22.2530, lng: 72.2010 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 48.0,
      current: 790,
      soiling: 9.5,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Inverter cabinet temperature within normal range. Air intake filters clean.',
    recommendedAction: 'Filter check at next scheduled technician round.',
    requiredTools: ['Filter Replacement Kit'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 7.0 },
      { day: 'Tue', primarySensorValue: 7.5 },
      { day: 'Wed', primarySensorValue: 8.0 },
      { day: 'Thu', primarySensorValue: 8.5 },
      { day: 'Fri', primarySensorValue: 9.0 },
      { day: 'Sat', primarySensorValue: 9.2 },
      { day: 'Sun', primarySensorValue: 9.5 },
    ],
    forecast: generateHealthyForecast(9.5, 30.0, 40.0),
  },
  {
    id: 'SP-05',
    firmId: 'firm-apex',
    name: 'Radhanpur Solar Complex Unit 5',
    type: 'Solar',
    modelNumber: 'Tata Power Solar TP-540',
    firmwareVersion: 'v1.8.0',
    location: 'Radhanpur Solar Zone, Banaskantha, Gujarat',
    coordinates: { lat: 23.8340, lng: 71.6050 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 47.5,
      current: 795,
      soiling: 11.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'String inverter efficiency at 98.6%. Temperature distribution across cells is uniform.',
    recommendedAction: 'Standard preventive maintenance.',
    requiredTools: ['Infrared Thermometer'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 8.5 },
      { day: 'Tue', primarySensorValue: 9.0 },
      { day: 'Wed', primarySensorValue: 9.5 },
      { day: 'Thu', primarySensorValue: 10.0 },
      { day: 'Fri', primarySensorValue: 10.2 },
      { day: 'Sat', primarySensorValue: 10.8 },
      { day: 'Sun', primarySensorValue: 11.0 },
    ],
    forecast: generateHealthyForecast(11.0, 30.0, 40.0),
  },
  {
    id: 'SP-06',
    firmId: 'firm-apex',
    name: 'Khavda Solar PV Station 6',
    type: 'Solar',
    modelNumber: 'Adani Solar Bifacial 600W',
    firmwareVersion: 'v1.8.0',
    location: 'Khavda Hybrid Renewable Park, Kutch, Gujarat',
    coordinates: { lat: 23.8620, lng: 69.7680 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 43.0,
      current: 830,
      soiling: 7.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Panel surface glass cleaned recently. Highest generation efficiency in cluster.',
    recommendedAction: 'None. Operating at peak yield.',
    requiredTools: ['Inspection Tablet'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 5.0 },
      { day: 'Tue', primarySensorValue: 5.5 },
      { day: 'Wed', primarySensorValue: 6.0 },
      { day: 'Thu', primarySensorValue: 6.2 },
      { day: 'Fri', primarySensorValue: 6.5 },
      { day: 'Sat', primarySensorValue: 6.8 },
      { day: 'Sun', primarySensorValue: 7.0 },
    ],
    forecast: generateHealthyForecast(7.0, 30.0, 40.0),
  },

  // ──────────────────────────────────────────────
  // Torrent Power Green Assets (Firm B Isolation - Gujarat)
  // ──────────────────────────────────────────────
  {
    id: 'HS-01',
    firmId: 'firm-helios',
    name: 'Torrent Solar Complex Surat',
    type: 'Solar',
    modelNumber: 'Waaree Energies 550W',
    firmwareVersion: 'v2.4.0',
    location: 'Hazira Industrial Green Zone, Surat, Gujarat',
    coordinates: { lat: 21.1120, lng: 72.6580 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 46.0,
      current: 850,
      soiling: 5.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Rooftop industrial PV cluster operating nominal.',
    recommendedAction: 'None required.',
    requiredTools: ['Inspection Tablet'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 4.5 },
      { day: 'Tue', primarySensorValue: 5.0 },
      { day: 'Wed', primarySensorValue: 4.8 },
      { day: 'Thu', primarySensorValue: 5.2 },
      { day: 'Fri', primarySensorValue: 5.0 },
      { day: 'Sat', primarySensorValue: 4.9 },
      { day: 'Sun', primarySensorValue: 5.0 },
    ],
    forecast: generateHealthyForecast(5.0, 30.0, 40.0),
  },
  {
    id: 'HS-02',
    firmId: 'firm-helios',
    name: 'Torrent Solar Array Rajkot',
    type: 'Solar',
    modelNumber: 'Waaree Energies 550W',
    firmwareVersion: 'v2.4.0',
    location: 'Rajkot Renewable Sector, Gujarat',
    coordinates: { lat: 22.3039, lng: 70.8022 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 47.0,
      current: 835,
      soiling: 8.0,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'Inverter bus voltage synchronized with state transmission grid.',
    recommendedAction: 'None. Nominal telemetry.',
    requiredTools: ['Inspection Tablet'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 7.0 },
      { day: 'Tue', primarySensorValue: 7.2 },
      { day: 'Wed', primarySensorValue: 7.5 },
      { day: 'Thu', primarySensorValue: 7.8 },
      { day: 'Fri', primarySensorValue: 8.0 },
      { day: 'Sat', primarySensorValue: 8.0 },
      { day: 'Sun', primarySensorValue: 8.0 },
    ],
    forecast: generateHealthyForecast(8.0, 30.0, 40.0),
  },
  {
    id: 'HS-03',
    firmId: 'firm-helios',
    name: 'Torrent Dholera Hybrid Station',
    type: 'Solar',
    modelNumber: 'Waaree Energies 550W',
    firmwareVersion: 'v2.4.0',
    location: 'Dholera SIR Sector 3, Gujarat',
    coordinates: { lat: 22.2490, lng: 72.1980 },
    risk: 'NORMAL',
    sensors: {
      vibration: 0.1,
      temperature: 45.0,
      current: 840,
      soiling: 6.5,
    },
    thresholds: SOLAR_THRESHOLDS,
    energyLossMWh: 0,
    revenueLossUSD: 0,
    diagnosis: 'PV cell strings in optimal MPPT synchronization.',
    recommendedAction: 'Routine monitoring.',
    requiredTools: ['Diagnostic Scanner'],
    estimatedRepairHours: 1,
    history: [
      { day: 'Mon', primarySensorValue: 5.5 },
      { day: 'Tue', primarySensorValue: 6.0 },
      { day: 'Wed', primarySensorValue: 6.2 },
      { day: 'Thu', primarySensorValue: 6.3 },
      { day: 'Fri', primarySensorValue: 6.5 },
      { day: 'Sat', primarySensorValue: 6.4 },
      { day: 'Sun', primarySensorValue: 6.5 },
    ],
    forecast: generateHealthyForecast(6.5, 30.0, 40.0),
  },
];

// ──────────────────────────────────────────────
// Initial Kanban Tickets (Gujarat Assets & 24h Auto-Retention Demonstration)
// ──────────────────────────────────────────────
export const INITIAL_KANBAN_TICKETS: KanbanTicket[] = [
  {
    id: 'TICK-101',
    assetId: 'WT-04',
    assetName: 'Dwarka Offshore Wind Turbine 4',
    firmId: 'firm-apex',
    title: 'Dwarka Turbine Bearing Spalling Replacement',
    severity: 'CRITICAL',
    status: 'TODO',
    description: 'Vibration reached 4.8 mm/s with thermal escalation to 92.5°C at Dwarka coastal array. Emergency maintenance flagged by ML algorithm.',
    recommendedAction: 'Disengage mechanical brake, extract bearing assembly, install SKF-7200 cartridge, and flush synthetic lubricant.',
    partsUsed: [],
    laborHours: 0,
    createdAt: '2026-09-12 08:30',
  },
  {
    id: 'TICK-102',
    assetId: 'SP-02',
    assetName: 'Charanka High-Yield Array 2',
    firmId: 'firm-apex',
    title: 'Charanka Array Robotic De-dusting & Bypass Diode Scan',
    severity: 'MODERATE',
    status: 'TODO',
    description: 'Patan desert dust storm caused soiling index spike to 45.0%. Power derate estimated at 4.2 MWh/day.',
    recommendedAction: 'Deploy automated robotic crawler wash rig and test combiner box 3-B bypass diodes.',
    partsUsed: [],
    laborHours: 0,
    createdAt: '2026-09-12 09:15',
  },
  {
    id: 'TICK-103',
    assetId: 'WT-01',
    assetName: 'Khavda Wind Turbine Unit 1',
    firmId: 'firm-apex',
    title: 'Routine 60-Day Pitch Actuator Torque Servicing',
    severity: 'LOW',
    status: 'IN_PROGRESS',
    assignedTech: 'Aarav Patel',
    description: 'Standard quarterly scheduled servicing and hydraulic pressure inspection at Khavda park.',
    recommendedAction: 'Torque check on pitch bearing fasteners and hydraulic seal inspection.',
    partsUsed: ['Synthetic Hydraulic Fluid Mobil DTE 10', 'O-Ring Seal Kit'],
    laborHours: 1.5,
    createdAt: '2026-09-11 14:00',
  },
  {
    id: 'TICK-104',
    assetId: 'SP-01',
    assetName: 'Charanka Solar Array Unit 1',
    firmId: 'firm-apex',
    title: 'Inverter Intake Filter Replacement & Thermography',
    severity: 'LOW',
    status: 'RESOLVED',
    assignedTech: 'Vikram Mehta',
    description: 'Biannual optical and infrared scan of central inverter cabinet. Filter replaced and restored to service.',
    recommendedAction: 'Clean intake air filters and verify terminal torque.',
    partsUsed: ['HEPA Intake Filter C-4'],
    laborHours: 2.0,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // Resolved 2 hours ago -> active with ~22h countdown!
  },
];

// ──────────────────────────────────────────────
// Initial Alert Rules (Gujarat Renewable Corridors)
// ──────────────────────────────────────────────
export const INITIAL_ALERT_RULES: AlertRule[] = [
  {
    id: 'RULE-01',
    firmId: 'firm-apex',
    assetId: 'WT-04',
    metric: 'vibration',
    condition: '>',
    threshold: 4.5,
    durationMinutes: 10,
    channel: 'SMS',
    recipient: '+91 98250 14820 (Aarav Patel)',
    isActive: true,
    lastTriggered: '12 mins ago',
  },
  {
    id: 'RULE-02',
    firmId: 'firm-apex',
    assetId: 'ALL',
    metric: 'temperature',
    condition: '>',
    threshold: 85.0,
    durationMinutes: 15,
    channel: 'SLACK',
    recipient: '#ops-gujarat-renewables-alerts',
    isActive: true,
  },
  {
    id: 'RULE-03',
    firmId: 'firm-apex',
    assetId: 'SP-02',
    metric: 'soiling',
    condition: '>',
    threshold: 35.0,
    durationMinutes: 30,
    channel: 'EMAIL',
    recipient: 'charanka-dispatch@guvnl.gujarat.gov.in',
    isActive: true,
    lastTriggered: '45 mins ago',
  },
];

// ──────────────────────────────────────────────
// Initial Audit Logs (Gujarat Grid)
// ──────────────────────────────────────────────
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-001',
    timestamp: '2026-09-12 09:35',
    userId: 'user-elena',
    userName: 'Priya Sharma',
    userRole: 'EXECUTIVE',
    firmId: 'firm-apex',
    action: 'THRESHOLD_MODIFIED',
    assetId: 'WT-04',
    details: 'Vibration critical threshold adjusted from 5.0 mm/s to 4.5 mm/s for Dwarka Offshore Turbine.',
  },
  {
    id: 'AUDIT-002',
    timestamp: '2026-09-12 09:15',
    userId: 'user-marcus',
    userName: 'Aarav Patel',
    userRole: 'TECHNICIAN',
    firmId: 'firm-apex',
    action: 'ALERT_RULE_CHANGED',
    assetId: 'SP-02',
    details: 'Automated notification rule enabled for Patan dust soiling spikes over 35%.',
  },
  {
    id: 'AUDIT-003',
    timestamp: '2026-09-12 08:50',
    userId: 'user-marcus',
    userName: 'Aarav Patel',
    userRole: 'TECHNICIAN',
    firmId: 'firm-apex',
    action: 'TICKET_RESOLVED',
    assetId: 'SP-01',
    details: 'Resolved ticket TICK-104 at Charanka. Replaced intake filter; array operating at 99.2% efficiency.',
  },
];
