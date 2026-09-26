import React, { useState, useRef, useEffect } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  Wind,
  Sun,
  Zap,
  DollarSign,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Moon,
  Plus,
  Shield,
  Wifi,
  WifiOff,
  Bell,
  FileText,
  Check,
  Database,
  FastForward,
  ShieldCheck,
  LogOut,
  Compass,
  Sliders,
  Wrench,
  Award,
} from 'lucide-react';

export const SimpleHeader: React.FC = () => {
  const {
    currentFirm,
    currentUser,
    users,
    switchUser,
    technicianZoneFilter,
    setTechnicianZoneFilter,
    totalAssetsCount,
    atRiskCount,
    totalRevenueLossINR,
    fleetUptimePct,
    triggerTurbineAnomaly,
    triggerSolarAnomaly,
    resetAllHealthy,
    simulateFastForward24Hours,
    theme,
    toggleTheme,
    setIsAddAssetModalOpen,
    setIsAlertRulesModalOpen,
    setIsAuditLogModalOpen,
    setIsSupabaseModalOpen,
    openIncidentCommand,
    isOffline,
    toggleOffline,
    offlineQueueCount,
    syncOfflineQueue,
    setIsAuthModalOpen,
    isAuthenticated,
    logoutUser,
    activeTab,
    setActiveTab,
    tickets,
  } = useSimpleApp();

  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;

  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live IST Clock
  const [headerClock, setHeaderClock] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const istString = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setHeaderClock(istString + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';
  const isExecutive = currentUser.role === 'EXECUTIVE';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);


  return (
    <header
      className={`relative z-40 transition-all duration-200 px-4 py-2.5 sm:px-6 backdrop-blur-xl ${
        isDark
          ? 'glass-panel-dark border-b border-white/10'
          : 'glass-panel-light border-b border-slate-200/90'
      }`}
    >
      {/* Title + Navigation + Global Controls Row */}
      <div className="relative z-50 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Firm Branding & App Title */}
        <div className="flex items-center gap-3">
          {/* VORTEX Brand Badge */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-xs tracking-wider shadow-md shadow-emerald-950/20">
              VORTEX
            </span>
            <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● LIVE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`rounded-lg p-1.5 border transition-colors ${
                isDark ? 'bg-slate-800/80 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'
              }`}
            >
              {currentFirm.logoType === 'Solar' ? <Sun size={16} /> : <Wind size={16} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-sm sm:text-base font-bold tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {currentFirm.name}
                </h1>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {currentFirm.region} · <span className="tabular-nums">{headerClock || 'IST: UTC+5:30'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Sleek Segmented Navigation Tabs */}
        <nav className={`flex items-center p-1 rounded-xl border ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200 shadow-2xs'
        }`}>
          {[
            { key: 'COMMAND', label: 'Fleet Overview', icon: <Compass size={14} /> },
            { key: 'SIMULATE', label: 'What-If Simulator', icon: <Sliders size={14} /> },
            { key: 'EXECUTE', label: 'Maintenance', icon: <Wrench size={14} />, badge: openTicketsCount },
            { key: 'INSIGHTS', label: 'Reports', icon: <Award size={14} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions, Multi-Tenancy Switcher, Theme & Demo Tools */}
        <div className="flex items-center gap-2">
          {/* ⚡ INCIDENT COMMAND Pill (Only when anomaly active) */}
          {atRiskCount > 0 && (
            <button
              onClick={() => openIncidentCommand('WT-04')}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-xs"
              title="Open Emergency Incident Command Center"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
              </span>
              <span>WT-04 ALERT</span>
            </button>
          )}

          {/* Demo Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border shadow-xs transition-all duration-200 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 hover:from-slate-750 hover:to-slate-850 text-slate-200 border-slate-700/90 hover:border-amber-400/50 hover:text-white'
                  : 'bg-gradient-to-b from-white to-slate-50 hover:from-white hover:to-slate-100 text-slate-800 border-slate-200 hover:border-amber-500/50'
              } ${demoMenuOpen ? (isDark ? 'ring-2 ring-amber-400/30 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'ring-2 ring-amber-500/30 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]') : ''}`}
              title="Inject demo anomalies and simulations"
            >
              <Sparkles size={14} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              <span className="hidden sm:inline font-bold">Demo Tools</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  demoMenuOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              />
            </button>

            {demoMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-left"
              >
                {/* Visible Gradient Frame with Glass Layer */}
                <div
                  className={`p-[1px] rounded-2xl transition-all duration-300 shadow-2xl ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-400/50 via-teal-400/35 to-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                      : 'bg-gradient-to-br from-amber-400/60 via-emerald-400/45 to-teal-500/50 shadow-[0_16px_40px_rgba(100,130,200,0.2)]'
                  }`}
                >
                  <div
                    className={`rounded-[15px] p-2.5 space-y-1.5 backdrop-blur-2xl transition-all ${
                      isDark
                        ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#0b162c]/95 text-slate-100'
                        : 'bg-gradient-to-b from-white/95 via-slate-50/95 to-slate-100/92 text-slate-900'
                    }`}
                  >
                    {/* Header with clear description */}
                    <div
                      className={`px-3 py-2 rounded-xl border flex items-center justify-between gap-2 ${
                        isDark
                          ? 'bg-slate-800/60 border-slate-700/60 text-slate-200'
                          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={13} className="text-amber-400 shrink-0" />
                          <p
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isDark ? 'text-amber-300' : 'text-emerald-900'
                            }`}
                          >
                            Interactive Demo Triggers
                          </p>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
                          }`}
                        >
                          Inject fault signatures for real-time evaluation
                        </p>
                      </div>
                    </div>

                    {/* Option 1: Bearing Fault (WT-04) */}
                    <button
                      onClick={() => {
                        triggerTurbineAnomaly();
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800/40 hover:bg-amber-500/15 border-slate-700/50 hover:border-amber-400/40 text-slate-200 hover:text-white'
                          : 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/80 hover:border-amber-300 text-amber-950 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                          isDark
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-xs'
                        }`}
                      >
                        <Zap size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-bold truncate ${isDark ? 'text-amber-200' : 'text-amber-950'}`}>
                            Bearing Fault (WT-04)
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              isDark ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'bg-amber-200/80 text-amber-900'
                            }`}
                          >
                            FAULT
                          </span>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isDark ? 'text-slate-400' : 'text-amber-900/80 font-medium'
                          }`}
                        >
                          High vibration (4.8 mm/s) &amp; overheat
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Solar Dust Soiling (SP-02) */}
                    <button
                      onClick={() => {
                        triggerSolarAnomaly();
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800/40 hover:bg-orange-500/15 border-slate-700/50 hover:border-orange-400/40 text-slate-200 hover:text-white'
                          : 'bg-orange-50/80 hover:bg-orange-100/90 border-orange-200/80 hover:border-orange-300 text-orange-950 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                          isDark
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-xs'
                        }`}
                      >
                        <Sun size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-bold truncate ${isDark ? 'text-orange-200' : 'text-orange-950'}`}>
                            Solar Dust Soiling (SP-02)
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              isDark ? 'bg-orange-400/15 text-orange-300 border border-orange-400/30' : 'bg-orange-200/80 text-orange-900'
                            }`}
                          >
                            SOLAR
                          </span>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isDark ? 'text-slate-400' : 'text-orange-900/80 font-medium'
                          }`}
                        >
                          Soiling index spike to 45%
                        </p>
                      </div>
                    </button>

                    {/* Option 3: Fast-Forward +24h (Purge Test) */}
                    <button
                      onClick={() => {
                        simulateFastForward24Hours();
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800/40 hover:bg-cyan-500/15 border-slate-700/50 hover:border-cyan-400/40 text-slate-200 hover:text-white'
                          : 'bg-sky-50/80 hover:bg-sky-100/90 border-sky-200/80 hover:border-sky-300 text-sky-950 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                          isDark
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-gradient-to-br from-sky-500 to-teal-600 text-white shadow-xs'
                        }`}
                      >
                        <FastForward size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-bold truncate ${isDark ? 'text-cyan-200' : 'text-sky-950'}`}>
                            Fast-Forward +24h (Purge Test)
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              isDark ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30' : 'bg-sky-200/80 text-sky-900'
                            }`}
                          >
                            +24H
                          </span>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isDark ? 'text-slate-400' : 'text-sky-900/80 font-medium'
                          }`}
                        >
                          Simulate 24h auto-deletion of resolved tasks
                        </p>
                      </div>
                    </button>

                    {/* Option 4: Supabase Gujarat SQL */}
                    <button
                      onClick={() => {
                        setIsSupabaseModalOpen(true);
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800/40 hover:bg-emerald-500/15 border-slate-700/50 hover:border-emerald-400/40 text-slate-200 hover:text-white'
                          : 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200/80 hover:border-emerald-300 text-emerald-950 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                          isDark
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs'
                        }`}
                      >
                        <Database size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-bold truncate ${isDark ? 'text-emerald-200' : 'text-emerald-950'}`}>
                            Supabase Gujarat SQL
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              isDark ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-200/80 text-emerald-900'
                            }`}
                          >
                            SQL
                          </span>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 truncate ${
                            isDark ? 'text-slate-400' : 'text-emerald-900/80 font-medium'
                          }`}
                        >
                          Copy SQL queries &amp; seed database
                        </p>
                      </div>
                    </button>

                    {/* Divider & Option 5: Reset Fleet Healthy */}
                    <div className={`pt-1 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200/80'}`}>
                      <button
                        onClick={() => {
                          resetAllHealthy();
                          setDemoMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border ${
                          isDark
                            ? 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/50 hover:border-slate-600 text-slate-200 hover:text-white'
                            : 'bg-slate-100/90 hover:bg-slate-200/90 border-slate-200 hover:border-slate-300 text-slate-900 shadow-2xs'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 transition-transform group-hover:scale-105 ${
                            isDark
                              ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                              : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-xs'
                          }`}
                        >
                          <RefreshCw size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                              Reset Fleet Healthy
                            </p>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                isDark ? 'bg-slate-700/60 text-slate-300 border border-slate-600' : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              RESET
                            </span>
                          </div>
                          <p
                            className={`text-[10px] mt-0.5 truncate ${
                              isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
                            }`}
                          >
                            Restore all assets to normal baseline
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct SCADA Auth / Login Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isAuthenticated
                ? isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-bold'
            }`}
            title="SCADA Grid Authentication & Role Clearance (Click to open Login Page)"
          >
            <ShieldCheck size={14} className={isAuthenticated ? 'text-emerald-400' : 'text-slate-950'} />
            <span className="hidden sm:inline">{isAuthenticated ? 'SCADA AUTH' : 'LOGIN REQUIRED'}</span>
            <span className="sm:hidden">{isAuthenticated ? 'AUTH' : 'LOGIN'}</span>
          </button>

          {/* Prominent Two-State Dark / Light Mode Switcher */}
          <div
            className={`flex items-center p-0.5 rounded-xl border transition-all ${
              isDark
                ? 'bg-slate-900/90 border-slate-700/80 shadow-inner'
                : 'bg-slate-100 border-slate-300 shadow-inner'
            }`}
          >
            <button
              type="button"
              onClick={() => isDark && toggleTheme()}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isDark
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Light Mode"
            >
              <Sun size={13} className={!isDark ? 'text-slate-950 fill-slate-950' : 'text-slate-400'} />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => !isDark && toggleTheme()}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-amber-300 border border-amber-400/20 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Dark Mode"
            >
              <Moon size={13} className={isDark ? 'text-amber-300 fill-amber-300/40' : 'text-slate-600'} />
              <span>Dark</span>
            </button>
          </div>

          {/* Unified System & Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg border shadow-xs transition-all duration-200 active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {currentUser.avatarInitials}
              </span>
              <span className="hidden sm:inline font-medium">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden md:inline">
                {isAuthenticated ? 'AES-256' : 'LOGIN'}
              </span>
              {offlineQueueCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {offlineQueueCount}
                </span>
              )}
              <ChevronDown size={13} className={`transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 rounded-xl border shadow-2xl z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Active Tenant Header */}
                <div className={`px-2 py-1.5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Active Tenant &amp; Role</p>
                  <p className="text-xs font-semibold">{currentUser.name}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentUser.title} · {currentFirm.name}
                  </p>
                </div>

                {/* Switch User (RBAC) */}
                <div className="space-y-1">
                  <p className={`text-[10px] uppercase font-bold px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Switch Role (RBAC Demo)
                  </p>
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                              : 'bg-emerald-50 text-emerald-800 font-semibold'
                            : isDark
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] flex items-center justify-center font-bold">
                            {u.avatarInitials}
                          </span>
                          <div>
                            <p className="leading-tight">{u.name}</p>
                            <p className={`text-[10px] opacity-75 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {u.role === 'EXECUTIVE' ? 'Executive Director' : 'Field Technician'} ({u.firmId === 'firm-apex' ? 'Apex' : 'Helios'})
                            </p>
                          </div>
                        </div>
                        {isSelected && <Check size={14} className="text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* System & Administrative Utilities */}
                <div className={`pt-2 border-t space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className={`text-[10px] uppercase font-bold px-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    System &amp; Data Tools
                  </p>

                  {/* Add Asset */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsAddAssetModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Plus size={13} className="text-emerald-400" />
                    <span>Add New Asset</span>
                  </button>

                  {/* Alert Rules */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsAlertRulesModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Bell size={13} className="text-amber-400" />
                    <span>Alert Rules &amp; Thresholds</span>
                  </button>

                  {/* Audit Log */}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsAuditLogModalOpen(true);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-xs transition-colors cursor-pointer ${
                      isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText size={13} className="text-slate-400" />
                    <span>Compliance Audit Log</span>
                  </button>

                  {/* Offline Mode & Sync */}
                  <div className="flex items-center justify-between px-2.5 py-1.5">
                    <button
                      onClick={toggleOffline}
                      className={`flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                        isOffline ? 'text-amber-400 font-semibold' : isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {isOffline ? <WifiOff size={13} /> : <Wifi size={13} className="text-emerald-500" />}
                      <span>{isOffline ? 'Field Offline Active' : 'Cloud Sync Connected'}</span>
                    </button>
                    {offlineQueueCount > 0 && (
                      <button
                        onClick={syncOfflineQueue}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                      >
                        Sync ({offlineQueueCount})
                      </button>
                    )}
                  </div>
                </div>

                {/* SCADA Auth Actions */}
                <div className={`pt-2 border-t space-y-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={14} />
                    <span>🔐 SCADA Security Clearance</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg text-xs text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Re-Authenticate Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technician Regional Zone Filter Bar (When Technician logged in) */}
      {!isExecutive && currentUser.assignedZone && (
        <div
          className={`mb-2.5 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
            isDark ? 'bg-slate-800/70 border border-slate-700/60 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Assigned Region: <strong>{currentUser.assignedZone}</strong></span>
          </div>
          <button
            onClick={() => setTechnicianZoneFilter(!technicianZoneFilter)}
            className="text-[11px] font-semibold text-emerald-500 hover:underline cursor-pointer"
          >
            {technicianZoneFilter ? 'Switch to All Fleet Units' : 'Filter Only My Zone'}
          </button>
        </div>
      )}

      {/* Streamlined KPI Status Strip - Ultra Clean & Minimal Vertical Height */}
      <div className={`mt-2 pt-2 border-t flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs transition-colors ${
        isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-100 text-slate-700'
      }`}>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          {/* Monitored Assets */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Fleet:</span>
            <strong className={`tabular-nums font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{totalAssetsCount} Units</strong>
          </div>

          {/* Attention */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${atRiskCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Attention:</span>
            <strong className={`tabular-nums font-semibold ${atRiskCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {atRiskCount > 0 ? `${atRiskCount} Flagged` : '0 (Nominal)'}
            </strong>
          </div>

          {/* Health Index */}
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-emerald-400 shrink-0" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Health Index:</span>
            <strong className="text-emerald-400 font-semibold tabular-nums">{fleetUptimePct}%</strong>
          </div>

          {/* Protected Revenue */}
          <div className="flex items-center gap-1.5">
            <DollarSign size={13} className="text-emerald-400 shrink-0" />
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Protected:</span>
            <strong className={`tabular-nums font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ₹{(totalRevenueLossINR / 100000).toFixed(2)}L Saved
            </strong>
          </div>
        </div>

        {/* Autonomous Mode Indicator */}
        <div className={`hidden sm:flex items-center gap-1.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>AI Autonomous Grid Guard</span>
          <span className="text-emerald-400 font-bold">ACTIVE</span>
        </div>
      </div>
    </header>
  );
};
