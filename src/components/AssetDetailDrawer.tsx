import React, { useState, useEffect } from 'react';
import {
  X,
  Wind,
  Sun,
  Activity,
  Thermometer,
  Zap,
  Droplets,
  Wrench,
  Clock,
  TrendingDown,
  CheckCircle,
  CalendarPlus,
  ExternalLink,
  Settings,
  TrendingUp,
  AlertTriangle,
  Trash2,
  Save,
  Cpu,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useSimpleApp } from '../context/SimpleAppContext';

const RISK_THEMES = {
  dark: {
    HIGH: {
      label: 'HIGH RISK',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-500 status-dot-urgent shadow-[0_0_12px_rgba(239,68,68,0.9)]',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.65)]',
    },
    NORMAL: {
      label: 'HEALTHY',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400 status-dot-breathe shadow-[0_0_8px_rgba(16,185,129,0.55)]',
    },
    SERVICED: {
      label: 'SERVICED',
      badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
    },
  },
  light: {
    HIGH: {
      label: 'HIGH RISK',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs',
      dot: 'bg-rose-600 status-dot-urgent shadow-[0_0_8px_rgba(225,29,72,0.6)]',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs',
      dot: 'bg-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.5)]',
    },
    NORMAL: {
      label: 'HEALTHY',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs',
      dot: 'bg-emerald-500 status-dot-breathe shadow-[0_0_6px_rgba(16,185,129,0.5)]',
    },
    SERVICED: {
      label: 'SERVICED',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 shadow-xs',
      dot: 'bg-sky-500 shadow-[0_0_6px_rgba(2,132,199,0.5)]',
    },
  },
};

