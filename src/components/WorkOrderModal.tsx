import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Printer 
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

interface WorkOrderModalProps {
  ticketId: string | null;
  onClose: () => void;
}

export const WorkOrderModal: React.FC<WorkOrderModalProps> = ({ ticketId, onClose }) => {
  const { workOrders } = useTelemetry();

  if (!ticketId) return null;

  const ticket = workOrders.find((wo) => wo.id === ticketId) || workOrders[0];
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-600 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                SCADA WORK ORDER DISPATCHED
              </h3>
              <p className="text-[11px] text-emerald-400 font-bold">
                Ticket Ref: {ticket.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">Target Asset</span>
              <span className="text-white font-bold text-xs">{ticket.asset_name}</span>
              <span className="text-sky-400 text-[10px] block">ID: {ticket.asset_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Severity Level</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                ticket.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-700' : 'bg-amber-950 text-amber-400 border border-amber-700'
              }`}>
                {ticket.severity} PRIORITY
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Dispatched Lead</span>
              <span className="text-slate-200 text-xs flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                {ticket.crew_lead}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Estimated Arrival</span>
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                &lt; 45 Minutes
              </span>
            </div>
          </div>

          {/* Diagnosis & Scope of Work */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-bold text-[11px] block">
              DIAGNOSTIC SUMMARY & ROOT CAUSE:
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed font-sans">
              {ticket.description}
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-bold text-[11px] block">
              MANDATORY FIELD PROCEDURE:
            </span>
            <ul className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-sans">
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 font-mono font-bold">1.</span>
                <span>Verify Lockout/Tagout (LOTO) isolation on 690V primary bus before nacelle ascent.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 font-mono font-bold">2.</span>
                <span>Inspect bearing housing with infrared pyrometer and high-resolution borescope.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 font-mono font-bold">3.</span>
                <span>Collect 50ml gearbox oil sample for ISO 4406 particulate cleanliness count.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-sky-400 font-mono font-bold">4.</span>
                <span>Log final telemetry clearance in SCADA terminal before restoring grid synchronization.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Work Order</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors shadow-lg"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
