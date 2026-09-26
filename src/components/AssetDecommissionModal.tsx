import React, { useState } from 'react';
import { useSimpleApp } from '../context/SimpleAppContext';
import { AlertOctagon, X, Trash2 } from 'lucide-react';

export const AssetDecommissionModal: React.FC = () => {
  const {
    isDecommissionModalOpen,
    setIsDecommissionModalOpen,
    decommissionTargetAsset,
    setDecommissionTargetAsset,
    decommissionAsset,
    theme,
  } = useSimpleApp();

  const [confirmInput, setConfirmInput] = useState('');
  const isDark = theme === 'dark';

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDecommissionModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDecommissionModalOpen]);

  if (!isDecommissionModalOpen || !decommissionTargetAsset) return null;

  const targetId = decommissionTargetAsset.id;
  const isMatched = confirmInput.trim().toUpperCase() === targetId.toUpperCase();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatched) return;

    decommissionAsset(targetId);
    setIsDecommissionModalOpen(false);
    setDecommissionTargetAsset(null);
    setConfirmInput('');
  };

  const handleClose = () => {
    setIsDecommissionModalOpen(false);
    setDecommissionTargetAsset(null);
    setConfirmInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl p-6 transition-all duration-300 ${
          isDark
            ? 'bg-[#18181B] border-rose-500/40 text-zinc-100'
            : 'bg-white border-rose-300 text-slate-900'
        }`}
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30">
              <AlertOctagon size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-500">Decommission Asset</h3>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Hardware ID: <strong className="text-white">{targetId}</strong> ({decommissionTargetAsset.name})
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning Content */}
        <div
          className={`p-3.5 rounded-xl mb-4 text-xs leading-relaxed border ${
            isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <p className="font-semibold mb-1">Warning: Irreversible Hardware Action</p>
          <p>
            Decommissioning will permanently purge <strong>{targetId}</strong> from live telemetry ingestion, cancel all pending work orders, and remove it from central SCADA dispatch.
          </p>
        </div>

        {/* Typed Confirmation Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Type <span className="font-mono font-bold text-rose-400 select-all">{targetId}</span> to confirm deletion:
            </label>
            <input
              type="text"
              autoFocus
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={`Type ${targetId} here`}
              className={`w-full px-3 py-2 text-xs rounded-lg border font-mono transition-colors ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 text-white focus:border-rose-500'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-rose-500'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatched}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isMatched
                  ? 'bg-rose-600 hover:bg-rose-500 text-white active:scale-95 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-50'
              }`}
            >
              <Trash2 size={13} />
              <span>Decommission Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
