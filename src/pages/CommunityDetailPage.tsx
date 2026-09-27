import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Megaphone, 
  UploadCloud, 
  Plus, 
  KeyRound, 
  Copy, 
  Check, 
  FolderLock, 
  FileText, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Pin,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { UploadResourceModal } from '../components/communities/UploadResourceModal';
import { CreateAnnouncementModal } from '../components/communities/CreateAnnouncementModal';

export const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    communities, 
    resources, 
    subjects, 
    members, 
    announcements, 
    comments, 
    personalReferences, 
    addToWorkspace, 
    removeFromWorkspace, 
    toggleStar,
    openResourceViewer 
  } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'discussions' | 'members' | 'announcements'>('resources');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);

  const community = communities.find(c => c.id === id);
  if (!community) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Community Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The community may have been removed or the link is incorrect.</p>
        <Link to="/communities" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-xs rounded-xl">
          Back to Communities
        </Link>
      </div>
    );
  }

  const communityResources = resources.filter(r => r.communityId === community.id);
  const communityMembers = members.filter(m => m.communityId === community.id);
  const communityAnnouncements = announcements.filter(a => a.communityId === community.id);
  const communitySubjects = subjects.filter(s => community.subjects.includes(s.id));

  // Get comments on resources in this community
  const communityResourceIds = new Set(communityResources.map(r => r.id));
  const communityComments = comments.filter(c => communityResourceIds.has(c.resourceId));

  const handleCopyCode = () => {
    navigator.clipboard.writeText(community.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredResources = communityResources.filter(res => {
    if (selectedSubjectFilter !== 'all' && res.subjectId !== selectedSubjectFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Communities', href: '/communities' },
          { label: community.name },
        ]}
      />

      {/* Community Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className={`h-28 sm:h-36 bg-gradient-to-r ${community.bannerGradient} p-6 flex items-end justify-between relative`}>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs font-bold text-white bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full">
              {community.category}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-10 sm:-mt-12">
          
          {/* Avatar and Name */}
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white p-2 shadow-lg border-2 border-white flex items-center justify-center text-4xl shrink-0">
              {community.avatar}
            </div>
            <div className="pt-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {community.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {community.membersCount} members • Code:{' '}
                <button
                  onClick={handleCopyCode}
                  className="font-mono text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  {community.code}
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setAnnouncementModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Announce</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Share Resource</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Prompt Section 5) */}
        <div className="px-6 sm:px-8 border-t border-slate-100 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'resources', label: `Resources (${communityResources.length})` },
            { id: 'discussions', label: `Discussions (${communityComments.length})` },
            { id: 'members', label: `Members (${communityMembers.length})` },
            { id: 'announcements', label: `Announcements (${communityAnnouncements.length})` },
          ].map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition-all shrink-0 ${
                  isSelected
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">About this Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{community.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Academic Subjects Covered:
                </span>
                <div className="flex flex-wrap gap-2">
                  {communitySubjects.map(s => (
                    <Badge key={s.id} variant={s.color as any} size="md">
                      {s.code} • {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Announcement */}
            {communityAnnouncements.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-2">
                  <Pin className="w-4 h-4 text-amber-600" />
                  <span>Important Class Notice</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {communityAnnouncements[0].title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {communityAnnouncements[0].content}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Posted by {communityAnnouncements[0].authorName}</span>
                  <span>{new Date(communityAnnouncements[0].createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Classroom Stats
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Shared Documents:</span>
                  <span className="font-semibold text-slate-800">{communityResources.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Members:</span>
                  <span className="font-semibold text-slate-800">{communityMembers.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Discussions:</span>
                  <span className="font-semibold text-slate-800">{communityComments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCES ORGANIZED BY SUBJECT (Prompt Section 5) */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          
          {/* Subject Filter Bar */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                onClick={() => setSelectedSubjectFilter('all')}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  selectedSubjectFilter === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Subjects ({communityResources.length})
              </button>
              {communitySubjects.map(s => {
                const count = communityResources.filter(r => r.subjectId === s.id).length;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubjectFilter(s.id)}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      selectedSubjectFilter === s.id
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s.name} ({count})
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload to this Class</span>
            </button>
          </div>

          {/* Resources List */}
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No resources for this subject yet</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Be the first to share notes or PYQs!</p>
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
                >
                  Upload Material
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map(res => {
                  const subj = subjects.find(s => s.id === res.subjectId);
                  const personalRef = personalReferences.find(r => r.resourceId === res.id);
                  const isInWorkspace = !!personalRef;
                  const resComments = comments.filter(c => c.resourceId === res.id);

                  return (
                    <div
                      key={res.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-4 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          {subj && (
                            <Badge variant={subj.color as any} size="sm">
                              {subj.name}
                            </Badge>
                          )}
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {res.type}
                          </span>
                        </div>

                        {/* Title - 1-Click opens in-app PDF Viewer! */}
                        <div 
                          onClick={() => openResourceViewer(res.id)}
                          className="cursor-pointer"
                        >
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {res.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                            {res.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openResourceViewer(res.id)}
                            className="flex items-center gap-1 hover:text-blue-600 text-[11px]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{resComments.length}</span>
                          </button>
                          <span>•</span>
                          <span className="text-[11px]">{res.size}</span>
                        </div>

                        {/* Add to Workspace / In Workspace Button */}
                        {isInWorkspace ? (
                          <button
                            onClick={() => removeFromWorkspace(res.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                            title="Click to remove from personal workspace"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>In Workspace</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => addToWorkspace(res.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add to Workspace</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DISCUSSIONS (Prompt Section 5 & 8) */}
      {activeTab === 'discussions' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Community Resource Q&A</h3>
              <p className="text-xs text-slate-500">Every comment links directly to its source study material</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {communityComments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No questions or discussions on this community's resources yet.
              </div>
            ) : (
              communityComments.map(c => {
                const res = resources.find(r => r.id === c.resourceId);
                return (
                  <div key={c.id} className="py-4 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <span className="text-xs font-bold text-slate-900">{c.userName}</span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {res && (
                        <button
                          onClick={() => openResourceViewer(res.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                        >
                          <span>Open Resource</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 pl-9">
                      "{c.content}"
                    </p>

                    {res && (
                      <div className="pl-9">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          📄 Resource: {res.title}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Community Members ({communityMembers.length})
            </h3>
            <span className="text-xs text-slate-400">Class Section Members</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {communityMembers.map(m => (
              <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.email}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  m.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {m.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Official Notices & Announcements</h3>
            <button
              onClick={() => setAnnouncementModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              + Post Announcement
            </button>
          </div>

          <div className="space-y-3">
            {communityAnnouncements.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                No announcements posted yet.
              </div>
            ) : (
              communityAnnouncements.map(ann => (
                <div key={ann.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{ann.title}</span>
                      {ann.pinned && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          PINNED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span>{ann.authorName} ({ann.authorRole})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadResourceModal
        communityId={community.id}
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      <CreateAnnouncementModal
        communityId={community.id}
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
      />

    </div>
  );
};
