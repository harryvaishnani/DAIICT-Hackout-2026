import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { SimpleAsset } from '../data/simpleAssets';
import {
  AlertTriangle,
  Wind,
  Sun,
  Sliders,
  Wrench,
  CheckCircle,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

// Leaflet center animator
function MapFocusController({ asset }: { asset?: SimpleAsset }) {
  const map = useMap();
  useEffect(() => {
    if (asset?.coordinates) {
      map.flyTo([asset.coordinates.lat, asset.coordinates.lng], 8, {
        duration: 0.8,
      });
    }
  }, [asset, map]);
  return null;
}

// Marker icon generator for Leaflet (Strictly 2-3 colors: Green for normal, Amber for attention)
function createMarkerIcon(asset: SimpleAsset, isSelected: boolean, isDark: boolean) {
  const needsAttention = asset.risk === 'HIGH' || asset.risk === 'MODERATE';
  const isWind = asset.type === 'Wind';

  const color = needsAttention ? '#F59E0B' : '#10B981';
  const ring = isSelected ? 'border: 2px solid #FFFFFF; transform: scale(1.18); z-index: 50;' : 'border: 1px solid rgba(0,0,0,0.25);';
  const pulse = needsAttention ? 'box-shadow: 0 0 14px rgba(245, 158, 11, 0.85);' : 'box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);';
  const radarPing = needsAttention 
    ? `<div class="animate-marker-radar" style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: rgba(245, 158, 11, 0.55); pointer-events: none;"></div>`
    : '';

  // Badge adapts to theme
  const badgeBg = isDark ? '#0F172A' : '#ffffff';
  const badgeBorder = isDark ? '#334155' : '#CBD5E1';
  const badgeColor = isDark ? '#fff' : '#1e293b';

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
      ${radarPing}
      <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background-color: ${color}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 700; ${ring} ${pulse}">
        ${isWind ? '🌬' : '☀'}
      </div>
      <div style="position: absolute; top: -6px; right: -8px; background: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${badgeColor}; font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 4px; z-index: 10; font-variant-numeric: tabular-nums; backdrop-filter: blur(4px);">
        ${asset.id}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'vortex-custom-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
}

export const CommandCenterView: React.FC = () => {
  const {
    visibleAssets,
    selectedAsset,
    selectedAssetId,
    selectAsset,
    setActiveTab,
    acceptOptimalMaintenancePlan,
    openIncidentCommand,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const [mapStyle, setMapStyle] = useState<'VECTOR' | 'SATELLITE'>('VECTOR');
  const [filterType, setFilterType] = useState<'ALL' | 'ATTENTION' | 'WIND' | 'SOLAR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Ref to the div wrapping MapContainer so we can imperatively toggle filter classes.
  // MapContainer's className prop is only applied once on mount and never updated by react-leaflet.
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapWrapperRef.current;
    if (!el) return;
    el.classList.remove('dark-colorful-map', 'light-clean-map');
    if (mapStyle !== 'SATELLITE') {
      el.classList.add(isDark ? 'dark-colorful-map' : 'light-clean-map');
    }
  }, [isDark, mapStyle]);

  // Default Gujarat Center
  const defaultCenter: [number, number] = [22.8, 70.8];

  // Highest priority asset requiring attention
  const urgentAsset = useMemo(() => {
    return visibleAssets.find(a => a.risk === 'HIGH') || visibleAssets.find(a => a.risk === 'MODERATE') || null;
  }, [visibleAssets]);

  // Filtered assets list
  const filteredAssets = useMemo(() => {
    return visibleAssets.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.location.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'ATTENTION') return a.risk === 'HIGH' || a.risk === 'MODERATE';
      if (filterType === 'WIND') return a.type === 'Wind';
      if (filterType === 'SOLAR') return a.type === 'Solar';
      return true;
    });
  }, [visibleAssets, filterType, searchQuery]);

  const handleSimulateAsset = (assetId: string) => {
    selectAsset(assetId);
    setActiveTab('SIMULATE');
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* ⚠️ HIGH-PRIORITY URGENT ACTION CARD (Frosted Glass with Amber Glow Gradient) */}
      {urgentAsset && (
        <div
          className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 backdrop-blur-xl ${
            isDark
              ? 'bg-gradient-to-r from-amber-500/15 via-slate-900/80 to-emerald-500/10 border-amber-500/30 text-slate-100 shadow-xl shadow-black/20'
              : 'bg-gradient-to-r from-amber-500/10 via-white/85 to-emerald-500/10 border-amber-300/80 text-slate-900 shadow-lg shadow-amber-500/5'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 shrink-0 shadow-sm">
                <AlertTriangle size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xs uppercase tracking-wider">
                    ACTION NEEDED
                  </span>
                  <h2 className="text-sm sm:text-base font-bold tracking-tight truncate">
                    {urgentAsset.name} ({urgentAsset.id})
                  </h2>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    · {urgentAsset.location}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs flex-wrap">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                    High Bearing Vibration (4.8 mm/s)
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Est. Trip: <strong className="tabular-nums">~8.5h</strong>
                  </span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    Risk Exposure: <strong className="text-amber-400 tabular-nums">₹1.84L</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Focused Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => acceptOptimalMaintenancePlan(urgentAsset.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                title="1-click approve AI optimized repair window (Today 14:00 IST)"
              >
                <Wrench size={13} />
                <span>1-Click Approve (14:00)</span>
              </button>

              <button
                onClick={() => handleSimulateAsset(urgentAsset.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
              >
                <Sliders size={13} />
                <span>Simulate Impact</span>
              </button>

              <button
                onClick={() => openIncidentCommand(urgentAsset.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer backdrop-blur-md ${
                  isDark
                    ? 'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-300/80 bg-white/60 hover:bg-slate-100 text-slate-700'
                }`}
                title="Open full Incident Cockpit with live failure countdown and diagnosis"
              >
                <Sparkles size={13} className="text-amber-400" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-COLUMN MAIN CONTENT (Map on Left, Filterable Asset List on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: Leaflet Map (7 Cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl border p-4 sm:p-5 flex flex-col transition-all duration-300 backdrop-blur-xl ${
            isDark
              ? 'glass-panel-dark'
              : 'glass-panel-light shadow-lg shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
            <div>
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Gujarat Renewable Grid Map</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Telemetry
                </span>
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Green = Healthy · Amber = Needs Attention · Click pin to inspect
              </p>
            </div>

            {/* Map Controls: Vector / Satellite Switcher & Status Indicators */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {/* Vibrant Map / Satellite Switcher */}
              <div className={`flex items-center p-0.5 rounded-lg border backdrop-blur-md ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/90 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setMapStyle('VECTOR')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    mapStyle === 'VECTOR'
                      ? isDark
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-emerald-800 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Colorful vector map with vibrant ocean & terrain"
                >
                  <span>🗺️</span>
                  <span>Vibrant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapStyle('SATELLITE')}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    mapStyle === 'SATELLITE'
                      ? isDark
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-emerald-800 shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Photographic satellite imagery"
                >
                  <span>🛰️</span>
                  <span>Satellite</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs shadow-emerald-500/50" />
                  <span>Healthy</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400 text-[11px] font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-xs shadow-amber-500/50" />
                  <span>Attention</span>
                </span>
              </div>
            </div>
          </div>

          {/* Map Container — theme-aware filter via ref wrapper */}
          <div className={`w-full h-84 sm:h-96 rounded-xl overflow-hidden border relative z-10 shadow-inner transition-all duration-300 ${
            isDark ? 'border-slate-800/80 bg-slate-950' : 'border-sky-200/60 bg-sky-50/50'
          }`}>
            {/* This inner div receives the dark-colorful-map / light-clean-map class imperatively via mapWrapperRef */}
            <div ref={mapWrapperRef} className={`w-full h-full ${mapStyle !== 'SATELLITE' ? (isDark ? 'dark-colorful-map' : 'light-clean-map') : ''}`}>
              <MapContainer
                center={defaultCenter}
                zoom={7}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  key={`${isDark ? 'dark' : 'light'}-${mapStyle}`}
                  attribution={
                    mapStyle === 'SATELLITE'
                      ? '&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics'
                      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  }
                  url={
                    mapStyle === 'SATELLITE'
                      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  }
                />
                <MapFocusController asset={selectedAsset} />

                {visibleAssets.map((asset) => {
                  if (!asset.coordinates) return null;
                  const isSelected = asset.id === selectedAssetId;
                  const isNeedsAttention = asset.risk === 'HIGH' || asset.risk === 'MODERATE';

                  return (
                    <Marker
                      key={asset.id}
                      position={[asset.coordinates.lat, asset.coordinates.lng]}
                      icon={createMarkerIcon(asset, isSelected, isDark)}
                      eventHandlers={{
                        click: () => selectAsset(asset.id),
                      }}
                    >
                      <Popup className="vortex-popup">
                        <div className="p-1 text-xs">
                          <p className="font-bold">{asset.name} ({asset.id})</p>
                          <p className="text-slate-500 text-[11px]">{asset.location}</p>
                          <p className={`mt-1 font-semibold ${isNeedsAttention ? 'text-amber-500' : 'text-emerald-500'}`}>
                            Status: {isNeedsAttention ? 'Needs Attention' : 'Healthy'}
                          </p>
                          <button
                            onClick={() => handleSimulateAsset(asset.id)}
                            className="mt-2 w-full py-1 text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-md text-[11px] font-semibold cursor-pointer shadow-xs"
                          >
                            Open What-If Simulator
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* RIGHT: Asset Directory (5 Cols) */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-4 sm:p-5 flex flex-col transition-all duration-300 backdrop-blur-xl ${
            isDark
              ? 'glass-panel-dark'
              : 'glass-panel-light shadow-lg shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold tracking-tight">Fleet Directory ({filteredAssets.length})</h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Click to select
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mb-3.5">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border transition-all ${
                isDark
                  ? 'bg-slate-900/60 backdrop-blur-md border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40'
                  : 'bg-white/70 backdrop-blur-md border-slate-300/80 text-slate-900 placeholder-slate-400 focus:border-emerald-600/80 focus:ring-1 focus:ring-emerald-600/40'
              }`}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'ATTENTION', label: '⚠️ Attention' },
              { key: 'WIND', label: 'Wind' },
              { key: 'SOLAR', label: 'Solar' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterType(tab.key as any)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  filterType === tab.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-950/20'
                    : isDark
                    ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                    : 'bg-white/70 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Asset Cards List */}
          <div className="space-y-2 overflow-y-auto max-h-96 pr-1">
            {filteredAssets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              const isNeedsAttention = asset.risk === 'HIGH' || asset.risk === 'MODERATE';

              return (
                <div
                  key={asset.id}
                  onClick={() => selectAsset(asset.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 backdrop-blur-sm ${
                    isSelected
                      ? isDark
                        ? 'border-emerald-500/80 bg-gradient-to-r from-emerald-950/50 via-slate-900/70 to-slate-900/50 shadow-sm shadow-emerald-500/10'
                        : 'border-emerald-500 bg-gradient-to-r from-emerald-50/90 via-white/90 to-teal-50/70 shadow-sm shadow-emerald-500/10'
                      : isDark
                      ? 'border-slate-800/80 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white/60 hover:bg-white/90 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${
                        isNeedsAttention
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : isDark
                          ? 'bg-slate-800/60 border-slate-700/60 text-emerald-400'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      }`}
                    >
                      {asset.type === 'Wind' ? <Wind size={16} /> : <Sun size={16} />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold tabular-nums">{asset.id}</span>
                        <span className="text-xs font-medium truncate">{asset.name}</span>
                      </div>
                      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {asset.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isNeedsAttention ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Attention
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle size={11} />
                        <span>Healthy</span>
                      </span>
                    )}

                    <ChevronRight size={14} className="text-slate-500" />
                  </div>
                </div>
              );
            })}

            {filteredAssets.length === 0 && (
              <p className={`text-xs text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No assets found matching "{searchQuery}".
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
