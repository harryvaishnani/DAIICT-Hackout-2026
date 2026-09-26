import React, { useState, useEffect } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  AlertTriangle,
  X,
  Clock,
  CheckCircle,
  TrendingUp,
  Cpu,
  Sparkles,
  Wrench,
} from 'lucide-react';

export const IncidentCommandModal: React.FC = () => {
  const {
    isIncidentCommandOpen,
    closeIncidentCommand,
    assets,
    selectedAssetId,
    launchFailureSimulation,
    acceptOptimalMaintenancePlan,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';

  // Countdown timer simulation (starts at 08h 41m 58s)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(8 * 3600 + 41 * 60 + 58);

  useEffect(() => {
    if (!isIncidentCommandOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isIncidentCommandOpen]);

  if (!isIncidentCommandOpen) return null;

  // Selected critical asset (default WT-04 or SP-02)
  const asset = assets.find((a) => a.id === selectedAssetId) || assets.find((a) => a.id === 'WT-04') || assets[0];
  const isWind = asset.type === 'Wind';

  const formatCountdown = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulate = () => {
    closeIncidentCommand();
    launchFailureSimulation(asset.id);
  };

  const handleDispatch = () => {
    acceptOptimalMaintenancePlan(asset.id);
    closeIncidentCommand();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Heavy Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={closeIncidentCommand}
      />

      {/* Incident Command Window */}
      <div
        className={`relative z-10 w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors ${
          isDark
            ? 'bg-[#0E1017] border-amber-500/30 text-zinc-100 shadow-[0_0_50px_rgba(245,158,11,0.15)]'
            : 'bg-white border-amber-400 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Top Emergency Status Banner */}
        <div className="bg-amber-500 text-slate-950 px-5 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
            </span>
            <span className="font-mono text-xs font-black tracking-widest uppercase">
              ⚡ ACTIVE INCIDENT COMMAND · {isWind ? 'WIND TURBINE ATTENTION' : 'SOLAR ARRAY ATTENTION'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[11px] bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded font-bold">
              GRID PRIORITY: P-1 HIGH
            </span>
            <button
              onClick={closeIncidentCommand}
              className="p-1 rounded-lg hover:bg-slate-950/20 text-slate-950 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Asset Header Info */}
        <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-zinc-800/80 bg-zinc-950/40' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-amber-400">{asset.id}</span>
              <span className="text-sm font-semibold">{asset.name}</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              {asset.location} · {asset.modelNumber || (isWind ? 'Inox Wind DF 3.3 MW' : 'Tata Power Solar TP-540')} · SCADA ID: {isWind ? '0x48FA' : '0x71BC'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {isWind ? '● INNER-RING SPALLING' : '● BYPASS DIODE HOTSPOT & SOILING'}
            </span>
          </div>
        </div>

        {/* Hero Critical Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-zinc-800/80">
          {/* Failure Probability Gauge */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Failure Probability
              </span>
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl font-black tracking-tight text-amber-400">
                  {asset.failureProbability || (isWind ? 87 : 78)}%
                </span>
                <span className="text-xs font-mono text-amber-500 flex items-center gap-0.5">
                  <TrendingUp size={12} /> Rapid Escalation
                </span>
              </div>

              {/* Progress Bar */}
              <div className={`h-2.5 rounded-full overflow-hidden mb-2 ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                <div
                  className="h-full bg-amber-500 rounded-full animate-pulse"
                  style={{ width: `${asset.failureProbability || (isWind ? 87 : 78)}%` }}
                />
              </div>
            </div>

            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'} leading-relaxed mt-2`}>
              {isWind
                ? `Acoustic bearing vibration (${asset.sensors.vibration.toFixed(1)} mm/s) crossed ISO 10816 Class IV critical limit (3.5 mm/s).`
                : `Surface particulate soiling (${asset.sensors.soiling}% soiling) caused string mismatch and diode thermal runaway (>65°C).`}
            </p>
          </div>

          {/* Time to Failure Countdown */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock size={14} /> Time to Irreversible Failure
              </span>
              <div className="flex items-baseline gap-3 my-2">
                <span className="text-5xl font-black font-mono tracking-tight text-amber-400 tabular-nums">
                  {formatCountdown(secondsRemaining)}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  EST: 6–14 HOURS
                </span>
              </div>

              <div className={`flex justify-between text-xs font-mono pt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                <span>{isWind ? 'Thermal Runaway: >100°C' : 'Cell Backsheet Burn: >80°C'}</span>
                <span className="text-amber-400 font-bold">Trip: ~18:00 IST</span>
              </div>
            </div>

            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'} leading-relaxed mt-2`}>
              {isWind
                ? 'Catastrophic bearing seizure and drive-shaft scoring anticipated if unserviced within 8.6 hours.'
                : 'Permanent EVA backsheet browning and solar cell micro-cracking anticipated if unwashed within 8.6 hours.'}
            </p>
          </div>
        </div>

        {/* Digital Twin & AI Root Cause Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x border-b border-zinc-800/80">
          {/* Digital Twin Schematic Hotspot (5 cols) */}
          <div className="md:col-span-5 p-5 flex flex-col items-center justify-center bg-radial from-amber-950/20 to-transparent">
            <div className="w-full text-left mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Cpu size={14} /> Digital Twin Hotspot ({isWind ? 'Turbine Nacelle' : 'Solar PV String'})
              </span>
            </div>

            {/* Schematic SVG: Wind Turbine vs Solar PV Array */}
            <div className="relative w-64 h-48 flex items-center justify-center">
              {isWind ? (
                <svg viewBox="0 0 240 160" className="w-full h-full">
                  {/* Nacelle Outline */}
                  <rect x="70" y="55" width="110" height="50" rx="8" fill={isDark ? '#1C202F' : '#E2E8F0'} stroke={isDark ? '#3B4262' : '#94A3B8'} strokeWidth="2" />
                  {/* Tower Top */}
                  <rect x="110" y="105" width="30" height="50" fill={isDark ? '#151824' : '#CBD5E1'} stroke={isDark ? '#2B3147' : '#94A3B8'} strokeWidth="2" />
                  {/* Hub / Nose Cone */}
                  <path d="M 70,55 L 45,80 L 70,105 Z" fill={isDark ? '#23293D' : '#94A3B8'} stroke={isDark ? '#3E476B' : '#64748B'} strokeWidth="2" />
                  {/* Rotor Blades */}
                  <line x1="45" y1="80" x2="15" y2="15" stroke={isDark ? '#64748B' : '#94A3B8'} strokeWidth="4" strokeLinecap="round" />
                  <line x1="45" y1="80" x2="15" y2="145" stroke={isDark ? '#64748B' : '#94A3B8'} strokeWidth="4" strokeLinecap="round" />
                  <line x1="45" y1="80" x2="5" y2="80" stroke={isDark ? '#64748B' : '#94A3B8'} strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Main Drive Shaft */}
                  <rect x="70" y="74" width="45" height="12" fill={isDark ? '#334155' : '#64748B'} />
                  {/* Planetary Gearbox */}
                  <rect x="115" y="65" width="30" height="30" rx="3" fill={isDark ? '#1E293B' : '#CBD5E1'} stroke="#475569" />
                  {/* Generator */}
                  <rect x="150" y="68" width="25" height="24" rx="2" fill={isDark ? '#0F172A' : '#94A3B8'} stroke="#475569" />

                  {/* 🟡 PULSING HOTSPOT: Main Bearing Cartridge */}
                  <circle cx="92" cy="80" r="14" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-ping opacity-75" />
                  <circle cx="92" cy="80" r="9" fill="#F59E0B" className="shadow-[0_0_15px_#F59E0B]" />
                  <text x="92" y="83" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="bold">!</text>
                </svg>
              ) : (
                <svg viewBox="0 0 240 160" className="w-full h-full">
                  {/* Solar Array Strings */}
                  <g transform="skewX(-18) translate(40, 30)">
                    <rect x="10" y="10" width="45" height="75" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                    <rect x="62" y="10" width="45" height="75" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
                    <rect x="114" y="10" width="45" height="75" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />

                    {/* PV Grid Lines */}
                    <line x1="10" y1="35" x2="55" y2="35" stroke="#334155" strokeWidth="1" />
                    <line x1="10" y1="60" x2="55" y2="60" stroke="#334155" strokeWidth="1" />
                    <line x1="62" y1="35" x2="107" y2="35" stroke="#334155" strokeWidth="1" />
                    <line x1="62" y1="60" x2="107" y2="60" stroke="#334155" strokeWidth="1" />
                    <line x1="114" y1="35" x2="159" y2="35" stroke="#334155" strokeWidth="1" />
                    <line x1="114" y1="60" x2="159" y2="60" stroke="#334155" strokeWidth="1" />

                    {/* 🟡 PULSING HOTSPOT: Bypass Diode #3 on Module 2 */}
                    <circle cx="85" cy="48" r="14" fill="none" stroke="#F59E0B" strokeWidth="2" className="animate-ping opacity-75" />
                    <circle cx="85" cy="48" r="8" fill="#F59E0B" />
                    <text x="85" y="51" textAnchor="middle" fill="#000000" fontSize="7" fontWeight="bold">!</text>
                  </g>

                  {/* Junction Box / Inverter */}
                  <rect x="40" y="125" width="160" height="22" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
                  <text x="120" y="140" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">INVERTER / MPPT COMBINER</text>
                </svg>
              )}

              {/* Hotspot Floating Tag */}
              <div className="absolute top-2 right-2 font-mono text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {isWind ? 'MAIN BEARING: 92.5°C' : 'DIODE HOTSPOT: 68.0°C'}
              </div>
            </div>

            <span className="text-[11px] font-mono text-zinc-400 mt-1">
              {isWind
                ? 'Component 03: SKF 7200 · High radial stress coupled'
                : 'Component: Diode D-03 · Patan High-Yield Sector'}
            </span>
          </div>

          {/* AI Root Cause & Multi-Signal Evidence (7 cols) */}
          <div className="md:col-span-7 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} /> AI Diagnostic Verification
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {isWind ? '91% Confidence · 3/3 Models Agree' : '88% Confidence · 3/3 Models Agree'}
              </span>
            </div>

            <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className="font-semibold text-amber-400">
                {isWind
                  ? 'Diagnostic: High-frequency raceway flaking and inner-ring spalling'
                  : 'Diagnostic: Desert sand accumulation causing localized bypass diode thermal runaway'}
              </p>
              <p className={isDark ? 'text-zinc-300' : 'text-slate-600'}>
                {isWind
                  ? 'Telemetry signatures confirm severe harmonic shockwaves. Temperature rise follows vibration spike with 24-minute latency, characteristic of hydrodynamic lubrication breakdown.'
                  : 'Optical reflectance degradation confirmed via drone telemetry. Localized hotspot (68°C) exceeds array mean by 24°C, triggering string-level current mismatch and potential diode failure.'}
              </p>
            </div>

            {/* Multi-Signal Evidence */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className={`p-2 rounded-lg border text-xs ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-zinc-400">{isWind ? 'Vibration Spike' : 'Soiling Index'}</span>
                  <span className="font-mono font-bold text-amber-400">{isWind ? '+34%' : '45%'}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[85%]" />
                </div>
              </div>

              <div className={`p-2 rounded-lg border text-xs ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-zinc-400">{isWind ? 'Thermal Gradient' : 'Hotspot Delta'}</span>
                  <span className="font-mono font-bold text-amber-400">{isWind ? '+22%' : '+24°C'}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT SHOULD WE DO? Decision Intelligence Grid */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span>WHAT SHOULD WE DO? · FINANCIAL &amp; DOWNTIME DECISION MATRIX</span>
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">
              ★ AI RECOMMENDS: {isWind ? 'REPAIR NOW (Save ₹4.81L)' : 'DRY-WASH NOW (Save ₹3.35L)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Scenario 1: Repair Now */}
            <div className={`p-4 rounded-xl border-2 transition-all relative ${
              isDark
                ? 'bg-emerald-950/20 border-emerald-500/80 shadow-lg shadow-emerald-950/30'
                : 'bg-emerald-50 border-emerald-500 shadow-md'
            }`}>
              <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                ★ OPTIMAL CHOICE
              </div>
              <p className="text-xs font-mono font-bold text-emerald-400 uppercase">
                {isWind ? 'REPAIR NOW' : 'AUTOMATED WASH NOW'}
              </p>
              <div className="my-2">
                <span className="text-2xl font-black text-emerald-400">
                  {isWind ? '₹1.35L' : '₹0.45L'}
                </span>
                <span className="text-[11px] text-zinc-400 ml-1">
                  {isWind ? '($1,640)' : '($540)'}
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-300">
                {isWind ? '4.5h Downtime' : '2.0h Downtime'}
              </p>
              <p className="text-[11px] opacity-75 mt-1">
                {isWind
                  ? 'Replaces cartridge before shaft or gearbox damage.'
                  : 'Automated robotic wash clears sand layer; clears hotspot before diode burns.'}
              </p>
            </div>

            {/* Scenario 2: Wait 6 Hours */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className="text-xs font-mono font-bold text-amber-400 uppercase">WAIT 6 HOURS</p>
              <div className="my-2">
                <span className="text-2xl font-black text-amber-400">
                  {isWind ? '₹2.61L' : '₹1.25L'}
                </span>
                <span className="text-[11px] text-zinc-400 ml-1">
                  {isWind ? '($3,150)' : '($1,510)'}
                </span>
              </div>
              <p className="text-xs font-medium text-amber-300">
                {isWind ? '7.0h Downtime' : '5.0h Downtime'}
              </p>
              <p className="text-[11px] opacity-75 mt-1">
                {isWind
                  ? 'Thermal escalation requires raceway regrind & flush.'
                  : 'Reverse-bias heating requires bypass diode box replacement and string rewire.'}
              </p>
            </div>

            {/* Scenario 3: Wait 24 Hours */}
            <div className={`p-4 rounded-xl border transition-all ${
              isDark ? 'bg-zinc-900/40 border-amber-900/40' : 'bg-amber-50/40 border-amber-200'
            }`}>
              <p className="text-xs font-mono font-bold text-amber-500 uppercase">WAIT 24 HOURS</p>
              <div className="my-2">
                <span className="text-2xl font-black text-amber-500">
                  {isWind ? '₹6.34L' : '₹3.80L'}
                </span>
                <span className="text-[11px] text-zinc-400 ml-1">
                  {isWind ? '($7,650)' : '($4,580)'}
                </span>
              </div>
              <p className="text-xs font-medium text-amber-400">
                {isWind ? '18.0h Downtime' : '14.0h Downtime'}
              </p>
              <p className="text-[11px] opacity-75 mt-1">
                {isWind
                  ? 'Bearing seizure, rotor drive-shaft scoring, forced trip.'
                  : 'Permanent solar cell cracking, backsheet burning, and complete panel loss.'}
              </p>
            </div>
          </div>

          {/* Action Triggers Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle size={14} className="text-emerald-400" />
              <span>
                {isWind
                  ? 'Technician Aarav Patel + SKF Bearing ready at Depot (92% readiness)'
                  : 'Robotic Cleaning Unit R-12 + Technician Priya Shah ready on site (95% readiness)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulate}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                🔮 Simulate Failure
              </button>

              <button
                onClick={handleDispatch}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Wrench size={14} />
                <span>★ ACCEPT PLAN &amp; DISPATCH {isWind ? 'REPAIR' : 'WASH'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
