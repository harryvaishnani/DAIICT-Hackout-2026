import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import {
  WT04_FAILURE_STAGES,
  SP02_FAILURE_STAGES,
} from '../data/simpleAssets';
import type { ProgressionStage } from '../data/simpleAssets';
import { DigitalTwinViewer } from './DigitalTwinViewer';
import {
  Zap,
  DollarSign,
  Wrench,
  ShieldCheck,
  Sliders,
  Cpu,
  AlertTriangle,
  Wind,
  Sun,
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  const {
    assets,
    selectedAsset,
    selectAsset,
    acceptOptimalMaintenancePlan,
    openIncidentCommand,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [subView, setSubView] = useState<'SIMULATOR' | 'TWIN'>('SIMULATOR');

  // Slider index for progression (0 = NOW, 1 = +6h/24h, 2 = +12h/48h, 3 = +18h/3d, 4 = +3.4d/7d)
  const [stageIndex, setStageIndex] = useState<number>(0);

  const isWind = selectedAsset.type === 'Wind';
  const stages: ProgressionStage[] = isWind ? WT04_FAILURE_STAGES : SP02_FAILURE_STAGES;
  const currentStage = stages[stageIndex] || stages[0];

  // Dynamic calculations based on slider
  const energyRisk = Math.round((selectedAsset.energyAtRiskMWh || 31.7) * (0.3 + (stageIndex / 4) * 0.7) * 10) / 10;
  const revenueRisk = Math.round((selectedAsset.revenueLossINR || 482000) * (0.3 + (stageIndex / 4) * 0.7));
  const repairCost = Math.round((selectedAsset.estimatedRepairINR || 135000) * (1 + stageIndex * 0.75));

  const handlePreventFailure = () => {
    acceptOptimalMaintenancePlan(selectedAsset.id);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Simulator Mode Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sliders size={18} />
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              What-If Failure Simulator &amp; Digital Twin
            </h2>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Slide the timeline to see what happens if repair is delayed vs. approving scheduled maintenance now.
          </p>
        </div>

        {/* View Switcher: Simulator vs Digital Twin */}
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-lg border flex gap-1 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setSubView('SIMULATOR')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                subView === 'SIMULATOR'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders size={13} />
              <span>Timeline Simulator</span>
            </button>

            <button
              onClick={() => setSubView('TWIN')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                subView === 'TWIN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu size={13} />
              <span>Component Diagram</span>
            </button>
          </div>

          {selectedAsset.risk === 'HIGH' && (
            <button
              onClick={() => openIncidentCommand(selectedAsset.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚠️ Incident Cockpit</span>
            </button>
          )}
        </div>
      </div>

      {subView === 'TWIN' ? (
        <DigitalTwinViewer />
      ) : (
        <>
          {/* Asset Selector Strip with Wind & Solar Modes */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 flex-wrap backdrop-blur-xl transition-all duration-300 ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
          }`}>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Type Mode Switcher */}
              <div className={`flex items-center p-1 rounded-lg border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => {
                    const firstWind = assets.find(a => a.type === 'Wind');
                    if (firstWind) {
                      selectAsset(firstWind.id);
                      setStageIndex(0);
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isWind
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wind size={13} />
                  <span>Wind Turbines</span>
                </button>

                <button
                  onClick={() => {
                    const firstSolar = assets.find(a => a.type === 'Solar');
                    if (firstSolar) {
                      selectAsset(firstSolar.id);
                      setStageIndex(0);
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    !isWind
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sun size={13} />
                  <span>Solar Farms</span>
                </button>
              </div>

              {/* Units for active mode */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {assets
                  .filter((a) => (isWind ? a.type === 'Wind' : a.type === 'Solar'))
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        selectAsset(a.id);
                        setStageIndex(0);
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold tabular-nums transition-all cursor-pointer ${
                        selectedAsset.id === a.id
                          ? isWind
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {a.id}
                      {(a.risk === 'HIGH' || a.risk === 'MODERATE') && ' ⚠️'}
                    </button>
                  ))}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Active: <strong className="text-slate-200">{selectedAsset.id} · {selectedAsset.name}</strong>
            </div>
          </div>

          {/* Interactive Failure Progression Slider Box */}
          <div className={`p-5 sm:p-6 rounded-2xl border space-y-4.5 transition-all duration-300 backdrop-blur-xl ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> FAILURE TIMELINE SIMULATION
                </span>
                <h3 className="text-base font-bold tracking-tight mt-0.5">
                  What happens if {selectedAsset.id} is left unserviced?
                </h3>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full font-bold tabular-nums transition-all ${
                stageIndex === 0
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  : stageIndex < 3
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 animate-pulse'
                  : 'bg-amber-500 text-slate-950 shadow-md font-black'
              }`}>
                Time Offset: {currentStage.timeOffset}
              </span>
            </div>

            {/* Stepper Timeline Slider with Dynamic Glowing Trail */}
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={stages.length - 1}
                value={stageIndex}
                onChange={(e) => setStageIndex(parseInt(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all accent-amber-500"
                style={{
                  background: `linear-gradient(to right, #10B981 0%, #F59E0B ${(stageIndex / (stages.length - 1)) * 100}%, #334155 ${(stageIndex / (stages.length - 1)) * 100}%, #334155 100%)`,
                }}
              />

              {/* Timeline Steps */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {stages.map((stg, idx) => {
                  const isActive = idx === stageIndex;
                  return (
                    <button
                      key={stg.timeOffset}
                      onClick={() => setStageIndex(idx)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : isDark
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold tabular-nums">
                        <span>{stg.timeOffset}</span>
                        <span>{stg.healthPct}%</span>
                      </div>
                      <p className="text-[10px] mt-1 truncate opacity-90">{stg.condition}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Condition Detail Card */}
            <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md ${
              isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase">
                    Projected Condition at {currentStage.timeOffset}:
                  </span>
                  <span className="text-xs tabular-nums px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Health: {currentStage.healthPct}%
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-100">{currentStage.condition}</p>
                <p className="text-xs text-slate-400">
                  Critical Impact: <span className="text-amber-400 font-bold">{currentStage.criticalEvent}</span>
                </p>
              </div>

              {/* Physical Readings at this stage */}
              <div className="flex items-center gap-4 text-xs tabular-nums shrink-0">
                {currentStage.tempC && (
                  <div>
                    <span className="text-slate-400 block">Temperature</span>
                    <span className={`font-bold text-sm ${currentStage.tempC > 95 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {currentStage.tempC.toFixed(1)}°C
                    </span>
                  </div>
                )}
                {currentStage.vibrationMmS && (
                  <div>
                    <span className="text-slate-400 block">Vibration</span>
                    <span className={`font-bold text-sm ${currentStage.vibrationMmS > 4.5 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {currentStage.vibrationMmS.toFixed(1)} mm/s
                    </span>
                  </div>
                )}
                {currentStage.soilingPct && (
                  <div>
                    <span className="text-slate-400 block">Soiling Index</span>
                    <span className="font-bold text-sm text-amber-400">
                      {currentStage.soilingPct.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial & Energy Exposure Summary Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Energy at Risk */}
              <div className={`p-4 rounded-xl border backdrop-blur-md ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="uppercase font-medium">Generation at Risk</span>
                  <Zap size={14} className="text-amber-400" />
                </div>
                <div className="text-xl font-bold tabular-nums tracking-tight text-amber-400">
                  {energyRisk} MWh
                </div>
              </div>

              {/* Revenue at Risk */}
              <div className={`p-4 rounded-xl border backdrop-blur-md ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="uppercase font-medium">Revenue at Risk</span>
                  <DollarSign size={14} className="text-amber-400" />
                </div>
                <div className="text-xl font-bold tabular-nums tracking-tight text-amber-400">
                  ₹{(revenueRisk / 100000).toFixed(2)}L
                </div>
              </div>

              {/* Estimated Repair Cost */}
              <div className={`p-4 rounded-xl border backdrop-blur-md ${isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/70 border-slate-200/80 shadow-2xs'}`}>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="uppercase font-medium">Escalated Repair Cost</span>
                  <Wrench size={14} className="text-slate-400" />
                </div>
                <div className="text-xl font-bold tabular-nums tracking-tight text-slate-200">
                  ₹{(repairCost / 100000).toFixed(2)}L
                </div>
              </div>
            </div>
          </div>

          {/* 3-Scenario Comparison Matrix */}
          <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 transition-all duration-300 backdrop-blur-xl ${
            isDark ? 'glass-panel-dark' : 'glass-panel-light shadow-lg shadow-slate-200/50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold tracking-tight">
                  Compare 3 Operational Pathways for {selectedAsset.id}
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Data-driven decision comparison based on power market dispatch schedules
                </p>
              </div>

              <button
                onClick={handlePreventFailure}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>Approve Recommended Repair (Today 14:00)</span>
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-2.5 px-3">Scenario</th>
                    <th className="py-2.5 px-3 text-right">Generation Loss</th>
                    <th className="py-2.5 px-3 text-right">Total Cost</th>
                    <th className="py-2.5 px-3 text-right">Downtime</th>
                    <th className="py-2.5 px-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {/* Scenario 1: Do Nothing */}
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-semibold text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Do Nothing (Run to Failure)</span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-amber-400 font-semibold">168.0 MWh</td>
                    <td className="py-3 px-3 text-right tabular-nums text-amber-400 font-bold">₹14,80,000</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-300">14 Days</td>
                    <td className="py-3 px-3 text-slate-400">Complete bearing seizure, shaft warping, emergency crane</td>
                  </tr>

                  {/* Scenario 2: Planned Repair (OPTIMAL) */}
                  <tr className={`border-l-4 border-l-emerald-500 ${
                    isDark ? 'bg-emerald-500/10' : 'bg-emerald-50/70'
                  }`}>
                    <td className="py-3 px-3 font-bold text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Planned Repair (Today 14:00 - 18:30)</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                        RECOMMENDED
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">12.4 MWh</td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">₹1,84,000 (Saves ₹12.96L)</td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-400 font-bold">4.5 Hours</td>
                    <td className="py-3 px-3 text-emerald-300 font-medium">Off-peak bearing replacement, zero secondary damage</td>
                  </tr>

                  {/* Scenario 3: Emergency Shutdown */}
                  <tr className={isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                    <td className="py-3 px-3 font-semibold text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-500" />
                      <span>Emergency Grid Trip / Shutdown</span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-300 font-semibold">42.0 MWh</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-300 font-bold">₹4,20,000</td>
                    <td className="py-3 px-3 text-right tabular-nums text-slate-300">3.5 Days</td>
                    <td className="py-3 px-3 text-slate-400">Curtailment loss during peak export until emergency crew arrives</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
