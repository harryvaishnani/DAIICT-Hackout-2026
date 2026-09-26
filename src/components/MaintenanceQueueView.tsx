import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Package,
  Search,
  CheckCircle2,
  ExternalLink,
  Clock,
  Trash2,
  FastForward,
} from 'lucide-react';
import { useSimpleApp } from '../context/SimpleAppContext';
import type { KanbanTicket, TicketStatus } from '../types';

const COMMON_PARTS = [
  'SKF Bearing Cartridge 7200',
  'Synthetic Gear Oil Mobil SHC 634',
  'Inverter Bypass Diode Array',
  'Robotic PV De-Dusting Rig',
  'Pitch Cylinder Hydraulic Seal',
  'Optical Vibration Accelerometer',
  'HEPA Intake Filter C-4',
];

export const MaintenanceQueueView: React.FC = () => {
  const {
    tickets,
    moveTicket,
    claimTicket,
    resolveTicket,
    deleteTicket,
    simulateFastForward24Hours,
    currentUser,
    openDrawer,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activePartTicketId, setActivePartTicketId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState(COMMON_PARTS[0]);

  const formatRemainingTime = (resolvedAt?: string) => {
    if (!resolvedAt) return 'in ~24h';
    const resolvedTime = new Date(resolvedAt).getTime();
    if (isNaN(resolvedTime)) return 'in ~24h';
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - resolvedTime;
    const remaining = TWENTY_FOUR_HOURS - elapsed;
    if (remaining <= 0) return 'Expiring now...';
    const hours = Math.floor(remaining / (3600 * 1000));
    const mins = Math.floor((remaining % (3600 * 1000)) / (60 * 1000));
    return `in ${hours}h ${mins}m`;
  };
  const [loggedHours, setLoggedHours] = useState('2.0');
  const resolutionNotes = 'Replaced damaged components and completed recalibration.';

  // HTML5 drag and drop state
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.assetId.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.assignedTech && t.assignedTech.toLowerCase().includes(q))
    );
  });

  const todoTickets = filteredTickets.filter((t) => t.status === 'TODO');
  const inProgressTickets = filteredTickets.filter((t) => t.status === 'IN_PROGRESS');
  const resolvedTickets = filteredTickets.filter((t) => t.status === 'RESOLVED');

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTicketId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TicketStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTicketId;
    if (id) {
      moveTicket(id, newStatus);
    }
    setDraggedTicketId(null);
  };

  const handleSavePartsAndResolve = (ticketId: string) => {
    resolveTicket(
      ticketId,
      resolutionNotes,
      [selectedPart],
      parseFloat(loggedHours) || 1.5
    );
    setActivePartTicketId(null);
  };

  const renderTicketCard = (ticket: KanbanTicket) => {
    const isCritical = ticket.severity === 'CRITICAL' || ticket.severity === 'HIGH';

    return (
      <div
        key={ticket.id}
        draggable
        onDragStart={(e) => handleDragStart(e, ticket.id)}
        className={`rounded-xl p-4 border transition-all duration-200 shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing ${
          isDark
            ? isCritical
              ? 'bg-[#1E1E1E]/90 border-amber-500/30 hover:border-amber-400'
              : 'bg-[#1E1E1E]/80 border-white/[0.07] hover:border-white/[0.15]'
            : isCritical
            ? 'bg-white border-amber-300 hover:border-amber-400'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-emerald-400">{ticket.id}</span>
            <span
              onClick={() => openDrawer(ticket.assetId)}
              className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
              title="Inspect hardware telemetry"
            >
              {ticket.assetId}
              <ExternalLink size={10} className="opacity-60" />
            </span>
          </div>

          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
              isCritical
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {ticket.severity}
          </span>
        </div>

        {/* Title & Description */}
        <h4 className={`text-xs font-bold leading-snug mb-1.5 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
          {ticket.title}
        </h4>
        <p className={`text-[11px] leading-relaxed mb-3 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          {ticket.description}
        </p>

        {/* Assigned Tech & Metadata */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-dashed border-zinc-700/50 mb-3">
          <div className="flex items-center gap-1.5">
            <UserCheck size={12} className={ticket.assignedTech ? 'text-emerald-500' : 'text-zinc-500'} />
            <span className={`truncate max-w-[130px] ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {ticket.assignedTech || 'Unassigned'}
            </span>
          </div>
          <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            {ticket.createdAt.split(' ')[1] || ticket.createdAt}
          </span>
        </div>

        {/* Logged Parts & Labor Badges (if any) */}
        {ticket.partsUsed.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {ticket.partsUsed.map((part, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                  isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Package size={10} />
                <span className="truncate max-w-[150px]">{part}</span>
              </span>
            ))}
            {ticket.laborHours > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {ticket.laborHours}h labor
              </span>
            )}
          </div>
        )}

        {/* Action Controls based on Status */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {ticket.status === 'TODO' && (
            <>
              <button
                onClick={() => claimTicket(ticket.id, currentUser.name)}
                className="flex-1 text-[11px] font-semibold py-1.5 px-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center justify-center gap-1"
              >
                <UserCheck size={12} />
                <span>Claim Ticket</span>
              </button>
              <button
                onClick={() => moveTicket(ticket.id, 'IN_PROGRESS')}
                title="Move to In-Progress"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ArrowRight size={13} />
              </button>
            </>
          )}

          {ticket.status === 'IN_PROGRESS' && (
            <>
              <button
                onClick={() => moveTicket(ticket.id, 'TODO')}
                title="Move back to To-Do"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ArrowLeft size={13} />
              </button>
              <button
                onClick={() => setActivePartTicketId(activePartTicketId === ticket.id ? null : ticket.id)}
                className="flex-1 text-[11px] font-semibold py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1"
              >
                <CheckCircle size={12} />
                <span>Log &amp; Resolve</span>
              </button>
              <button
                onClick={() => moveTicket(ticket.id, 'RESOLVED')}
                title="Quick mark resolved"
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ArrowRight size={13} />
              </button>
            </>
          )}

          {ticket.status === 'RESOLVED' && (
            <div className="w-full space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] text-emerald-500 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Serviced &amp; Restored
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveTicket(ticket.id, 'IN_PROGRESS')}
                    className={`text-[10px] hover:underline ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}
                  >
                    Reopen
                  </button>
                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    title="Permanently remove work order now"
                    className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* 24-Hour Auto-Retention Indicator */}
              <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  Auto-purges {formatRemainingTime(ticket.resolvedAt)}
                </span>
                <span className="text-[9px] opacity-75">24h policy</span>
              </div>
            </div>
          )}
        </div>

        {/* Inline Parts & Labor Dialog (when resolving) */}
        {activePartTicketId === ticket.id && (
          <div className={`mt-3 p-3 rounded-lg border space-y-2.5 animate-in fade-in duration-150 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}>
            <p className="text-[11px] font-bold text-sky-400 uppercase">Log Servicing Parts &amp; Time</p>
            <div>
              <label className="block text-[10px] opacity-75 mb-1">Hardware Part Used:</label>
              <select
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
                className={`w-full text-xs p-1.5 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                {COMMON_PARTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] opacity-75 mb-1">Labor Hours:</label>
              <input
                type="number"
                step="0.5"
                value={loggedHours}
                onChange={(e) => setLoggedHours(e.target.value)}
                className={`w-full text-xs p-1.5 rounded border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActivePartTicketId(null)}
                className="text-[11px] px-2 py-1 rounded hover:underline opacity-80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSavePartsAndResolve(ticket.id)}
                className="text-[11px] font-bold px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow-xs"
              >
                Complete Work Order
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Wrench size={20} className="text-sky-500" />
            Maintenance Operations Kanban
          </h2>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Track work orders, dispatch field technicians, log parts catalog, and restore hardware baseline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={14} className={`absolute left-2.5 top-2.5 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-lg border w-48 sm:w-64 transition-colors ${
                isDark ? 'bg-[#1E1E1E] border-zinc-700 text-white focus:border-sky-500' : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: TO-DO */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'TODO')}
          className={`rounded-2xl p-4 border flex flex-col gap-3 min-h-[500px] transition-colors ${
            isDark ? 'bg-[#18181B]/60 border-zinc-800/80' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">To-Do / Triaged</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400">
              {todoTickets.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {todoTickets.map(renderTicketCard)}
            {todoTickets.length === 0 && (
              <div className={`p-8 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                No pending work orders in backlog.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: IN-PROGRESS */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'IN_PROGRESS')}
          className={`rounded-2xl p-4 border flex flex-col gap-3 min-h-[500px] transition-colors ${
            isDark ? 'bg-[#18181B]/60 border-zinc-800/80' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider">In-Progress</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
              {inProgressTickets.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {inProgressTickets.map(renderTicketCard)}
            {inProgressTickets.length === 0 && (
              <div className={`p-8 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                No active work orders. Drag or claim tickets from To-Do.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: RESOLVED */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'RESOLVED')}
          className={`rounded-2xl p-4 border flex flex-col gap-3 min-h-[500px] transition-colors ${
            isDark ? 'bg-[#18181B]/60 border-zinc-800/80' : 'bg-slate-50/70 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Resolved &amp; Restored</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                24h Retention
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                {resolvedTickets.length}
              </span>
            </div>
          </div>

          {/* 24-Hour Auto-Purge Retention Banner & Fast-Forward Simulator */}
          <div className={`p-2.5 rounded-xl border text-[11px] flex items-center justify-between gap-2 ${
            isDark ? 'bg-emerald-950/30 border-emerald-500/25 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center gap-1.5 min-w-0">
              <Clock size={13} className="shrink-0 text-emerald-400" />
              <span className="truncate text-[11px] font-medium">
                Auto-purges permanently 24 hours after resolution.
              </span>
            </div>
            {resolvedTickets.length > 0 && (
              <button
                onClick={simulateFastForward24Hours}
                title="Advance clock by 24h to verify automatic permanent deletion"
                className="shrink-0 px-2 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-xs active:scale-95"
              >
                <FastForward size={11} />
                <span>Simulate +24h</span>
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {resolvedTickets.map(renderTicketCard)}
            {resolvedTickets.length === 0 && (
              <div className={`p-8 text-center text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                Completed work orders will appear here and automatically delete permanently after 24 hours.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
