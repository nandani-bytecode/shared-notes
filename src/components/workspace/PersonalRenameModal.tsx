import React, { useState, useEffect } from 'react';
import { X, Edit2, AlertCircle, Sparkles } from 'lucide-react';
import { PersonalReference, Resource } from '../../types';
import { useData } from '../../context/DataContext';

interface PersonalRenameModalProps {
  reference: PersonalReference | null;
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalRenameModal: React.FC<PersonalRenameModalProps> = ({
  reference,
  resource,
  isOpen,
  onClose,
}) => {
  const { renamePersonalReference } = useData();
  const [personalName, setPersonalName] = useState('');

  useEffect(() => {
    if (reference) {
      setPersonalName(reference.personalName);
    }
  }, [reference]);

  if (!isOpen || !reference || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalName.trim()) return;
    renamePersonalReference(reference.id, personalName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Personalize Display Name</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Name in My Workspace
            </label>
            <input
              type="text"
              value={personalName}
              onChange={(e) => setPersonalName(e.target.value)}
              placeholder="e.g. 🔥 MUST DO — Linked Lists"
              className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              autoFocus
            />
          </div>

          {/* Educational Callout explaining the architectural distinction */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Original Community Title Remains Unchanged:</span>
              <p className="text-[11px] text-amber-800">
                Original title: <span className="font-medium text-slate-900">"{resource.title}"</span>. 
                Other community members will still see the original title. Only your private personal workspace will display this personalized title.
              </p>
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
              disabled={!personalName.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              Save Personal Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
