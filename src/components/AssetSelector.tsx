import React, { useState, useMemo } from 'react';
import { Search, Wind, Sun, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import type { AssetType, AssetStatus } from '../types';

export const AssetSelector: React.FC = () => {
  const { assets, selectedAssetId, selectAsset } = useTelemetry();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | AssetType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AssetStatus>('ALL');

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = 
        asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'ALL' || asset.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchTerm, typeFilter, statusFilter]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[480px]">
      {/* Header & Search */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide">FLEET ASSET DIRECTORY</h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {filteredAssets.length} / {assets.length}
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/90 border border-slate-700/80 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-mono transition-colors"
          />
        </div>

        {/* Type & Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              typeFilter === 'ALL'
                ? 'bg-sky-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter('Wind')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors whitespace-nowrap ${
              typeFilter === 'Wind'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Wind</span>
          </button>
          <button
            onClick={() => setTypeFilter('Solar')}
            className={`px-2 py-1 rounded flex items-center gap-1 transition-colors whitespace-nowrap ${
              typeFilter === 'Solar'
                ? 'bg-amber-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Solar</span>
          </button>

          <span className="text-slate-600">|</span>

          <button
            onClick={() => setStatusFilter(statusFilter === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'CRITICAL'
                ? 'bg-red-600 text-white font-medium'
                : 'bg-slate-800 text-red-400 hover:bg-red-950'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === 'WARNING' ? 'ALL' : 'WARNING')}
            className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'WARNING'
                ? 'bg-amber-600 text-white font-medium'
                : 'bg-slate-800 text-amber-400 hover:bg-amber-950'
            }`}
          >
            Warning
          </button>
        </div>
      </div>

      {/* Asset List View */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-1">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No assets match current filter criteria.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isSelected = asset.id === selectedAssetId;
            const isCritical = asset.status === 'CRITICAL';
            const isWarning = asset.status === 'WARNING';

            return (
              <div
                key={asset.id}
                onClick={() => selectAsset(asset.id)}
                className={`p-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border border-sky-500/70 shadow-md'
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    asset.type === 'Wind' ? 'bg-blue-950 text-sky-400 border border-blue-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
                  }`}>
                    {asset.type === 'Wind' ? <Wind className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {asset.id}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        isCritical
                          ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                          : isWarning
                          ? 'bg-amber-950 text-amber-400 border border-amber-700'
                          : asset.status === 'MAINTENANCE_DISPATCHED'
                          ? 'bg-blue-950 text-blue-400 border border-blue-700'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
                      {asset.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-slate-200">
                      {asset.health_score}%
                    </div>
                    <div className="w-16 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          asset.health_score >= 85 ? 'bg-emerald-500' :
                          asset.health_score >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${asset.health_score}%` }}
                      ></div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600'
                  }`} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
