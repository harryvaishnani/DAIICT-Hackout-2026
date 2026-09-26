import React, { useState } from 'react';
import { 
  Flame, 
  Sun, 
  RotateCcw, 
  Zap, 
  ChevronUp, 
  ChevronDown, 
  Radio, 
  Check, 
  AlertOctagon 
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const FloatingDemoPanel: React.FC = () => {
  const { 
    injectBearingOverheat, 
    injectSolarSoiling, 
    resetFleetBaseline, 
    isSupabaseLive,
    activeFaultBanner
  } = useTelemetry();

  const [isOpen, setIsOpen] = useState(true);
  const [activeFault, setActiveFault] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleInjectOverheat = async () => {
    setLoadingAction('OVERHEAT');
    try {
      await injectBearingOverheat();
      setActiveFault('BEARING_OVERHEAT');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleInjectSoiling = async () => {
    setLoadingAction('SOILING');
    try {
      await injectSolarSoiling();
      setActiveFault('SOLAR_SOILING');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReset = async () => {
    setLoadingAction('RESET');
    try {
      await resetFleetBaseline();
      setActiveFault(null);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[1500] max-w-lg w-full px-4 sm:px-0">
      {/* Active Fault Alert Toast if any */}
      {activeFaultBanner && (
        <div className="mb-2 p-3 rounded-xl bg-red-950/95 border border-red-500 text-red-200 text-xs font-mono shadow-2xl flex items-center justify-between backdrop-blur-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
            <span className="font-semibold">{activeFaultBanner}</span>
          </div>
        </div>
      )}

      {/* Main Floating Card */}
      <div className="bg-slate-900/95 border-2 border-sky-500/60 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden ring-4 ring-sky-500/20">
        {/* Panel Header */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-3 bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-sky-950/90 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/80 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-sky-900/80 border border-sky-500/50 text-sky-300">
              <Zap className="w-4 h-4 text-sky-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-white font-mono">
                  PRESENTATION DEMO CONTROL PANEL
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  JUDGES FAST-PATH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Live SCADA Hardware Fault Injection & Zero-Refresh Sync
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>{isSupabaseLive ? 'SUPABASE' : 'REALTIME'}</span>
            </div>
            <button className="text-slate-400 hover:text-white p-1">
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Buttons Body */}
        {isOpen && (
          <div className="p-4 space-y-3 bg-slate-900/90 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Button 1: Inject Bearing Overheat */}
              <button
                onClick={handleInjectOverheat}
                disabled={loadingAction !== null}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all text-left shadow-lg group ${
                  activeFault === 'BEARING_OVERHEAT'
                    ? 'bg-red-900/80 border-red-500 text-white ring-2 ring-red-500/40'
                    : 'bg-red-950/40 border-red-800/60 hover:bg-red-900/50 hover:border-red-600 text-red-200'
                }`}
              >
                <div className="p-2 rounded-lg bg-red-900/60 text-red-300 group-hover:scale-110 transition-transform">
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-white text-xs">
                    Inject Bearing Overheat
                  </span>
                  <span className="text-[10px] text-red-300/80 block truncate">
                    Turbine-004 • 92.5°C & 4.8 mm/s
                  </span>
                </div>
              </button>

              {/* Button 2: Inject Solar Panel Soiling */}
              <button
                onClick={handleInjectSoiling}
                disabled={loadingAction !== null}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all text-left shadow-lg group ${
                  activeFault === 'SOLAR_SOILING'
                    ? 'bg-amber-900/80 border-amber-500 text-white ring-2 ring-amber-500/40'
                    : 'bg-amber-950/40 border-amber-800/60 hover:bg-amber-900/50 hover:border-amber-600 text-amber-200'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-900/60 text-amber-300 group-hover:scale-110 transition-transform">
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold block text-white text-xs">
                    Inject Solar Soiling
                  </span>
                  <span className="text-[10px] text-amber-300/80 block truncate">
                    Solar-002 • 45% Dust Fouling
                  </span>
                </div>
              </button>
            </div>

            {/* Button 3: Reset Fleet Baseline */}
            <button
              onClick={handleReset}
              disabled={loadingAction !== null}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700/80 text-slate-200 flex items-center justify-center space-x-2 transition-all shadow font-medium"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-sky-400 ${loadingAction === 'RESET' ? 'animate-spin' : ''}`} />
              <span>Reset Fleet Baseline (All 20 Assets Healthy)</span>
            </button>

            {/* Micro verification info */}
            <div className="pt-2 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                Real-time Map, Charts & RCA Sync
              </span>
              <span className="text-slate-500 font-sans italic">No page refresh needed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