const SensorGauge: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  normal: number;
  warning: number;
  critical: number;
  isDark: boolean;
}> = ({ label, icon, value, unit, normal, warning, critical, isDark }) => {
  const isCurrent = label.toLowerCase().includes('current');
  const isCritical = isCurrent ? value <= critical : value >= critical;
  const isWarning = isCurrent ? (!isCritical && value <= warning) : (!isCritical && value >= warning);
  const pct = isCurrent
    ? Math.min(100, (value / (normal * 1.3)) * 100)
    : Math.min(100, (value / (critical * 1.15)) * 100);

  const barColor = isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-500';
  const valColor = isCritical
    ? isDark ? 'text-rose-400 font-bold' : 'text-rose-600 font-bold'
    : isWarning
    ? isDark ? 'text-amber-400 font-bold' : 'text-amber-600 font-bold'
    : isDark ? 'text-zinc-100 font-semibold' : 'text-slate-800 font-semibold';

  const statusLabel = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Normal';
  const statusBadge = isCritical
    ? isDark ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-rose-700 bg-rose-50 border-rose-200'
    : isWarning
    ? isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-700 bg-amber-50 border-amber-200'
    : isDark ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  return (
    <div
      className={`rounded-xl p-3.5 border transition-colors duration-300 ${
        isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{icon}</span>
          <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${valColor}`}>
            {value} <span className={`text-xs font-normal ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{unit}</span>
          </span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${statusBadge}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.max(4, Math.min(100, pct))}%` }}
        />
      </div>

      <div className={`flex justify-between text-[10px] mt-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
        <span>0</span>
        <span>Norm {isCurrent ? `≥${normal}` : `≤${normal}`}</span>
        <span>Warn {isCurrent ? `≤${warning}` : `≥${warning}`}</span>
        <span className={isCritical ? (isDark ? 'text-rose-400 font-semibold' : 'text-rose-600 font-semibold') : ''}>
          Crit {isCurrent ? `≤${critical}` : `≥${critical}`}
        </span>
      </div>
    </div>
  );
};

export const AssetDetailDrawer: React.FC = () => {
  const {
    selectedAsset,
    isDrawerOpen,
    closeDrawer,
    markAsServiced,
    createTicketForAsset,
    setActiveTab,
    theme,
    updateAsset,
    setDecommissionTargetAsset,
    setIsDecommissionModalOpen,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [drawerTab, setDrawerTab] = useState<'TELEMETRY' | 'FORECAST' | 'SETTINGS'>('TELEMETRY');

  // Local state for editing settings
  const [editName, setEditName] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editFirmware, setEditFirmware] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editVibCrit, setEditVibCrit] = useState('');
  const [editTempCrit, setEditTempCrit] = useState('');
  const [editCurrCrit, setEditCurrCrit] = useState('');
  const [editSoilingCrit, setEditSoilingCrit] = useState('');

  useEffect(() => {
    if (selectedAsset) {
      setEditName(selectedAsset.name);
      setEditModel(selectedAsset.modelNumber || '');
      setEditFirmware(selectedAsset.firmwareVersion || '');
      setEditLocation(selectedAsset.location);
      setEditVibCrit(String(selectedAsset.thresholds.vibration.critical));
      setEditTempCrit(String(selectedAsset.thresholds.temperature.critical));
      setEditCurrCrit(String(selectedAsset.thresholds.current.critical));
      setEditSoilingCrit(String(selectedAsset.thresholds.soiling.critical));
    }
  }, [selectedAsset]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen || !selectedAsset) return null;

  const currentThemeMap = isDark ? RISK_THEMES.dark : RISK_THEMES.light;
  const themeStyles = currentThemeMap[selectedAsset.risk] || currentThemeMap.NORMAL;
  const { sensors, thresholds } = selectedAsset;

  const handleQueue = () => {
    createTicketForAsset(selectedAsset.id);
  };

  const handleService = () => {
    markAsServiced(selectedAsset.id);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAsset(selectedAsset.id, {
      name: editName,
      modelNumber: editModel,
      firmwareVersion: editFirmware,
      location: editLocation,
      thresholds: {
        ...selectedAsset.thresholds,
        vibration: {
          ...selectedAsset.thresholds.vibration,
          critical: parseFloat(editVibCrit) || selectedAsset.thresholds.vibration.critical,
        },
        temperature: {
          ...selectedAsset.thresholds.temperature,
          critical: parseFloat(editTempCrit) || selectedAsset.thresholds.temperature.critical,
        },
        current: {
          ...selectedAsset.thresholds.current,
          critical: parseFloat(editCurrCrit) || selectedAsset.thresholds.current.critical,
        },
        soiling: {
          ...selectedAsset.thresholds.soiling,
          critical: parseFloat(editSoilingCrit) || selectedAsset.thresholds.soiling.critical,
        },
      },
    });
    setDrawerTab('TELEMETRY');
  };

  const handleOpenDecommission = () => {
    setDecommissionTargetAsset(selectedAsset);
    setIsDecommissionModalOpen(true);
  };

  // Cost of Inaction calculations
  const repairCost = selectedAsset.estimatedRepairHours * 150 + (selectedAsset.type === 'Wind' ? 800 : 250);
  const cost7Days = repairCost + selectedAsset.revenueLossUSD * 7;
  const catastrophicCost = selectedAsset.type === 'Wind' ? 45000 : 18500;
  const roiSavings = Math.round(((catastrophicCost - repairCost) / catastrophicCost) * 100);

  // Predictive Forecast Data
  const forecastData = selectedAsset.forecast || [
    { day: 'Day -6', actual: 1.2, predicted: 1.2, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Day -4', actual: 1.3, predicted: 1.3, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Day -2', actual: 1.4, predicted: 1.4, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Today', actual: selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling, predicted: selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+3d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.05, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+7d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.15, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+14d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.3, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
  ];

  const isAtRisk = selectedAsset.risk === 'HIGH' || selectedAsset.risk === 'MODERATE';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <aside
        className={`absolute inset-y-0 right-0 max-w-full w-full sm:w-[580px] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out ${
          isDark
            ? 'bg-[#121212]/95 backdrop-blur-xl border-l border-white/[0.08] text-zinc-100'
            : 'bg-white/95 backdrop-blur-xl border-l border-slate-200 text-slate-900'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between transition-colors duration-300 ${
            isDark ? 'border-white/[0.08]' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                selectedAsset.type === 'Wind'
                  ? isDark
                    ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                    : 'bg-sky-50 border-sky-200 text-sky-600'
                  : isDark
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-600'
              }`}
            >
              {selectedAsset.type === 'Wind' ? <Wind size={20} /> : <Sun size={20} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold tracking-tight">{selectedAsset.id}</h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${themeStyles.badge}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${themeStyles.dot}`} />
                  {themeStyles.label}
                </span>
              </div>
              <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {selectedAsset.name} · {selectedAsset.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={closeDrawer}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Close Drawer (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Drawer */}
        <div
          className={`px-5 border-b flex gap-4 text-xs font-semibold transition-colors ${
            isDark ? 'border-zinc-800 bg-[#18181B]/60' : 'border-slate-200 bg-slate-50/70'
          }`}
        >
          <button
            onClick={() => setDrawerTab('TELEMETRY')}
            className={`py-2.5 border-b-2 transition-all ${
              drawerTab === 'TELEMETRY'
                ? 'border-sky-500 text-sky-500'
                : isDark ? 'border-transparent text-zinc-400 hover:text-zinc-200' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Telemetry &amp; Diagnosis
          </button>
          <button
            onClick={() => setDrawerTab('FORECAST')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-all ${
              drawerTab === 'FORECAST'
                ? 'border-amber-500 text-amber-500'
                : isDark ? 'border-transparent text-zinc-400 hover:text-zinc-200' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp size={13} />
            <span>Predictive Forecast ("Crystal Ball")</span>
          </button>
          <button
            onClick={() => setDrawerTab('SETTINGS')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition-all ${
              drawerTab === 'SETTINGS'
                ? 'border-sky-500 text-sky-500'
                : isDark ? 'border-transparent text-zinc-400 hover:text-zinc-200' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings size={13} />
            <span>Settings &amp; Edit</span>
          </button>
        </div>

        {/* Action Quick-Bar */}
        <div
          className={`px-5 py-2.5 border-b flex items-center gap-2 flex-wrap transition-colors duration-300 ${
            isDark ? 'bg-[#18181B] border-zinc-800/60' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          {isAtRisk && (
            <>
              <button
                onClick={handleQueue}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs"
              >
                <CalendarPlus size={14} />
                Generate Work Order Ticket
              </button>
              <button
                onClick={handleService}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs"
              >
                <CheckCircle size={14} />
                Mark as Serviced
              </button>
            </>
          )}

          {!isAtRisk && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <CheckCircle size={13} />
              Equipment Operating at Peak Baseline
            </span>
          )}

          <button
            onClick={() => {
              setActiveTab('INSPECTOR');
              closeDrawer();
            }}
            className={`ml-auto inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors border ${
              isDark
                ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border-zinc-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white border-slate-200'
            }`}
          >
            Sensor View
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* TAB 1: TELEMETRY & DIAGNOSIS */}
          {drawerTab === 'TELEMETRY' && (
            <>
              {/* Loss Summary Banner (if at risk) */}
              {isAtRisk && (
                <div
                  className={`rounded-xl p-3.5 flex items-center justify-between border ${
                    isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div>
                    <p className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-rose-300/80' : 'text-rose-700'}`}>
                      Operational Impact
                    </p>
                    <p className={`text-base font-bold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                      -${selectedAsset.revenueLossUSD.toLocaleString()} / day
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-rose-300/80' : 'text-rose-700'}`}>
                      Energy Derate
                    </p>
                    <p className={`text-sm font-bold ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                      {selectedAsset.energyLossMWh} MWh / day
                    </p>
                  </div>
                </div>
              )}

              {/* 4 Sensor Telemetry Meters */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Live Sensor Readings
                  </h3>
                  <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Edge SCADA · 1 Hz</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <SensorGauge
                    label="Vibration"
                    icon={<Activity size={15} />}
                    value={sensors.vibration}
                    unit="mm/s"
                    normal={thresholds.vibration.normal}
                    warning={thresholds.vibration.warning}
                    critical={thresholds.vibration.critical}
                    isDark={isDark}
                  />
                  <SensorGauge
                    label="Temperature"
                    icon={<Thermometer size={15} />}
                    value={sensors.temperature}
                    unit="°C"
                    normal={thresholds.temperature.normal}
                    warning={thresholds.temperature.warning}
                    critical={thresholds.temperature.critical}
                    isDark={isDark}
                  />
                  <SensorGauge
                    label="Current Draw"
                    icon={<Zap size={15} />}
                    value={sensors.current}
                    unit="A"
                    normal={thresholds.current.normal}
                    warning={thresholds.current.warning}
                    critical={thresholds.current.critical}
                    isDark={isDark}
                  />
                  <SensorGauge
                    label="Panel Soiling"
                    icon={<Droplets size={15} />}
                    value={sensors.soiling}
                    unit="%"
                    normal={thresholds.soiling.normal}
                    warning={thresholds.soiling.warning}
                    critical={thresholds.soiling.critical}
                    isDark={isDark}
                  />
                </div>
              </div>

              {/* AI Diagnostics & Remediation */}
              <div
                className={`rounded-xl p-4 border space-y-3 transition-colors duration-300 ${
                  isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div>
                  <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">
                    AI Anomaly Diagnostics
                  </p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                    {selectedAsset.diagnosis}
                  </p>
                </div>

                <div className={`pt-2.5 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                  <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wider mb-1">
                    Prescribed Maintenance Action
                  </p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    {selectedAsset.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Maintenance Specs */}
              <div
                className={`rounded-xl p-3.5 border transition-colors duration-300 ${
                  isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs pb-2 border-b ${
                    isDark ? 'text-zinc-400 border-zinc-800' : 'text-slate-500 border-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    Estimated Labor Window
                  </span>
                  <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {selectedAsset.estimatedRepairHours} hours
                  </span>
                </div>

                <div className="pt-2.5">
                  <p className={`text-[11px] font-medium flex items-center gap-1.5 mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    <Wrench size={13} />
                    Required Tooling &amp; Parts:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAsset.requiredTools.map((tool) => (
                      <span
                        key={tool}
                        className={`text-[11px] px-2 py-0.5 rounded-md border ${
                          isDark
                            ? 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PREDICTIVE FORECASTING ("CRYSTAL BALL") */}
          {drawerTab === 'FORECAST' && (
            <div className="space-y-4">
              {/* Future Time-To-Failure Projection Alert */}
              <div
                className={`p-4 rounded-xl border ${
                  isAtRisk
                    ? isDark
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                    : isDark
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle size={16} className={isAtRisk ? 'text-rose-500' : 'text-emerald-500'} />
                  <p className="text-xs font-bold uppercase tracking-wider">
                    {isAtRisk ? 'Predicted Critical Failure Horizon' : 'Predictive Health Trajectory'}
                  </p>
                </div>
                <p className="text-sm font-bold">
                  {isAtRisk
                    ? 'Estimated Critical Breakdown: 14 Days (Threshold breach at Day +7)'
                    : 'Operational Lifespan Nominal: >180 Days at current wear progression'}
                </p>
                <p className="text-xs opacity-85 mt-1 leading-relaxed">
                  {isAtRisk
                    ? `Machine learning wear degradation model extrapolates ${selectedAsset.type === 'Wind' ? 'bearing vibration will reach 6.8 mm/s' : 'dust soiling will breach 65%'} without immediate intervention.`
                    : 'Component degradation slope is within standard ISO vibration/efficiency tolerances.'}
                </p>
              </div>

              {/* 14-Day Forecasting Chart */}
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      14-Day Predictive Degradation Curve
                    </h4>
                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {selectedAsset.type === 'Wind' ? 'Vibration (mm/s)' : 'Soiling Index (%)'} Projected into Future
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30">
                    AI ML Model v2.4
                  </span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e2e8f0'} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: isDark ? '#a1a1aa' : '#64748b', fontSize: 10 }}
                        axisLine={{ stroke: isDark ? '#3f3f46' : '#cbd5e1' }}
                      />
                      <YAxis
                        tick={{ fill: isDark ? '#a1a1aa' : '#64748b', fontSize: 10 }}
                        axisLine={{ stroke: isDark ? '#3f3f46' : '#cbd5e1' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#18181b' : '#ffffff',
                          borderColor: isDark ? '#3f3f46' : '#e2e8f0',
                          color: isDark ? '#f4f4f5' : '#0f172a',
                          fontSize: '11px',
                          borderRadius: '8px',
                        }}
                      />
                      {/* Critical Threshold Line */}
                      <ReferenceLine
                        y={forecastData[0]?.criticalThreshold}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Critical Threshold',
                          fill: '#ef4444',
                          fontSize: 9,
                          position: 'top',
                        }}
                      />
                      {/* Warning Threshold Line */}
                      <ReferenceLine
                        y={forecastData[0]?.warningThreshold}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{
                          value: 'Warning Limit',
                          fill: '#f59e0b',
                          fontSize: 9,
                          position: 'bottom',
                        }}
                      />
                      {/* Actual Historical Telemetry */}
                      <Line
                        type="monotone"
                        dataKey="actual"
                        name="Actual Telemetry"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#0284c7' }}
                      />
                      {/* Projected Future Telemetry */}
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Projected Trend"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        strokeDasharray="4 4"
                        dot={{ r: 3, fill: '#f59e0b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-[10px] mt-2 pt-2 border-t border-zinc-800">
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="w-2.5 h-0.5 bg-sky-500 inline-block" /> Actual Sensor History
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-0.5 bg-amber-500 border-t border-dashed inline-block" /> ML Predicted Trajectory
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-0.5 bg-rose-500 inline-block" /> Critical Limit
                  </span>
                </div>
              </div>

              {/* Economic Cost Differential */}
              <div
                className={`rounded-xl p-4 border space-y-3 transition-colors duration-300 ${
                  isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingDown size={15} className="text-rose-500" />
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                    Economic Impact of Delaying Action
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className={`text-[10px] uppercase font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Action Today</p>
                    <p className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>${repairCost.toLocaleString()}</p>
                    <p className={`text-[9px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Standard Servicing</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                    <p className={`text-[10px] uppercase font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Day +7</p>
                    <p className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>${Math.round(cost7Days).toLocaleString()}</p>
                    <p className={`text-[9px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Derate + Repair</p>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
                    <p className={`text-[10px] uppercase font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Day +14 Breakdown</p>
                    <p className={`text-sm font-bold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>${Math.round(catastrophicCost).toLocaleString()}</p>
                    <p className={`text-[9px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Catastrophic Damage</p>
                  </div>
                </div>

                <div className={`flex items-center gap-3 rounded-lg p-2.5 border ${isDark ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-200 text-sky-800'}`}>
                    {roiSavings}%
                  </div>
                  <p className={`text-xs ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Predictive replacement today saves <span className="font-semibold text-sky-400">{roiSavings}%</span> compared to catastrophic machine breakdown.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & EDIT (CRUD UPDATE & DECOMMISSION) */}
          {drawerTab === 'SETTINGS' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} className="text-sky-500" />
                  Hardware Configuration &amp; Operating Limits
                </h4>
                <span className="text-[11px] font-mono opacity-70">Tag: {selectedAsset.id}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Asset Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Hardware Model</label>
                  <input
                    type="text"
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Firmware Version</label>
                  <input
                    type="text"
                    value={editFirmware}
                    onChange={(e) => setEditFirmware(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                      isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Assigned Geographic Site</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Threshold Configuration */}
              <div className={`p-3.5 rounded-xl border space-y-3 ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  At-Risk Critical Threshold Limits
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] opacity-75 mb-1">Vibration Critical (mm/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editVibCrit}
                      onChange={(e) => setEditVibCrit(e.target.value)}
                      className="w-full p-2 rounded border font-mono text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] opacity-75 mb-1">Temperature Critical (°C)</label>
                    <input
                      type="number"
                      value={editTempCrit}
                      onChange={(e) => setEditTempCrit(e.target.value)}
                      className="w-full p-2 rounded border font-mono text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] opacity-75 mb-1">Current Critical (A)</label>
                    <input
                      type="number"
                      value={editCurrCrit}
                      onChange={(e) => setEditCurrCrit(e.target.value)}
                      className="w-full p-2 rounded border font-mono text-xs bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] opacity-75 mb-1">Soiling Critical (%)</label>
                    <input
                      type="number"
                      value={editSoilingCrit}
                      onChange={(e) => setEditSoilingCrit(e.target.value)}
                      className="w-full p-2 rounded border font-mono text-xs bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <Save size={14} />
                  <span>Save Configuration</span>
                </button>
              </div>

              {/* Danger Zone: Decommission Asset */}
              <div
                className={`pt-4 mt-6 border-t ${
                  isDark ? 'border-zinc-800' : 'border-slate-200'
                }`}
              >
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-rose-500">Decommission Hardware</p>
                    <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Purge asset from telemetry ingestion &amp; central SCADA. Requires confirmation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenDecommission}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Trash2 size={13} />
                    <span>Decommission</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
};
