import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import { X, Wind, Sun, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import type { AssetType } from '../data/simpleAssets';

export const AssetAddModal: React.FC = () => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, createAsset, currentFirm, theme } = useSimpleApp();
  const isDark = theme === 'dark';

  const [type, setType] = useState<AssetType>('Wind');
  const [assetId, setAssetId] = useState('WT-07');
  const [name, setName] = useState('Wind Turbine Unit 7');
  const [location, setLocation] = useState('Tehachapi Wind Resource Area, CA');
  const [modelNumber, setModelNumber] = useState('Vestas V164-9.5 MW');
  const [firmwareVersion, setFirmwareVersion] = useState('v4.19.0-prod');
  const [lat, setLat] = useState('35.1385');
  const [lng, setLng] = useState('-118.4410');

  // Baseline threshold state
  const [vibWarn, setVibWarn] = useState(type === 'Wind' ? '3.5' : '1.0');
  const [vibCrit, setVibCrit] = useState(type === 'Wind' ? '4.5' : '1.5');
  const [tempWarn, setTempWarn] = useState(type === 'Wind' ? '80' : '65');
  const [tempCrit, setTempCrit] = useState(type === 'Wind' ? '90' : '75');
  const [currWarn, setCurrWarn] = useState(type === 'Wind' ? '800' : '600');
  const [currCrit, setCurrCrit] = useState(type === 'Wind' ? '700' : '500');
  const [soilingWarn, setSoilingWarn] = useState(type === 'Wind' ? '10' : '30');
  const [soilingCrit, setSoilingCrit] = useState(type === 'Wind' ? '15' : '40');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddAssetModalOpen) {
        setIsAddAssetModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddAssetModalOpen, setIsAddAssetModalOpen]);

  if (!isAddAssetModalOpen) return null;

  const handleTypeChange = (newType: AssetType) => {
    setType(newType);
    if (newType === 'Wind') {
      setAssetId('WT-07');
      setName('Wind Turbine Unit 7');
      setLocation('Tehachapi Wind Resource Area, CA');
      setModelNumber('Vestas V164-9.5 MW');
      setVibWarn('3.5');
      setVibCrit('4.5');
      setTempWarn('80');
      setTempCrit('90');
      setCurrWarn('800');
      setCurrCrit('700');
      setSoilingWarn('10');
      setSoilingCrit('15');
    } else {
      setAssetId('SP-07');
      setName('Solar Array Sector 7');
      setLocation('Mojave Desert Solar Field, CA');
      setModelNumber('First Solar Series 6+');
      setVibWarn('1.0');
      setVibCrit('1.5');
      setTempWarn('65');
      setTempCrit('75');
      setCurrWarn('600');
      setCurrCrit('500');
      setSoilingWarn('30');
      setSoilingCrit('40');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId.trim() || !name.trim()) return;

    createAsset({
      id: assetId.trim().toUpperCase(),
      name: name.trim(),
      type,
      location: location.trim(),
      modelNumber: modelNumber.trim(),
      firmwareVersion: firmwareVersion.trim(),
      coordinates: {
        lat: parseFloat(lat) || 35.0,
        lng: parseFloat(lng) || -118.0,
      },
      risk: 'NORMAL',
      sensors: type === 'Wind' ? {
        vibration: 1.2,
        temperature: 58.0,
        current: 1220,
        soiling: 0,
      } : {
        vibration: 0.1,
        temperature: 44.0,
        current: 820,
        soiling: 5.0,
      },
      thresholds: {
        vibration: { normal: parseFloat(vibWarn) * 0.7, warning: parseFloat(vibWarn), critical: parseFloat(vibCrit) },
        temperature: { normal: parseFloat(tempWarn) * 0.8, warning: parseFloat(tempWarn), critical: parseFloat(tempCrit) },
        current: { normal: parseFloat(currWarn) * 1.1, warning: parseFloat(currWarn), critical: parseFloat(currCrit) },
        soiling: { normal: parseFloat(soilingWarn) * 0.5, warning: parseFloat(soilingWarn), critical: parseFloat(soilingCrit) },
      },
      energyLossMWh: 0,
      revenueLossUSD: 0,
      diagnosis: 'Hardware initialized and communicating with edge SCADA bridge.',
      recommendedAction: 'Standard routine monitoring schedule active.',
      requiredTools: ['Multimeter', 'Torque Wrench'],
      estimatedRepairHours: 1,
      history: [],
    });

    setIsAddAssetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-[#18181B] border-zinc-700/80 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-sky-500/15 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              <Cpu size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Register New Hardware Asset</h2>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Add to organization: <strong>{currentFirm.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asset Type Selector */}
          <div>
            <label className="block text-xs font-semibold mb-2">Hardware Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('Wind')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
                  type === 'Wind'
                    ? isDark
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300 font-bold shadow-xs'
                      : 'bg-sky-50 border-sky-500 text-sky-700 font-bold shadow-xs'
                    : isDark
                    ? 'border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wind size={16} className={type === 'Wind' ? 'text-sky-500' : ''} />
                <span>Wind Turbine Unit</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('Solar')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
                  type === 'Solar'
                    ? isDark
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-xs'
                      : 'bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-xs'
                    : isDark
                    ? 'border-zinc-700/60 text-zinc-400 hover:bg-zinc-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sun size={16} className={type === 'Solar' ? 'text-amber-500' : ''} />
                <span>Solar Array Sector</span>
              </button>
            </div>
          </div>

          {/* Primary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Asset Identifier (SCADA Tag)</label>
              <input
                type="text"
                required
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="e.g. WT-07"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 focus:border-sky-500 text-white'
                    : 'bg-white border-slate-300 focus:border-sky-500 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wind Turbine Unit 7"
                className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 focus:border-sky-500 text-white'
                    : 'bg-white border-slate-300 focus:border-sky-500 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Hardware Model Number</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. Vestas V164-9.5 MW"
                className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 focus:border-sky-500 text-white'
                    : 'bg-white border-slate-300 focus:border-sky-500 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Edge Firmware Version</label>
              <input
                type="text"
                value={firmwareVersion}
                onChange={(e) => setFirmwareVersion(e.target.value)}
                placeholder="e.g. v4.19.0-prod"
                className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-700 focus:border-sky-500 text-white'
                    : 'bg-white border-slate-300 focus:border-sky-500 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Location & GPS Coordinates */}
          <div>
            <label className="block text-xs font-semibold mb-1">Facility / Geographic Site</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tehachapi Wind Resource Area, CA"
              className={`w-full px-3 py-2 text-xs rounded-lg border transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 focus:border-sky-500 text-white'
                  : 'bg-white border-slate-300 focus:border-sky-500 text-slate-900'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Latitude (°N)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="35.1385"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Longitude (°W)</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="-118.4410"
                className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors ${
                  isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Baseline Operating Thresholds Section */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-wider">AI Anomaly Trigger Thresholds</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Vibration Warn / Crit (mm/s)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={vibWarn}
                    onChange={(e) => setVibWarn(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs bg-transparent"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    step="0.1"
                    value={vibCrit}
                    onChange={(e) => setVibCrit(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs text-rose-500 font-bold bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Temp Warn / Crit (°C)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={tempWarn}
                    onChange={(e) => setTempWarn(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs bg-transparent"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={tempCrit}
                    onChange={(e) => setTempCrit(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs text-rose-500 font-bold bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Current Warn / Crit (A)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={currWarn}
                    onChange={(e) => setCurrWarn(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs bg-transparent"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={currCrit}
                    onChange={(e) => setCurrCrit(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs text-rose-500 font-bold bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Soiling Warn / Crit (%)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={soilingWarn}
                    onChange={(e) => setSoilingWarn(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs bg-transparent"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={soilingCrit}
                    onChange={(e) => setSoilingCrit(e.target.value)}
                    className="w-1/2 p-1.5 rounded border text-center font-mono text-xs text-rose-500 font-bold bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddAssetModalOpen(false)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>Register Hardware</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
