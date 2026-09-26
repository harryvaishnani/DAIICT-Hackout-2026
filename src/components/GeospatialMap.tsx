import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Wind, Sun, Eye, Navigation } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import type { Asset } from '../types';

// Helper component to center and animate map when selected asset changes
function MapFocusController({ asset }: { asset?: Asset }) {
  const map = useMap();
  useEffect(() => {
    if (asset) {
      map.flyTo([asset.latitude, asset.longitude], 8, {
        duration: 1.2,
      });
    }
  }, [asset, map]);
  return null;
}

// Function to generate custom HTML/SVG DivIcons for Leaflet
function createAssetMarkerIcon(asset: Asset, isSelected: boolean) {
  const isWind = asset.type === 'Wind';
  let bgColor = 'bg-emerald-500';
  let ringColor = 'ring-emerald-400/40';
  let pulseClass = '';
  let badgeIcon = '✓';

  if (asset.status === 'CRITICAL') {
    bgColor = 'bg-red-600';
    ringColor = 'ring-red-500/80';
    pulseClass = 'pin-critical ring-4';
    badgeIcon = '!';
  } else if (asset.status === 'WARNING') {
    bgColor = 'bg-amber-500';
    ringColor = 'ring-amber-400/70';
    pulseClass = 'pin-warning ring-2';
    badgeIcon = '▲';
  } else if (asset.status === 'MAINTENANCE_DISPATCHED') {
    bgColor = 'bg-blue-600';
    ringColor = 'ring-blue-400/60';
    badgeIcon = '⚙';
  }

  const selectedRing = isSelected ? 'border-2 border-white scale-125 shadow-2xl z-50' : 'border border-slate-900 shadow-md';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white ${bgColor} ${ringColor} ${pulseClass} ${selectedRing}">
        ${isWind 
          ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>` 
          : `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
        }
      </div>
      <div class="absolute -top-1.5 -right-1.5 bg-slate-950 text-[10px] font-mono px-1 rounded-full border border-slate-700 text-white font-bold">
        ${badgeIcon}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

export const GeospatialMap: React.FC = () => {
  const { assets, selectedAsset, selectAsset } = useTelemetry();

  // Center coordinate around Western Renewable Corridors
  const defaultCenter: [number, number] = [36.2, -117.5];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[480px]">
      {/* Map Header & Filter Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
            <span>GEOSPATIAL ASSET FLEET MAP</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {assets.length} Active Nodes
            </span>
          </h3>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Healthy</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-1.5 text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Dispatched</span>
          </div>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={defaultCenter}
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#090D16' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />

          <MapFocusController asset={selectedAsset} />

          {assets.map((asset) => {
            const isSelected = asset.id === selectedAsset?.id;
            const icon = createAssetMarkerIcon(asset, isSelected);

            return (
              <Marker
                key={asset.id}
                position={[asset.latitude, asset.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => {
                    selectAsset(asset.id);
                  },
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[210px] text-slate-900">
                    <div className="flex items-center justify-between border-b pb-1.5 mb-1.5">
                      <div className="flex items-center space-x-1 font-bold text-xs">
                        {asset.type === 'Wind' ? <Wind className="w-3.5 h-3.5 text-blue-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{asset.id}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        asset.status === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        asset.status === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                        asset.status === 'MAINTENANCE_DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {asset.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-1">{asset.name}</p>

                    <div className="grid grid-cols-2 gap-1 text-[11px] mb-2 font-mono">
                      <div>
                        <span className="text-slate-500">Health:</span>{' '}
                        <span className="font-bold">{asset.health_score}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Loss:</span>{' '}
                        <span className={asset.est_daily_loss > 0 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                          ${asset.est_daily_loss}/d
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-600 italic line-clamp-2 mb-2">
                      {asset.recommended_action}
                    </p>

                    <button
                      onClick={() => selectAsset(asset.id)}
                      className="w-full py-1 px-2 text-center text-xs font-medium text-white bg-slate-900 hover:bg-sky-600 rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Select & View Telemetry</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Selected asset floating badge */}
        {selectedAsset && (
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-lg p-2.5 text-xs font-mono shadow-2xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                selectedAsset.status === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                selectedAsset.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
              <span className="font-bold text-white">{selectedAsset.id}</span>
              <span className="text-slate-400">({selectedAsset.type})</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-sky-400">Lat: {selectedAsset.latitude.toFixed(2)}, Lon: {selectedAsset.longitude.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
