import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Firm, UserProfile, KanbanTicket, AlertRule, AuditLogEntry, TicketStatus, EnvironmentalCondition } from '../types';
import type { SimpleAsset } from '../data/simpleAssets';
import {
  INITIAL_SIMPLE_ASSETS,
  DEFAULT_FIRMS,
  DEFAULT_USERS,
  INITIAL_KANBAN_TICKETS,
  INITIAL_ALERT_RULES,
  INITIAL_AUDIT_LOGS,
  generateHealthyForecast,
} from '../data/simpleAssets';

export type AppTab = 'COMMAND' | 'PREDICT' | 'SIMULATE' | 'EXECUTE' | 'INSIGHTS' | 'FLEET' | 'QUEUE' | 'REPORTING' | 'INSPECTOR';

interface SimpleAppContextType {
  // Multi-Tenancy & RBAC
  firms: Firm[];
  users: UserProfile[];
  currentFirm: Firm;
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  technicianZoneFilter: boolean;
  setTechnicianZoneFilter: (val: boolean) => void;

  // Assets & Filtering
  assets: SimpleAsset[];
  firmAssets: SimpleAsset[];
  visibleAssets: SimpleAsset[];
  selectedAsset: SimpleAsset;
  selectedAssetId: string;
  selectAsset: (id: string) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  filter: 'ALL' | 'RISK' | 'WIND' | 'SOLAR';
  setFilter: (f: 'ALL' | 'RISK' | 'WIND' | 'SOLAR') => void;

  // CRUD Operations
  createAsset: (assetData: Omit<SimpleAsset, 'firmId'>) => void;
  updateAsset: (id: string, updates: Partial<SimpleAsset>) => void;
  decommissionAsset: (id: string) => void;

  // Kanban Maintenance Tickets & 24h Retention
  tickets: KanbanTicket[];
  moveTicket: (ticketId: string, newStatus: TicketStatus) => void;
  claimTicket: (ticketId: string, techName: string) => void;
  resolveTicket: (ticketId: string, notes: string, partsUsed: string[], hours: number) => void;
  createTicketForAsset: (assetId: string) => void;
  deleteTicket: (ticketId: string) => void;
  simulateFastForward24Hours: () => void;
  purgeExpiredTickets: () => void;

  // Audit Logs & Alert Rules
  auditLogs: AuditLogEntry[];
  logAudit: (action: AuditLogEntry['action'], assetId: string, details: string) => void;
  alertRules: AlertRule[];
  addAlertRule: (rule: Omit<AlertRule, 'id' | 'firmId'>) => void;
  toggleAlertRule: (ruleId: string) => void;
  testAlertRule: (ruleId: string) => void;

  // Offline Mode Simulation
  isOffline: boolean;
  toggleOffline: () => void;
  offlineQueueCount: number;
  syncOfflineQueue: () => void;

  // Modals
  isAddAssetModalOpen: boolean;
  setIsAddAssetModalOpen: (open: boolean) => void;
  isDecommissionModalOpen: boolean;
  setIsDecommissionModalOpen: (open: boolean) => void;
  decommissionTargetAsset: SimpleAsset | null;
  setDecommissionTargetAsset: (asset: SimpleAsset | null) => void;
  isAlertRulesModalOpen: boolean;
  setIsAlertRulesModalOpen: (open: boolean) => void;
  isAuditLogModalOpen: boolean;
  setIsAuditLogModalOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  authenticateUser: (userId: string) => void;
  logoutUser: () => void;

  // ⚡ INCIDENT COMMAND Presentation Mode
  isIncidentCommandOpen: boolean;
  openIncidentCommand: (assetId?: string) => void;
  closeIncidentCommand: () => void;

  // Environmental Intelligence & Impact Metrics
  environmentalConditions: EnvironmentalCondition;
  energyRecoveredMWh: number;
  revenueProtectedINR: number;
  co2AvoidedTonnes: number;
  launchFailureSimulation: (assetId: string) => void;
  acceptOptimalMaintenancePlan: (assetId: string) => void;

  // Summary Metrics (Role & Firm Adaptive)
  totalAssetsCount: number;
  atRiskCount: number;
  totalEnergyLossMWh: number;
  totalRevenueLossUSD: number;
  totalRevenueLossINR: number;
  fleetUptimePct: number;

