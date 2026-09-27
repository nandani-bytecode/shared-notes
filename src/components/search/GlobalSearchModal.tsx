import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  FolderLock, 
  Check, 
  MessageSquare, 
  Star, 
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Badge } from '../common/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    resources, 
    communities, 
    subjects, 
    comments, 
    personalReferences, 
    addToWorkspace, 
    openResourceViewer 
  } = useData();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [onlyInWorkspace, setOnlyInWorkspace] = useState(false);
  const [onlyStarred, setOnlyStarred] = useState(false);

  // Debounce search input by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();

    return resources.filter(res => {
      const comm = communities.find(c => c.id === res.communityId);
      const subj = subjects.find(s => s.id === res.subjectId);
      const personalRef = personalReferences.find(r => r.resourceId === res.id);
      const resComments = comments.filter(c => c.resourceId === res.id);

      // Filters
      if (selectedType !== 'all' && res.type !== selectedType) return false;
      if (selectedSubject !== 'all' && res.subjectId !== selectedSubject) return false;
      if (selectedCommunity !== 'all' && res.communityId !== selectedCommunity) return false;
      if (onlyInWorkspace && !personalRef) return false;
      if (onlyStarred && !personalRef?.starred) return false;

      // Search Query
      if (!q) return true;

      const titleMatch = res.title.toLowerCase().includes(q);
      const descMatch = res.description.toLowerCase().includes(q);
      const uploaderMatch = res.uploaderName.toLowerCase().includes(q);
      const commMatch = comm?.name.toLowerCase().includes(q);
      const subjMatch = subj?.name.toLowerCase().includes(q) || subj?.code.toLowerCase().includes(q);
      const personalNameMatch = personalRef?.personalName.toLowerCase().includes(q);
      const personalTagsMatch = personalRef?.personalTags.some(t => t.toLowerCase().includes(q));
      const personalNotesMatch = personalRef?.personalNotes.toLowerCase().includes(q);
      const commentsMatch = resComments.some(c => 
        c.content.toLowerCase().includes(q) || 
        c.replies.some(r => r.content.toLowerCase().includes(q))
      );

      return (
        titleMatch || 
        descMatch || 
        uploaderMatch || 
        commMatch || 
        subjMatch || 
        personalNameMatch || 
        personalTagsMatch || 
        personalNotesMatch || 
        commentsMatch
      );
    });
  }, [
    debouncedQuery, 
    resources, 
    communities, 
    subjects, 
    personalReferences, 
    comments, 
    selectedType, 
    selectedSubject, 
    selectedCommunity, 
    onlyInWorkspace, 
    onlyStarred
  ]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4 text-rose-500" />;
      case 'video': return <Video className="w-4 h-4 text-red-500" />;
      case 'link': return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'image': return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, personal tags, subjects, discussions..."
            className="flex-1 text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0">
            Filters:
          </span>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDFs</option>
            <option value="video">Videos</option>
            <option value="link">Links</option>
            <option value="image">Images</option>
          </select>

          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="all">All Communities</option>
            {communities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            onClick={() => setOnlyInWorkspace(!onlyInWorkspace)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium shrink-0 transition-colors ${
              onlyInWorkspace 
                ? 'bg-blue-100 text-blue-800 border-blue-300' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            In My Workspace
          </button>

          <button
            onClick={() => setOnlyStarred(!onlyStarred)}
            className={`px-2.5 py-1 rounded-md border text-xs font-medium shrink-0 transition-colors ${
              onlyStarred 
                ? 'bg-amber-100 text-amber-800 border-amber-300' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Starred
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No study resources found matching "{debouncedQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting keywords, subject, or community filters</p>
            </div>
          ) : (
            searchResults.map(res => {
              const comm = communities.find(c => c.id === res.communityId);
              const subj = subjects.find(s => s.id === res.subjectId);
              const personalRef = personalReferences.find(r => r.resourceId === res.id);
              const resComments = comments.filter(c => c.resourceId === res.id);
              const isInWorkspace = !!personalRef;

              return (
                <div 
                  key={res.id} 
                  className="p-3 hover:bg-slate-50/80 rounded-xl transition-colors flex items-start justify-between gap-3 group"
                >
                  <div 
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                    onClick={() => {
                      openResourceViewer(res.id);
                      onClose();
                    }}
                  >
                    <div className="p-2.5 bg-slate-100 rounded-lg shrink-0 mt-0.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {getTypeIcon(res.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {personalRef?.personalName || res.title}
                        </span>
                        {personalRef?.personalName && personalRef.personalName !== res.title && (
                          <span className="text-[10px] text-slate-400 font-normal italic">
                            (Orig: {res.title})
                          </span>
                        )}
                        {personalRef?.starred && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {res.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px] text-slate-500">
                        {subj && (
                          <Badge variant={subj.color as any} size="sm">
                            {subj.name}
                          </Badge>
                        )}
                        {comm && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {comm.avatar} {comm.name}
                          </span>
                        )}
                        <span>by {res.uploaderName}</span>
                        {resComments.length > 0 && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            {resComments.length}
                          </span>
                        )}
                      </div>

                      {/* Display Personal Tags if in workspace */}
                      {personalRef && personalRef.personalTags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">Personal tags:</span>
                          {personalRef.personalTags.map((tag, i) => (
                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-center">
                    {isInWorkspace ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <Check className="w-3.5 h-3.5" />
                        In Workspace
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWorkspace(res.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        <FolderLock className="w-3.5 h-3.5" />
                        Add to Workspace
                      </button>
                    )}

                    <button
                      onClick={() => {
                        openResourceViewer(res.id);
                        onClose();
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      title="Open Resource Viewer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{searchResults.length} study items found</span>
          <span>Tip: Add resources to workspace to personalize tags and notes</span>
        </div>
      </div>
    </div>
  );
};
