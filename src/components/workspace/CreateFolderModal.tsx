import React, { useState } from 'react';
import { X, FolderPlus, Folder, Flame, Bookmark, Binary, Cpu, Network, Sigma } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose }) => {
  const { createPersonalFolder } = useData();
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedIcon, setSelectedIcon] = useState('Folder');

  if (!isOpen) return null;

  const colorPalette = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#64748b', // slate
  ];

  const iconOptions = [
    { name: 'Folder', Icon: Folder },
    { name: 'Flame', Icon: Flame },
    { name: 'Bookmark', Icon: Bookmark },
    { name: 'Binary', Icon: Binary },
    { name: 'Cpu', Icon: Cpu },
    { name: 'Network', Icon: Network },
    { name: 'Sigma', Icon: Sigma },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    createPersonalFolder(folderName.trim(), selectedColor, selectedIcon);
    setFolderName('');
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
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">New Personal Folder</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. DSA, Important, Midsem 2024"
              className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Folder Color
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Icon
            </label>
            <div className="flex items-center gap-2">
              {iconOptions.map(item => {
                const IconComponent = item.Icon;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedIcon(item.name)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600 border-blue-300' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            This folder is unique to your workspace. You can combine resources from multiple communities into it.
          </p>

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
              disabled={!folderName.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