  // 1-Click Interactive Simulations
  triggerTurbineAnomaly: () => void;
  triggerSolarAnomaly: () => void;
  resetAllHealthy: () => void;
  markAsServiced: (id: string) => void;
  scheduleVisit: (id: string) => void;

  // Side Panel / Drawer State
  isDrawerOpen: boolean;
  openDrawer: (id?: string) => void;
  closeDrawer: () => void;

  // Theme Management
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (t: 'dark' | 'light') => void;

  // Notifications
  notification: string | null;
  clearNotification: () => void;
}


const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined);

export const SimpleAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── Multi-Tenancy & User State ──
  const [firms] = useState<Firm[]>(DEFAULT_FIRMS);
  const [users] = useState<UserProfile[]>(DEFAULT_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('user-elena');
  const [technicianZoneFilter, setTechnicianZoneFilter] = useState<boolean>(false);

  // ── Assets & State ──
  const [assets, setAssets] = useState<SimpleAsset[]>(INITIAL_SIMPLE_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('WT-04');
  const [activeTab, setActiveTab] = useState<AppTab>('COMMAND');
  const [filter, setFilter] = useState<'ALL' | 'RISK' | 'WIND' | 'SOLAR'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // ── ⚡ INCIDENT COMMAND State ──
  const [isIncidentCommandOpen, setIsIncidentCommandOpen] = useState<boolean>(false);

  // ── Environmental Conditions (Gujarat Corridors) ──
  const [environmentalConditions] = useState<EnvironmentalCondition>({
    windSpeedKmh: 31,
    ambientTempC: 38,
    humidityPct: 61,
    dustIndex: 'HIGH',
    solarIrradianceWm2: 842,
    forecastSummary: 'High Desert Wind Shear & Extreme Dust Particulate Warning',
    stressModifierDescription: 'High dust + thermal stress increases inverter cooling load and module hotspots. SP-02 risk adjusted +22%.'
  });

  // ── Impact & Recovery Metrics ──
  const [energyRecoveredMWh, setEnergyRecoveredMWh] = useState<number>(12.4);
  const [revenueProtectedINR, setRevenueProtectedINR] = useState<number>(184000);

  // ── Kanban, Alerts, Audit Logs ──
  const [tickets, setTickets] = useState<KanbanTicket[]>(INITIAL_KANBAN_TICKETS);
  const [alertRules, setAlertRules] = useState<AlertRule[]>(INITIAL_ALERT_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);


  // ── Offline Mode Simulation ──
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);

  // ── Modals State ──
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState<boolean>(false);
  const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState<boolean>(false);
  const [decommissionTargetAsset, setDecommissionTargetAsset] = useState<SimpleAsset | null>(null);
  const [isAlertRulesModalOpen, setIsAlertRulesModalOpen] = useState<boolean>(false);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('vortex_session_authed') !== 'true';
    }
    return true;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('vortex_session_authed') === 'true';
    }
    return false;
  });

  // ── Theme State ──
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pm_theme') as 'dark' | 'light';
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      localStorage.setItem('pm_theme', theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // ── Current User & Firm ──
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const currentFirm = useMemo(() => {
    return firms.find(f => f.id === currentUser.firmId) || firms[0];
  }, [firms, currentUser]);

  const switchUser = useCallback((userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUserId(userId);
      // Auto-adjust technician zone filter
      if (targetUser.role === 'TECHNICIAN') {
        setTechnicianZoneFilter(true);
      } else {
        setTechnicianZoneFilter(false);
      }
      // Pick first asset of that firm
      const firmFirstAsset = assets.find(a => a.firmId === targetUser.firmId);
      if (firmFirstAsset) {
        setSelectedAssetId(firmFirstAsset.id);
      }
      setNotification(`Switched profile to ${targetUser.name} (${targetUser.title}) - ${targetUser.role === 'EXECUTIVE' ? 'Executive Global View' : 'Regional Technician Mode'}`);
    }
  }, [users, assets]);

  const authenticateUser = useCallback((userId: string) => {
    switchUser(userId);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vortex_session_authed', 'true');
    }
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, [switchUser]);

  const logoutUser = useCallback(() => {
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vortex_session_authed');
    }
    setNotification('Session terminated. Re-authenticate to access Gujarat SCADA grid.');
  }, []);

  // ── Multi-Tenant Filtered Assets ──
  const firmAssets = useMemo(() => {
    return assets.filter(a => a.firmId === currentFirm.id);
  }, [assets, currentFirm.id]);

  const visibleAssets = useMemo(() => {
    if (currentUser.role === 'TECHNICIAN' && technicianZoneFilter && currentUser.assignedZone) {
      const zoneFiltered = firmAssets.filter(a => a.location.toLowerCase().includes(currentUser.assignedZone!.toLowerCase().split(',')[0].trim().toLowerCase()));
      return zoneFiltered.length > 0 ? zoneFiltered : firmAssets;
    }
    return firmAssets;
  }, [firmAssets, currentUser, technicianZoneFilter]);

  const selectedAsset = useMemo(() => {
    return firmAssets.find(a => a.id === selectedAssetId) || firmAssets[0] || assets[0];
  }, [firmAssets, selectedAssetId, assets]);

  // ── Metrics ──
  const totalAssetsCount = visibleAssets.length;

  const atRiskCount = useMemo(() => {
    return visibleAssets.filter(a => a.risk === 'HIGH' || a.risk === 'MODERATE').length;
  }, [visibleAssets]);

  const totalEnergyLossMWh = useMemo(() => {
    return Math.round(visibleAssets.reduce((sum, a) => sum + a.energyLossMWh, 0) * 10) / 10;
  }, [visibleAssets]);

  const totalRevenueLossUSD = useMemo(() => {
    return Math.round(visibleAssets.reduce((sum, a) => sum + a.revenueLossUSD, 0));
  }, [visibleAssets]);

  const totalRevenueLossINR = useMemo(() => {
    return Math.round(visibleAssets.reduce((sum, a) => sum + (a.revenueLossINR || a.revenueLossUSD * 83), 0));
  }, [visibleAssets]);

  const fleetUptimePct = useMemo(() => {
    if (visibleAssets.length === 0) return 100;
    const healthyCount = visibleAssets.filter(a => a.risk === 'NORMAL' || a.risk === 'SERVICED').length;
    return Math.round((healthyCount / visibleAssets.length) * 1000) / 10;
  }, [visibleAssets]);

  // ── Audit Logger ──
  const logAudit = useCallback((action: AuditLogEntry['action'], assetId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      firmId: currentFirm.id,
      action,
      assetId,
      details,
    };
    setAuditLogs(prev => [entry, ...prev]);
  }, [currentUser, currentFirm]);

  // ── Incident Command Handlers ──
  const openIncidentCommand = useCallback((assetId?: string) => {
    if (assetId) {
      setSelectedAssetId(assetId);
    }
    setIsIncidentCommandOpen(true);
  }, []);

  const closeIncidentCommand = useCallback(() => {
    setIsIncidentCommandOpen(false);
  }, []);

  // ── Impact & Recovery Metrics ──
  const co2AvoidedTonnes = useMemo(() => {
    return Math.round(energyRecoveredMWh * 0.406 * 10) / 10;
  }, [energyRecoveredMWh]);

  const launchFailureSimulation = useCallback((assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveTab('SIMULATE');
    setNotification(`🔮 VORTEX What-If Simulator initialized for ${assetId}`);
  }, []);

  const acceptOptimalMaintenancePlan = useCallback((assetId: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          scheduledTechnician: 'Aarav Patel (Scheduled: Today 14:00 - 18:30 IST)',
        };
      }
      return a;
    }));

    setTickets(prev => {
      const existing = prev.find(t => t.assetId === assetId && t.status !== 'RESOLVED');
      if (existing) {
        return prev.map(t => t.id === existing.id ? {
          ...t,
          assignedTech: 'Aarav Patel',
          description: `${t.description} | [AI OPTIMIZED WINDOW]: Today 14:00 – 18:30 IST during minimal wind curtailment.`,
          status: 'IN_PROGRESS' as const,
        } : t);
      }
      return [
        {
          id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
          assetId,
          assetName: assetId.startsWith('WT') ? `Wind Turbine ${assetId}` : `Solar Array ${assetId}`,
          firmId: currentFirm.id,
          title: `AI-Optimized Window: Remediation for ${assetId}`,
          severity: 'CRITICAL' as const,
          status: 'IN_PROGRESS' as const,
          assignedTech: 'Aarav Patel',
          description: `Scheduled Today 14:00 – 18:30 IST during low wind forecast. Expected savings ₹1,84,000.`,
          recommendedAction: 'Execute planned component replacement during window.',
          partsUsed: [],
          laborHours: 0,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
        ...prev,
      ];
    });

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setEnergyRecoveredMWh(prev => Math.round((prev + 2.1) * 10) / 10);
    setRevenueProtectedINR(prev => prev + 184000);

    setNotification(`⚡ Optimal Maintenance Plan Activated: Scheduled ${assetId} for 14:00 – 18:30 IST. Lead Aarav Patel notified.`);
    logAudit('ASSET_UPDATED', assetId, `Accepted AI-optimized maintenance window (Today 14:00 - 18:30 IST). Technician Aarav Patel assigned.`);
  }, [currentFirm.id, logAudit]);


  // ── CRUD Operations ──
  const createAsset = useCallback((newAssetData: Omit<SimpleAsset, 'firmId'>) => {
    const newAsset: SimpleAsset = {
      ...newAssetData,
      firmId: currentFirm.id,
      risk: 'NORMAL',
      energyLossMWh: 0,
      revenueLossUSD: 0,
      diagnosis: 'Baseline parameters initialised. Telemetry nominal.',
      recommendedAction: 'Standard monitoring schedule active.',
      requiredTools: newAssetData.requiredTools || ['Multimeter', 'Diagnostic Tablet'],
      estimatedRepairHours: newAssetData.estimatedRepairHours || 1,
      history: [
        { day: 'Mon', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
        { day: 'Tue', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
        { day: 'Wed', primarySensorValue: newAssetData.sensors.vibration || 1.1 },
        { day: 'Thu', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
        { day: 'Fri', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
        { day: 'Sat', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
        { day: 'Sun', primarySensorValue: newAssetData.sensors.vibration || 1.0 },
      ],
      forecast: generateHealthyForecast(
        newAssetData.type === 'Wind' ? newAssetData.sensors.vibration : newAssetData.sensors.soiling,
        newAssetData.type === 'Wind' ? newAssetData.thresholds.vibration.warning : newAssetData.thresholds.soiling.warning,
        newAssetData.type === 'Wind' ? newAssetData.thresholds.vibration.critical : newAssetData.thresholds.soiling.critical
      ),
    };

    setAssets(prev => [newAsset, ...prev]);
    setSelectedAssetId(newAsset.id);
    logAudit('ASSET_CREATED', newAsset.id, `Hardware ${newAsset.name} (${newAsset.modelNumber || newAsset.type}) added to ${currentFirm.name}`);

    if (isOffline) {
      setOfflineQueue(prev => [...prev, `Created ${newAsset.id} locally`]);
      setNotification(`💾 [Offline Mode] Asset ${newAsset.id} saved to local cache. Will sync when online.`);
    } else {
      setNotification(`✅ Asset Registered: ${newAsset.id} (${newAsset.name}) successfully added to fleet.`);
    }
  }, [currentFirm, isOffline, logAudit]);

  const updateAsset = useCallback((id: string, updates: Partial<SimpleAsset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      return a;
    }));
    logAudit('ASSET_UPDATED', id, `Updated properties on ${id}: ${Object.keys(updates).join(', ')}`);

    if (isOffline) {
      setOfflineQueue(prev => [...prev, `Updated ${id}`]);
      setNotification(`💾 [Offline Mode] Changes for ${id} saved to local cache.`);
    } else {
      setNotification(`⚙️ Asset Updated: ${id} configuration and thresholds updated.`);
    }
  }, [isOffline, logAudit]);

  const decommissionAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    logAudit('ASSET_DECOMMISSIONED', id, `Hardware asset ${id} permanently decommissioned from active production.`);
    // Select first remaining asset
    const remaining = assets.filter(a => a.id !== id && a.firmId === currentFirm.id);
    if (remaining.length > 0) {
      setSelectedAssetId(remaining[0].id);
    }
    setIsDrawerOpen(false);
    setNotification(`🗑️ Asset Decommissioned: ${id} has been permanently removed from service.`);
  }, [assets, currentFirm.id, logAudit]);

  // ── Kanban Ticket Actions ──
  const firmTickets = useMemo(() => {
    return tickets.filter(t => t.firmId === currentFirm.id);
  }, [tickets, currentFirm.id]);

  const moveTicket = useCallback((ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = {
          ...t,
          status: newStatus,
          resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : t.resolvedAt,
        };
        return updated;
      }
      return t;
    }));

    // If moving to RESOLVED, restore asset healthy!
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && newStatus === 'RESOLVED') {
      setAssets(prev => prev.map(a => {
        if (a.id === ticket.assetId) {
          return {
            ...a,
            risk: 'SERVICED',
            energyLossMWh: 0,
            revenueLossUSD: 0,
            sensors: a.type === 'Wind' ? {
              vibration: 1.2,
              temperature: 60.0,
              current: 1240,
              soiling: 0,
            } : {
              vibration: 0.1,
              temperature: 44.0,
              current: 825,
              soiling: 5.0,
            },
            diagnosis: `MAINTENANCE COMPLETE: Resolved via Work Order ${ticket.id}. Technician cleared equipment.`,
          };
        }
        return a;
      }));
      setEnergyRecoveredMWh(prev => Math.round((prev + 3.2) * 10) / 10);
      setRevenueProtectedINR(prev => prev + 135000);
      logAudit('TICKET_RESOLVED', ticket.assetId, `Ticket ${ticketId} marked resolved. Asset ${ticket.assetId} restored to active service.`);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#0284C7', '#F59E0B'] });
      } catch {
        // ignore
      }
      setNotification(`🎉 Work Order Resolved: ${ticket.assetId} returned to peak production.`);
    } else {
      setNotification(`📋 Ticket Updated: ${ticketId} moved to ${newStatus.replace('_', ' ')}.`);
    }
  }, [tickets, logAudit]);

  const claimTicket = useCallback((ticketId: string, techName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedTech: techName,
          status: 'IN_PROGRESS',
        };
      }
      return t;
    }));
    setNotification(`👷 Ticket Claimed: ${ticketId} claimed by ${techName}.`);
  }, []);

  const resolveTicket = useCallback((ticketId: string, notes: string, partsUsed: string[], hours: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'RESOLVED',
          description: `${t.description} | Resolution Notes: ${notes}`,
          partsUsed: [...t.partsUsed, ...partsUsed],
          laborHours: t.laborHours + hours,
          resolvedAt: new Date().toISOString(),
        };
      }
      return t;
    }));

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setAssets(prev => prev.map(a => {
        if (a.id === ticket.assetId) {
          return {
            ...a,
            risk: 'SERVICED',
            energyLossMWh: 0,
            revenueLossUSD: 0,
            diagnosis: `MAINTENANCE COMPLETE: ${notes}`,
          };
        }
        return a;
      }));
      setEnergyRecoveredMWh(prev => Math.round((prev + 3.2) * 10) / 10);
      setRevenueProtectedINR(prev => prev + 135000);
      logAudit('TICKET_RESOLVED', ticket.assetId, `Resolved ${ticketId}. Parts: ${partsUsed.join(', ') || 'None'}. Labor: ${hours}h.`);
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setNotification(`🎉 Ticket Resolved: ${ticket.assetId} restored to service. Logged ${hours}h labor.`);
    }
  }, [tickets, logAudit]);

  const deleteTicket = useCallback((ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    logAudit('TICKET_RESOLVED', 'QUEUE', `Work Order ${ticketId} permanently deleted from queue.`);
    setNotification(`🗑️ Work Order ${ticketId} permanently deleted.`);
  }, [logAudit]);

  // 24-Hour Auto-Purge Policy for Resolved Tickets
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  const purgeExpiredTickets = useCallback(() => {
    const now = Date.now();
    let purgedCount = 0;
    setTickets(prev => {
      const unexpired = prev.filter(t => {
        if (t.status !== 'RESOLVED' || !t.resolvedAt) return true;
        const resolvedTimestamp = new Date(t.resolvedAt).getTime();
        if (isNaN(resolvedTimestamp)) return true;
        const isExpired = (now - resolvedTimestamp) >= TWENTY_FOUR_HOURS_MS;
        if (isExpired) {
          purgedCount++;
          logAudit(
            'TICKET_RESOLVED',
            t.assetId,
            `Ticket ${t.id} automatically purged permanently after 24-hour retention period.`
          );
        }
        return !isExpired;
      });

      if (purgedCount > 0) {
        setNotification(`🧹 Auto-Retention Policy: ${purgedCount} completed work order(s) reached 24-hour limit and were permanently removed.`);
        return unexpired;
      }
      return prev;
    });
  }, [logAudit]);

  useEffect(() => {
    purgeExpiredTickets();
    const interval = setInterval(purgeExpiredTickets, 15000);
    return () => clearInterval(interval);
  }, [purgeExpiredTickets]);

  const simulateFastForward24Hours = useCallback(() => {
    setTickets(prev => {
      const resolved = prev.filter(t => t.status === 'RESOLVED');
      if (resolved.length === 0) {
        setNotification('ℹ️ No resolved tickets in queue to simulate 24-hour expiration.');
        return prev;
      }
      resolved.forEach(t => {
        logAudit('TICKET_RESOLVED', t.assetId, `Simulated 24-hour expiration: Ticket ${t.id} permanently removed.`);
      });
      setNotification(`⏱️ Simulated +24h Fast-Forward: ${resolved.length} resolved task(s) exceeded 24 hours and were permanently deleted.`);
      return prev.filter(t => t.status !== 'RESOLVED');
    });
  }, [logAudit]);

  const createTicketForAsset = useCallback((assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Check if open ticket exists
    const existing = tickets.find(t => t.assetId === assetId && t.status !== 'RESOLVED');
    if (existing) {
      setActiveTab('EXECUTE');
      setNotification(`ℹ️ Ticket already open for ${assetId}: ${existing.id}`);
      return;
    }

    const newTicket: KanbanTicket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      assetId: asset.id,
      assetName: asset.name,
      firmId: asset.firmId,
      title: `${asset.type} Remediation: ${asset.diagnosis.split('.')[0]}`,
      severity: asset.risk === 'HIGH' ? 'CRITICAL' : 'MODERATE',
      status: 'TODO',
      description: asset.diagnosis,
      recommendedAction: asset.recommendedAction,
      partsUsed: [],
      laborHours: 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setTickets(prev => [newTicket, ...prev]);
    setActiveTab('EXECUTE');
    logAudit('TICKET_RESOLVED', asset.id, `Created work order ticket ${newTicket.id} for ${asset.id}`);
    setNotification(`🎫 Work Order Generated: ${newTicket.id} added to To-Do queue.`);
  }, [assets, tickets, logAudit]);


  // ── Alert Rules Engine ──
  const firmAlertRules = useMemo(() => {
    return alertRules.filter(r => r.firmId === currentFirm.id);
  }, [alertRules, currentFirm.id]);

  const addAlertRule = useCallback((newRule: Omit<AlertRule, 'id' | 'firmId'>) => {
    const rule: AlertRule = {
      ...newRule,
      id: `RULE-${Math.floor(10 + Math.random() * 90)}`,
      firmId: currentFirm.id,
    };
    setAlertRules(prev => [rule, ...prev]);
    logAudit('ALERT_RULE_CHANGED', rule.assetId, `Added alerting rule: ${rule.metric} ${rule.condition} ${rule.threshold} -> ${rule.channel}`);
    setNotification(`🔔 Alert Rule Configured: ${rule.id} activated for ${rule.metric} telemetry.`);
  }, [currentFirm.id, logAudit]);

  const toggleAlertRule = useCallback((ruleId: string) => {
    setAlertRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const toggled = { ...r, isActive: !r.isActive };
        logAudit('ALERT_RULE_CHANGED', r.assetId, `Rule ${r.id} ${toggled.isActive ? 'activated' : 'paused'}`);
        return toggled;
      }
      return r;
    }));
  }, [logAudit]);

  const testAlertRule = useCallback((ruleId: string) => {
    const rule = alertRules.find(r => r.id === ruleId);
    if (rule) {
      setAlertRules(prev => prev.map(r => r.id === ruleId ? { ...r, lastTriggered: 'Just now' } : r));
      setNotification(`🚨 Alert Dispatched [${rule.channel}]: "${rule.metric} condition triggered for ${rule.assetId}" sent to ${rule.recipient}`);
    }
  }, [alertRules]);

  // ── Offline Mode Simulation ──
  const toggleOffline = useCallback(() => {
    setIsOffline(prev => {
      const next = !prev;
      if (next) {
        setNotification('📶 Entering Offline Field Mode. Telemetry cached locally. Edits will queue.');
      } else {
        setNotification('🌐 Reconnected to Cloud Grid. Offline synchronization ready.');
      }
      return next;
    });
  }, []);

  const syncOfflineQueue = useCallback(() => {
    if (offlineQueue.length === 0) {
      setNotification('✅ Everything up to date. No pending offline edits.');
      return;
    }
    const count = offlineQueue.length;
    setOfflineQueue([]);
    setIsOffline(false);
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setNotification(`🔄 Cloud Sync Complete: Successfully synchronized ${count} offline updates to central database.`);
  }, [offlineQueue]);

  // ── Asset Selection & Drawer ──
  const selectAsset = useCallback((id: string) => {
    setSelectedAssetId(id);
  }, []);

  const openDrawer = useCallback((id?: string) => {
    if (id) {
      setSelectedAssetId(id);
    }
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // ── Fault Injections ──
  const triggerTurbineAnomaly = useCallback(() => {
    setAssets(prev => prev.map(a => {
      if (a.id === 'WT-04') {
        return {
          ...a,
          risk: 'HIGH',
          sensors: {
            vibration: 4.8,
            temperature: 92.5,
            current: 850,
            soiling: 0,
          },
          energyLossMWh: 12.5,
          revenueLossUSD: 1920,
          diagnosis: 'CRITICAL: Severe bearing vibration (4.8 mm/s) & thermal escalation (92.5°C). Inner-ring spalling detected.',
        };
      }
      return a;
    }));
    setSelectedAssetId('WT-04');
    // Ensure WT-04 has open ticket
    setTickets(prev => {
      if (!prev.some(t => t.assetId === 'WT-04' && t.status === 'TODO')) {
        return [
          {
            id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
            assetId: 'WT-04',
            assetName: 'Wind Turbine Unit 4',
            firmId: 'firm-apex',
            title: 'Critical Inner-Ring Bearing Spalling Replacement',
            severity: 'CRITICAL',
            status: 'TODO',
            description: 'Vibration reached 4.8 mm/s with thermal escalation to 92.5°C.',
            recommendedAction: 'Immediate shutdown. Replace bearing cartridge.',
            partsUsed: [],
            laborHours: 0,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          },
          ...prev,
        ];
      }
      return prev;
    });
    setNotification('⚠️ Anomaly Injected: WT-04 bearing overheat & vibration failure (4.8 mm/s)! Ticket added to queue.');
  }, []);

  const triggerSolarAnomaly = useCallback(() => {
    setAssets(prev => prev.map(a => {
      if (a.id === 'SP-02') {
        return {
          ...a,
          risk: 'MODERATE',
          sensors: {
            vibration: 0.1,
            temperature: 52.0,
            current: 510,
            soiling: 45.0,
          },
          energyLossMWh: 4.2,
          revenueLossUSD: 650,
          diagnosis: 'MODERATE: Heavy dust and sand particulate soiling (45.0%). Generation yield degraded by 38%.',
        };
      }
      return a;
    }));
    setSelectedAssetId('SP-02');
    setTickets(prev => {
      if (!prev.some(t => t.assetId === 'SP-02' && t.status === 'TODO')) {
        return [
          {
            id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
            assetId: 'SP-02',
            assetName: 'Solar Array Sector 2',
            firmId: 'firm-apex',
            title: 'Automated Robotic De-dusting & Bypass Diode Inspection',
            severity: 'MODERATE',
            status: 'TODO',
            description: 'Dust soiling spiked to 45%. Array derated by 4.2 MWh/day.',
            recommendedAction: 'Deploy wash crawler bot and inspect diodes.',
            partsUsed: [],
            laborHours: 0,
            createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          },
          ...prev,
        ];
      }
      return prev;
    });
    setNotification('☀️ Anomaly Injected: SP-02 desert dust soiling spike at 45.0%! Ticket generated.');
  }, []);

  const resetAllHealthy = useCallback(() => {
    setAssets(prev => prev.map(a => ({
      ...a,
      risk: 'NORMAL',
      energyLossMWh: 0,
      revenueLossUSD: 0,
      scheduledTechnician: undefined,
      sensors: a.type === 'Wind' ? {
        vibration: 1.3,
        temperature: 62.0,
        current: 1230,
        soiling: 0,
      } : {
        vibration: 0.1,
        temperature: 45.0,
        current: 820,
        soiling: 7.0,
      },
      diagnosis: a.type === 'Wind'
        ? 'Rotor harmonic vibration and mechanical transmission nominal.'
        : 'Photovoltaic surface clean. Inverter in peak MPPT synchronization.',
    })));
    setNotification('✅ Fleet Baseline Restored: All assets returned to normal healthy baseline.');
  }, []);

  const markAsServiced = useCallback((id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          risk: 'SERVICED',
          energyLossMWh: 0,
          revenueLossUSD: 0,
          sensors: a.type === 'Wind' ? {
            vibration: 1.2,
            temperature: 60.0,
            current: 1240,
            soiling: 0,
          } : {
            vibration: 0.1,
            temperature: 44.0,
            current: 825,
            soiling: 5.0,
          },
          diagnosis: 'MAINTENANCE COMPLETE: Equipment inspected, serviced, and cleared by field technician.',
        };
      }
      return a;
    }));
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 }, colors: ['#10B981', '#0284C7', '#F59E0B'] });
    } catch {
      // ignore
    }
    setNotification(`🎉 Maintenance Completed: ${id} serviced and returned to active production!`);
  }, []);

  const scheduleVisit = useCallback((id: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          scheduledTechnician: a.type === 'Wind'
            ? 'Crew 4 (Lead: Mike Vance, Mechanical Rigging)'
            : 'Solar Ops Team (Lead: David Nguyen, PV Electrical)',
        };
      }
      return a;
    }));
    setNotification(`📅 Maintenance Visit Scheduled for ${id}. Technician dispatched.`);
  }, []);

  return (
    <SimpleAppContext.Provider
      value={{
        firms,
        users,
        currentFirm,
        currentUser,
        switchUser,
        technicianZoneFilter,
        setTechnicianZoneFilter,

        assets,
        firmAssets,
        visibleAssets,
        selectedAsset,
        selectedAssetId,
        selectAsset,
        activeTab,
        setActiveTab,
        filter,
        setFilter,

        createAsset,
        updateAsset,
        decommissionAsset,

        tickets: firmTickets,
        moveTicket,
        claimTicket,
        resolveTicket,
        createTicketForAsset,
        deleteTicket,
        simulateFastForward24Hours,
        purgeExpiredTickets,

        auditLogs,
        logAudit,
        alertRules: firmAlertRules,
        addAlertRule,
        toggleAlertRule,
        testAlertRule,

        isOffline,
        toggleOffline,
        offlineQueueCount: offlineQueue.length,
        syncOfflineQueue,

        isAddAssetModalOpen,
        setIsAddAssetModalOpen,
        isDecommissionModalOpen,
        setIsDecommissionModalOpen,
        decommissionTargetAsset,
        setDecommissionTargetAsset,
        isAlertRulesModalOpen,
        setIsAlertRulesModalOpen,
        isAuditLogModalOpen,
        setIsAuditLogModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAuthenticated,
        authenticateUser,
        logoutUser,

        // ⚡ INCIDENT COMMAND
        isIncidentCommandOpen,
        openIncidentCommand,
        closeIncidentCommand,

        // Environmental Intelligence & Sustainability
        environmentalConditions,
        energyRecoveredMWh,
        revenueProtectedINR,
        co2AvoidedTonnes,
        launchFailureSimulation,
        acceptOptimalMaintenancePlan,

        totalAssetsCount,
        atRiskCount,
        totalEnergyLossMWh,
        totalRevenueLossUSD,
        totalRevenueLossINR,
        fleetUptimePct,

        triggerTurbineAnomaly,
        triggerSolarAnomaly,
        resetAllHealthy,
        markAsServiced,
        scheduleVisit,

        isDrawerOpen,
        openDrawer,
        closeDrawer,

        theme,
        toggleTheme,
        setTheme: setThemeState,

        notification,
        clearNotification,
      }}
    >
      {children}
    </SimpleAppContext.Provider>

  );
};

export const useSimpleApp = () => {
  const context = useContext(SimpleAppContext);
  if (!context) {
    throw new Error('useSimpleApp must be used within a SimpleAppProvider');
  }
  return context;
};
