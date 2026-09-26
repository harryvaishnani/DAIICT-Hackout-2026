import React from 'react';
import { SimpleAppProvider, useSimpleApp } from './context/SimpleAppContext';
import { SimpleHeader } from './components/SimpleHeader';
import { CommandCenterView } from './components/CommandCenterView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { AutonomousExecuteView } from './components/AutonomousExecuteView';
import { ExecutiveReportingView } from './components/ExecutiveReportingView';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { AssetAddModal } from './components/AssetAddModal';
import { AssetDecommissionModal } from './components/AssetDecommissionModal';
import { AlertRulesModal } from './components/AlertRulesModal';
import { AuditLogModal } from './components/AuditLogModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { IncidentCommandModal } from './components/IncidentCommandModal';
import { AuthModal } from './components/AuthModal';
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    notification,
    clearNotification,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden ${
        isDark
          ? 'dark dark-canvas text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300'
          : 'light light-canvas text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-800'
      }`}
    >
      {/* Ambient Relaxed Background Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl transition-all duration-700 ${
            isDark ? 'bg-emerald-500/15' : 'bg-emerald-300/35'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full blur-3xl transition-all duration-700 ${
            isDark ? 'bg-teal-500/10' : 'bg-sky-300/30'
          }`}
        />
        <div
          className={`absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full blur-3xl transition-all duration-700 ${
            isDark ? 'bg-amber-500/10' : 'bg-violet-300/20'
          }`}
        />
        {/* Extra orb for richer light mode depth */}
        {!isDark && (
          <div className="absolute top-1/2 left-1/4 w-[20rem] h-[20rem] rounded-full blur-3xl bg-amber-200/25 transition-all duration-700" />
        )}
      </div>
      {/* Top Header with Integrated Navigation, Controls, Theme Switcher & KPI Strip (z-40) */}
      <SimpleHeader />

      {/* Dynamic Notification Toast Banner */}
      {notification && (
        <div
          className={`relative z-30 border-b text-xs sm:text-sm px-4 sm:px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200 transition-colors ${
            isDark
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 text-sm">⚡</span>
            <span className="font-medium truncate">{notification}</span>
          </div>
          <button
            onClick={clearNotification}
            className={`text-xs p-1 ml-3 shrink-0 rounded transition-colors ${
              isDark ? 'text-emerald-400 hover:text-emerald-200' : 'text-emerald-700 hover:text-emerald-900'
            }`}
            title="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Content Area (z-10) */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {(activeTab === 'COMMAND' || activeTab === 'FLEET') && <CommandCenterView />}
        {activeTab === 'SIMULATE' && <WhatIfSimulatorView />}
        {(activeTab === 'EXECUTE' || activeTab === 'QUEUE') && <AutonomousExecuteView />}
        {(activeTab === 'INSIGHTS' || activeTab === 'REPORTING') && <ExecutiveReportingView />}
      </main>

      {/* Slide-Out Detail Side Panel (z-50) */}
      <AssetDetailDrawer />

      {/* ⚡ INCIDENT COMMAND Modal (Hero Presentation Screen) */}
      <IncidentCommandModal />

      {/* Global Utility Modals (z-50) */}
      <AssetAddModal />
      <AssetDecommissionModal />
      <AlertRulesModal />
      <AuditLogModal />
      <SupabaseConfigModal />
      <AuthModal />


    </div>
  );
};

// ──────────────────────────────────────────────
// Root App with Provider
// ──────────────────────────────────────────────
function App() {
  return (
    <SimpleAppProvider>
      <AppContent />
    </SimpleAppProvider>
  );
}

export default App;
