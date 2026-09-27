import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  FolderLock, 
  Folder, 
  FolderPlus, 
  LayoutGrid, 
  List, 
  Filter, 
  Search, 
  ArrowUpDown, 
  Star, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Plus, 
  FolderTree, 
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Breadcrumbs, BreadcrumbItem } from '../components/common/Breadcrumbs';
import { FolderCard } from '../components/workspace/FolderCard';
import { ResourceCard } from '../components/workspace/ResourceCard';
import { ResourceListItem } from '../components/workspace/ResourceListItem';
import { PersonalRenameModal } from '../components/workspace/PersonalRenameModal';
import { MoveResourceModal } from '../components/workspace/MoveResourceModal';
import { PersonalTagsModal } from '../components/workspace/PersonalTagsModal';
import { CreateFolderModal } from '../components/workspace/CreateFolderModal';
import { PersonalReference, Resource } from '../types';

export const WorkspacePage: React.FC = () => {
  const { folderId } = useParams<{ folderId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { 
    personalFolders, 
    personalReferences, 
    resources, 
    communities, 
    userCommunities, 
    subjects, 
    workspaceViewMode, 
    setWorkspaceViewMode,
    workspaceOrgMode,
    setWorkspaceOrgMode,
    workspaceCommunityFilter,
    setWorkspaceCommunityFilter,
  } = useData();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'added' | 'name' | 'community'>('added');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  // Modals state for selected item
  const [activeRenameItem, setActiveRenameItem] = useState<{ ref: PersonalReference; res: Resource } | null>(null);
  const [activeMoveItem, setActiveMoveItem] = useState<{ ref: PersonalReference; res: Resource } | null>(null);
  const [activeTagsItem, setActiveTagsItem] = useState<{ ref: PersonalReference; res: Resource } | null>(null);

  // Read URL query filters
  const currentFilterParam = searchParams.get('filter') || 'all';
  const currentSubjectParam = searchParams.get('subject') || 'all';

  const currentFolder = folderId 
    ? personalFolders.find(f => f.id === folderId) 
    : undefined;

  // Filtered Personal References
  const filteredReferences = useMemo(() => {
    return personalReferences.filter(ref => {
      const res = resources.find(r => r.id === ref.resourceId);
      if (!res) return false;

      // Folder filtering:
      if (workspaceOrgMode === 'combined') {
        if (folderId) {
          if (ref.personalFolderId !== folderId) return false;
        }
      }

      // Community Filter:
      if (workspaceCommunityFilter !== 'all' && res.communityId !== workspaceCommunityFilter) {
        return false;
      }

      // Quick tab filter:
      if (currentFilterParam === 'starred' && !ref.starred) return false;
      if (currentFilterParam === 'completed' && !ref.completed) return false;

      // Subject Filter:
      if (currentSubjectParam !== 'all' && res.subjectId !== currentSubjectParam) return false;

      // Type Filter:
      if (typeFilter !== 'all' && res.type !== typeFilter) return false;

      // Search Filter:
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = ref.personalName.toLowerCase().includes(q) || res.title.toLowerCase().includes(q);
        const tagMatch = ref.personalTags?.some(t => t.toLowerCase().includes(q));
        const noteMatch = ref.personalNotes?.toLowerCase().includes(q);
        if (!titleMatch && !tagMatch && !noteMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.personalName.localeCompare(b.personalName);
      }
      if (sortBy === 'community') {
        const resA = resources.find(r => r.id === a.resourceId);
        const resB = resources.find(r => r.id === b.resourceId);
        return (resA?.communityId || '').localeCompare(resB?.communityId || '');
      }
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [
    personalReferences, 
    resources, 
    folderId, 
    workspaceOrgMode, 
    workspaceCommunityFilter, 
    currentFilterParam, 
    currentSubjectParam, 
    typeFilter, 
    searchQuery, 
    sortBy
  ]);

  // Breadcrumb items
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: 'My Workspace', href: '/workspace' }];
    if (currentFolder) {
      items.push({ label: `📁 ${currentFolder.name}` });
    } else if (currentFilterParam === 'starred') {
      items.push({ label: '⭐ Starred' });
    } else if (currentFilterParam === 'completed') {
      items.push({ label: '✅ Completed' });
    }
    return items;
  }, [currentFolder, currentFilterParam]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
            <span>{currentFolder ? currentFolder.name : 'My Personal Workspace'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {filteredReferences.length} items
            </span>
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCreateFolderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>New Folder</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
            <button
              onClick={() => setWorkspaceViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                workspaceViewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWorkspaceViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                workspaceViewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Community Aggregation Switcher & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          
          {/* Multi-Community Org Mode Toggle (Prompt Section 10) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Multi-Community View:
            </span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setWorkspaceOrgMode('combined')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceOrgMode === 'combined'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Combined into Personal Subjects
              </button>
              <button
                onClick={() => setWorkspaceOrgMode('by-community')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceOrgMode === 'by-community'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Separate by Community
              </button>
            </div>
          </div>

          {/* Filter by Community */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Source:</span>
            <select
              value={workspaceCommunityFilter}
              onChange={(e) => setWorkspaceCommunityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Communities ({userCommunities.length})</option>
              {userCommunities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.avatar} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search, Type Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex-1 flex items-center gap-2 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter this folder by title, tag, or note..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  searchParams.delete('filter');
                  setSearchParams(searchParams);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  currentFilterParam === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  searchParams.set('filter', 'starred');
                  setSearchParams(searchParams);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  currentFilterParam === 'starred'
                    ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ⭐ Starred
              </button>
              <button
                onClick={() => {
                  searchParams.set('filter', 'completed');
                  setSearchParams(searchParams);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                  currentFilterParam === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ✅ Completed
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="added">Recently Added</option>
                <option value="name">Name (A-Z)</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Folders Section (Only in Root or Combined Mode) */}
      {!folderId && currentFilterParam === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Personal Folders ({personalFolders.length})
            </h2>
            <button
              onClick={() => setCreateFolderOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + Create Folder
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {personalFolders.map(folder => {
              const count = personalReferences.filter(r => r.personalFolderId === folder.id).length;
              return (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  count={count}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Resources Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {folderId ? `Files in ${currentFolder?.name}` : 'Personal Reference Files'}
          </h2>
          <span className="text-xs text-slate-400">
            {filteredReferences.length} files
          </span>
        </div>

        {/* Empty State */}
        {filteredReferences.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <FolderLock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No resources in this view
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore your class communities and click <strong>"Add to My Workspace"</strong> to build your personalized exam revision list.
            </p>
            <Link
              to="/communities"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <span>Explore Community Files</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {workspaceViewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReferences.map(ref => {
                  const res = resources.find(r => r.id === ref.resourceId);
                  if (!res) return null;
                  const comm = communities.find(c => c.id === res.communityId);
                  const subj = subjects.find(s => s.id === res.subjectId);

                  return (
                    <ResourceCard
                      key={ref.id}
                      reference={ref}
                      resource={res}
                      community={comm}
                      subject={subj}
                      onRename={() => setActiveRenameItem({ ref, res })}
                      onMove={() => setActiveMoveItem({ ref, res })}
                      onTags={() => setActiveTagsItem({ ref, res })}
                    />
                  );
                })}
              </div>
            )}

            {/* List View */}
            {workspaceViewMode === 'list' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
                {/* List Table Header */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex-1">Name / Personal Title</span>
                  <span className="hidden sm:inline w-48 px-2">Community Origin</span>
                  <span className="hidden md:inline w-36 px-2">Subject</span>
                  <span className="w-16 text-right">Size</span>
                  <span className="w-8"></span>
                </div>

                {filteredReferences.map(ref => {
                  const res = resources.find(r => r.id === ref.resourceId);
                  if (!res) return null;
                  const comm = communities.find(c => c.id === res.communityId);
                  const subj = subjects.find(s => s.id === res.subjectId);

                  return (
                    <ResourceListItem
                      key={ref.id}
                      reference={ref}
                      resource={res}
                      community={comm}
                      subject={subj}
                      onRename={() => setActiveRenameItem({ ref, res })}
                      onMove={() => setActiveMoveItem({ ref, res })}
                      onTags={() => setActiveTagsItem({ ref, res })}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Item Action Modals */}
      <PersonalRenameModal
        isOpen={!!activeRenameItem}
        reference={activeRenameItem?.ref || null}
        resource={activeRenameItem?.res || null}
        onClose={() => setActiveRenameItem(null)}
      />

      <MoveResourceModal
        isOpen={!!activeMoveItem}
        reference={activeMoveItem?.ref || null}
        resource={activeMoveItem?.res || null}
        onClose={() => setActiveMoveItem(null)}
      />

      <PersonalTagsModal
        isOpen={!!activeTagsItem}
        reference={activeTagsItem?.ref || null}
        onClose={() => setActiveTagsItem(null)}
      />

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
      />

    </div>
  );
};
