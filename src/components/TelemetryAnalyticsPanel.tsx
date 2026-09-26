import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Thermometer, 
  Waves, 
  Zap, 
  SunMedium
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const TelemetryAnalyticsPanel: React.FC = () => {
  const { selectedAsset, telemetryHistory } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'THERMAL_VIBRATION' | 'ELECTRICAL_POWER' | 'SOILING'>('THERMAL_VIBRATION');

  if (!selectedAsset) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500 font-mono">
        Select an asset to visualize operational telemetry.
      </div>
    );
  }

  // Format data for Recharts
  const chartData = telemetryHistory.map((log) => {
    const time = new Date(log.timestamp);
    return {
      ...log,
      displayTime: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
    };
  });

  const latest = telemetryHistory[telemetryHistory.length - 1] || {
    temperature: 65,
    vibration: 1.5,
    voltage: 690,
    current_amps: 1200,
    soiling_index: 0,
    power_output_mw: 2.2,
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              <span>LIVE TELEMETRY & TIME-SERIES ANOMALY ANALYSIS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-400 border border-blue-800">
                SCADA 1-Hz Synchronized
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Asset: <span className="text-white font-bold">{selectedAsset.name}</span> ({selectedAsset.id})
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('THERMAL_VIBRATION')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'THERMAL_VIBRATION'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal & Vibration</span>
          </button>

          <button
            onClick={() => setActiveTab('ELECTRICAL_POWER')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'ELECTRICAL_POWER'
                ? 'bg-sky-600 text-white font-medium shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Electrical & MW</span>
          </button>

          {selectedAsset.type === 'Solar' && (
            <button
              onClick={() => setActiveTab('SOILING')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'SOILING'
                  ? 'bg-amber-600 text-white font-medium shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5" />
              <span>Soiling Index</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Telemetry Metrics Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/80 font-mono text-xs">
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Bearing / Array Temp</span>
            <span className={`text-base font-bold ${
              latest.temperature >= 85 ? 'text-red-400 animate-pulse' :
              latest.temperature >= 75 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {latest.temperature.toFixed(1)} °C
            </span>
          </div>
          <Thermometer className={`w-5 h-5 ${latest.temperature >= 85 ? 'text-red-400' : 'text-slate-400'}`} />
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Vibration Velocity</span>
            <span className={`text-base font-bold ${
              latest.vibration >= 4.5 ? 'text-red-400 animate-pulse' :
              latest.vibration >= 3.5 ? 'text-amber-400' : 'text-sky-400'
            }`}>
              {latest.vibration.toFixed(2)} mm/s
            </span>
          </div>
          <Waves className={`w-5 h-5 ${latest.vibration >= 4.5 ? 'text-red-400' : 'text-slate-400'}`} />
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">Active Generation</span>
            <span className="text-base font-bold text-emerald-400">
              {latest.power_output_mw.toFixed(2)} MW
            </span>
          </div>
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[10px]">
              {selectedAsset.type === 'Solar' ? 'Soiling Index' : 'DC Bus Voltage'}
            </span>
            <span className={`text-base font-bold ${
              selectedAsset.type === 'Solar' && latest.soiling_index >= 30 ? 'text-amber-400 font-bold' : 'text-slate-200'
            }`}>
              {selectedAsset.type === 'Solar' ? `${latest.soiling_index.toFixed(1)}%` : `${latest.voltage.toFixed(0)} V`}
            </span>
          </div>
          {selectedAsset.type === 'Solar' ? (
            <SunMedium className="w-5 h-5 text-amber-400" />
          ) : (
            <Activity className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Chart Viewport */}
      <div className="p-4 h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'THERMAL_VIBRATION' ? (
            <LineChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis 
                dataKey="displayTime" 
                stroke="#64748b" 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              />
              {/* Left Axis: Temperature */}
              <YAxis 
                yAxisId="left" 
                stroke="#ef4444" 
                domain={[30, 110]}
                unit="°C"
                tick={{ fill: '#ef4444', fontSize: 11, fontFamily: 'monospace' }} 
              />
              {/* Right Axis: Vibration */}
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#38bdf8" 
                domain={[0, 6.0]}
                unit="mm/s"
                tick={{ fill: '#38bdf8', fontSize: 11, fontFamily: 'monospace' }} 
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.7)',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
              />
              
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '8px' }} />

              {/* Threshold Lines */}
              <ReferenceLine 
                yAxisId="left" 
                y={75} 
                stroke="#d97706" 
                strokeDasharray="4 4" 
                label={{ value: 'Warning @ 75°C', fill: '#d97706', fontSize: 10, position: 'insideTopLeft' }} 
              />
              <ReferenceLine 
                yAxisId="left" 
                y={85} 
                stroke="#dc2626" 
                strokeWidth={1.5}
                strokeDasharray="3 3" 
                label={{ value: 'CRITICAL @ 85°C', fill: '#dc2626', fontSize: 10, position: 'insideTopLeft' }} 
              />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#ef4444' }}
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vibration"
                name="Vibration (mm/s)"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 2, fill: '#38bdf8' }}
                activeDot={{ r: 5, fill: '#38bdf8' }}
              />
            </LineChart>
          ) : activeTab === 'ELECTRICAL_POWER' ? (
            <LineChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="displayTime" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis yAxisId="power" stroke="#10b981" unit="MW" domain={[0, 4]} tick={{ fill: '#10b981', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis yAxisId="current" orientation="right" stroke="#fbbf24" unit="A" tick={{ fill: '#fbbf24', fontSize: 11, fontFamily: 'monospace' }} />
              
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '8px' }} />

              <Line
                yAxisId="power"
                type="monotone"
                dataKey="power_output_mw"
                name="Power Output (MW)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
              <Line
                yAxisId="current"
                type="monotone"
                dataKey="current_amps"
                name="Phase Current (A)"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 15, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="displayTime" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#f59e0b" unit="%" domain={[0, 60]} tick={{ fill: '#f59e0b', fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} />
              
              <ReferenceLine y={30} stroke="#d97706" strokeDasharray="4 4" label={{ value: 'Cleaning Threshold @ 30%', fill: '#d97706', fontSize: 10 }} />
              <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Critical Soiling @ 40%', fill: '#dc2626', fontSize: 10 }} />

              <Line
                type="monotone"
                dataKey="soiling_index"
                name="Soiling Index (%)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f59e0b' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Threshold Reference Indicator Footer */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-0.5 bg-red-600 inline-block"></span>
            Critical: &gt;85°C or &gt;4.5 mm/s
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-0.5 bg-amber-500 inline-block"></span>
            Warning: &gt;75°C or &gt;3.5 mm/s
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-0.5 bg-emerald-500 inline-block"></span>
            Nominal: &lt;75°C
          </span>
        </div>
        <span className="text-slate-500">IEEE 10816-3 Mechanical Vibration Compliance</span>
      </div>
    </div>
  );
};
