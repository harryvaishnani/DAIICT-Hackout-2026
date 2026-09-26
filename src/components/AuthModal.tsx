import React, { useState, useEffect } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  X,
  CheckCircle2,
  ChevronRight,
  Zap,
  Wind,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    users,
    currentUser,
    authenticateUser,
    isAuthenticated,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'ROLES' | 'CREDENTIALS'>('ROLES');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<number>(0);
  const [authLog, setAuthLog] = useState<string>('');
  const [rpmDisplay, setRpmDisplay] = useState<number>(16.8);
  const [freqDisplay, setFreqDisplay] = useState<number>(50.02);

  // Live dynamic acceleration of windmill turbine when logging in
  useEffect(() => {
    let interval: any;
    if (isAuthenticating) {
      interval = setInterval(() => {
        setRpmDisplay((prev) => {
          if (prev < 94.2) {
            return parseFloat((prev + Math.random() * 9 + 6).toFixed(1));
          }
          return 94.2;
        });
        setFreqDisplay((prev) => {
          if (prev > 50.00) {
            return parseFloat((prev - 0.004).toFixed(2));
          }
          return 50.00;
        });
      }, 70);
    } else {
      setRpmDisplay(16.8);
      setFreqDisplay(50.02);
    }
    return () => clearInterval(interval);
  }, [isAuthenticating]);

  const handleClose = () => {
    if (!isAuthenticating) {
      if (!isAuthenticated) {
        authenticateUser(currentUser.id);
      } else {
        setIsAuthModalOpen(false);
      }
      setIsAuthenticating(false);
      setAuthStep(0);
      setAuthLog('');
    }
  };

  if (!isAuthModalOpen) return null;

  const handleAuthorize = (userId: string) => {
    setSelectedUserId(userId);
    setIsAuthenticating(true);
    setAuthStep(1);
    setAuthLog('Spooling Windmill Turbine & initiating SCADA TLS 1.3 handshake...');

    setTimeout(() => {
      setAuthStep(2);
      setAuthLog('Phase-locking generator to 50.00 Hz & verifying AES-256 tokens...');
    }, 700);

    setTimeout(() => {
      setAuthStep(3);
      setAuthLog('Grid Synchronization Complete! Clearance granted for Gujarat nodes...');
    }, 1400);

    setTimeout(() => {
      authenticateUser(userId);
    }, 2200);
  };

  const selectedTargetUser = users.find(u => u.id === selectedUserId) || currentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Heavy Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Cybernetic Login Modal */}
      <div
        className={`relative z-10 w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200 ${
          isDark
            ? 'bg-[#0B101D] border-emerald-500/30 text-slate-100 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black tracking-widest text-emerald-400 uppercase">
                  VORTEX SCADA GATEWAY
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AES-256
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gujarat Renewable Transmission Node · Multi-Tenant RBAC Authentication
              </p>
            </div>
          </div>

          {!isAuthenticating && (
            <button
              onClick={handleClose}
              aria-label="Close"
              title="Close SCADA Login"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ⚡ UNIQUE WINDMILL FAN SCADA SHOWCASE & TELEMETRY DECK */}
        <div className="relative h-36 sm:h-40 bg-gradient-to-b from-slate-950 via-[#0B1323] to-[#0A0F1D] border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 overflow-hidden">
          {/* Cybernetic background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Laser Sweep Line */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-laser-scan pointer-events-none" />

          {/* LEFT: Live Animated Windmill Fan with Concentric HUD Reticles */}
          <div className="relative flex items-center justify-center shrink-0 z-10">
            <svg viewBox="0 0 160 140" className="w-32 h-28 sm:w-40 sm:h-36 overflow-visible">
              <defs>
                <linearGradient id="loginTowerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="loginBladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="30%" stopColor="#34D399" />
                  <stop offset="70%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>
                <filter id="loginGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Wind Velocity Streamlines */}
              <line x1="5" y1="42" x2="155" y2="42" stroke="#10B981" strokeWidth="1" className="animate-wind-stream" opacity="0.6" />
              <line x1="0" y1="75" x2="160" y2="75" stroke="#10B981" strokeWidth="1.2" className="animate-wind-stream" opacity="0.8" />
              <line x1="10" y1="108" x2="150" y2="108" stroke="#10B981" strokeWidth="0.8" className="animate-wind-stream" opacity="0.5" />

              {/* Concentric Rotating Cybernetic HUD Reticles around Hub (80, 72) */}
              <g transform="translate(80, 72)">
                {/* Outer segmented ring */}
                <circle cx="0" cy="0" r="48" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="14 8 4 8" className="animate-hud-reticle-ccw opacity-40" />
                {/* Inner dashed ring */}
                <circle cx="0" cy="0" r="34" fill="none" stroke="#10B981" strokeWidth="1.2" strokeDasharray="8 6" className="animate-hud-reticle-cw opacity-70" />

                {/* Crosshairs */}
                <line x1="-54" y1="0" x2="-44" y2="0" stroke="#10B981" strokeWidth="1.5" />
                <line x1="44" y1="0" x2="54" y2="0" stroke="#10B981" strokeWidth="1.5" />
                <line x1="0" y1="-54" x2="0" y2="-44" stroke="#10B981" strokeWidth="1.5" />
                <line x1="0" y1="44" x2="0" y2="54" stroke="#10B981" strokeWidth="1.5" />

                {/* Expanding Grid Synchronization Shockwave Burst (when authenticating) */}
                {isAuthenticating && (
                  <circle cx="0" cy="0" r="16" fill="none" stroke="#34D399" strokeWidth="2.5" className="animate-sync-shockwave" />
                )}
              </g>

              {/* Turbine Tower */}
              <polygon points="77,75 83,75 86,140 74,140" fill="url(#loginTowerGrad)" stroke="#334155" strokeWidth="0.5" />
              <line x1="76" y1="95" x2="84" y2="95" stroke="#475569" strokeWidth="0.8" />
              <line x1="75" y1="115" x2="85" y2="115" stroke="#475569" strokeWidth="0.8" />

              {/* Generator Nacelle */}
              <ellipse cx="80" cy="72" rx="14" ry="9" fill="#1E293B" stroke="#10B981" strokeWidth="1" />
              <circle cx="80" cy="72" r="5" fill="#0F172A" stroke="#34D399" strokeWidth="1" />

              {/* Plasma Lightning Arc when spooling */}
              {isAuthenticating && (
                <path d="M 80 72 Q 95 62, 105 74 T 125 70" fill="none" stroke="#34D399" strokeWidth="1.8" className="animate-plasma-arc" filter="url(#loginGlow)" />
              )}

              {/* Mathematically Symmetrical 3-Blade Rotor centered at (80, 72) */}
              <g transform="translate(80, 72)">
                <g className={isAuthenticating ? 'animate-turbine-login-spool' : 'animate-turbine-login-idle'}>
                  {/* Blade 1 (0 deg) */}
                  <g transform="rotate(0)">
                    <path d="M -2.5 0 C -3.5 -12, -4.5 -30, -1.8 -48 C 0 -54, 1.8 -54, 2.5 -48 C 4.5 -30, 3.5 -12, 2.5 0 Z" fill="url(#loginBladeGrad)" />
                    <polygon points="-1.8,-48 0,-54 1.8,-54 2,-44 -2,-44" fill="#10B981" />
                  </g>
                  {/* Blade 2 (120 deg) */}
                  <g transform="rotate(120)">
                    <path d="M -2.5 0 C -3.5 -12, -4.5 -30, -1.8 -48 C 0 -54, 1.8 -54, 2.5 -48 C 4.5 -30, 3.5 -12, 2.5 0 Z" fill="url(#loginBladeGrad)" />
                    <polygon points="-1.8,-48 0,-54 1.8,-54 2,-44 -2,-44" fill="#10B981" />
                  </g>
                  {/* Blade 3 (240 deg) */}
                  <g transform="rotate(240)">
                    <path d="M -2.5 0 C -3.5 -12, -4.5 -30, -1.8 -48 C 0 -54, 1.8 -54, 2.5 -48 C 4.5 -30, 3.5 -12, 2.5 0 Z" fill="url(#loginBladeGrad)" />
                    <polygon points="-1.8,-48 0,-54 1.8,-54 2,-44 -2,-44" fill="#10B981" />
                  </g>

                  {/* Central Hub Dome */}
                  <circle cx="0" cy="0" r="5" fill="#0F172A" stroke="#10B981" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#34D399" />
                </g>
              </g>
            </svg>
          </div>

          {/* RIGHT: Live SCADA Telemetry & Phase Synchronizer */}
          <div className="flex flex-col justify-center min-w-0 z-10 flex-1 ml-3 sm:ml-5 font-mono">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1.5 transition-all ${
                isAuthenticating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAuthenticating ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                <span>{isAuthenticating ? 'HYPER-SPOOL & GRID SYNC' : 'WIND TURBINE GENERATOR'}</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">● NODE: GUJ-SCADA-01</span>
            </div>

            {/* Live Telemetry Meters */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ROTOR SPEED</span>
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${isAuthenticating ? 'text-emerald-300 animate-pulse' : 'text-slate-200'}`}>
                  <Wind size={13} className={isAuthenticating ? 'animate-spin text-emerald-400' : 'text-emerald-500'} />
                  <span>{rpmDisplay} RPM</span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">GRID FREQUENCY</span>
                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${freqDisplay === 50.00 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <Zap size={13} />
                  <span>{freqDisplay.toFixed(2)} Hz</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
              <span>CAPACITY: 3.3 MW</span>
              <span className={isAuthenticating ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-400'}>
                {isAuthenticating ? 'PHASE LOCKING: 0.00°' : 'AES-256 STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('ROLES')}
            className={`px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ROLES'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={13} />
            <span>1-Click Role Profiles (Demo)</span>
          </button>
          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`px-4 py-2 text-xs font-bold font-mono transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CREDENTIALS'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key size={13} />
            <span>Standard SCADA Login</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {activeTab === 'ROLES' ? (
            /* Role Cards List */
            <div className="space-y-2.5">
              <p className="text-xs font-medium text-slate-400">
                Choose an operational role below to instantly load their customized permissions, fleet scope, and telemetry views:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {users.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  const isDirector = u.role === 'EXECUTIVE';
                  const isReliability = u.title.toLowerCase().includes('engineer') || u.title.toLowerCase().includes('lead');

                  return (
                    <div
                      key={u.id}
                      onClick={() => !isAuthenticating && handleAuthorize(u.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/20'
                          : isDark
                          ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center">
                            {u.avatarInitials}
                          </span>
                          <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {isDirector ? 'LEVEL 5' : isReliability ? 'LEVEL 4' : 'LEVEL 3'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold leading-tight">{u.name}</h4>
                        <p className="text-[11px] text-emerald-400 font-medium mt-0.5">{u.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                          {isDirector
                            ? 'Full statewide overview, ₹ Protected Revenue, Financial Loss Prevention.'
                            : isReliability
                            ? 'SCADA Telemetry, Vibration FFT, 1-Click Work Order Dispatch.'
                            : 'Regional Depot Spares, Component Checklists, Mobile Tickets.'}
                        </p>
                      </div>

                      <button
                        disabled={isAuthenticating}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAuthorize(u.id);
                        }}
                        className={`mt-3 w-full py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isAuthenticating && isSelected ? (
                          <>
                            <Wind size={13} className="animate-spin text-white" />
                            <span>Synchronizing Grid...</span>
                          </>
                        ) : (
                          <>
                            <Wind size={13} className={isSelected ? 'text-white' : 'text-emerald-400'} />
                            <span>Authorize Role</span>
                            <ChevronRight size={13} />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Standard SCADA Credentials Form */
            <div className="space-y-3.5 max-w-md mx-auto py-2">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  OPERATOR USERNAME / ID
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="priya.sharma@apexrenewable.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  GRID ACCESS KEY (AES-256 TOKEN)
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={isAuthenticating}
                  onClick={() => handleAuthorize(currentUser.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <Wind size={14} className="animate-spin text-white" />
                      <span>Synchronizing Wind Turbines...</span>
                    </>
                  ) : (
                    <>
                      <Wind size={14} />
                      <span>Authenticate Grid Session</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Full-Feature Animated Grid Synchronization Console */}
          {isAuthenticating && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/50 space-y-3 shadow-xl shadow-emerald-950/40 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <span className="animate-spin text-base">⚡</span>
                  <span className="truncate">{authLog}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono shrink-0 ml-2">
                  STAGE {authStep}/3
                </span>
              </div>

              {/* Dynamic Animated Meter */}
              <div className="h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 rounded-full transition-all duration-300 shadow-[0_0_15px_#10B981]"
                  style={{ width: `${(authStep / 3) * 100}%` }}
                />
              </div>

              {/* 3 Grid Stages Verification Badges */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
                <div
                  className={`p-1.5 rounded border transition-all ${
                    authStep >= 1
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  {authStep >= 1 ? '✓ Rotor Spool 84 RPM' : '○ Rotor Spool-Up'}
                </div>
                <div
                  className={`p-1.5 rounded border transition-all ${
                    authStep >= 2
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  {authStep >= 2 ? '✓ 50.00 Hz Phase Locked' : '○ Phase Synchronization'}
                </div>
                <div
                  className={`p-1.5 rounded border transition-all ${
                    authStep >= 3
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-semibold'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  {authStep >= 3 ? '✓ AES-256 Clearance' : '○ Token Decryption'}
                </div>
              </div>

              {authStep === 3 && (
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-150">
                  <span className="flex items-center gap-2 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>GRID SYNCHRONIZATION LOCKED — WELCOME {selectedTargetUser.name.toUpperCase()}!</span>
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded font-mono shrink-0 ml-2">
                    WORKSPACE ACTIVE
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quick Demo Bypass Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
            <span className="text-[11px] text-slate-500">SCADA Gujarat Grid Gateway · TLS 1.3 · AES-256</span>
            <button
              disabled={isAuthenticating}
              onClick={() => handleAuthorize(currentUser.id)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>⚡ 1-Click Guest Pass</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
