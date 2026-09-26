import React, { useState } from 'react';
import { 
  Bot, 
  AlertCircle, 
  DollarSign, 
  Wrench, 
  Clock, 
  Sparkles, 
  CheckCircle
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

interface AiDiagnosticCardProps {
  onOpenWorkOrderModal: (ticketId: string) => void;
}

export const AiDiagnosticCard: React.FC<AiDiagnosticCardProps> = ({ onOpenWorkOrderModal }) => {
  const { selectedAsset, dispatchMaintenance } = useTelemetry();
  const [isDispatching, setIsDispatching] = useState(false);

  if (!selectedAsset) return null;

  const isCritical = selectedAsset.status === 'CRITICAL';
  const isWarning = selectedAsset.status === 'WARNING';
  const isDispatched = selectedAsset.status === 'MAINTENANCE_DISPATCHED';

  // Handle Maintenance Dispatch
  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const ticket = await dispatchMaintenance(selectedAsset.id);
      onOpenWorkOrderModal(ticket.id);
    } finally {
      setIsDispatching(false);
    }
  };

  // Health Score Circular Progress Calculation
  const score = selectedAsset.health_score;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gaugeColor = '#10B981'; // green
  if (score < 50) gaugeColor = '#DC2626'; // red
  else if (score < 75) gaugeColor = '#D97706'; // amber

  // Financial Loss formatting
  const lossFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(selectedAsset.est_daily_loss);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-800/80 text-sky-400">
            <Bot className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            AI DIAGNOSTIC & FINANCIAL IMPACT ENGINE
          </h3>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Neural Anomaly v4.1
        </span>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">
        {/* Top: Dynamic 0-100% Asset Health Gauge + Vital Metrics */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          {/* Circular SVG Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#1f2937"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Animated value arc */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-white tracking-tight">
                {score}%
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                Health
              </span>
            </div>
          </div>

          {/* Asset Info & AI Status Summary */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">
                {selectedAsset.name}
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                isCritical ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse' :
                isWarning ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                isDispatched ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {selectedAsset.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Asset Type: <span className="text-sky-400 font-medium">{selectedAsset.type} Subsystem</span> • SCADA Node: <span className="text-white font-mono">{selectedAsset.id}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                MTTF: <strong className={isCritical ? 'text-red-400' : 'text-slate-200'}>
                  {isCritical ? '14.2 Hours' : isWarning ? '4.5 Days' : '> 180 Days'}
                </strong>
              </span>
              <span>•</span>
              <span>
                Failure Prob: <strong className={isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}>
                  {isCritical ? '96.8%' : isWarning ? '41.2%' : '< 1.5%'}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Projected Downtime Financial Loss Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          selectedAsset.est_daily_loss > 0 
            ? 'bg-gradient-to-r from-red-950/40 to-amber-950/20 border-red-600/50' 
            : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${selectedAsset.est_daily_loss > 0 ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-emerald-400'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Projected Unserviced Downtime Loss
              </span>
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${selectedAsset.est_daily_loss > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {lossFormatted}
                <span className="text-xs font-mono font-normal text-slate-400 ml-1">/ day</span>
              </span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <span className="text-[11px] font-mono text-slate-400 block">Immediate Service ROI</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {selectedAsset.est_daily_loss > 0 ? `Saves ${lossFormatted} / 24h` : 'Zero Revenue at Risk'}
            </span>
          </div>
        </div>

        {/* Root Cause Analysis (RCA) Output */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <AlertCircle className={`w-4 h-4 ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-sky-400'}`} />
            <span className="font-mono uppercase tracking-wider">AI Root Cause Analysis (RCA)</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedAsset.root_cause_analysis || (
              isCritical
                ? 'High vibration and severe thermal escalation detected in main shaft bearing raceway. Severe inner-ring spalling risk detected.'
                : isWarning
                ? 'Optical transmittance degradation and high particulate deposition detected on photovoltaic cells. Soiling index exceeds seasonal threshold.'
                : 'All operational parameters are well within normal operating parameters. Thermal dissipation and bearing harmonics in equilibrium.'
            )}
          </p>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400 block mb-0.5">Recommended Field Action:</span>
            <p className="text-xs text-sky-300 font-medium italic">
              "{selectedAsset.recommended_action}"
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Dispatch Maintenance Button */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800">
        {isDispatched ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/50 border border-blue-600/60 text-blue-300 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Work Order Dispatched to Field Operations</span>
            </div>
            <span className="text-[11px] font-bold text-sky-300">STATUS: ACTIVE</span>
          </div>
        ) : (
          <button
            id="dispatch-maintenance-btn"
            onClick={handleDispatch}
            disabled={isDispatching}
            className={`w-full py-3 px-4 rounded-xl font-medium font-mono text-sm shadow-xl flex items-center justify-center space-x-2 transition-all transform active:scale-98 ${
              isCritical
                ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white ring-2 ring-red-500/50 animate-pulse'
                : isWarning
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                : 'bg-gradient-to-r from-blue-700 to-sky-700 hover:from-blue-600 hover:to-sky-600 text-white'
            }`}
          >
            <Wrench className={`w-4 h-4 ${isDispatching ? 'animate-spin' : ''}`} />
            <span>
              {isDispatching
                ? 'Generating SCADA Work Order Ticket...'
                : isCritical
                ? 'DISPATCH EMERGENCY MAINTENANCE TEAM'
                : 'Dispatch Scheduled Maintenance Crew'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
