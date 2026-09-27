import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Star, 
  FolderLock, 
  Check, 
  MessageSquare, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  Share2, 
  Edit3, 
  Trash2, 
  Send, 
  AlertCircle,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface ResourceViewerModalProps {
  resourceId: string | null;
  onClose: () => void;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({ resourceId, onClose }) => {
  const { 
    getResource, 
    getCommunity, 
    getSubject, 
    getPersonalReferenceForResource,
    addToWorkspace,
    removeFromWorkspace,
    toggleStar,
    updatePersonalNotes,
    getResourceComments,
    addComment,
    addReply,
    deleteComment
  } = useData();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'preview' | 'discussion' | 'notes'>('preview');
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<'newest' | 'oldest'>('newest');
  const [personalNotesText, setPersonalNotesText] = useState('');
  const [notesSaveStatus, setNotesSaveStatus] = useState<string>('');

  const resource = resourceId ? getResource(resourceId) : undefined;
  const community = resource ? getCommunity(resource.communityId) : undefined;
  const subject = resource ? getSubject(resource.subjectId) : undefined;
  const personalRef = resource ? getPersonalReferenceForResource(resource.id) : undefined;
  const comments = resource ? getResourceComments(resource.id) : [];

  // Sync personal notes when modal opens or reference changes
  useEffect(() => {
    if (personalRef) {
      setPersonalNotesText(personalRef.personalNotes || '');
    } else {
      setPersonalNotesText('');
    }
  }, [personalRef]);

  // Reset page when resource changes
  useEffect(() => {
    setCurrentPage(0);
    setZoomLevel(100);
  }, [resourceId]);

  if (!resource) return null;

  const totalPages = resource.pdfContent?.length || 1;
  const isInWorkspace = !!personalRef;
  const isStarred = !!personalRef?.starred;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setPersonalNotesText(val);
    if (personalRef) {
      updatePersonalNotes(personalRef.id, val);
      setNotesSaveStatus('Saved');
      setTimeout(() => setNotesSaveStatus(''), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(resource.id, commentInput);
    setCommentInput('');
  };

  const handleAddReply = (commentId: string) => {
    const text = replyInputMap[commentId];
    if (!text || !text.trim()) return;
    addReply(commentId, text);
    setReplyInputMap(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return commentSort === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in ${
      isFullscreen ? 'p-0' : ''
    }`}>
      <div 
        className={`w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all ${
          isFullscreen ? 'h-screen rounded-none border-none' : 'max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Viewer Navigation & Action Bar */}
        <header className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
              {resource.type === 'pdf' ? <FileText className="w-5 h-5" /> : 
               resource.type === 'video' ? <Video className="w-5 h-5" /> : 
               resource.type === 'image' ? <ImageIcon className="w-5 h-5" /> : 
               <LinkIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {personalRef?.personalName || resource.title}
                </h2>
                {personalRef?.personalName && personalRef.personalName !== resource.title && (
                  <span className="hidden sm:inline text-xs text-slate-400 italic">
                    (Original: {resource.title})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                {subject && (
                  <Badge variant={subject.color as any} size="sm">
                    {subject.name}
                  </Badge>
                )}
                {community && (
                  <span className="font-medium text-slate-700">
                    {community.avatar} {community.name}
                  </span>
                )}
                <span>•</span>
                <span>Uploaded by {resource.uploaderName}</span>
                <span>•</span>
                <span>{resource.size}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add / Remove from My Workspace */}
            {isInWorkspace ? (
              <button
                onClick={() => removeFromWorkspace(resource.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                title="Remove from My Workspace"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>In Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => addToWorkspace(resource.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all"
                title="Add to My Workspace"
              >
                <FolderLock className="w-3.5 h-3.5" />
                <span>Add to Workspace</span>
              </button>
            )}

            {/* Star Toggle */}
            <button
              onClick={() => toggleStar(resource.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isStarred 
                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                  : 'bg-white text-slate-400 hover:text-slate-600 border-slate-200'
              }`}
              title={isStarred ? "Starred" : "Star this resource"}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Download */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              download={resource.title}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              title="Download or view raw file"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="hidden sm:block p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content Area: Split View (Viewer & Side Panel) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-100">
          
          {/* Left/Center Pane: Document / Media Preview */}
          <div className="flex-1 flex flex-col min-w-0 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-100 relative">
            
            {/* Viewer Controls Toolbar (for PDF and reader) */}
            {resource.type === 'pdf' && (
              <div className="px-4 py-2 bg-white/90 backdrop-blur-xs border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-slate-800">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel(z => Math.max(70, z - 15))}
                    className="p-1 rounded hover:bg-slate-100"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(z => Math.min(160, z + 15))}
                    className="p-1 rounded hover:bg-slate-100"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-200 mx-1" />
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-600"
                    title={isDarkMode ? "Light Paper Mode" : "Dark Reader Mode"}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Document Render Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
              {resource.type === 'pdf' && (
                <div 
                  className={`w-full max-w-3xl transition-all shadow-xl rounded-xl p-8 sm:p-12 border ${
                    isDarkMode 
                      ? 'bg-slate-900 text-slate-200 border-slate-800' 
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {/* Realistic Academic PDF Header */}
                  <div className="border-b pb-4 mb-6 flex items-center justify-between border-slate-200/60 text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-blue-600">
                      StudySpace Academic Archive • {community?.name}
                    </span>
                    <span>Document Page {currentPage + 1}</span>
                  </div>

                  {/* PDF Markdown / Latex Content */}
                  <div className="prose max-w-none text-sm leading-relaxed space-y-4">
                    {resource.pdfContent && resource.pdfContent[currentPage] ? (
                      <div className="whitespace-pre-wrap font-sans">
                        {resource.pdfContent[currentPage]}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">Lecture Notes Preview</p>
                        <p className="text-xs mt-1">{resource.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Watermark / Page footer */}
                  <div className="mt-12 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{resource.title}</span>
                    <span>Verified Study Material</span>
                  </div>
                </div>
              )}

              {resource.type === 'video' && (
                <div className="w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                  {resource.previewUrl ? (
                    <iframe
                      src={resource.previewUrl}
                      title={resource.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-6 text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 text-red-500" />
                      <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                      <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Watch on YouTube</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {resource.type === 'image' && (
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-2">
                  <img
                    src={resource.url}
                    alt={resource.title}
                    className="w-full h-auto object-contain rounded-xl max-h-[70vh]"
                  />
                  <div className="p-4 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900">{resource.title}</p>
                    <p className="mt-1">{resource.description}</p>
                  </div>
                </div>
              )}

              {resource.type === 'link' && (
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.title}</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                  >
                    <span>Open External Resource Link</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Collapsible Panel: Discussion, Personal Notes, Details */}
          <div className="w-full md:w-80 lg:w-96 bg-white flex flex-col shrink-0">
            
            {/* Side Panel Tabs */}
            <div className="flex items-center border-b border-slate-200 px-3 pt-2 gap-1 bg-slate-50/80">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'discussion'
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussion ({comments.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>My Notes</span>
                {isInWorkspace && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'preview'
                    ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Details</span>
              </button>
            </div>

            {/* Tab 1: Discussion Thread */}
            {activeTab === 'discussion' && (
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Sorting header */}
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
                  <span>Questions & Answers</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCommentSort('newest')}
                      className={`px-1.5 py-0.5 rounded text-[11px] ${commentSort === 'newest' ? 'font-bold text-blue-600' : 'text-slate-400'}`}
                    >
                      Newest
                    </button>
                    <span>|</span>
                    <button
                      onClick={() => setCommentSort('oldest')}
                      className={`px-1.5 py-0.5 rounded text-[11px] ${commentSort === 'oldest' ? 'font-bold text-blue-600' : 'text-slate-400'}`}
                    >
                      Oldest
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-slate-100">
                  {sortedComments.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-medium">No questions asked yet</p>
                      <p className="text-[11px] mt-1">Be the first to start a study discussion on this resource!</p>
                    </div>
                  ) : (
                    sortedComments.map(c => {
                      const isAuthor = c.userId === user?.id;
                      return (
                        <div key={c.id} className="pt-3 first:pt-0 space-y-2">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={c.userAvatar}
                              alt={c.userName}
                              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {c.userName}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                                {c.content}
                              </p>

                              {/* Comment Actions */}
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                                <button
                                  onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                                  className="hover:text-blue-600 font-medium"
                                >
                                  Reply
                                </button>
                                {isAuthor && (
                                  <button
                                    onClick={() => deleteComment(c.id)}
                                    className="hover:text-red-600 text-slate-300"
                                    title="Delete my comment"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>

                              {/* Nested Replies */}
                              {c.replies && c.replies.length > 0 && (
                                <div className="mt-2.5 pl-3 border-l-2 border-slate-100 space-y-2">
                                  {c.replies.map(rep => (
                                    <div key={rep.id} className="flex items-start gap-2">
                                      <img
                                        src={rep.userAvatar}
                                        alt={rep.userName}
                                        className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-semibold text-slate-900 truncate">
                                            {rep.userName}
                                          </span>
                                          <span className="text-[9px] text-slate-400">
                                            {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                          {rep.content}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reply Input Box */}
                              {activeReplyId === c.id && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    value={replyInputMap[c.id] || ''}
                                    onChange={(e) => setReplyInputMap(prev => ({ ...prev, [c.id]: e.target.value }))}
                                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddReply(c.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddReply(c.id)}
                                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Comment Input Footer */}
                <form onSubmit={handleAddComment} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Ask a question or discuss this page..."
                    className="flex-1 text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Personal Notes Scratchpad */}
            {activeTab === 'notes' && (
              <div className="flex-1 flex flex-col p-4">
                {isInWorkspace ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Private Personal Scratchpad</span>
                      </div>
                      {notesSaveStatus && (
                        <span className="text-[10px] text-emerald-600 font-semibold animate-pulse">
                          {notesSaveStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">
                      These notes are private to your workspace. Community members cannot see them.
                    </p>

                    <textarea
                      value={personalNotesText}
                      onChange={handleNotesChange}
                      placeholder="Write your revision notes, formula reminders, exam hints, page bookmarks here..."
                      className="flex-1 w-full text-xs p-3 border border-slate-200 rounded-xl resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-sans"
                    />

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{personalNotesText.length} characters</span>
                      <span>Auto-saved to personal reference</span>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <FolderLock className="w-10 h-10 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Add to Workspace to Take Notes
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Personal notes are linked to your private workspace reference for this document.
                    </p>
                    <button
                      onClick={() => addToWorkspace(resource.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      + Add to My Workspace
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Resource Details */}
            {activeTab === 'preview' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">About this Resource</h4>
                  <p className="leading-relaxed text-slate-600">{resource.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Subject:</span>
                    <span className="font-medium text-slate-800">{subject?.name} ({subject?.code})</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Community:</span>
                    <span className="font-medium text-slate-800">{community?.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Uploader:</span>
                    <span className="font-medium text-slate-800">{resource.uploaderName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Date Shared:</span>
                    <span className="font-medium text-slate-800">{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">File Size:</span>
                    <span className="font-medium text-slate-800">{resource.size}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Total Views:</span>
                    <span className="font-medium text-slate-800">{resource.viewsCount || 1} views</span>
                  </div>
                </div>

                {/* Architectural Rule Info */}
                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                  <span className="font-semibold block mb-0.5">Reference Architecture:</span>
                  Unique Resource ID: <code className="bg-blue-100 px-1 py-0.2 rounded font-mono text-[10px]">{resource.id}</code>. 
                  Adding this to your personal drive creates a personal reference without file duplication.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
