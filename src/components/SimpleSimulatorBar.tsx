import React from 'react';
import { Zap, Sun, RefreshCw } from 'lucide-react';
import { useSimpleApp } from '../context/SimpleAppContext';

export const SimpleSimulatorBar: React.FC = () => {
  const { triggerTurbineAnomaly, triggerSolarAnomaly, resetAllHealthy, notification } = useSimpleApp();

  return (
    <div className="bg-gray-800/60 border-b border-gray-700 px-4 py-3 sm:px-6">
      {/* Notification Toast */}
      {notification && (
        <div className="mb-3 flex items-center gap-2 bg-green-900/50 border border-green-600/60 text-green-300 text-sm px-3 py-2 rounded-lg">
          <span className="text-base">🎉</span>
          <span className="font-medium">{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Live Demo Controls
          </span>
          <span className="text-xs text-gray-600">·</span>
          <span className="text-xs text-gray-500">Click to simulate faults for judges</span>
        </div>

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <button
            onClick={triggerTurbineAnomaly}
            className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-150 shadow-lg shadow-red-900/30"
          >
            <Zap size={15} className="shrink-0" />
            Simulate Bearing Fault <span className="font-normal opacity-80">(WT-04)</span>
          </button>

          <button
            onClick={triggerSolarAnomaly}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-150 shadow-lg shadow-amber-900/30"
          >
            <Sun size={15} className="shrink-0" />
            Simulate Solar Soiling <span className="font-normal opacity-80">(SP-02)</span>
          </button>

          <button
            onClick={resetAllHealthy}
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 active:scale-95 text-gray-200 text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-150 border border-gray-600"
          >
            <RefreshCw size={15} className="shrink-0" />
            Reset All Healthy
          </button>
        </div>
      </div>
    </div>
  );
};
