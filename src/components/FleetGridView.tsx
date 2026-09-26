import React, { useState } from 'react';
import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle,
  TrendingDown,
  Activity,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { useSimpleApp } from '../context/SimpleAppContext';
import type { SimpleAsset } from '../data/simpleAssets';

type Filter = 'ALL' | 'AT_RISK' | 'WIND' | 'SOLAR';

// ──────────────────────────────────────────────
// Minimalist SVG Sparkline (24h performance indicator)
// ──────────────────────────────────────────────
const Sparkline: React.FC<{
  data: number[];
  color: string;
  height?: number;
}> = ({ data, color, height = 26 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;
  const padding = 2;
  const width = 180;
  const h = height - padding * 2;

  // Generate coordinate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - padding - ((val - min) / range) * h;
    return { x, y };
  });

  // Build smooth bezier path
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`;
  }

  const fillD = `${pathD} L ${width},${height} L 0,${height} Z`;
  const gradId = `spark-${Math.abs(data.reduce((a, b) => a + b, 0)).toFixed(0)}-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="w-full overflow-hidden mt-1 pointer-events-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-5 overflow-visible opacity-80"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gradId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const RISK_THEMES = {
  dark: {
    HIGH: {
      label: 'HIGH RISK',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-xs',
      card: 'bg-[#1E1E1E]/80 backdrop-blur-md border-rose-500/40 hover:border-rose-400 shadow-lg shadow-rose-950/20',
      dot: 'bg-rose-500 status-dot-urgent shadow-[0_0_12px_rgba(239,68,68,0.9)]',
      sparkColor: '#F43F5E',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-xs',
      card: 'bg-[#1E1E1E]/80 backdrop-blur-md border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-950/20',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.65)]',
      sparkColor: '#F59E0B',
    },
    NORMAL: {
      label: 'HEALTHY',
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-xs',
      card: 'bg-[#18181B]/75 backdrop-blur-md border-white/[0.08] hover:border-white/20 hover:bg-[#1f1f23]/90 shadow-md shadow-black/25',
      dot: 'bg-emerald-400 status-dot-breathe shadow-[0_0_8px_rgba(16,185,129,0.55)]',
      sparkColor: '#10B981',
    },
    SERVICED: {
      label: 'SERVICED',
      badge: 'bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-xs',
      card: 'bg-[#18181B]/75 backdrop-blur-md border-white/[0.08] hover:border-white/20 hover:bg-[#1f1f23]/90 shadow-md shadow-black/25',
      dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
      sparkColor: '#38BDF8',
    },
  },
  light: {
    HIGH: {
      label: 'HIGH RISK',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs',
      card: 'bg-white border-rose-300 hover:border-rose-400 shadow-sm hover:shadow-md',
      dot: 'bg-rose-600 status-dot-urgent shadow-[0_0_8px_rgba(225,29,72,0.6)]',
      sparkColor: '#E11D48',
    },
    MODERATE: {
      label: 'MODERATE RISK',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 shadow-xs',
      card: 'bg-white border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md',
      dot: 'bg-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.5)]',
      sparkColor: '#D97706',
    },
    NORMAL: {
      label: 'HEALTHY',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs',
      card: 'bg-white/95 backdrop-blur-sm border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md',
      dot: 'bg-emerald-500 status-dot-breathe shadow-[0_0_6px_rgba(16,185,129,0.5)]',
      sparkColor: '#059669',
    },
    SERVICED: {
      label: 'SERVICED',
      badge: 'bg-sky-50 text-sky-700 border-sky-200 shadow-xs',
      card: 'bg-white/95 backdrop-blur-sm border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md',
      dot: 'bg-sky-500 shadow-[0_0_6px_rgba(2,132,199,0.5)]',
      sparkColor: '#0284C7',
    },
  },
};

/**
 * Finds the primary critical or warning sensor reading for an at-risk asset.
 */
