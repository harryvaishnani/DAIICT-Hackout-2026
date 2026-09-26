import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import { Bell, X, Plus, Send } from 'lucide-react';
import type { AlertRule } from '../types';

export const AlertRulesModal: React.FC = () => {
  const {
    isAlertRulesModalOpen,
    setIsAlertRulesModalOpen,
    alertRules,
    addAlertRule,
    toggleAlertRule,
    testAlertRule,
    visibleAssets,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [targetAsset, setTargetAsset] = useState('ALL');
  const [metric, setMetric] = useState<AlertRule['metric']>('temperature');
  const [condition, setCondition] = useState<'>' | '<'>('>');
  const [threshold, setThreshold] = useState('85.0');
  const [duration, setDuration] = useState('15');
  const [channel, setChannel] = useState<AlertRule['channel']>('SLACK');
  const [recipient, setRecipient] = useState('#ops-renewables-alerts');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAlertRulesModalOpen) {
        setIsAlertRulesModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAlertRulesModalOpen, setIsAlertRulesModalOpen]);

  if (!isAlertRulesModalOpen) return null;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    addAlertRule({
      assetId: targetAsset,
      metric,
      condition,
      threshold: parseFloat(threshold) || 80,
      durationMinutes: parseInt(duration, 10) || 10,
      channel,
      recipient,
      isActive: true,
    });
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#18181B] border-zinc-700/80 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Automated Alerting &amp; Routing Engine</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Custom telemetry anomaly rules dispatched automatically to on-call technicians
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAlertRulesModalOpen(false)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Active Routing Rules ({alertRules.length})
            </h3>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-xs font-semibold text-sky-500 hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              <span>{isAddingNew ? 'Cancel New Rule' : 'Add Custom Rule'}</span>
            </button>
          </div>

          {/* New Rule Form Drawer */}
          {isAddingNew && (
            <form onSubmit={handleCreateRule} className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}>
              <p className="text-xs font-bold">Configure Alert Trigger Condition</p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Target Asset</label>
                  <select
                    value={targetAsset}
                    onChange={(e) => setTargetAsset(e.target.value)}
                    className={`w-full p-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  >
                    <option value="ALL">All Fleet Units</option>
                    {visibleAssets.map((a) => (
                      <option key={a.id} value={a.id}>{a.id} ({a.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Telemetry Metric</label>
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value as AlertRule['metric'])}
                    className={`w-full p-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  >
                    <option value="vibration">Vibration (mm/s)</option>
                    <option value="temperature">Temperature (°C)</option>
                    <option value="current">Current Draw (A)</option>
                    <option value="soiling">Panel Soiling (%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as '>' | '<')}
                    className={`w-full p-2 rounded border font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  >
                    <option value=">">Exceeds (&gt;)</option>
                    <option value="<">Falls Below (&lt;)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Threshold Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className={`w-full p-2 rounded border font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Sustained Window</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="15 min"
                    className={`w-full p-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Notification Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => {
                      const ch = e.target.value as AlertRule['channel'];
                      setChannel(ch);
                      if (ch === 'SMS') setRecipient('+1 (555) 382-9912 (Marcus Chen)');
                      else if (ch === 'SLACK') setRecipient('#ops-renewables-alerts');
                      else setRecipient('solar-dispatch@apexenergy.io');
                    }}
                    className={`w-full p-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  >
                    <option value="SLACK">Slack / Teams Webhook</option>
                    <option value="SMS">SMS Direct Dispatch</option>
                    <option value="EMAIL">Email Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] opacity-75 mb-1">Recipient Destination</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className={`w-full p-2 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs shadow-xs"
                >
                  Save &amp; Activate Rule
                </button>
              </div>
            </form>
          )}

          {/* List of Rules */}
          <div className="space-y-2.5">
            {alertRules.map((rule) => (
              <div
                key={rule.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-500">{rule.id}</span>
                    <span className="text-xs font-bold">
                      If {rule.assetId} {rule.metric} {rule.condition} {rule.threshold}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${rule.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                      {rule.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Sustained for {rule.durationMinutes} min · Route via <strong>{rule.channel}</strong> to {rule.recipient}
                  </p>
                  {rule.lastTriggered && (
                    <p className="text-[10px] text-rose-400">
                      ⚡ Last triggered: {rule.lastTriggered}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => testAlertRule(rule.id)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isDark ? 'hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                    title="Simulate firing this alert"
                  >
                    <Send size={11} />
                    <span>Test Dispatch</span>
                  </button>

                  <button
                    onClick={() => toggleAlertRule(rule.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      rule.isActive
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {rule.isActive ? 'Pause' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
