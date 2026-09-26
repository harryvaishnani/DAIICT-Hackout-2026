import React from 'react';
import { 
  Server, 
  Gauge, 
  AlertOctagon, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const ExecutiveKPIBar: React.FC = () => {
  const { kpis } = useTelemetry();

  const totalLossFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(kpis.totalRevenueAtRisk);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Total Active Assets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden transition-all hover:border-slate-700">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Fleet Assets</span>
          <div className="p-2 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-400">
            <Server className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
              {kpis.totalActiveAssets}
            </span>
            <span className="ml-1 text-xs text-slate-400 font-mono">Units</span>
          </div>
          <div className="flex items-center text-xs font-mono text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>100% Online</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
          <span>10 Wind Turbines</span>
          <span className="text-slate-600">|</span>
          <span>10 Solar Arrays</span>
        </div>
      </div>

      {/* KPI 2: Operational Efficiency */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden transition-all hover:border-slate-700">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Fleet Efficiency</span>
          <div className="p-2 rounded-lg bg-sky-950/70 border border-sky-800/60 text-sky-400">
            <Gauge className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              kpis.operationalEfficiency >= 90 
                ? 'text-emerald-400' 
                : kpis.operationalEfficiency >= 75 
                ? 'text-amber-400' 
                : 'text-red-400'
            }`}>
              {kpis.operationalEfficiency.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center text-xs font-mono text-slate-400">
            <span>Grid MPPT Sync</span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              kpis.operationalEfficiency >= 90 ? 'bg-emerald-500' : kpis.operationalEfficiency >= 75 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, kpis.operationalEfficiency))}%` }}
          ></div>
        </div>
      </div>

      {/* KPI 3: Active Critical Alerts */}
      <div className={`bg-slate-900/90 border rounded-xl p-4 shadow-lg relative overflow-hidden transition-all ${
        kpis.criticalAlertsCount > 0 
          ? 'border-red-600/70 bg-red-950/20 ring-1 ring-red-500/40' 
          : 'border-slate-800 hover:border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Critical Alerts</span>
          <div className={`p-2 rounded-lg border ${
            kpis.criticalAlertsCount > 0 
              ? 'bg-red-900/80 border-red-500 text-red-300 animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              kpis.criticalAlertsCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-300'
            }`}>
              {kpis.criticalAlertsCount}
            </span>
            <span className="ml-1 text-xs text-slate-400 font-mono">
              {kpis.criticalAlertsCount === 1 ? 'Alert' : 'Alerts'}
            </span>
          </div>
          {kpis.warningAlertsCount > 0 && (
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/70 border border-amber-600/60 text-amber-400">
              +{kpis.warningAlertsCount} Warning
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
          <span>Action Required</span>
          <span className={kpis.criticalAlertsCount > 0 ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
            {kpis.criticalAlertsCount > 0 ? 'Immediate Shutdown' : 'System Clear'}
          </span>
        </div>
      </div>

      {/* KPI 4: Total Revenue at Risk */}
      <div className={`bg-slate-900/90 border rounded-xl p-4 shadow-lg relative overflow-hidden transition-all ${
        kpis.totalRevenueAtRisk > 0 
          ? 'border-amber-600/60 bg-amber-950/15 ring-1 ring-amber-500/30' 
          : 'border-slate-800 hover:border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Revenue at Risk</span>
          <div className={`p-2 rounded-lg border ${
            kpis.totalRevenueAtRisk > 0 
              ? 'bg-amber-900/70 border-amber-600 text-amber-300' 
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${
              kpis.totalRevenueAtRisk > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {totalLossFormatted}
            </span>
            <span className="ml-1 text-xs text-slate-400 font-mono">/day</span>
          </div>
          {kpis.totalRevenueAtRisk > 0 ? (
            <div className="flex items-center text-xs font-mono text-amber-400">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              <span>Unserviced</span>
            </div>
          ) : (
            <span className="text-xs font-mono text-emerald-400">0% Loss</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
          <span>Active Generation</span>
          <span className="text-sky-400 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-sky-400" />
            {kpis.totalPowerGenerationMW} MW
          </span>
        </div>
      </div>
    </div>
  );
};