function getFailingSensorInfo(asset: SimpleAsset) {
  const { sensors, thresholds, type } = asset;
  const issues: { name: string; value: string; isCrit: boolean; icon: React.ReactNode }[] = [];

  if (sensors.vibration >= thresholds.vibration.critical) {
    issues.push({
      name: 'Vibration',
      value: `${sensors.vibration.toFixed(1)} mm/s`,
      isCrit: true,
      icon: <Activity size={14} />,
    });
  } else if (sensors.vibration >= thresholds.vibration.warning) {
    issues.push({
      name: 'Vibration',
      value: `${sensors.vibration.toFixed(1)} mm/s`,
      isCrit: false,
      icon: <Activity size={14} />,
    });
  }

  if (sensors.soiling >= thresholds.soiling.critical) {
    issues.push({
      name: 'Soiling',
      value: `${sensors.soiling.toFixed(0)}%`,
      isCrit: true,
      icon: <Droplets size={14} />,
    });
  } else if (sensors.soiling >= thresholds.soiling.warning) {
    issues.push({
      name: 'Soiling',
      value: `${sensors.soiling.toFixed(0)}%`,
      isCrit: false,
      icon: <Droplets size={14} />,
    });
  }

  if (sensors.temperature >= thresholds.temperature.critical) {
    issues.push({
      name: 'Temperature',
      value: `${sensors.temperature.toFixed(0)}°C`,
      isCrit: true,
      icon: <Thermometer size={14} />,
    });
  } else if (sensors.temperature >= thresholds.temperature.warning) {
    issues.push({
      name: 'Temperature',
      value: `${sensors.temperature.toFixed(0)}°C`,
      isCrit: false,
      icon: <Thermometer size={14} />,
    });
  }

  if (issues.length > 0) return issues;

  if (type === 'Wind') {
    return [{
      name: 'Vibration',
      value: `${sensors.vibration.toFixed(1)} mm/s`,
      isCrit: false,
      icon: <Activity size={14} />,
    }];
  }
  return [{
    name: 'Soiling',
    value: `${sensors.soiling.toFixed(0)}%`,
    isCrit: false,
    icon: <Droplets size={14} />,
  }];
}

const MiniWindmillSpinner: React.FC<{ isNeedsAttention: boolean; isDark: boolean }> = ({ isNeedsAttention, isDark }) => {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-full h-full overflow-visible">
        {/* Tower Mast */}
        <line x1="16" y1="14" x2="16" y2="30" stroke={isDark ? '#475569' : '#94A3B8'} strokeWidth="2.5" strokeLinecap="round" />
        {/* Animated 3-Blade Rotor */}
        <g
          className={isNeedsAttention ? 'animate-mini-wobble' : 'animate-mini-spin'}
          style={{ transformOrigin: '16px 14px' }}
        >
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              transform={`rotate(${deg}, 16, 14)`}
              d="M 16,14 C 14.5,10 13.5,4 16,1 C 18.5,4 17.5,10 16,14 Z"
              fill={isNeedsAttention ? '#F59E0B' : (isDark ? '#38BDF8' : '#0284C7')}
            />
          ))}
          {/* Hub Center */}
          <circle cx="16" cy="14" r="2.8" fill={isNeedsAttention ? '#F59E0B' : '#10B981'} />
          <circle cx="16" cy="14" r="1.2" fill="#FFFFFF" />
        </g>
      </svg>
      {/* Amber Warning Ping for At-Risk Turbines */}
      {isNeedsAttention && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
    </div>
  );
};

const MiniSolarModule: React.FC<{ isNeedsAttention: boolean; isDark: boolean }> = ({ isNeedsAttention, isDark }) => {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-full h-full overflow-visible">
        {/* Tilted Solar PV Array */}
        <g transform="skewX(-10) translate(2, 0)">
          <rect
            x="4"
            y="7"
            width="22"
            height="18"
            rx="2"
            fill={isDark ? '#1E293B' : '#E0E7FF'}
            stroke={isNeedsAttention ? '#F59E0B' : '#38BDF8'}
            strokeWidth="1.5"
          />
          {/* PV Grid Lines */}
          <line x1="4" y1="16" x2="26" y2="16" stroke={isDark ? '#334155' : '#93C5FD'} strokeWidth="1" />
          <line x1="15" y1="7" x2="15" y2="25" stroke={isDark ? '#334155' : '#93C5FD'} strokeWidth="1" />
          {/* Hotspot or Sun Shimmer */}
          {isNeedsAttention ? (
            <circle cx="18" cy="12" r="3" fill="#F59E0B" className="animate-ping" />
          ) : (
            <polygon points="6,7 12,7 18,25 12,25" fill="#FFFFFF" fillOpacity="0.35" className="animate-sun-shimmer" />
          )}
        </g>
      </svg>
      {isNeedsAttention && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      )}
    </div>
  );
};

