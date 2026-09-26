import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type { 
  Asset, 
  TelemetryLog, 
  ExecutiveKPIs, 
  WorkOrderTicket 
} from '../types';
import { INITIAL_ASSETS, generateInitialTelemetry } from '../lib/mockData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

interface TelemetryContextType {
  assets: Asset[];
  selectedAsset: Asset | undefined;
  selectedAssetId: string;
  selectAsset: (id: string) => void;
  telemetryHistory: TelemetryLog[];
  kpis: ExecutiveKPIs;
  workOrders: WorkOrderTicket[];
  isSupabaseLive: boolean;
  isRealtimeActive: boolean;
  activeFaultBanner: string | null;
  clearFaultBanner: () => void;
  
  // Presentation Demo Control Actions
  injectBearingOverheat: () => Promise<void>;
  injectSolarSoiling: () => Promise<void>;
  resetFleetBaseline: () => Promise<void>;
  dispatchMaintenance: (assetId: string) => Promise<WorkOrderTicket>;
  refreshFleetData: () => Promise<void>;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pm_assets_state') : null;
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [selectedAssetId, setSelectedAssetId] = useState<string>('TURBINE-004');
  
  const [telemetryMap, setTelemetryMap] = useState<Record<string, TelemetryLog[]>>(() => {
    const map: Record<string, TelemetryLog[]> = {};
    INITIAL_ASSETS.forEach(a => {
      map[a.id] = generateInitialTelemetry(a.id, a.type === 'Wind');
    });
    return map;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrderTicket[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pm_work_orders') : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [activeFaultBanner, setActiveFaultBanner] = useState<string | null>(null);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);

  // Sync to local storage for persistence across reloads in demo
  useEffect(() => {
    try {
      localStorage.setItem('pm_assets_state', JSON.stringify(assets));
    } catch {
      // ignore
    }
  }, [assets]);

  useEffect(() => {
    try {
      localStorage.setItem('pm_work_orders', JSON.stringify(workOrders));
    } catch {
      // ignore
    }
  }, [workOrders]);

  // Connect to Supabase or activate in-memory realtime
  const refreshFleetData = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      setIsSupabaseLive(false);
      setIsRealtimeActive(true); // Mock realtime active
      return;
    }

    try {
      const { data: assetsData, error: assetsErr } = await supabase
        .from('assets')
        .select('*')
        .order('id');

      if (assetsErr) throw assetsErr;

      if (assetsData && assetsData.length > 0) {
        setAssets(assetsData as Asset[]);
        setIsSupabaseLive(true);
        setIsRealtimeActive(true);
      }

      // Fetch telemetry for current selected asset
      const { data: logsData, error: logsErr } = await supabase
        .from('telemetry_logs')
        .select('*')
        .eq('asset_id', selectedAssetId)
        .order('timestamp', { ascending: true })
        .limit(50);

      if (!logsErr && logsData && logsData.length > 0) {
        setTelemetryMap(prev => ({
          ...prev,
          [selectedAssetId]: logsData as TelemetryLog[],
        }));
      }
    } catch (err) {
      console.warn('Could not query Supabase directly, staying on local/cached state:', err);
      setIsSupabaseLive(false);
      setIsRealtimeActive(true);
    }
  }, [selectedAssetId]);

