import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  FolderLock, 
  Check, 
  Plus, 
  MessageSquare, 
  Star, 
  ArrowRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    subjects, 
    resources, 
    communities, 
    personalReferences, 
    addToWorkspace, 
    removeFromWorkspace, 
    openResourceViewer 
  } = useData();

  const [communityFilter, setCommunityFilter] = useState<string>('all');

  const subject = subjects.find(s => s.id === id) || subjects[0];
  const subjectResources = resources.filter(r => r.subjectId === subject.id);

  const filteredResources = subjectResources.filter(r => {
    if (communityFilter !== 'all' && r.communityId !== communityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Subjects', href: '/dashboard' },
          { label: subject.name },
        ]}
      />

      {/* Subject Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={subject.color as any} size="md">
              {subject.code}
            </Badge>
            <span className="text-xs text-slate-400">Core Engineering Subject</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {subject.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            {subject.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl text-center border border-blue-100">
            <span className="text-2xl font-black block">{subjectResources.length}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Available Files</span>
          </div>
        </div>
      </div>

      {/* Multi-Community Sourcing Notice */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-100 flex items-center justify-between gap-4 text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Aggregating resources for <strong>{subject.name}</strong> across all active student communities.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 text-xs">Filter by Source:</span>
          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Communities</option>
            {communities.map(c => (
              <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          const comm = communities.find(c => c.id === res.communityId);
          const personalRef = personalReferences.find(r => r.resourceId === res.id);
          const isInWorkspace = !!personalRef;

          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-4 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  {comm && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span>{comm.avatar}</span>
                      <span className="truncate max-w-[120px]">{comm.name}</span>
                    </span>
                  )}
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {res.type}
                  </span>
                </div>

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
                <span>{res.size}</span>

                {isInWorkspace ? (
                  <button
                    onClick={() => removeFromWorkspace(res.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
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
    </div>
  );
};
