import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  FileText,
  Download,
  Printer,
  Zap,
  DollarSign,
  Leaf,
  Award,
  Car,
  Trees,
  Home,
} from 'lucide-react';

export const ExecutiveReportingView: React.FC = () => {
  const {
    currentFirm,
    visibleAssets,
    energyRecoveredMWh,
    revenueProtectedINR,
    co2AvoidedTonnes,
    setIsAuditLogModalOpen,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<'WEEKLY' | 'MONTHLY' | 'QUARTERLY'>('WEEKLY');

  // Generate and download genuine CSV
  const handleExportCSV = () => {
    const headers = [
      'Asset ID',
      'Name',
      'Hardware Type',
      'Location',
      'Model',
      'Risk Level',
      'Failure Probability (%)',
      'RUL Window',
      'Vibration (mm/s)',
      'Temperature (C)',
      'Current (A)',
      'Soiling (%)',
      'Daily Loss (INR)',
      'Energy at Risk (MWh)',
    ];

    const rows = visibleAssets.map((a) => [
      a.id,
      `"${a.name}"`,
      a.type,
      `"${a.location}"`,
      `"${a.modelNumber || 'N/A'}"`,
      a.risk,
      a.failureProbability || 10,
      `"${a.expectedFailureWindow || 'Nominal'}"`,
      a.sensors.vibration,
      a.sensors.temperature,
      a.sensors.current,
      a.sensors.soiling,
      a.revenueLossINR || Math.round(a.revenueLossUSD * 83),
      a.energyAtRiskMWh || a.energyLossMWh,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VORTEX_${currentFirm.name.replace(/\s+/g, '_')}_Intelligence_Report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award size={18} />
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Executive Intelligence &amp; ROI Ledger
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Aggregated business intelligence and sustainability metrics for {currentFirm.name}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe Selector */}
          <div className={`p-1 rounded-lg border flex text-xs font-semibold ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['WEEKLY', 'MONTHLY', 'QUARTERLY'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  timeframe === t
                    ? (isDark ? 'bg-slate-800 text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                    : 'opacity-70'
                }`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer ${
              isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => setIsAuditLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <FileText size={13} />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Hero: Energy Recovery & Value Protected Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Clean Energy Recovered */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
          isDark
            ? 'bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-teal-500/10 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-950/20'
            : 'bg-gradient-to-br from-emerald-50/90 via-white/85 to-teal-50/70 border-emerald-300 text-emerald-900 shadow-lg shadow-emerald-500/5'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Zap size={15} /> Clean Energy Preserved
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              SAVED
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight my-2 text-emerald-400">
            +{energyRecoveredMWh.toFixed(1)} MWh
          </div>
          <p className="text-xs opacity-80 mt-1">
            Preserved generation from proactive servicing vs. reactive trip downtime.
          </p>
        </div>

        {/* Revenue Protected */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
          isDark
            ? 'bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-teal-500/10 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-950/20'
            : 'bg-gradient-to-br from-emerald-50/90 via-white/85 to-teal-50/70 border-emerald-300 text-emerald-900 shadow-lg shadow-emerald-500/5'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <DollarSign size={15} /> Revenue Protected
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              NET ROI
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight my-2 text-emerald-400">
            ₹{(revenueProtectedINR / 100000).toFixed(2)}L
          </div>
          <p className="text-xs opacity-80 mt-1">
            Capital loss prevented against catastrophic unmitigated hardware seizures.
          </p>
        </div>

        {/* Carbon Offset Avoided */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
          isDark
            ? 'glass-panel-dark text-slate-200'
            : 'glass-panel-light text-slate-800 shadow-lg shadow-slate-200/50'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-300">
              <Leaf size={15} className="text-emerald-400" /> CO₂ Offset Preserved
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              ESG
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight my-2 text-slate-100">
            {co2AvoidedTonnes} Tonnes
          </div>
          <p className="text-xs opacity-80 mt-1 text-slate-400">
            Avoided fossil fuel grid substitution across Gujarat state transmission.
          </p>
        </div>
      </div>

      {/* Environmental & ESG Equivalent Impact Grid */}
      <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight">
            Real-World Equivalents of Recovered Clean Energy
          </h3>
          <span className="text-xs text-slate-400">
            Central Electricity Authority (CEA) Model
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Equivalent 1: Driving */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 backdrop-blur-sm ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'
          }`}>
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Car size={20} />
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums text-slate-100">4,900 km</p>
              <p className="text-xs text-slate-400">Vehicle Driving Avoided</p>
            </div>
          </div>

          {/* Equivalent 2: Trees */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 backdrop-blur-sm ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'
          }`}>
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Trees size={20} />
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums text-slate-100">820 Trees</p>
              <p className="text-xs text-slate-400">Annual Carbon Absorption</p>
            </div>
          </div>

          {/* Equivalent 3: Homes */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 backdrop-blur-sm ${
            isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'
          }`}>
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
              <Home size={20} />
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums text-slate-100">3,400 Homes</p>
              <p className="text-xs text-slate-400">Daily Clean Electricity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial ROI Breakdown Table */}
      <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
        isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight">
            Predictive Maintenance Return on Investment (ROI)
          </h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            FLEET ROI: 414%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Reactive Run-To-Failure</th>
                <th className="py-2.5 px-3 text-emerald-400 font-bold">VORTEX Predictive Ops</th>
                <th className="py-2.5 px-3 text-right">Net Value Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Main Bearing &amp; Drivetrain Repair</td>
                <td className="py-2.5 px-3 tabular-nums text-slate-400">₹6,34,000 (catastrophic seizure)</td>
                <td className="py-2.5 px-3 tabular-nums text-emerald-400 font-bold">₹1,35,000 (planned swap)</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-400">+₹4,99,000</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Solar Array Soiling &amp; Diode Stress</td>
                <td className="py-2.5 px-3 tabular-nums text-slate-400">₹1,85,000 (string burnout)</td>
                <td className="py-2.5 px-3 tabular-nums text-emerald-400 font-bold">₹18,000 (crawler wash bot)</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-400">+₹1,67,000</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-slate-200">Generation Curtailment Penalty</td>
                <td className="py-2.5 px-3 tabular-nums text-slate-400">₹2,40,000 (peak export loss)</td>
                <td className="py-2.5 px-3 tabular-nums text-emerald-400 font-bold">₹18,000 (off-peak window)</td>
                <td className="py-2.5 px-3 text-right tabular-nums font-bold text-emerald-400">+₹2,22,000</td>
              </tr>
              <tr className="font-bold text-xs bg-emerald-500/5">
                <td className="py-2.5 px-3 text-emerald-400">TOTAL OPERATIONAL NET VALUE</td>
                <td className="py-2.5 px-3 tabular-nums text-slate-400">₹10,59,000</td>
                <td className="py-2.5 px-3 tabular-nums text-emerald-400">₹1,71,000</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-bold">+₹8,88,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
