import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const PredictiveIntelligenceView: React.FC = () => {
  const {
    assets,
    selectedAsset,
    selectAsset,
    launchFailureSimulation,
    openIncidentCommand,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  // Fallback evidence if not defined on asset
  const evidenceList = selectedAsset.explainableEvidence || [
    { metric: 'Telemetry Deviation', change: '+24%', weight: 24, isPrimary: true },
    { metric: 'Thermal Harmonic Rise', change: '+18%', weight: 18, isSecondary: true },
    { metric: 'Cluster Fleet Correlation', change: '+12%', weight: 12 },
    { metric: 'Historical Failure Pattern', change: '+15%', weight: 15 },
  ];

  const modelAgreement = selectedAsset.modelAgreement || {
    agreedCount: 3,
    totalModels: 3,
    models: [
      'Random Forest Anomaly Detector',
      'LSTM Time-Series Predictor',
      'Physics-Informed Neural Network (PINN)',
    ],
  };

  const isHighRisk = selectedAsset.risk === 'HIGH';
  const isModerate = selectedAsset.risk === 'MODERATE';
  const sensors = selectedAsset.sensors;

  const forecastData = selectedAsset.forecast || [
    { day: 'Day -6', actual: 1.2, predicted: 1.2, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Day -4', actual: 1.3, predicted: 1.3, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Day -2', actual: 1.4, predicted: 1.4, warningThreshold: 3.5, criticalThreshold: 4.5 },
    { day: 'Today', actual: selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling, predicted: selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+3d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.05, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+7d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.15, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
    { day: '+14d', predicted: (selectedAsset.type === 'Wind' ? sensors.vibration : sensors.soiling) * 1.3, warningThreshold: selectedAsset.type === 'Wind' ? 3.5 : 30, criticalThreshold: selectedAsset.type === 'Wind' ? 4.5 : 40 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Asset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
              <Sparkles size={18} />
            </span>
            <h2 className="text-lg font-bold tracking-tight">
              Predictive Intelligence &amp; Explainable AI (XAI)
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Multi-signal acoustic anomaly classification, Remaining Useful Life (RUL), and 3-model agreement verification.
          </p>
        </div>

        {/* Quick Asset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-zinc-400">Target Asset:</span>
          {assets.slice(0, 5).map((a) => (
            <button
              key={a.id}
              onClick={() => selectAsset(a.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedAsset.id === a.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {a.id}
              {a.risk === 'HIGH' && ' 🔴'}
              {a.risk === 'MODERATE' && ' 🟠'}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Prediction & RUL Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Remaining Useful Life Card (5 Cols) */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isHighRisk
            ? (isDark ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30' : 'bg-rose-50/70 border-rose-300 shadow-md')
            : isModerate
            ? (isDark ? 'bg-amber-950/20 border-amber-500/50' : 'bg-amber-50/70 border-amber-300')
            : (isDark ? 'bg-[#121622] border-zinc-800' : 'bg-white border-slate-200')
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Clock size={14} /> Remaining Useful Life (RUL)
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                isHighRisk ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {selectedAsset.confidenceScore || 91}% AI Confidence
              </span>
            </div>

            <div className="my-4">
              <span className="text-xs font-mono text-zinc-400 uppercase block">
                {selectedAsset.id} · {selectedAsset.type === 'Wind' ? 'Main Drive Bearing' : 'String Inverter Station'}
              </span>
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-1 text-white">
                {selectedAsset.rulHours
                  ? `${selectedAsset.rulHours} HOURS`
                  : selectedAsset.rulDays
                  ? `${selectedAsset.rulDays} DAYS`
                  : '45+ DAYS'}
              </div>
            </div>

            {/* Visual Health Gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Critical Horizon: {selectedAsset.expectedFailureWindow || 'Optimal Baseline'}</span>
                <span className="font-bold text-rose-400">{selectedAsset.failureProbability || 12}% Risk</span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHighRisk ? 'bg-rose-500 animate-pulse' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedAsset.failureProbability || 12}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action triggers */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => launchFailureSimulation(selectedAsset.id)}
              className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🔮 Simulate Failure</span>
            </button>

            {isHighRisk && (
              <button
                onClick={() => openIncidentCommand(selectedAsset.id)}
                className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>⚡ Incident Command</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Explainable AI — Multi-Signal Evidence & Model Agreement (7 Cols) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#121622] border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Cpu size={14} /> Explainable AI — Evidence Weights
              </span>
              <h4 className="text-sm font-bold mt-0.5">Why does the AI predict this outcome?</h4>
            </div>

            <button
              onClick={() => setWhyModalOpen(!whyModalOpen)}
              className="px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 bg-zinc-800/80 hover:bg-zinc-700 text-sky-300 border-zinc-700 cursor-pointer"
            >
              <Info size={13} />
              <span>Full Deep-Dive</span>
            </button>
          </div>

          {/* Evidence Breakdown Bar List */}
          <div className="space-y-2.5">
            {evidenceList.map((ev) => (
              <div key={ev.metric} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {ev.isPrimary && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                        PRIMARY
                      </span>
                    )}
                    {ev.isSecondary && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        SECONDARY
                      </span>
                    )}
                    <span className="font-medium">{ev.metric}</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">{ev.change}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, ev.weight * 2.2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Model Agreement Widget */}
          <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <div>
                <p className="text-xs font-mono font-bold">Model Ensemble Consensus</p>
                <p className="text-[11px] text-zinc-400">
                  {modelAgreement.agreedCount} of {modelAgreement.totalModels} independent algorithms agree on failure vector
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              100% CONSENSUS
            </span>
          </div>
        </div>
      </div>

      {/* "Why This Prediction" Explanatory Accordion */}
      {whyModalOpen && (
        <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-slate-50 border-slate-300 text-slate-900'
        }`}>
          <div className="flex items-center justify-between border-b pb-2 border-zinc-700">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <HelpCircle size={14} /> PHYSICAL &amp; ACOUSTIC REASONING CHAIN
            </h4>
            <button onClick={() => setWhyModalOpen(false)} className="text-xs text-zinc-400 hover:text-white">
              ✕ Close
            </button>
          </div>

          <ul className="space-y-2 text-xs leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Vibration exceeded baseline:</strong> High-frequency accelerometer peak at 4.8 mm/s violates ISO standard limits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Thermal rise follows vibration spike:</strong> Lubricant thermal degradation (+22°C above nominal) confirms hydrodynamic breakdown.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Historical match:</strong> Anomaly spectral FFT matches historical bearing raceway flaking profiles from 14 previous offshore fleet incidents.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Current harmonic distortion:</strong> Stator current ripple confirms mechanical torque pulsation coupled to shaft rotation.</span>
            </li>
          </ul>
        </div>
      )}

      {/* 14-Day Predictive Forecast Chart ("Crystal Ball") */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        isDark ? 'bg-[#121622] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              PREDICTIVE TRAJECTORY FORECAST
            </span>
            <h3 className="text-base font-bold tracking-tight mt-0.5">
              14-Day Degradation Horizon vs Safety Thresholds
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400" />
              <span>Actual Telemetry</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-0 border-b-2 border-dashed border-rose-400" />
              <span>AI Projected Curve</span>
            </span>
          </div>
        </div>

        {/* Recharts Forecast Line */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262D42' : '#E2E8F0'} />
              <XAxis dataKey="day" stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} fontStyle="monospace" />
              <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} fontSize={11} fontStyle="monospace" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0F121C' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine y={forecastData[0].warningThreshold} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Warning Limit', fill: '#F59E0B', fontSize: 10 }} />
              <ReferenceLine y={forecastData[0].criticalThreshold} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Critical Runaway', fill: '#EF4444', fontSize: 10 }} />
              <Line type="monotone" dataKey="actual" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4, fill: '#0284C7' }} name="Actual Sensor" />
              <Line type="monotone" dataKey="predicted" stroke="#F43F5E" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4, fill: '#F43F5E' }} name="AI Projection" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
