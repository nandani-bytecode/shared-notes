import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { GlobalSearchModal } from '../search/GlobalSearchModal';
import { ResourceViewerModal } from '../viewer/ResourceViewerModal';
import { CreateFolderModal } from '../workspace/CreateFolderModal';
import { JoinCommunityModal } from '../communities/JoinCommunityModal';
import { CreateCommunityModal } from '../communities/CreateCommunityModal';
import { useData } from '../../context/DataContext';

export const Layout: React.FC = () => {
  const { activeViewerResourceId, closeResourceViewer } = useData();

  const [searchOpen, setSearchOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [joinCommunityOpen, setJoinCommunityOpen] = useState(false);
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenJoinCommunity={() => setJoinCommunityOpen(true)}
        onOpenCreateCommunity={() => setCreateCommunityOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Drive / Workspace Sidebar */}
        <Sidebar
          onOpenCreateFolder={() => setCreateFolderOpen(true)}
          onOpenJoinCommunity={() => setJoinCommunityOpen(true)}
          onOpenCreateCommunity={() => setCreateCommunityOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <ResourceViewerModal
        resourceId={activeViewerResourceId}
        onClose={closeResourceViewer}
      />

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
      />

      <JoinCommunityModal
        isOpen={joinCommunityOpen}
        onClose={() => setJoinCommunityOpen(false)}
      />

      <CreateCommunityModal
        isOpen={createCommunityOpen}
        onClose={() => setCreateCommunityOpen(false)}
      />
    </div>
  );
};
