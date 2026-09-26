import React, { useState, useMemo } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import type { TwinComponent } from '../types';
import {
  getWindTurbineTwinComponents,
  getSolarArrayTwinComponents,
} from '../data/simpleAssets';
import {
  Activity,
  Thermometer,
  Zap,
  Droplets,
  AlertTriangle,
  Clock,
  Sparkles,
  Wind,
  Sun,
  Eye,
} from 'lucide-react';

export const DigitalTwinViewer: React.FC = () => {
  const {
    assets,
    selectedAsset,
    selectAsset,
    firmAssets,
    openIncidentCommand,
    launchFailureSimulation,
    theme,
  } = useSimpleApp();

  const isDark = theme === 'dark';
  const isWind = selectedAsset.type === 'Wind';

  // Model-specific aerodynamic, mechanical, and structural profiles (Every model is unique!)
  const turbineConfig = useMemo(() => {
    const id = selectedAsset.id;
    const model = selectedAsset.modelNumber || '';
    const isCritical = selectedAsset.risk === 'HIGH';

    if (id === 'WT-01' || model.includes('V150')) {
      return {
        modelName: 'Vestas V150-4.2 MW',
        bladeR: 142,
        tipColor: '#10B981', // Emerald aerodynamic efficiency tip
        towerType: 'tubular-sleek',
        nacelleType: 'streamlined',
        hasGearbox: true,
        rotorSpeed: '3.0s',
        rpmText: '18.4 RPM (High Aero Yield)',
        tag: '150m High-Aspect Carbon-Glass Rotor',
      };
    }

    if (id === 'WT-02' || model.includes('S144')) {
      return {
        modelName: 'Suzlon S144-3.15 MW',
        bladeR: 136,
        tipColor: '#F59E0B', // Amber dual safety stripes
        towerType: 'hybrid-lattice', // Coastal lattice lower tower
        nacelleType: 'standard',
        hasGearbox: true,
        rotorSpeed: '3.8s',
        rpmText: '15.6 RPM (Coastal Grid Sync)',
        tag: '144m Coastal Hybrid Lattice Base',
      };
    }

    if (id === 'WT-03' || model.includes('Inox')) {
      return {
        modelName: 'Inox Wind DF 3.3 MW',
        bladeR: 134,
        tipColor: '#38BDF8', // Cyan winglets
        towerType: 'tubular',
        nacelleType: 'standard',
        hasGearbox: true,
        rotorSpeed: '3.6s',
        rpmText: '16.2 RPM (DFIG Nominal)',
        tag: 'Winglet Tip Aerodynamics · DFIG System',
      };
    }

    if (id === 'WT-04' || isCritical) {
      return {
        modelName: 'Gamesa G114-2.0 MW (Vibration Alert)',
        bladeR: 118,
        tipColor: '#EF4444', // Danger red/amber tip
        towerType: 'tubular',
        nacelleType: 'compact',
        hasGearbox: true,
        rotorSpeed: '4.8s',
        rpmText: '11.4 RPM (Vibration Drag / Shudder)',
        tag: '114m Rotor · Inner-Ring Spalling Imbalance',
      };
    }

    if (id === 'WT-05' || model.includes('Enercon')) {
      return {
        modelName: 'Enercon E-126 EP4 (Direct Drive)',
        bladeR: 138,
        tipColor: '#10B981',
        towerType: 'concrete',
        nacelleType: 'direct-drive', // Teardrop / egg-shaped nacelle, annular generator, NO GEARBOX!
        hasGearbox: false,
        rotorSpeed: '4.2s',
        rpmText: '14.1 RPM (Gearless Direct Drive)',
        tag: 'Gearless Annular Synchronous Generator',
      };
    }

    // Default / WT-06 (Siemens SG 3.4-132)
    return {
      modelName: selectedAsset.modelNumber || 'Siemens SG 3.4-132',
      bladeR: 130,
      tipColor: '#F59E0B',
      towerType: 'tubular',
      nacelleType: 'serrated',
      hasGearbox: true,
      rotorSpeed: '3.5s',
      rpmText: '16.8 RPM (DinoTail Low Noise)',
      tag: 'DinoTail Serrated Trailing Edges',
    };
  }, [selectedAsset]);

  // Get components for current asset
  const baseComponents: TwinComponent[] = isWind
    ? getWindTurbineTwinComponents(selectedAsset)
    : getSolarArrayTwinComponents(selectedAsset);

  // Adapt for Direct Drive (Enercon has no gearbox)
  const components: TwinComponent[] = useMemo(() => {
    if (isWind && !turbineConfig.hasGearbox) {
      return baseComponents.map((c: TwinComponent) => {
        if (c.id === 'gearbox') {
          return {
            ...c,
            name: 'Annular Synchronous Stator',
            diagnosis: 'Gearless direct-drive stator rings nominal. High electromagnetic coupling.',
            specs: {
              'Architecture': 'Direct Drive Gearless',
              'Stator Diameter': '4.8 meters',
              'Poles': '84 Electromagnetic Poles',
            }
          };
        }
        return c;
      });
    }
    return baseComponents;
  }, [isWind, turbineConfig.hasGearbox, baseComponents]);

  // Default selected component: Main Bearing for wind, or PV strings for solar
  const [selectedCompId, setSelectedCompId] = useState<string>(
    isWind ? 'main-bearing' : 'pv-strings'
  );

  const activeComp = components.find((c) => c.id === selectedCompId) || components[0];

  const getStatusColor = (status: TwinComponent['status']) => {
    switch (status) {
      case 'CRITICAL':
      case 'WARNING':
        return {
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
        };
      default:
        return {
          badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Asset & Component Selector Bar */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
        isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'
          }`}>
            {isWind ? <Wind size={20} /> : <Sun size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">{selectedAsset.name}</h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedAsset.id}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Physics Component Schematic · Subsystem Telemetry Isolation
            </p>
          </div>
        </div>

        {/* Quick Type & Asset Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode Switcher Buttons */}
          <div className={`flex items-center p-1 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                const target = firmAssets.find(a => a.type === 'Wind') || assets.find(a => a.type === 'Wind');
                if (target) {
                  selectAsset(target.id);
                  setSelectedCompId('main-bearing');
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
                const target = firmAssets.find(a => a.type === 'Solar') || assets.find(a => a.type === 'Solar');
                if (target) {
                  selectAsset(target.id);
                  setSelectedCompId('pv-strings');
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

          {/* Unit pills for currently selected mode */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {firmAssets
              .filter((a) => (isWind ? a.type === 'Wind' : a.type === 'Solar'))
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    selectAsset(a.id);
                    setSelectedCompId(a.type === 'Wind' ? 'main-bearing' : 'pv-strings');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all cursor-pointer ${
                    selectedAsset.id === a.id
                      ? isWind
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-amber-500 text-slate-950 shadow-xs font-bold'
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
      </div>

      {/* Main Digital Twin Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Component Schematic (7 Cols) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
          isDark ? 'bg-[#0F121C] border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Holographic Scanline Transition Animation */}
          <div className="animate-scanline" />

          {/* Schematic Overlay Header */}
          <div className="flex items-center justify-between z-10 mb-2 flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Eye size={14} /> Interactive Spatial Schematic
              </span>
              {isWind && (
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span className="text-emerald-400 font-bold">{turbineConfig.modelName}</span> · {turbineConfig.tag}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 flex items-center gap-1.5 shadow-xs">
                <span className={`w-2 h-2 rounded-full ${selectedAsset.risk === 'HIGH' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span className={selectedAsset.risk === 'HIGH' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {isWind
                    ? turbineConfig.rpmText
                    : selectedAsset.risk === 'MODERATE'
                    ? '72% Irradiance Capture (Soiled)'
                    : '98.5% High Yield PV'}
                </span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                Click parts to inspect
              </span>
            </div>
          </div>

          {/* SVG Canvas for Turbine or Solar */}
          <div className="relative w-full h-80 sm:h-96 flex items-center justify-center my-auto">
            {isWind ? (
              <svg viewBox="0 0 400 360" className="w-full h-full max-h-96">
                <defs>
                  <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={isDark ? '#1E2438' : '#94A3B8'} />
                    <stop offset="50%" stopColor={isDark ? '#333D5C' : '#CBD5E1'} />
                    <stop offset="100%" stopColor={isDark ? '#1E2438' : '#94A3B8'} />
                  </linearGradient>

                  {/* High-Fidelity Airfoil Blade Gradient */}
                  <linearGradient id="bladeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={isDark ? '#1E293B' : '#E2E8F0'} />
                    <stop offset="40%" stopColor={isDark ? '#38BDF8' : '#0284C7'} />
                    <stop offset="100%" stopColor={isDark ? '#0F172A' : '#64748B'} />
                  </linearGradient>

                  {/* Annular Direct Drive Generator Gradient */}
                  <radialGradient id="annularGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#065F46" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#022C22" stopOpacity="1" />
                  </radialGradient>
                </defs>

                {/* Ground Line */}
                <line x1="20" y1="340" x2="380" y2="340" stroke={isDark ? '#262D42' : '#CBD5E1'} strokeWidth="2" strokeDasharray="4" />

                {/* Animated Aerodynamic Wind Flow Streaks */}
                <g className="opacity-40">
                  <line x1="10" y1="75" x2="390" y2="75" stroke="#10B981" strokeWidth="1.5" className="animate-wind-stream" />
                  <line x1="10" y1="165" x2="390" y2="165" stroke="#10B981" strokeWidth="2" className="animate-wind-stream" style={{ animationDelay: '0.6s' }} />
                  <line x1="10" y1="255" x2="390" y2="255" stroke="#10B981" strokeWidth="1.5" className="animate-wind-stream" style={{ animationDelay: '1.2s' }} />
                </g>

                {/* Model-Differentiated Towers */}
                {turbineConfig.towerType === 'hybrid-lattice' ? (
                  /* Suzlon S144 Coastal Hybrid Tower (Lattice Lower Base + Tubular Upper) */
                  <g
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => setSelectedCompId('tower-foundation')}
                  >
                    {/* Upper Tubular Steel */}
                    <path d="M 176,180 L 168,260 L 232,260 L 224,180 Z" fill="url(#towerGrad)" stroke={selectedCompId === 'tower-foundation' ? '#10B981' : (isDark ? '#3A4465' : '#64748B')} strokeWidth={selectedCompId === 'tower-foundation' ? '3' : '1.5'} />
                    {/* Lower Structural Lattice Truss Base */}
                    <path d="M 168,260 L 150,340 L 250,340 L 232,260 Z" fill={isDark ? '#141A29' : '#E2E8F0'} stroke={selectedCompId === 'tower-foundation' ? '#10B981' : '#475569'} strokeWidth="2" />
                    {/* Lattice Cross-Braces */}
                    <line x1="168" y1="260" x2="245" y2="300" stroke={isDark ? '#334155' : '#94A3B8'} strokeWidth="1.5" />
                    <line x1="232" y1="260" x2="155" y2="300" stroke={isDark ? '#334155' : '#94A3B8'} strokeWidth="1.5" />
                    <line x1="155" y1="300" x2="250" y2="340" stroke={isDark ? '#334155' : '#94A3B8'} strokeWidth="1.5" />
                    <line x1="245" y1="300" x2="150" y2="340" stroke={isDark ? '#334155' : '#94A3B8'} strokeWidth="1.5" />
                    <line x1="155" y1="300" x2="245" y2="300" stroke={isDark ? '#334155' : '#94A3B8'} strokeWidth="2" />
                  </g>
                ) : turbineConfig.towerType === 'concrete' ? (
                  /* Enercon E-126 Pre-Stressed Modular Concrete Tower */
                  <g
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => setSelectedCompId('tower-foundation')}
                  >
                    <path d="M 174,180 L 155,340 L 245,340 L 226,180 Z" fill="url(#towerGrad)" stroke={selectedCompId === 'tower-foundation' ? '#10B981' : (isDark ? '#3A4465' : '#64748B')} strokeWidth={selectedCompId === 'tower-foundation' ? '3' : '1.5'} />
                    {/* Modular Segment Rings */}
                    <line x1="170" y1="220" x2="230" y2="220" stroke={isDark ? '#475569' : '#64748B'} strokeWidth="2" />
                    <line x1="165" y1="260" x2="235" y2="260" stroke={isDark ? '#475569' : '#64748B'} strokeWidth="2" />
                    <line x1="160" y1="300" x2="240" y2="300" stroke={isDark ? '#475569' : '#64748B'} strokeWidth="2" />
                  </g>
                ) : (
                  /* Sleek Tapered Tubular Steel Tower */
                  <path
                    d="M 178,180 L 162,340 L 238,340 L 222,180 Z"
                    fill="url(#towerGrad)"
                    stroke={selectedCompId === 'tower-foundation' ? '#10B981' : (isDark ? '#3A4465' : '#64748B')}
                    strokeWidth={selectedCompId === 'tower-foundation' ? '3' : '1.5'}
                    className="cursor-pointer transition-all hover:opacity-90"
                    onClick={() => setSelectedCompId('tower-foundation')}
                  />
                )}

                {/* Tower Ground Cable Electric Flow */}
                <line x1="200" y1="185" x2="200" y2="340" stroke="#10B981" strokeWidth="2" className="animate-electric-flow" />

                {/* Model-Differentiated Nacelle Housing */}
                {turbineConfig.nacelleType === 'direct-drive' ? (
                  /* Enercon Direct-Drive Teardrop / Annular Egg Nacelle */
                  <g
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedCompId('nacelle-yaw')}
                  >
                    <path
                      d="M 130,165 C 130,135 170,135 255,142 C 275,145 285,155 285,165 C 285,175 275,185 255,188 C 170,195 130,195 130,165 Z"
                      fill={isDark ? '#182033' : '#E2E8F0'}
                      stroke={selectedCompId === 'nacelle-yaw' ? '#10B981' : (isDark ? '#3E496D' : '#94A3B8')}
                      strokeWidth={selectedCompId === 'nacelle-yaw' ? '3' : '2'}
                    />
                    {/* Direct-Drive Annular Generator Ring (Replaces Gearbox) */}
                    <ellipse
                      cx="165"
                      cy="165"
                      rx="24"
                      ry="24"
                      fill="url(#annularGrad)"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      className="cursor-pointer transition-transform hover:scale-105"
                      onClick={(e) => { e.stopPropagation(); setSelectedCompId('gearbox'); }}
                    />
                    <text x="165" y="169" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">DIRECT</text>
                  </g>
                ) : (
                  /* Standard / Geared Aerodynamic Nacelle */
                  <rect
                    x="135"
                    y="138"
                    width="145"
                    height="54"
                    rx="8"
                    fill={isDark ? '#1C2235' : '#E2E8F0'}
                    stroke={selectedCompId === 'nacelle-yaw' ? '#10B981' : (isDark ? '#3E496D' : '#94A3B8')}
                    strokeWidth={selectedCompId === 'nacelle-yaw' ? '3' : '1.5'}
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedCompId('nacelle-yaw')}
                  />
                )}

                {/* Siemens SG 3.4 Top Ultrasonic Anemometer & Met-Mast */}
                {turbineConfig.nacelleType === 'serrated' && (
                  <g className="cursor-pointer" onClick={() => setSelectedCompId('nacelle-yaw')}>
                    <line x1="240" y1="138" x2="240" y2="120" stroke="#64748B" strokeWidth="2" />
                    <line x1="230" y1="120" x2="250" y2="120" stroke="#64748B" strokeWidth="1.5" />
                    <circle cx="230" cy="120" r="3" fill="#10B981" />
                    <circle cx="250" cy="120" r="3" fill="#10B981" />
                  </g>
                )}

                {/* Mechanical Subsystems inside Nacelle */}
                {/* Main Drive Shaft */}
                <rect x="105" y="159" width="45" height="12" fill="#475569" />

                {/* Main Bearing Housing (clickable) */}
                <rect
                  x="130"
                  y="150"
                  width="30"
                  height="30"
                  rx="4"
                  fill={selectedAsset.risk === 'HIGH' ? '#F59E0B' : '#10B981'}
                  fillOpacity={isDark ? '0.85' : '0.9'}
                  stroke={selectedCompId === 'main-bearing' ? '#FFFFFF' : (selectedAsset.risk === 'HIGH' ? '#F59E0B' : '#10B981')}
                  strokeWidth="2.5"
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setSelectedCompId('main-bearing')}
                />

                {/* Gearbox Stage (Only on geared turbines) */}
                {turbineConfig.hasGearbox && (
                  <rect
                    x="170"
                    y="146"
                    width="44"
                    height="38"
                    rx="4"
                    fill={isDark ? '#28314A' : '#CBD5E1'}
                    stroke={selectedCompId === 'gearbox' ? '#10B981' : '#64748B'}
                    strokeWidth={selectedCompId === 'gearbox' ? '3' : '1.5'}
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedCompId('gearbox')}
                  />
                )}

                {/* Generator Stage */}
                <rect
                  x={turbineConfig.hasGearbox ? '225' : '205'}
                  y="150"
                  width={turbineConfig.hasGearbox ? '45' : '65'}
                  height="30"
                  rx="4"
                  fill={isDark ? '#192033' : '#94A3B8'}
                  stroke={selectedCompId === 'generator' ? '#10B981' : '#64748B'}
                  strokeWidth={selectedCompId === 'generator' ? '3' : '1.5'}
                  className="cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedCompId('generator')}
                />

                {/* Rotor Hub Nose Cone Base */}
                <path
                  d="M 115,142 L 80,165 L 115,188 Z"
                  fill={isDark ? '#232A40' : '#94A3B8'}
                  stroke={selectedCompId === 'hub-blades' ? '#10B981' : (isDark ? '#4B5780' : '#64748B')}
                  strokeWidth={selectedCompId === 'hub-blades' ? '3' : '1.5'}
                  className="cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedCompId('hub-blades')}
                />

                {/* 🌀 ROTOR BLADES - MATHEMATICALLY BALANCED 120° SYMMETRIC PROPELLER */}
                <g transform="translate(105, 165)">
                  <g
                    className={selectedAsset.risk === 'HIGH' ? 'animate-turbine-critical cursor-pointer' : 'animate-turbine-healthy cursor-pointer'}
                    style={{ '--rotor-speed': turbineConfig.rotorSpeed } as React.CSSProperties}
                    onClick={() => setSelectedCompId('hub-blades')}
                  >
                    {[0, 120, 240].map((deg) => (
                      <g key={deg} transform={`rotate(${deg})`}>
                        {/* Aerodynamic Airfoil Blade with realistic chord width */}
                        <path
                          d={`M -3.5,-12 C -8.5,-35 -14,-${turbineConfig.bladeR * 0.45} -2.5,-${turbineConfig.bladeR} C 0.5,-${turbineConfig.bladeR + 2} 3.5,-${turbineConfig.bladeR + 2} 3.5,-${turbineConfig.bladeR} C 11,-${turbineConfig.bladeR * 0.45} 8.5,-35 3.5,-12 Z`}
                          fill="url(#bladeGrad)"
                          stroke={isDark ? '#475569' : '#94A3B8'}
                          strokeWidth="0.8"
                        />
                        {/* Aerodynamic Leading Edge Ridge */}
                        <line x1="-1" y1="-20" x2="-1" y2={`-${turbineConfig.bladeR - 12}`} stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                        {/* Model-Specific Tip Marker */}
                        <path
                          d={`M -2.5,-${turbineConfig.bladeR - 16} C -2.5,-${turbineConfig.bladeR} 0.5,-${turbineConfig.bladeR} 0.5,-${turbineConfig.bladeR} C 2.5,-${turbineConfig.bladeR} 3.5,-${turbineConfig.bladeR} 3.5,-${turbineConfig.bladeR - 16} Z`}
                          fill={turbineConfig.tipColor}
                        />
                      </g>
                    ))}

                    {/* Streamlined Nose Cone / Hub Cap at Rotation Center (0, 0) */}
                    <circle cx="0" cy="0" r="10" fill={isDark ? '#1E293B' : '#64748B'} stroke={selectedCompId === 'hub-blades' ? '#10B981' : '#CBD5E1'} strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                  </g>
                </g>

                {/* 🟡 MULTI-RING ACOUSTIC SONAR SHOCKWAVES OVER FAILING BEARING (WT-04) */}
                {selectedAsset.risk === 'HIGH' && (
                  <g className="cursor-pointer" onClick={() => setSelectedCompId('main-bearing')}>
                    <circle cx="145" cy="165" r="14" fill="none" stroke="#F59E0B" className="animate-sonar-ring" />
                    <circle cx="145" cy="165" r="14" fill="none" stroke="#F59E0B" className="animate-sonar-ring-delayed" />
                    <circle cx="145" cy="165" r="12" fill="#F59E0B" />
                    <text x="145" y="169" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">!</text>
                  </g>
                )}
              </svg>
            ) : (
              /* Solar Array SVG Schematic with Dynamic Flow & Dust Drift */
              <svg viewBox="0 0 400 320" className="w-full h-full max-h-96">
                <defs>
                  <linearGradient id="sunBeamGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Animated Sunlight Beam Shimmer Sweep */}
                <polygon points="20,10 160,10 240,240 60,240" fill="url(#sunBeamGrad)" className="animate-sun-shimmer pointer-events-none" />

                {/* PV Strings Grid (clickable) */}
                <g
                  className="cursor-pointer hover:opacity-90"
                  onClick={() => setSelectedCompId('pv-strings')}
                >
                  <rect
                    x="30"
                    y="50"
                    width="230"
                    height="180"
                    rx="8"
                    fill={isDark ? '#142036' : '#E0E7FF'}
                    stroke={selectedCompId === 'pv-strings' ? '#10B981' : (selectedAsset.risk === 'MODERATE' ? '#F59E0B' : '#0284C7')}
                    strokeWidth="2.5"
                  />
                  {/* Grid Lines representing cells */}
                  <line x1="30" y1="95" x2="260" y2="95" stroke={isDark ? '#1E3A8A' : '#93C5FD'} strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="140" x2="260" y2="140" stroke={isDark ? '#1E3A8A' : '#93C5FD'} strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="185" x2="260" y2="185" stroke={isDark ? '#1E3A8A' : '#93C5FD'} strokeWidth="1" strokeDasharray="3" />
                  <line x1="106" y1="50" x2="106" y2="230" stroke={isDark ? '#1E3A8A' : '#93C5FD'} strokeWidth="1" strokeDasharray="3" />
                  <line x1="183" y1="50" x2="183" y2="230" stroke={isDark ? '#1E3A8A' : '#93C5FD'} strokeWidth="1" strokeDasharray="3" />
                  
                  {/* Patan Desert Dust Particulate Swarm Animation (if soiled) */}
                  {selectedAsset.risk === 'MODERATE' && (
                    <g className="pointer-events-none">
                      <rect x="30" y="50" width="230" height="180" rx="8" fill="#F59E0B" fillOpacity="0.25" />
                      <circle cx="70" cy="110" r="3" fill="#F59E0B" className="animate-dust-drift" />
                      <circle cx="140" cy="160" r="4" fill="#D97706" className="animate-dust-drift" style={{ animationDelay: '1s' }} />
                      <circle cx="200" cy="90" r="3.5" fill="#F59E0B" className="animate-dust-drift" style={{ animationDelay: '2s' }} />
                      <circle cx="120" cy="80" r="2.5" fill="#FDE68A" className="animate-dust-drift" style={{ animationDelay: '1.5s' }} />
                      {/* String 4 Hotspot Ping */}
                      <circle cx="210" cy="185" r="12" fill="none" stroke="#F59E0B" className="animate-ping opacity-75" />
                      <circle cx="210" cy="185" r="7" fill="#F59E0B" />
                    </g>
                  )}
                </g>

                {/* Animated Electric Current Lines: PV -> Combiner -> Inverter -> Transformer */}
                <path d="M 260,140 L 280,95" stroke="#10B981" strokeWidth="2.5" className="animate-electric-flow" />
                <path d="M 302,125 L 302,145" stroke="#10B981" strokeWidth="2.5" className="animate-electric-flow" />
                <path d="M 375,180 L 375,125" stroke="#10B981" strokeWidth="2.5" className="animate-electric-flow" />

                {/* Single-Axis Tracker Axis (clickable) */}
                <rect
                  x="140"
                  y="240"
                  width="10"
                  height="50"
                  fill="#64748B"
                  className="cursor-pointer"
                  onClick={() => setSelectedCompId('tracking-actuator')}
                />

                {/* DC Combiner Box (clickable) */}
                <rect
                  x="280"
                  y="70"
                  width="45"
                  height="55"
                  rx="4"
                  fill={isDark ? '#1E293B' : '#CBD5E1'}
                  stroke={selectedCompId === 'dc-combiner' ? '#10B981' : '#64748B'}
                  strokeWidth="2"
                  className="cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedCompId('dc-combiner')}
                />

                {/* Inverter Station (clickable) */}
                <rect
                  x="280"
                  y="145"
                  width="95"
                  height="75"
                  rx="6"
                  fill={isDark ? '#182236' : '#E2E8F0'}
                  stroke={selectedCompId === 'central-inverter' ? '#10B981' : '#0284C7'}
                  strokeWidth="2"
                  className="cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedCompId('central-inverter')}
                />

                {/* Transformer Station (clickable) */}
                <rect
                  x="335"
                  y="70"
                  width="40"
                  height="55"
                  rx="4"
                  fill={isDark ? '#0F172A' : '#94A3B8'}
                  stroke={selectedCompId === 'grid-transformer' ? '#10B981' : '#475569'}
                  strokeWidth="2"
                  className="cursor-pointer hover:brightness-110"
                  onClick={() => setSelectedCompId('grid-transformer')}
                />

                {/* Labels */}
                <text x="145" y="145" textAnchor="middle" fill={isDark ? '#94A3B8' : '#475569'} fontSize="11" fontWeight="bold">
                  {selectedAsset.name}
                </text>
                <text x="327" y="188" textAnchor="middle" fill={isDark ? '#38BDF8' : '#0284C7'} fontSize="10" fontWeight="bold">
                  2.5MW INVERTER
                </text>
              </svg>
            )}
          </div>

          {/* Component Tabs Quick Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-zinc-800/80 z-10">
            {components.map((comp) => {
              const isSelected = comp.id === selectedCompId;
              const statusTheme = getStatusColor(comp.status);
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusTheme.dot}`} />
                  <span>{comp.name.split(' ')[0]}</span>
                  {comp.status !== 'HEALTHY' && (
                    <span className="text-[10px] opacity-80">!</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Component Telemetry & AI Diagnostic Inspector (5 Cols) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
          isDark ? 'bg-[#141722] border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          {/* Active Component Title & Health Score */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                getStatusColor(activeComp.status).badge
              }`}>
                {activeComp.status} · {activeComp.subsystem}
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Confidence: {activeComp.confidence}%
              </span>
            </div>

            <h4 className="text-lg font-bold tracking-tight mt-1">{activeComp.name}</h4>

            {/* Health Score Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">Component Health Index</span>
                <span className={`font-mono font-bold text-sm ${
                  activeComp.healthScore < 40 ? 'text-rose-400' : activeComp.healthScore < 75 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activeComp.healthScore}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeComp.healthScore < 40 ? 'bg-rose-500' : activeComp.healthScore < 75 ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${activeComp.healthScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Telemetry Metric Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Thermometer size={14} className="text-rose-400" />
                <span>Operating Temp</span>
              </div>
              <p className="text-lg font-mono font-bold">{activeComp.temperature.toFixed(1)}°C</p>
              <span className="text-[10px] text-zinc-400 font-mono">Normal: &lt;70.0°C</span>
            </div>

            {activeComp.vibration !== undefined && (
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Activity size={14} className="text-sky-400" />
                  <span>Vibration Speed</span>
                </div>
                <p className="text-lg font-mono font-bold">{activeComp.vibration.toFixed(1)} mm/s</p>
                <span className="text-[10px] text-zinc-400 font-mono">Crit: &gt;4.5 mm/s</span>
              </div>
            )}

            {activeComp.current !== undefined && (
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Zap size={14} className="text-amber-400" />
                  <span>Current Draw</span>
                </div>
                <p className="text-lg font-mono font-bold">{activeComp.current} A</p>
                <span className="text-[10px] text-zinc-400 font-mono">Rated: 1240 A</span>
              </div>
            )}

            {activeComp.soiling !== undefined && (
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Droplets size={14} className="text-amber-400" />
                  <span>Surface Dust</span>
                </div>
                <p className="text-lg font-mono font-bold">{activeComp.soiling.toFixed(1)}%</p>
                <span className="text-[10px] text-zinc-400 font-mono">Crit: &gt;40.0%</span>
              </div>
            )}

            {/* Remaining Useful Life Card */}
            <div className={`col-span-2 p-3 rounded-xl border flex items-center justify-between ${
              activeComp.status === 'CRITICAL'
                ? (isDark ? 'bg-rose-950/20 border-rose-800/60 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800')
                : (isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200')
            }`}>
              <div className="flex items-center gap-2">
                <Clock size={16} className={activeComp.status === 'CRITICAL' ? 'text-rose-400' : 'text-sky-400'} />
                <div>
                  <p className="text-xs font-mono font-bold uppercase">Estimated Remaining Life</p>
                  <p className="text-sm font-black font-mono">
                    {activeComp.rulHours ? `${activeComp.rulHours} HOURS` : `${activeComp.rulDays} DAYS`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase block text-zinc-400">Failure Risk</span>
                <span className="text-xs font-mono font-bold text-rose-400">{activeComp.failureProbability}%</span>
              </div>
            </div>
          </div>

          {/* AI Diagnostic Explanation */}
          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-1.5 text-sky-400 text-xs font-mono font-bold">
              <Sparkles size={13} />
              <span>AI Component Diagnosis</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              {activeComp.diagnosis}
            </p>
            <p className={`text-[11px] leading-relaxed pt-1 border-t ${
              isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-500'
            }`}>
              <span className="font-semibold">Remediation:</span> {activeComp.recommendedAction}
            </p>
          </div>

          {/* Hardware Specifications Snapshot */}
          <div className="text-xs space-y-1 font-mono">
            <p className="text-[11px] font-bold text-zinc-400 uppercase">Component Specs</p>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {Object.entries(activeComp.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-zinc-800/40 py-0.5">
                  <span className="text-zinc-500">{key}:</span>
                  <span className="font-bold text-zinc-300">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Action Triggers */}
          <div className="flex items-center gap-2 pt-2">
            {activeComp.status === 'CRITICAL' && (
              <button
                onClick={() => openIncidentCommand(selectedAsset.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-md shadow-rose-950/40 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle size={13} />
                <span>⚡ Open Incident Command</span>
              </button>
            )}

            <button
              onClick={() => launchFailureSimulation(selectedAsset.id)}
              className="py-2 px-3 rounded-xl border text-xs font-mono font-bold transition-all bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 cursor-pointer"
            >
              🔮 What-If Simulate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
