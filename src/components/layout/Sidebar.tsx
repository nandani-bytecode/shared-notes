import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderLock, 
  Folder, 
  FolderPlus, 
  Star, 
  CheckCircle2, 
  Users, 
  Plus, 
  MessageSquare, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ChevronRight,
  Flame,
  Binary,
  Cpu,
  Network,
  Sigma,
  Terminal,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  onOpenCreateFolder: () => void;
  onOpenJoinCommunity: () => void;
  onOpenCreateCommunity: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onOpenCreateFolder,
  onOpenJoinCommunity,
  onOpenCreateCommunity 
}) => {
  const { 
    personalFolders, 
    userCommunities, 
    subjects, 
    personalReferences 
  } = useData();

  const location = useLocation();
  const navigate = useNavigate();

  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [communitiesExpanded, setCommunitiesExpanded] = useState(true);
  const [subjectsExpanded, setSubjectsExpanded] = useState(false);

  const starredCount = personalReferences.filter(r => r.starred).length;
  const completedCount = personalReferences.filter(r => r.completed).length;

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Binary': return Binary;
      case 'Cpu': return Cpu;
      case 'Network': return Network;
      case 'Sigma': return Sigma;
      case 'Flame': return Flame;
      default: return Folder;
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">

        {/* Workspace Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            <span>My Workspace</span>
            <button
              onClick={onOpenCreateFolder}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors"
              title="New Personal Folder"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            <Link
              to="/workspace"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/workspace'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-blue-600" />
                <span>All Resources</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {personalReferences.length}
              </span>
            </Link>

            {/* Folders Accordion */}
            <div className="pt-1">
              <button
                onClick={() => setFoldersExpanded(!foldersExpanded)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 rounded transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  {foldersExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span>Personal Folders</span>
                </div>
                <span className="text-[10px] text-slate-400">({personalFolders.length})</span>
              </button>

              {foldersExpanded && (
                <div className="ml-3 pl-2 border-l border-slate-200 mt-1 space-y-0.5">
                  {personalFolders.map(folder => {
                    const IconComponent = getFolderIcon(folder.icon);
                    const folderRefCount = personalReferences.filter(r => r.personalFolderId === folder.id).length;
                    const isSelected = location.pathname === `/workspace/folder/${folder.id}`;

                    return (
                      <Link
                        key={folder.id}
                        to={`/workspace/folder/${folder.id}`}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-blue-100/80 text-blue-800 font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconComponent 
                            className="w-3.5 h-3.5 shrink-0" 
                            style={{ color: folder.color || '#3b82f6' }} 
                          />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {folderRefCount}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/workspace?filter=starred"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.search.includes('filter=starred')
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                <span>Starred</span>
              </div>
              {starredCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                  {starredCount}
                </span>
              )}
            </Link>

            <Link
              to="/workspace?filter=completed"
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.search.includes('filter=completed')
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Completed</span>
              </div>
              {completedCount > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                  {completedCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Communities Section */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            <span>Communities</span>
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenJoinCommunity}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded"
                title="Join with code"
              >
                Join
              </button>
              <button
                onClick={onOpenCreateCommunity}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600 transition-colors"
                title="Create Community"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-0.5">
            {userCommunities.map(comm => {
              const isSelected = location.pathname === `/communities/${comm.id}`;
              return (
                <Link
                  key={comm.id}
                  to={`/communities/${comm.id}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{comm.avatar}</span>
                    <span className="truncate">{comm.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {comm.category.split(' ')[0]}
                  </span>
                </Link>
              );
            })}

            <Link
              to="/communities"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Explore all communities</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Access Subjects */}
        <div>
          <button
            onClick={() => setSubjectsExpanded(!subjectsExpanded)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 hover:text-slate-600"
          >
            <span>Subjects Quick Access</span>
            {subjectsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {subjectsExpanded && (
            <div className="space-y-0.5">
              {subjects.map(subj => (
                <Link
                  key={subj.id}
                  to={`/workspace?subject=${subj.id}`}
                  className="flex items-center justify-between px-2.5 py-1 rounded-lg text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <span className="truncate">{subj.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{subj.code}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Concept Architecture Card */}
      <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Zero-Duplicate Architecture</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Community files remain single & shared. Your custom tags, notes, and folders belong strictly to your personal layer.
        </p>
      </div>
    </aside>
  );
};