const AssetCard: React.FC<{ asset: SimpleAsset }> = ({ asset }) => {
  const { openDrawer, scheduleVisit, theme } = useSimpleApp();
  const isDark = theme === 'dark';
  const risk = RISK_THEMES[theme][asset.risk];
  const isWind = asset.type === 'Wind';
  const isAtRisk = asset.risk === 'HIGH' || asset.risk === 'MODERATE';

  const handleCardClick = () => {
    openDrawer(asset.id);
  };

  const handleQueueClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    scheduleVisit(asset.id);
  };

  const sparklineData = (asset.history || []).map((h) => h.primarySensorValue);

  // ──────────────────────────────────────────────
  // SIMPLIFIED HEALTHY / SERVICED CARD
  // Clean, minimal, compact with micro-sparkline & hover lift
  // ──────────────────────────────────────────────
  if (!isAtRisk) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        aria-label={`View telemetry for ${asset.id}`}
        className={`group ${risk.card} border rounded-2xl p-3.5 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative`}
      >
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`rounded-xl p-2 shrink-0 border transition-colors duration-300 ${
                isDark
                  ? isWind ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : isWind ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-amber-50 border-amber-200 text-amber-600'
              }`}
            >
              {isWind ? (
                <MiniWindmillSpinner isNeedsAttention={false} isDark={isDark} />
              ) : (
                <MiniSolarModule isNeedsAttention={false} isDark={isDark} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3
                  className={`text-sm font-bold whitespace-nowrap transition-colors duration-200 ${
                    isDark
                      ? 'text-white group-hover:text-sky-300'
                      : 'text-slate-900 group-hover:text-sky-600'
                  }`}
                >
                  {asset.id}
                </h3>
                <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-slate-300'}`}>·</span>
                <p
                  className={`text-xs truncate transition-colors duration-200 ${
                    isDark ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                >
                  {asset.name}
                </p>
              </div>
              <p
                className={`text-[11px] truncate transition-colors duration-200 ${
                  isDark ? 'text-zinc-500' : 'text-slate-400'
                }`}
              >
                📍 {asset.location.split(',')[0]}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 transition-colors duration-300 ${risk.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            {risk.label}
          </span>
        </div>

        {/* Minimalist Sparkline Activity Indicator */}
        <div className="pt-1.5 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <Sparkline data={sparklineData} color={risk.sparkColor} height={20} />
          </div>
          <span
            className={`text-[10px] transition-colors shrink-0 ${
              isDark
                ? 'text-zinc-500 group-hover:text-zinc-300'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            Inspect →
          </span>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────
  // EXPANDED AT-RISK CARD (WT-04, SP-02)
  // Highlights the specific failing metric, losses, Add to Queue, and sparkline
  // ──────────────────────────────────────────────
  const failingSensors = getFailingSensorInfo(asset);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`View alerts and telemetry for ${asset.id}`}
      className={`group ${risk.card} border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 flex flex-col gap-3 relative`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`rounded-xl p-2.5 shrink-0 border transition-colors duration-300 ${
              isDark
                ? isWind ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : isWind ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-amber-50 border-amber-200 text-amber-600'
            }`}
          >
            {isWind ? (
              <MiniWindmillSpinner isNeedsAttention={true} isDark={isDark} />
            ) : (
              <MiniSolarModule isNeedsAttention={true} isDark={isDark} />
            )}
          </div>
          <div className="min-w-0">
            <h3
              className={`text-sm font-bold whitespace-nowrap leading-tight transition-colors duration-200 ${
                isDark
                  ? 'text-white group-hover:text-rose-300'
                  : 'text-slate-900 group-hover:text-rose-600'
              }`}
            >
              {asset.id}
            </h3>
            <p
              className={`text-xs font-medium truncate leading-tight transition-colors duration-200 ${
                isDark ? 'text-zinc-300' : 'text-slate-600'
              }`}
            >
              {asset.name}
            </p>
            <p
              className={`text-[11px] truncate mt-0.5 transition-colors duration-200 ${
                isDark ? 'text-zinc-500' : 'text-slate-400'
              }`}
            >
              📍 {asset.location.split(',')[0]}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 transition-colors duration-300 ${risk.badge}`}
        >
          <span className={`w-2 h-2 rounded-full ${risk.dot}`} />
          {risk.label}
        </span>
      </div>

      {/* Primary Failing Sensor(s) Highlight */}
      <div
        className={`rounded-xl p-3 space-y-1.5 transition-colors duration-300 ${
          isDark
            ? 'bg-rose-500/10 border border-rose-500/20'
            : 'bg-rose-50/80 border border-rose-200/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-rose-300' : 'text-rose-700'
            }`}
          >
            <AlertTriangle size={13} className={isDark ? 'text-rose-400' : 'text-rose-600'} />
            Failing Metric Detected
          </span>
          <span className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Exceeds Tolerance
          </span>
        </div>

        <div className="flex items-baseline gap-3 flex-wrap pt-0.5">
          {failingSensors.map((fs) => (
            <div key={fs.name} className="flex items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {fs.name}:
              </span>
              <span
                className={`text-base font-extrabold tracking-tight ${
                  isDark ? 'text-rose-300' : 'text-rose-600'
                }`}
              >
                {fs.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Energy & Revenue Loss Info */}
      <div className="flex items-center justify-between px-1 py-0.5">
        <div>
          <p
            className={`text-[11px] uppercase tracking-wide font-medium ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            Daily Energy Derate
          </p>
          <p className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
            {asset.energyLossMWh}{' '}
            <span className={`text-xs font-normal ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              MWh/day
            </span>
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-[11px] uppercase tracking-wide font-medium ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            Daily Revenue Loss
          </p>
          <p
            className={`text-sm font-bold flex items-center justify-end gap-0.5 ${
              isDark ? 'text-rose-300' : 'text-rose-600'
            }`}
          >
            <TrendingDown size={13} />
            -${asset.revenueLossUSD.toLocaleString()}
            <span className={`text-xs font-normal ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              /day
            </span>
          </p>
        </div>
      </div>

      {/* Diagnosis Note */}
      {asset.diagnosis && (
        <p
          className={`text-xs leading-relaxed line-clamp-2 px-1 transition-colors duration-200 ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          {asset.diagnosis}
        </p>
      )}

      {/* 24h Escalation Sparkline */}
      <div className="px-1 -mt-1">
        <Sparkline data={sparklineData} color={risk.sparkColor} height={24} />
      </div>

      {/* Card Action Row */}
      <div
        className={`flex items-center justify-between gap-2 pt-2 border-t mt-auto ${
          isDark ? 'border-zinc-800/80' : 'border-slate-100'
        }`}
      >
        <span
          className={`text-[11px] transition-colors flex items-center gap-1 ${
            isDark
              ? 'text-zinc-400 group-hover:text-zinc-300'
              : 'text-slate-500 group-hover:text-slate-800'
          }`}
        >
          View Telemetry →
        </span>

        {!asset.scheduledTechnician ? (
          <button
            onClick={handleQueueClick}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-rose-900/30"
          >
            <CalendarPlus size={13} />
            Add to Queue
          </button>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${
              isDark
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                : 'bg-sky-50 border-sky-200 text-sky-700'
            }`}
          >
            <CheckCircle size={13} />
            Scheduled
          </span>
        )}
      </div>
    </div>
  );
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'ALL', label: 'All Assets' },
  { key: 'AT_RISK', label: '⚠ At Risk' },
  { key: 'WIND', label: '🌬 Wind' },
  { key: 'SOLAR', label: '☀ Solar' },
];

export const FleetGridView: React.FC = () => {
  const { visibleAssets, theme, setIsAddAssetModalOpen } = useSimpleApp();
  const [filter, setFilter] = useState<Filter>('ALL');
  const isDark = theme === 'dark';

  const filtered = visibleAssets.filter((a) => {
    if (filter === 'AT_RISK') return a.risk === 'HIGH' || a.risk === 'MODERATE';
    if (filter === 'WIND') return a.type === 'Wind';
    if (filter === 'SOLAR') return a.type === 'Solar';
    return true;
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filter Bar & Header Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : isDark
                    ? 'bg-[#1E1E1E] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {filtered.length} assets
          </span>

          <button
            onClick={() => setIsAddAssetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
          >
            <span>+ Add Asset</span>
          </button>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start overflow-y-auto pb-6">
        {filtered.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};