  // Supabase Realtime Subscriptions
  useEffect(() => {
    refreshFleetData();

    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) {
      setIsRealtimeActive(true);
      return;
    }

    // Subscribe to asset changes
    const assetChannel = supabase
      .channel('public:assets')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Asset;
            setAssets(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
          } else if (payload.eventType === 'INSERT') {
            const newAsset = payload.new as Asset;
            setAssets(prev => [...prev.filter(a => a.id !== newAsset.id), newAsset]);
          }
        }
      )
      .subscribe((status) => {
        setIsRealtimeActive(status === 'SUBSCRIBED');
      });

    // Subscribe to telemetry logs
    const telemetryChannel = supabase
      .channel('public:telemetry_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry_logs' },
        (payload) => {
          const newLog = payload.new as TelemetryLog;
          setTelemetryMap(prev => {
            const current = prev[newLog.asset_id] || [];
            return {
              ...prev,
              [newLog.asset_id]: [...current.slice(-29), newLog], // keep last 30
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(assetChannel);
      supabase.removeChannel(telemetryChannel);
    };
  }, [refreshFleetData]);

  // Selected asset computation
  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Selected telemetry computation
  const telemetryHistory = useMemo(() => {
    if (!selectedAsset) return [];
    if (telemetryMap[selectedAsset.id]) {
      return telemetryMap[selectedAsset.id];
    }
    const fresh = generateInitialTelemetry(selectedAsset.id, selectedAsset.type === 'Wind');
    return fresh;
  }, [selectedAsset, telemetryMap]);

  // KPI Calculations
  const kpis: ExecutiveKPIs = useMemo(() => {
    const total = assets.length;
    const criticalCount = assets.filter(a => a.status === 'CRITICAL').length;
    const warningCount = assets.filter(a => a.status === 'WARNING').length;

    // Operational efficiency: weighted health scores
    const avgHealth = total > 0 
      ? Math.round(assets.reduce((sum, a) => sum + a.health_score, 0) / total * 10) / 10 
      : 95.0;

    // Revenue at Risk: sum of estimated daily loss
    const totalLoss = assets.reduce((sum, a) => sum + (Number(a.est_daily_loss) || 0), 0);

    // Total power generation
    let totalMW = 0;
    assets.forEach(a => {
      const logs = telemetryMap[a.id];
      if (logs && logs.length > 0) {
        totalMW += logs[logs.length - 1].power_output_mw;
      } else {
        totalMW += a.type === 'Wind' ? 2.5 : 1.8;
      }
    });

    return {
      totalActiveAssets: total,
      operationalEfficiency: avgHealth,
      criticalAlertsCount: criticalCount,
      warningAlertsCount: warningCount,
      totalRevenueAtRisk: Math.round(totalLoss),
      totalPowerGenerationMW: Math.round(totalMW * 10) / 10,
    };
  }, [assets, telemetryMap]);

  const selectAsset = useCallback((id: string) => {
    setSelectedAssetId(id);
  }, []);

  const clearFaultBanner = useCallback(() => {
    setActiveFaultBanner(null);
  }, []);

  // HACKATHON DEMO ACTION 1: Inject Bearing Overheat Fault (Turbine-004)
  const injectBearingOverheat = useCallback(async () => {
    const targetId = 'TURBINE-004';
    setSelectedAssetId(targetId);

    const now = new Date().toISOString();
    const updatedFields: Partial<Asset> = {
      status: 'CRITICAL',
      health_score: 28,
      est_daily_loss: 1920.00,
      recommended_action: 'CRITICAL ALARM: Immediate emergency brake application required. Dispatched field technician crew for main bearing replacement.',
      root_cause_analysis: 'High vibration (4.82 mm/s) and severe thermal escalation (92.5°C) in high-speed shaft bearing. Severe inner-ring race spalling with 96.8% catastrophic failure probability within 18 hours.',
      fault_type: 'BEARING_THERMAL_RUNAWAY',
      updated_at: now,
    };

    const newTelemetryPoint: TelemetryLog = {
      id: `${targetId}-fault-${Date.now()}`,
      asset_id: targetId,
      temperature: 92.5,
      vibration: 4.82,
      voltage: 685.0,
      current_amps: 1420.0,
      soiling_index: 0,
      power_output_mw: 0.85, // Degraded output
      timestamp: now,
    };

    // Update Local State immediately
    setAssets(prev => prev.map(a => a.id === targetId ? { ...a, ...updatedFields } : a));
    setTelemetryMap(prev => {
      const current = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: [...current, newTelemetryPoint],
      };
    });

    setActiveFaultBanner('CRITICAL FAULT INJECTED: Altamont Pass Turbine 4 bearing temperature escalated to 92.5°C with 4.82 mm/s vibration!');

    // Update Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('assets').update(updatedFields).eq('id', targetId);
        await supabase.from('telemetry_logs').insert([newTelemetryPoint]);
      } catch (err) {
        console.error('Supabase fault injection error:', err);
      }
    }
  }, []);

  // HACKATHON DEMO ACTION 2: Inject Solar Panel Soiling Fault (Solar-002)
  const injectSolarSoiling = useCallback(async () => {
    const targetId = 'SOLAR-002';
    setSelectedAssetId(targetId);

    const now = new Date().toISOString();
    const updatedFields: Partial<Asset> = {
      status: 'WARNING',
      health_score: 64,
      est_daily_loss: 650.00,
      recommended_action: 'WARNING: Optical transmittance degraded. Deploy automated dry-sweep crawler or schedule night water-wash within 24 hours.',
      root_cause_analysis: 'Particulate accretion and heavy particulate soiling detected across PV string arrays. Soiling index spiked to 45.0%, resulting in 34.5% output loss compared to reference irradiance.',
      fault_type: 'SURFACE_SOILING_DEGRADATION',
      updated_at: now,
    };

    const newTelemetryPoint: TelemetryLog = {
      id: `${targetId}-fault-${Date.now()}`,
      asset_id: targetId,
      temperature: 49.2,
      vibration: 0.11,
      voltage: 630.0,
      current_amps: 580.0,
      soiling_index: 45.0,
      power_output_mw: 1.15, // Degraded from ~1.9 MW
      timestamp: now,
    };

    setAssets(prev => prev.map(a => a.id === targetId ? { ...a, ...updatedFields } : a));
    setTelemetryMap(prev => {
      const current = prev[targetId] || [];
      return {
        ...prev,
        [targetId]: [...current, newTelemetryPoint],
      };
    });

    setActiveFaultBanner('WARNING FAULT INJECTED: Mojave Desert Array A2 soiling escalated to 45.0% - MPPT generation degraded.');

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('assets').update(updatedFields).eq('id', targetId);
        await supabase.from('telemetry_logs').insert([newTelemetryPoint]);
      } catch (err) {
        console.error('Supabase fault injection error:', err);
      }
    }
  }, []);

  // HACKATHON DEMO ACTION 3: Reset Fleet Baseline
  const resetFleetBaseline = useCallback(async () => {
    const now = new Date().toISOString();
    const resetAssets = INITIAL_ASSETS.map(a => ({
      ...a,
      status: 'HEALTHY' as const,
      est_daily_loss: 0,
      updated_at: now,
    }));

    const freshMap: Record<string, TelemetryLog[]> = {};
    resetAssets.forEach(a => {
      freshMap[a.id] = generateInitialTelemetry(a.id, a.type === 'Wind');
    });

    setAssets(resetAssets);
    setTelemetryMap(freshMap);
    setActiveFaultBanner(null);

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        for (const a of resetAssets) {
          await supabase.from('assets').update({
            status: 'HEALTHY',
            health_score: a.health_score,
            est_daily_loss: 0,
            recommended_action: a.recommended_action,
            updated_at: now,
          }).eq('id', a.id);
        }
      } catch (err) {
        console.error('Supabase reset error:', err);
      }
    }
  }, []);

  // ACTION: Dispatch Maintenance Crew
  const dispatchMaintenance = useCallback(async (assetId: string) => {
    const target = assets.find(a => a.id === assetId) || selectedAsset;
    const ticketId = `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: WorkOrderTicket = {
      id: ticketId,
      asset_id: assetId,
      asset_name: target?.name || assetId,
      severity: target?.status === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      description: target?.root_cause_analysis || 'Field maintenance inspection and sensor diagnostic verification.',
      recommended_action: target?.recommended_action || 'Execute diagnostic protocol and replace degraded components.',
      dispatched_at: now,
      crew_lead: target?.type === 'Wind' ? 'Crew Alpha-7 (Lead: M. Vance, Rigging/Mechanical)' : 'Solar Field Crew 3 (Lead: D. Nguyen, PV Electrical)',
      status: 'DISPATCHED',
    };

    setWorkOrders(prev => [newTicket, ...prev]);

    // Update asset status to MAINTENANCE_DISPATCHED
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          status: 'MAINTENANCE_DISPATCHED',
          recommended_action: `WORK ORDER #${ticketId} ACTIVE: Maintenance crew dispatched to site.`,
        };
      }
      return a;
    }));

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#10B981', '#F59E0B'],
      });
    } catch {
      // Ignore if canvas not accessible
    }

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('assets').update({
          status: 'MAINTENANCE_DISPATCHED',
          recommended_action: `WORK ORDER #${ticketId} ACTIVE: Maintenance crew dispatched to site.`,
          updated_at: now,
        }).eq('id', assetId);
      } catch (err) {
        console.error('Supabase work order update error:', err);
      }
    }

    return newTicket;
  }, [assets, selectedAsset]);

  return (
    <TelemetryContext.Provider
      value={{
        assets,
        selectedAsset,
        selectedAssetId,
        selectAsset,
        telemetryHistory,
        kpis,
        workOrders,
        isSupabaseLive,
        isRealtimeActive,
        activeFaultBanner,
        clearFaultBanner,
        injectBearingOverheat,
        injectSolarSoiling,
        resetFleetBaseline,
        dispatchMaintenance,
        refreshFleetData,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
