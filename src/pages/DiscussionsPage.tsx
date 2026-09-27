import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  ArrowRight, 
  FileText, 
  CornerDownRight, 
  Sparkles,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const DiscussionsPage: React.FC = () => {
  const { comments, resources, communities, subjects, openResourceViewer } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredComments = comments.filter(c => {
    const res = resources.find(r => r.id === c.resourceId);
    if (!res) return false;

    if (selectedCommunity !== 'all' && res.communityId !== selectedCommunity) return false;
    if (selectedSubject !== 'all' && res.subjectId !== selectedSubject) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComment = c.content.toLowerCase().includes(q);
      const matchAuthor = c.userName.toLowerCase().includes(q);
      const matchResource = res.title.toLowerCase().includes(q);
      const matchReplies = c.replies.some(r => r.content.toLowerCase().includes(q));
      return matchComment || matchAuthor || matchResource || matchReplies;
    }
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <span>Study Discussions & Q&A</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ask questions about tricky derivations, exam topics, or lecture slides. Every thread is attached directly to its study document.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, replies or topics..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Communities</option>
            {communities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No discussions found</h4>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          filteredComments.map(c => {
            const res = resources.find(r => r.id === c.resourceId);
            const comm = res ? communities.find(co => co.id === res.communityId) : undefined;
            const subj = res ? subjects.find(s => s.id === res.subjectId) : undefined;

            return (
              <div 
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 transition-all space-y-3"
              >
                {/* Associated Resource Bar */}
                {res && (
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                    <div 
                      onClick={() => openResourceViewer(res.id)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {res.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {subj && <Badge variant={subj.color as any} size="sm">{subj.code}</Badge>}
                      {comm && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {comm.name}
                        </span>
                      )}
                      <button
                        onClick={() => openResourceViewer(res.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-2"
                      >
                        <span>Open Document</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex items-start gap-3">
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{c.userName}</span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()} at{' '}
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {c.content}
                    </p>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-slate-100 space-y-2">
                        {c.replies.map(rep => (
                          <div key={rep.id} className="flex items-start gap-2">
                            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-1" />
                            <img src={rep.userAvatar} alt={rep.userName} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-slate-900">{rep.userName}</span>
                                <span className="text-[9px] text-slate-400">{new Date(rep.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{rep.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
