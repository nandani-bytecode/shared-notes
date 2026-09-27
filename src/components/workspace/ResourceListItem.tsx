import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Star, 
  MoreVertical, 
  Edit2, 
  FolderInput, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { PersonalReference, Resource, Community, Subject } from '../../types';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';

interface ResourceListItemProps {
  reference: PersonalReference;
  resource: Resource;
  community?: Community;
  subject?: Subject;
  onRename: () => void;
  onMove: () => void;
  onTags: () => void;
}

export const ResourceListItem: React.FC<ResourceListItemProps> = ({
  reference,
  resource,
  community,
  subject,
  onRename,
  onMove,
  onTags,
}) => {
  const { 
    openResourceViewer, 
    toggleStar, 
    toggleCompleted, 
    removeReferenceById,
    comments 
  } = useData();

  const [menuOpen, setMenuOpen] = useState(false);
  const resComments = comments.filter(c => c.resourceId === resource.id);
  const isCustomizedName = reference.personalName !== resource.title;

  const getTypeIcon = () => {
    switch (resource.type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'video': return <Video className="w-4 h-4 text-red-500" />;
      case 'link': return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className={`flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 transition-colors text-xs group ${
      reference.completed ? 'bg-emerald-50/20' : ''
    }`}>
      {/* Left: Star, Completed checkbox, Icon & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={() => toggleStar(reference.id)}
          className={`shrink-0 ${reference.starred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
          title="Star"
        >
          <Star className={`w-3.5 h-3.5 ${reference.starred ? 'fill-amber-500' : ''}`} />
        </button>

        <button
          onClick={() => toggleCompleted(reference.id)}
          className={`shrink-0 ${reference.completed ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-600'}`}
          title={reference.completed ? "Completed" : "Mark completed"}
        >
          <CheckCircle2 className={`w-4 h-4 ${reference.completed ? 'fill-emerald-500 text-white' : ''}`} />
        </button>

        <div 
          onClick={() => openResourceViewer(resource.id)}
          className="p-1.5 bg-slate-100 group-hover:bg-blue-50 rounded-lg shrink-0 cursor-pointer"
        >
          {getTypeIcon()}
        </div>

        <div 
          onClick={() => openResourceViewer(resource.id)}
          className="min-w-0 flex-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 group-hover:text-blue-600 truncate">
              {reference.personalName}
            </span>
            {isCustomizedName && (
              <span className="text-[10px] text-slate-400 font-normal italic truncate">
                (Orig: {resource.title})
              </span>
            )}
          </div>

          {reference.personalTags && reference.personalTags.length > 0 && (
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              {reference.personalTags.map((tag, i) => (
                <span key={i} className="text-[9px] bg-blue-50 text-blue-600 px-1 rounded font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Community Source Badge */}
      <div className="hidden sm:flex items-center gap-2 w-48 shrink-0 px-2">
        {community && (
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px] truncate flex items-center gap-1">
            <span>{community.avatar}</span>
            <span className="truncate">{community.name}</span>
          </span>
        )}
      </div>

      {/* Center 2: Subject Badge */}
      <div className="hidden md:flex items-center w-36 shrink-0 px-2">
        {subject && (
          <Badge variant={subject.color as any} size="sm">
            {subject.name}
          </Badge>
        )}
      </div>

      {/* Right: Comments, Size & Options */}
      <div className="flex items-center gap-3 shrink-0 ml-2">
        {resComments.length > 0 && (
          <span className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
            <MessageSquare className="w-3 h-3" />
            {resComments.length}
          </span>
        )}

        <span className="text-[11px] text-slate-400 w-16 text-right">
          {resource.size}
        </span>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div 
              className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in text-xs"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openResourceViewer(resource.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
              >
                <span>Open Preview</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onRename();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Personalize Name</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onMove();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
              >
                <FolderInput className="w-3.5 h-3.5" />
                <span>Move to Folder</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onTags();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Manage Tags</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  removeReferenceById(reference.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Remove Reference</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
