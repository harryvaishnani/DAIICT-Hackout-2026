export type AssetType = 'Wind' | 'Solar';

export type AssetStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE_DISPATCHED';

export type UserRole = 'EXECUTIVE' | 'TECHNICIAN';

export interface Firm {
  id: string;
  name: string;
  logoType: 'Wind' | 'Solar' | 'Hybrid';
  primaryColor: string;
  region: string;
  assetCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId: string;
  assignedZone?: string;
  title: string;
  avatarInitials: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  firmId: string;
  action: 'ASSET_CREATED' | 'ASSET_UPDATED' | 'ASSET_DECOMMISSIONED' | 'THRESHOLD_MODIFIED' | 'TICKET_RESOLVED' | 'ALERT_RULE_CHANGED';
  assetId: string;
  details: string;
}

export type TicketStatus = 'TODO' | 'IN_PROGRESS' | 'RESOLVED';

export interface KanbanTicket {
  id: string;
  assetId: string;
  assetName: string;
  firmId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  status: TicketStatus;
  assignedTech?: string;
  description: string;
  recommendedAction: string;
  partsUsed: string[];
  laborHours: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface AlertRule {
  id: string;
  firmId: string;
  assetId: string; // 'ALL' or specific asset ID
  metric: 'vibration' | 'temperature' | 'current' | 'soiling';
  condition: '>' | '<';
  threshold: number;
  durationMinutes: number;
  channel: 'SMS' | 'EMAIL' | 'SLACK';
  recipient: string;
  isActive: boolean;
  lastTriggered?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  latitude: number;
  longitude: number;
  health_score: number;
  status: AssetStatus;
  est_daily_loss: number;
  recommended_action: string;
  updated_at: string;
  root_cause_analysis?: string;
  fault_type?: string;
}

export interface TelemetryLog {
  id: string | number;
  asset_id: string;
  temperature: number;      // °C
  vibration: number;        // mm/s
  voltage: number;          // V
  current_amps: number;     // A
  soiling_index: number;    // %
  power_output_mw: number;  // MW
  timestamp: string;        // ISO timestamp
}

export interface ExecutiveKPIs {
  totalActiveAssets: number;
  operationalEfficiency: number;
  criticalAlertsCount: number;
  warningAlertsCount: number;
  totalRevenueAtRisk: number;
  totalPowerGenerationMW: number;
}

export interface WorkOrderTicket {
  id: string;
  asset_id: string;
  asset_name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  recommended_action: string;
  dispatched_at: string;
  crew_lead: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ON_SITE' | 'RESOLVED';
}

export interface FaultInjectionPayload {
  assetId: string;
  status: AssetStatus;
  healthScore: number;
  estDailyLoss: number;
  recommendedAction: string;
  rootCauseAnalysis: string;
  faultType: string;
  telemetry: {
    temperature: number;
    vibration: number;
    voltage: number;
    current_amps: number;
    soiling_index: number;
    power_output_mw: number;
  };
}

// ──────────────────────────────────────────────
// VORTEX Autonomous Operations Intelligence Types
// ──────────────────────────────────────────────
export type VortexTab = 'COMMAND' | 'PREDICT' | 'SIMULATE' | 'EXECUTE' | 'INSIGHTS';

export interface TwinComponent {
  id: string;
  name: string;
  subsystem: 'MECHANICAL' | 'ELECTRICAL' | 'THERMAL' | 'STRUCTURAL' | 'OPTICAL';
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  healthScore: number;
  temperature: number;
  vibration?: number;
  current?: number;
  soiling?: number;
  rulHours?: number;
  rulDays?: number;
  confidence: number;
  failureProbability: number;
  diagnosis: string;
  recommendedAction: string;
  specs: Record<string, string | number>;
}

export interface WhatIfScenarioData {
  scenarioName: 'DO_NOTHING' | 'ROUTINE_MAINTENANCE' | 'EMERGENCY_SHUTDOWN';
  label: string;
  energyLossMWh: number;
  financialCostINR: number;
  financialCostUSD: number;
  downtimeHours: number;
  description: string;
  riskOutcome: string;
}

export interface EnvironmentalCondition {
  windSpeedKmh: number;
  ambientTempC: number;
  humidityPct: number;
  dustIndex: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  solarIrradianceWm2: number;
  forecastSummary: string;
  stressModifierDescription: string;
}

export interface DecisionTimelineStep {
  time: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
  severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  assetId: string;
}

export interface SparePartItem {
  id: string;
  name: string;
  required: number;
  available: number;
  location: string;
  eta: string;
  status: 'IN_STOCK' | 'DEPOT_TRANSIT' | 'BACKORDER';
}

