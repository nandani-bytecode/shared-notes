import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Folder, 
  Flame, 
  Bookmark, 
  Binary, 
  Cpu, 
  Network, 
  Sigma, 
  MoreVertical, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { PersonalFolder } from '../../types';
import { useData } from '../../context/DataContext';

interface FolderCardProps {
  folder: PersonalFolder;
  count: number;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, count }) => {
  const { deletePersonalFolder, renamePersonalFolder } = useData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(folder.name);

  const getIcon = () => {
    switch (folder.icon) {
      case 'Flame': return Flame;
      case 'Bookmark': return Bookmark;
      case 'Binary': return Binary;
      case 'Cpu': return Cpu;
      case 'Network': return Network;
      case 'Sigma': return Sigma;
      default: return Folder;
    }
  };

  const IconComponent = getIcon();

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      renamePersonalFolder(folder.id, nameInput.trim());
      setIsRenaming(false);
    }
  };

  return (
    <div className="relative group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 transition-all duration-200 hover:shadow-md flex items-center justify-between">
      {isRenaming ? (
        <form onSubmit={handleRenameSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full text-xs font-semibold px-2 py-1 border border-blue-500 rounded focus:outline-hidden"
            autoFocus
            onBlur={() => setIsRenaming(false)}
          />
        </form>
      ) : (
        <Link
          to={`/workspace/folder/${folder.id}`}
          className="flex items-center gap-3 flex-1 min-w-0"
        >
          <div 
            className="p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105"
            style={{ backgroundColor: `${folder.color || '#3b82f6'}18` }}
          >
            <IconComponent 
              className="w-5 h-5" 
              style={{ color: folder.color || '#3b82f6' }} 
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
              {folder.name}
            </h4>
            <p className="text-[11px] text-slate-400">
              {count} {count === 1 ? 'item' : 'items'}
            </p>
          </div>
        </Link>
      )}

      {/* Options Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div 
            className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in text-xs"
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                setIsRenaming(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Rename</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                if (window.confirm(`Delete folder "${folder.name}"? Items inside will move to root.`)) {
                  deletePersonalFolder(folder.id);
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete Folder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
