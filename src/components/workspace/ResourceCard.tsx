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
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PersonalReference, Resource, Community, Subject } from '../../types';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';

interface ResourceCardProps {
  reference: PersonalReference;
  resource: Resource;
  community?: Community;
  subject?: Subject;
  onRename: () => void;
  onMove: () => void;
  onTags: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
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
      case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-blue-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
        reference.completed 
          ? 'border-emerald-200 bg-emerald-50/20' 
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Top Header & Badges */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* File Icon & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <div 
              onClick={() => openResourceViewer(resource.id)}
              className="p-2 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl cursor-pointer transition-colors"
            >
              {getTypeIcon()}
            </div>
            {community && (
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span>{community.avatar}</span>
                <span className="truncate max-w-[120px]">{community.name}</span>
              </span>
            )}
            {subject && (
              <Badge variant={subject.color as any} size="sm">
                {subject.code}
              </Badge>
            )}
          </div>

          {/* Quick Actions (Star & Menu) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleStar(reference.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${
                reference.starred ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
              }`}
              title={reference.starred ? "Unstar" : "Star"}
            >
              <Star className={`w-4 h-4 ${reference.starred ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div 
                  className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-fade-in text-xs"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      openResourceViewer(resource.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open in Study Viewer</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRename();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Personalize Display Name</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onMove();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <FolderInput className="w-3.5 h-3.5 text-slate-500" />
                    <span>Move to Personal Folder</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onTags();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>Manage Personal Tags</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      removeReferenceById(reference.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-left font-medium"
                    title="Removes only your personal reference. Community resource stays intact."
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Remove from Workspace</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resource Personal Title */}
        <div 
          onClick={() => openResourceViewer(resource.id)}
          className="mt-3 cursor-pointer"
        >
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {reference.personalName}
          </h3>

          {/* If student renamed it, show subtle subtitle of original title */}
          {isCustomizedName && (
            <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
              Original: {resource.title}
            </p>
          )}

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Personal Notes Snippet if added */}
        {reference.personalNotes && (
          <div 
            onClick={() => openResourceViewer(resource.id)}
            className="mt-2.5 p-2 bg-amber-50/60 rounded-lg border border-amber-100 text-[11px] text-amber-900 cursor-pointer"
          >
            <span className="font-semibold block text-[10px] text-amber-700 uppercase tracking-wider mb-0.5">
              My Private Note:
            </span>
            <p className="line-clamp-2 italic">{reference.personalNotes}</p>
          </div>
        )}

        {/* Personal Tags */}
        {reference.personalTags && reference.personalTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {reference.personalTags.map((tag, i) => (
              <span key={i} className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Details & Completed Toggle */}
      <div className="p-3 px-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleCompleted(reference.id)}
            className={`flex items-center gap-1.5 transition-colors ${
              reference.completed ? 'text-emerald-700 font-semibold' : 'text-slate-400 hover:text-slate-700'
            }`}
            title={reference.completed ? "Mark as in-progress" : "Mark as completed"}
          >
            <CheckCircle2 className={`w-4 h-4 ${reference.completed ? 'fill-emerald-500 text-white' : ''}`} />
            <span className="text-[11px]">{reference.completed ? 'Studied' : 'To Study'}</span>
          </button>

          {resComments.length > 0 && (
            <button
              onClick={() => openResourceViewer(resource.id)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{resComments.length}</span>
            </button>
          )}
        </div>

        <span className="text-[10px] text-slate-400">
          {resource.size}
        </span>
      </div>
    </div>
  );
};
