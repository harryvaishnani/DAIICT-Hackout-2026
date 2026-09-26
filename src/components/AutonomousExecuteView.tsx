import React from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  OPTIMAL_MAINTENANCE_WINDOW,
  WT04_PARTS_READINESS,
} from '../data/simpleAssets';
import { MaintenanceQueueView } from './MaintenanceQueueView';
import {
  Wrench,
  Clock,
  CheckCircle,
  Package,
  DollarSign,
} from 'lucide-react';

export const AutonomousExecuteView: React.FC = () => {
  const {
    selectedAsset,
    acceptOptimalMaintenancePlan,
    tickets,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const isOptimalAccepted = selectedAsset.scheduledTechnician?.includes('Today 14:00');

  const handleAcceptPlan = () => {
    acceptOptimalMaintenancePlan(selectedAsset.id);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wrench size={18} />
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Maintenance Execution &amp; Dispatch Optimizer
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            AI-scheduled service windows during low-wind off-peak hours with parts logistics tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            CREW &amp; PARTS: 92% READY
          </span>
        </div>
      </div>

      {/* Row 1: Maintenance Window Optimizer & Parts Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Maintenance Window Optimizer Card (7 cols) */}
        <div className={`lg:col-span-7 p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
          isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Clock size={14} /> AI Recommended Service Window
              </span>
              <h3 className="text-base font-bold tracking-tight mt-0.5">
                {OPTIMAL_MAINTENANCE_WINDOW.recommendedSlot}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Protected Revenue</span>
              <span className="text-base font-bold tabular-nums text-emerald-400">
                ₹{(OPTIMAL_MAINTENANCE_WINDOW.expectedSavingsINR / 100000).toFixed(2)}L
              </span>
            </div>
          </div>

          {/* Reasoning Checklist */}
          <div className={`p-4 rounded-xl border space-y-2 text-xs leading-relaxed backdrop-blur-md ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' : 'bg-white/70 border-slate-200/80 text-slate-700'
          }`}>
            <p className="font-semibold text-emerald-400 uppercase text-[11px] mb-1">
              Why this window?
            </p>
            {OPTIMAL_MAINTENANCE_WINDOW.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>

          {/* Accept Plan Trigger */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Target Asset: <strong className="text-slate-200">{selectedAsset.id}</strong>
            </span>

            <button
              onClick={handleAcceptPlan}
              disabled={isOptimalAccepted}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isOptimalAccepted
                  ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30 cursor-default shadow-xs'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {isOptimalAccepted ? <CheckCircle size={15} /> : <Wrench size={15} />}
              <span>{isOptimalAccepted ? '✓ AI PLAN SCHEDULED (Aarav Patel Assigned)' : 'Approve AI Window (Today 14:00)'}</span>
            </button>
          </div>
        </div>

        {/* Parts Readiness & Logistics Tracker (5 cols) */}
        <div className={`lg:col-span-5 p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
          isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Package size={14} /> Parts &amp; Crew Readiness
              </span>
              <h3 className="text-sm font-bold tracking-tight mt-0.5">
                Rajkot Depot Logistics
              </h3>
            </div>

            <span className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              92% READY
            </span>
          </div>

          {/* Parts List */}
          <div className="space-y-2">
            {WT04_PARTS_READINESS.map((part) => (
              <div
                key={part.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs backdrop-blur-sm ${
                  isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-200">{part.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {part.location} · <span className="text-emerald-400">{part.eta}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 tabular-nums">
                    {part.available} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: AI Maintenance Cost Optimizer (Cost of Inaction) */}
      <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <DollarSign size={14} /> Cost of Inaction Calculator
            </span>
            <h3 className="text-sm font-bold tracking-tight mt-0.5">
              Financial Progression If Repair Is Delayed
            </h3>
          </div>

          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            NET SAVINGS: ₹4.81 LAKHS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Repair Now */}
          <div className={`p-3.5 rounded-lg border-2 relative ${
            isDark ? 'bg-emerald-500/10 border-emerald-500 text-slate-100' : 'bg-emerald-50 border-emerald-500 text-slate-900'
          }`}>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
              RECOMMENDED
            </span>
            <h4 className="text-xs font-bold uppercase text-emerald-400 mt-2">REPAIR TODAY (14:00)</h4>
            <div className="space-y-1 text-xs mt-2 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">Repair Cost:</span>
                <span className="font-bold">₹1.35L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Generation Loss:</span>
                <span className="font-bold">₹18K</span>
              </div>
              <div className="flex justify-between border-t border-emerald-500/40 pt-1.5 text-sm font-bold text-emerald-400">
                <span>Total Cost:</span>
                <span>₹1.53L</span>
              </div>
            </div>
          </div>

          {/* Option 2: Wait 24 Hours */}
          <div className={`p-3.5 rounded-lg border ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              ELEVATED WEAR
            </span>
            <h4 className="text-xs font-bold uppercase text-amber-400 mt-2">WAIT 24 HOURS</h4>
            <div className="space-y-1 text-xs mt-2 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">Repair Cost:</span>
                <span className="font-bold">₹1.85L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Generation Loss:</span>
                <span className="font-bold">₹76K</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1.5 text-sm font-bold text-amber-400">
                <span>Total Cost:</span>
                <span>₹2.61L</span>
              </div>
            </div>
          </div>

          {/* Option 3: Wait 72 Hours */}
          <div className={`p-3.5 rounded-lg border ${
            isDark ? 'bg-amber-950/20 border-amber-500/40 text-slate-300' : 'bg-amber-50/70 border-amber-300 text-slate-800'
          }`}>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
              CATASTROPHIC
            </span>
            <h4 className="text-xs font-bold uppercase text-amber-400 mt-2">WAIT 72 HOURS (FAILURE)</h4>
            <div className="space-y-1 text-xs mt-2 tabular-nums">
              <div className="flex justify-between">
                <span className="text-slate-400">Repair Cost:</span>
                <span className="font-bold">₹4.20L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Generation Loss:</span>
                <span className="font-bold">₹2.14L</span>
              </div>
              <div className="flex justify-between border-t border-amber-500/40 pt-1.5 text-sm font-bold text-amber-400">
                <span>Total Cost:</span>
                <span>₹6.34L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Maintenance Kanban Work Orders Queue */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight">Active Work Order Kanban Queue</h3>
          <span className="text-xs text-slate-400">
            {tickets.length} Registered Tasks · Click or drag to update status
          </span>
        </div>
        <MaintenanceQueueView />
      </div>
    </div>
  );
};
