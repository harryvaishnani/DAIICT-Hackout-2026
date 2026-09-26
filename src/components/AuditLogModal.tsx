import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import { X, Shield, Download } from 'lucide-react';
import type { AuditLogEntry } from '../types';

export const AuditLogModal: React.FC = () => {
  const { isAuditLogModalOpen, setIsAuditLogModalOpen, auditLogs, currentFirm, theme } = useSimpleApp();
  const isDark = theme === 'dark';

  const [filterAction, setFilterAction] = useState<string>('ALL');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuditLogModalOpen) {
        setIsAuditLogModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuditLogModalOpen, setIsAuditLogModalOpen]);

  if (!isAuditLogModalOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  const handleExportLogs = () => {
    const headers = ['Audit ID', 'Timestamp', 'User Name', 'User Role', 'Firm ID', 'Action Type', 'Asset ID', 'Audit Details'];
    const rows = auditLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      l.userRole,
      l.firmId,
      l.action,
      l.assetId,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentFirm.name.replace(/\s+/g, '_')}_Audit_Log_Trail.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'ASSET_CREATED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'ASSET_DECOMMISSIONED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'ASSET_UPDATED':
      case 'THRESHOLD_MODIFIED':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'TICKET_RESOLVED':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#18181B] border-zinc-700/80 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Enterprise Audit &amp; Accountability Trail</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Immutable record of hardware modifications, operational threshold updates, and work order closures
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportLogs}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-300 border-zinc-700' : 'hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title="Download CSV Audit Log"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => setIsAuditLogModalOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Action Filter */}
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-75">Showing {filteredLogs.length} audit trail records</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] opacity-75">Filter:</span>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className={`p-1.5 rounded border text-xs ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                <option value="ALL">All Actions</option>
                <option value="ASSET_CREATED">Hardware Registered</option>
                <option value="ASSET_UPDATED">Asset Configuration Updated</option>
                <option value="ASSET_DECOMMISSIONED">Hardware Decommissioned</option>
                <option value="THRESHOLD_MODIFIED">Threshold Modified</option>
                <option value="TICKET_RESOLVED">Work Order Resolved</option>
              </select>
            </div>
          </div>

          {/* Audit Items List */}
          <div className="space-y-2.5">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-500">{log.id}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getActionBadge(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {log.assetId}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {log.details}
                  </p>
                </div>

                <div className={`text-right text-[11px] shrink-0 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <p className="font-semibold text-zinc-200">{log.userName}</p>
                  <p className="text-[10px] opacity-75">{log.userRole} · {log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
