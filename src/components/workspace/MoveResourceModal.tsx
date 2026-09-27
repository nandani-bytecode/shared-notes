import React, { useState } from 'react';
import { X, FolderInput, Folder, Check, Info } from 'lucide-react';
import { PersonalReference, Resource } from '../../types';
import { useData } from '../../context/DataContext';

interface MoveResourceModalProps {
  reference: PersonalReference | null;
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MoveResourceModal: React.FC<MoveResourceModalProps> = ({
  reference,
  resource,
  isOpen,
  onClose,
}) => {
  const { personalFolders, movePersonalReference } = useData();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    reference?.personalFolderId || null
  );

  if (!isOpen || !reference || !resource) return null;

  const handleSave = () => {
    movePersonalReference(reference.id, selectedFolderId);
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
            <FolderInput className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Move Personal Reference</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-xs text-slate-600">
            Moving <span className="font-semibold text-slate-900">"{reference.personalName}"</span> to:
          </div>

          {/* Folder Options */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2">
            {/* Root workspace folder */}
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                selectedFolderId === null
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-slate-400" />
                <span>My Workspace Root (No folder)</span>
              </div>
              {selectedFolderId === null && <Check className="w-4 h-4 text-blue-600" />}
            </button>

            {/* Custom Folders */}
            {personalFolders.map(folder => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" style={{ color: folder.color || '#3b82f6' }} />
                  <span>📁 {folder.name}</span>
                </div>
                {selectedFolderId === folder.id && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>

          {/* Architectural Notice */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Moving this item re-files your personal reference. The community resource stays in its original subject inside the community for other students.
            </p>
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
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              Move Reference
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
