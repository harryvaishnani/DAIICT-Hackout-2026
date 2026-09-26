import React from 'react';
import { Wind, Sun, Thermometer, Zap, Droplets, Activity, TrendingDown, CheckCircle, ArrowLeft } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useSimpleApp } from '../context/SimpleAppContext';

// ──────────────────────────────────────────────
// Sensor Threshold Progress Bar
// ──────────────────────────────────────────────
const SensorBar: React.FC<{
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

  const status = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NORMAL';

  return (
    <div
      className={`rounded-xl border p-4 shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={isCritical ? (isDark ? 'text-rose-400' : 'text-rose-600') : isWarning ? (isDark ? 'text-amber-400' : 'text-amber-600') : (isDark ? 'text-zinc-400' : 'text-slate-400')}>
            {icon}
          </span>
          <span className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</span>
        </div>
        <div className="text-right">
          <span className={`text-base font-bold ${valColor}`}>{value.toFixed(1)}</span>
          <span className={`text-xs ml-1 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>{unit}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`relative h-1.5 rounded-full overflow-hidden mb-2 ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>

      {/* Scale labels */}
      <div className={`flex justify-between text-[10px] mb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
        <span>0</span>
        {isCurrent ? (
          <>
            <span className={isDark ? 'text-rose-400/80' : 'text-rose-600'}>Crit ≤{critical}</span>
            <span>Warn ≤{warning}</span>
            <span>Norm ≥{normal}</span>
          </>
        ) : (
          <>
            <span>Norm ≤{normal}</span>
            <span>Warn ≥{warning}</span>
            <span className={isDark ? 'text-rose-400/80' : 'text-rose-600'}>Crit ≥{critical}</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-end">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            isCritical
              ? isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
              : isWarning
              ? isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
              : isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Cost of Inaction Calculator
// ──────────────────────────────────────────────
const CostCalculator: React.FC<{ revenueLossPerDay: number; estimatedRepairHours: number; isDark: boolean }> = ({
  revenueLossPerDay,
  estimatedRepairHours,
  isDark,
}) => {
  const repairCost = estimatedRepairHours * 120 + 350;
  const cost7Days = revenueLossPerDay * 7 + repairCost * 1.3;
  const catastrophicCost = revenueLossPerDay * 21 + 24000;
  const roiSavings = Math.round(((catastrophicCost - repairCost) / catastrophicCost) * 100);

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-colors duration-300 ${
        isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80'
      }`}
    >
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
        <TrendingDown size={15} className="text-rose-500" />
        Cost of Inaction Analysis
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={`border rounded-xl p-3 text-center ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className={`text-[10px] mb-1 uppercase font-semibold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Fix Today</p>
          <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>${repairCost.toLocaleString()}</p>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Parts + Labor</p>
        </div>
        <div className={`border rounded-xl p-3 text-center ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
          <p className={`text-[10px] mb-1 uppercase font-semibold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>After 7 Days</p>
          <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>${Math.round(cost7Days).toLocaleString()}</p>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Loss + Repair</p>
        </div>
        <div className={`border rounded-xl p-3 text-center ${isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-200'}`}>
          <p className={`text-[10px] mb-1 uppercase font-semibold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Catastrophic</p>
          <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>${Math.round(catastrophicCost).toLocaleString()}</p>
          <p className={`text-[10px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>Full Breakdown</p>
        </div>
      </div>

      <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${isDark ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-sky-200 text-sky-800'}`}>
          {roiSavings}%
        </div>
        <div>
          <p className={`text-xs font-bold ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>Preventive Maintenance ROI</p>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Fixing now avoids catastrophic failure, saving {roiSavings}% of potential replacement costs.</p>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Custom Tooltip for Recharts
// ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-2 text-xs shadow-xl text-white">
        <p className="text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-bold text-white">
            {p.name}: {Number(p.value).toFixed(1)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ──────────────────────────────────────────────
// Main Inspector View
// ──────────────────────────────────────────────
export const SensorInspectorView: React.FC = () => {
  const { selectedAsset, setActiveTab, theme } = useSimpleApp();
  const isDark = theme === 'dark';
  const asset = selectedAsset;

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center">
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${isDark ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
          <Activity size={24} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
        </div>
        <div>
          <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Asset Selected</h3>
          <p className={`text-xs max-w-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Go to Fleet Overview and select any asset card to inspect full telemetry.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('FLEET')}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700/60'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
          }`}
        >
          <ArrowLeft size={14} />
          Go to Fleet Overview
        </button>
      </div>
    );
  }

  const isWind = asset.type === 'Wind';
  const { sensors, thresholds, history } = asset;

  const chartData = (history || []).map((h) => ({
    day: h.day,
    value: h.primarySensorValue,
  }));

  const primarySensorLabel = isWind ? 'Vibration (mm/s)' : 'Soiling (%)';
  const primarySensorColor = isWind ? '#F59E0B' : '#0284C7';

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Asset Header */}
      <div
        className={`flex items-center gap-3 flex-wrap p-4 rounded-2xl border shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80'
        }`}
      >
        <div
          className={`rounded-xl p-2.5 border ${
            isDark
              ? isWind ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : isWind ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-amber-50 border-amber-200 text-amber-600'
          }`}
        >
          {isWind ? <Wind size={22} /> : <Sun size={22} />}
        </div>
        <div>
          <h2 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {asset.id} — {asset.name}
          </h2>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>📍 {asset.location}</p>
        </div>
        <div className="ml-auto">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
              asset.risk === 'HIGH'
                ? isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
                : asset.risk === 'MODERATE'
                ? isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'
                : asset.risk === 'SERVICED'
                ? isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-700'
                : isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {asset.risk === 'HIGH'
              ? '● HIGH RISK'
              : asset.risk === 'MODERATE'
              ? '● MODERATE RISK'
              : asset.risk === 'SERVICED'
              ? '✓ SERVICED'
              : '✓ HEALTHY'}
          </span>
        </div>
      </div>

      {/* Sensor Threshold Bars */}
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          Live Sensor Readings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SensorBar
            label="Vibration"
            icon={<Activity size={15} />}
            value={sensors.vibration}
            unit="mm/s"
            normal={thresholds.vibration.normal}
            warning={thresholds.vibration.warning}
            critical={thresholds.vibration.critical}
            isDark={isDark}
          />
          <SensorBar
            label="Temperature"
            icon={<Thermometer size={15} />}
            value={sensors.temperature}
            unit="°C"
            normal={thresholds.temperature.normal}
            warning={thresholds.temperature.warning}
            critical={thresholds.temperature.critical}
            isDark={isDark}
          />
          <SensorBar
            label="Current Draw"
            icon={<Zap size={15} />}
            value={sensors.current}
            unit="A"
            normal={thresholds.current.normal}
            warning={thresholds.current.warning}
            critical={thresholds.current.critical}
            isDark={isDark}
          />
          <SensorBar
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

      {/* 7-Day Trend Chart */}
      {chartData.length > 0 && (
        <div
          className={`rounded-2xl border p-4.5 shadow-sm transition-colors duration-300 ${
            isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
                7-Day Trend: {primarySensorLabel}
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Primary telemetry indicator over the past week</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded ${isDark ? 'text-zinc-400 bg-zinc-800' : 'text-slate-500 bg-slate-100'}`}>Daily 1Hz Peak</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272A' : '#E2E8F0'} />
                <XAxis dataKey="day" tick={{ fill: isDark ? '#71717A' : '#64748B', fontSize: 10 }} />
                <YAxis tick={{ fill: isDark ? '#71717A' : '#64748B', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={primarySensorLabel}
                  stroke={primarySensorColor}
                  strokeWidth={2.5}
                  dot={{ fill: primarySensorColor, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Diagnosis + Action */}
      {asset.diagnosis && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#1E1E1E] border-zinc-800/80' : 'bg-white border-slate-200/80'}`}>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Diagnostics Report
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{asset.diagnosis}</p>
          </div>
          <div className={`rounded-2xl border p-4 ${isDark ? 'bg-sky-500/5 border-sky-500/20' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
              Recommended Work Order
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{asset.recommendedAction}</p>
          </div>
        </div>
      )}

      {/* Scheduled Technician */}
      {asset.scheduledTechnician && (
        <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${isDark ? 'bg-sky-500/10 border-sky-500/20' : 'bg-sky-50 border-sky-200'}`}>
          <CheckCircle size={16} className={`shrink-0 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>Maintenance Dispatch Scheduled</p>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{asset.scheduledTechnician}</p>
          </div>
        </div>
      )}

      {/* Cost of Inaction (only for at-risk assets) */}
      {(asset.risk === 'HIGH' || asset.risk === 'MODERATE') && (
        <CostCalculator
          revenueLossPerDay={asset.revenueLossUSD}
          estimatedRepairHours={asset.estimatedRepairHours}
          isDark={isDark}
        />
      )}
    </div>
  );
};
