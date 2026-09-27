import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  KeyRound, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const CommunitiesPage: React.FC = () => {
  const { 
    communities, 
    userCommunities, 
    subjects, 
    openCreateCommunity, 
    openJoinCommunity 
  } = useData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Classroom', 'Club & Interest', 'Career & Placement', 'Exam Archive'];

  const filteredCommunities = communities.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.name.toLowerCase().includes(q);
      const descMatch = c.description.toLowerCase().includes(q);
      const codeMatch = c.code.toLowerCase().includes(q);
      return nameMatch || descMatch || codeMatch;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Academic Communities</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join your college class sections, subject study groups, and placement preparation hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openJoinCommunity}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-2xs"
          >
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Join with Code</span>
          </button>

          <button
            onClick={openCreateCommunity}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Community</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities by name, code or topic..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg border font-medium transition-colors shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCommunities.map(comm => {
          const isMember = userCommunities.some(c => c.id === comm.id);
          const commSubjects = subjects.filter(s => comm.subjects.includes(s.id));

          return (
            <div
              key={comm.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Banner Gradient */}
                <div className={`h-20 bg-gradient-to-r ${comm.bannerGradient} p-4 flex items-start justify-between relative`}>
                  <span className="text-3xl bg-white/90 backdrop-blur-xs w-12 h-12 rounded-2xl flex items-center justify-center shadow-md">
                    {comm.avatar}
                  </span>
                  <span className="text-[10px] font-bold text-white bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    {comm.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 pt-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {comm.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {comm.description}
                  </p>

                  {/* Subject Badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {commSubjects.slice(0, 3).map(subj => (
                      <Badge key={subj.id} variant={subj.color as any} size="sm">
                        {subj.name}
                      </Badge>
                    ))}
                    {commSubjects.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{commSubjects.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="p-4 px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">
                    {comm.membersCount} members
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {comm.code}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isMember ? (
                    <Link
                      to={`/communities/${comm.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={openJoinCommunity}
                      className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-2xs"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
