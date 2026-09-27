import React, { useState } from 'react';
import { X, UserPlus, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({ isOpen, onClose }) => {
  const { joinCommunityWithCode } = useData();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Please enter a valid community invite code.');
      return;
    }

    const res = joinCommunityWithCode(code);
    if (res.success) {
      setSuccess(res.message);
      setTimeout(() => {
        onClose();
        if (res.community) {
          navigate(`/communities/${res.community.id}`);
        }
      }, 1200);
    } else {
      setError(res.message);
    }
  };

  const sampleCodes = [
    { code: 'CSEH-2024', name: 'CSE Section H' },
    { code: 'DSA-ELITE', name: 'Coding Club & DSA Group' },
    { code: 'PLACE-2025', name: 'Placement Preparation 2025' },
    { code: 'SEM3-CORE', name: 'Semester 3 Archives' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Join Class or Study Group</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Community Invite Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. CSEH-2024"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm uppercase tracking-wider font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Ask your Class Representative (CR) or community admin for the invite code.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Sample quick click codes */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Available Demo Codes:
            </span>
            <div className="space-y-1">
              {sampleCodes.map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCode(item.code)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-xs rounded-lg border border-slate-200 transition-colors text-left"
                >
                  <span className="text-slate-700 font-medium">{item.name}</span>
                  <span className="font-mono text-[10px] text-blue-600 font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              Join Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
