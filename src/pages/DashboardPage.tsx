import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderLock, 
  Users, 
  Clock, 
  Sparkles, 
  FileText, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  UploadCloud, 
  UserPlus, 
  BookOpen, 
  Flame,
  Binary,
  Cpu,
  Network,
  Sigma,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    personalReferences, 
    resources, 
    userCommunities, 
    subjects, 
    comments, 
    openResourceViewer, 
    addToWorkspace 
  } = useData();

  // 1. Continue Studying: Recently accessed personal references
  const continueStudyingList = [...personalReferences]
    .sort((a, b) => new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime())
    .slice(0, 4)
    .map(ref => {
      const res = resources.find(r => r.id === ref.resourceId);
      return { ref, res };
    })
    .filter(item => item.res !== undefined);

  // 2. Recently Added Community Resources
  const recentlyAddedResources = [...resources]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // 3. Recent Discussions
  const recentDiscussions = [...comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const completedCount = personalReferences.filter(r => r.completed).length;
  const starredCount = personalReferences.filter(r => r.starred).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Welcome back, {user?.name.split(' ')[0]}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to prepare for midsems?
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            You have <strong className="text-white">{personalReferences.length} study items</strong> in your personal workspace from <strong className="text-white">{userCommunities.length} communities</strong>. Community files stay single and shared; your notes and folders are private.
          </p>

          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Link
              to="/workspace"
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FolderLock className="w-4 h-4" />
              <span>Go to My Workspace</span>
            </Link>
            <Link
              to="/communities"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Explore Classes & Groups</span>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Workspace Resources
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{personalReferences.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              0 Duplicates
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Studied / Completed
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{completedCount}</span>
            <span className="text-[11px] text-slate-400">
              of {personalReferences.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Starred High-Priority
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-500">{starredCount}</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Joined Communities
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">{userCommunities.length}</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Main Grid: Continue Studying & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Continue Studying & Recently Added */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Continue Studying */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Continue Studying</h2>
              </div>
              <Link to="/workspace" className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {continueStudyingList.map(({ ref, res }) => {
                if (!res) return null;
                return (
                  <div
                    key={ref.id}
                    onClick={() => openResourceViewer(res.id)}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider">
                          {res.type.toUpperCase()}
                        </span>
                        {ref.completed && (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            Studied
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {ref.personalName}
                      </h3>
                      {ref.personalNotes && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 italic">
                          "{ref.personalNotes}"
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{res.size}</span>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Resume <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Recently Added Community Resources */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recently Shared in Your Classes</h2>
                <p className="text-xs text-slate-500">New study materials uploaded by classmates and professors</p>
              </div>
              <Link to="/communities" className="text-xs text-blue-600 font-semibold">
                Explore All
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentlyAddedResources.map(res => {
                const comm = userCommunities.find(c => c.id === res.communityId);
                const subj = subjects.find(s => s.id === res.subjectId);
                const isInWorkspace = personalReferences.some(r => r.resourceId === res.id);

                return (
                  <div key={res.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div 
                      onClick={() => openResourceViewer(res.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                    >
                      <div className="p-2 bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-xl transition-colors shrink-0">
                        <FileText className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                          {res.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 flex-wrap">
                          {comm && <span>{comm.avatar} {comm.name}</span>}
                          {subj && <span>• {subj.name}</span>}
                          <span>• by {res.uploaderName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isInWorkspace ? (
                        <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                          In Workspace
                        </span>
                      ) : (
                        <button
                          onClick={() => addToWorkspace(res.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Access Subjects & My Communities & Discussions */}
        <div className="space-y-6">
          
          {/* Quick Access Subjects */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Access Subjects
            </h3>
            <div className="space-y-2">
              {subjects.map(subj => {
                const count = resources.filter(r => r.subjectId === subj.id).length;
                return (
                  <Link
                    key={subj.id}
                    to={`/workspace?subject=${subj.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {subj.code.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{subj.name}</div>
                        <div className="text-[10px] text-slate-400">{subj.code}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {count} files
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* My Communities List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                My Communities
              </h3>
              <Link to="/communities" className="text-xs text-blue-600 font-semibold">
                Explore
              </Link>
            </div>
            <div className="space-y-2">
              {userCommunities.map(comm => (
                <Link
                  key={comm.id}
                  to={`/communities/${comm.id}`}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-colors block"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{comm.avatar}</span>
                      <span className="text-xs font-bold text-slate-900">{comm.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {comm.membersCount} students
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Resource Discussions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Recent Discussions
            </h3>
            <div className="space-y-3">
              {recentDiscussions.map(c => {
                const res = resources.find(r => r.id === c.resourceId);
                return (
                  <div 
                    key={c.id} 
                    onClick={() => res && openResourceViewer(res.id)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">{c.userName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 line-clamp-2">"{c.content}"</p>
                    {res && (
                      <span className="text-[10px] text-blue-600 font-medium block truncate">
                        on {res.title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
