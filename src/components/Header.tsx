import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  Settings,
  Clock
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

interface HeaderProps {
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConfig }) => {
  const { isSupabaseLive, isRealtimeActive, kpis } = useTelemetry();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 lg:px-6 py-3 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & System Identifier */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-500/40 text-sky-400 shadow-inner">
            <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>VORTEX-SOLARIS</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-950 text-sky-400 border border-blue-800">
                  MVP v2.4
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span>Predictive Maintenance & Asset Telemetry SCADA</span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-400/80 font-medium">Solar & Wind Fleet</span>
            </p>
          </div>
        </div>

        {/* Operational Status & Telemetry Indicators */}
        <div className="flex items-center flex-wrap gap-2.5 text-xs">
          {/* System Clock */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-slate-500">UTC-Local</span>
          </div>

          {/* Realtime Connection Status Pill */}
          <button
            onClick={onOpenConfig}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md border font-medium transition-all shadow-sm ${
              isSupabaseLive
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-sky-950/60 border-sky-500/40 text-sky-300 hover:bg-sky-900/50'
            }`}
            title="Click to configure Supabase credentials"
          >
            <Radio className={`w-3.5 h-3.5 ${isRealtimeActive ? 'animate-pulse text-emerald-400' : 'text-slate-400'}`} />
            <div className="flex items-center space-x-1.5">
              <span className="font-mono">
                {isSupabaseLive ? 'SUPABASE LIVE' : 'DEMO REALTIME'}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
            </div>
            <Settings className="w-3 h-3 text-slate-400 hover:text-white" />
          </button>

          {/* Quick Alarm Badge */}
          {kpis.criticalAlertsCount > 0 ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-red-950/80 border border-red-500/60 text-red-300 font-mono animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{kpis.criticalAlertsCount} CRITICAL</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FLEET NOMINAL</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
