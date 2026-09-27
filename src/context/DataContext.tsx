import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Community, 
  Subject, 
  Resource, 
  PersonalReference, 
  PersonalFolder, 
  Comment, 
  Announcement,
  CommunityMember,
  WorkspaceOrganizationMode,
  WorkspaceViewMode
} from '../types';
import { 
  INITIAL_COMMUNITIES, 
  INITIAL_SUBJECTS, 
  INITIAL_RESOURCES, 
  INITIAL_PERSONAL_FOLDERS, 
  INITIAL_PERSONAL_REFERENCES, 
  INITIAL_COMMENTS, 
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MEMBERS 
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface DataContextType {
  communities: Community[];
  userCommunities: Community[];
  subjects: Subject[];
  resources: Resource[];
  personalFolders: PersonalFolder[];
  personalReferences: PersonalReference[];
  comments: Comment[];
  announcements: Announcement[];
  members: CommunityMember[];
  
  // Workspace UI settings
  workspaceViewMode: WorkspaceViewMode;
  setWorkspaceViewMode: (mode: WorkspaceViewMode) => void;
  workspaceOrgMode: WorkspaceOrganizationMode;
  setWorkspaceOrgMode: (mode: WorkspaceOrganizationMode) => void;
  workspaceCommunityFilter: string; // 'all' or communityId
  setWorkspaceCommunityFilter: (commId: string) => void;

  // Global Modals State & Triggers
  activeViewerResourceId: string | null;
  openResourceViewer: (resourceId: string) => void;
  closeResourceViewer: () => void;

  isCreateCommunityOpen: boolean;
  openCreateCommunity: () => void;
  closeCreateCommunity: () => void;

  isJoinCommunityOpen: boolean;
  openJoinCommunity: () => void;
  closeJoinCommunity: () => void;

  isUploadResourceOpen: boolean;
  uploadTargetCommunityId?: string;
  uploadTargetSubjectId?: string;
  openUploadResource: (communityId?: string, subjectId?: string) => void;
  closeUploadResource: () => void;

  isCreateFolderOpen: boolean;
  openCreateFolder: () => void;
  closeCreateFolder: () => void;

  // Personal Workspace Operations (THE CORE ARCHITECTURAL RULE)
  addToWorkspace: (resourceId: string, folderId?: string | null) => PersonalReference;
  removeFromWorkspace: (resourceId: string) => void;
  removeReferenceById: (referenceId: string) => void;
  renamePersonalReference: (referenceId: string, newPersonalName: string) => void;
  movePersonalReference: (referenceId: string, newFolderId: string | null) => void;
  updatePersonalNotes: (referenceId: string, notes: string) => void;
  updatePersonalTags: (referenceId: string, tags: string[]) => void;
  toggleStar: (referenceIdOrResourceId: string) => void;
  toggleCompleted: (referenceId: string) => void;
  touchResourceAccess: (resourceId: string) => void;

  // Personal Folder Operations
  createPersonalFolder: (name: string, color?: string, icon?: string, parentId?: string | null) => PersonalFolder;
  deletePersonalFolder: (folderId: string) => void;
  renamePersonalFolder: (folderId: string, newName: string) => void;

  // Subject Operations
  addSubject: (data: { code: string; name: string; color?: string; description?: string }) => Subject;

  // Community Operations
  createCommunity: (data: { 
    name: string; 
    code: string; 
    description: string; 
    category: string; 
    subjects: string[];
    avatar?: string;
    bannerGradient?: string;
  }) => Community;
  joinCommunityWithCode: (code: string) => { success: boolean; message: string; community?: Community };
  leaveCommunity: (communityId: string) => void;
  createAnnouncement: (communityId: string, title: string, content: string, pinned?: boolean) => Announcement;

  // Resource Operations
  uploadResource: (data: {
    title: string;
    description: string;
    type: Resource['type'];
    url: string;
    communityId: string;
    subjectId: string;
    size?: string;
    pdfContent?: string[];
  }) => Resource;

  // Discussion & Comments Operations
  addComment: (resourceId: string, content: string) => Comment;
  addReply: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;

  // Helper getters
  getPersonalReferenceForResource: (resourceId: string) => PersonalReference | undefined;
  getResource: (resourceId: string) => Resource | undefined;
  getCommunity: (communityId: string) => Community | undefined;
  getSubject: (subjectId: string) => Subject | undefined;
  getResourceComments: (resourceId: string) => Comment[];
  resetToDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMMUNITIES: 'studyspace_communities_v2',
  SUBJECTS: 'studyspace_subjects_v2',
  RESOURCES: 'studyspace_resources_v2',
  FOLDERS: 'studyspace_folders_v2',
  REFERENCES: 'studyspace_references_v2',
  COMMENTS: 'studyspace_comments_v2',
  ANNOUNCEMENTS: 'studyspace_announcements_v2',
  MEMBERS: 'studyspace_members_v2',
  ORG_MODE: 'studyspace_org_mode_v2',
  VIEW_MODE: 'studyspace_view_mode_v2',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'usr-current';

  // State initialization with localStorage fallback
  const [communities, setCommunities] = useState<Community[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
      return stored ? JSON.parse(stored) : INITIAL_COMMUNITIES;
    } catch {
      return INITIAL_COMMUNITIES;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return stored ? JSON.parse(stored) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return stored ? JSON.parse(stored) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [personalFolders, setPersonalFolders] = useState<PersonalFolder[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FOLDERS);
      return stored ? JSON.parse(stored) : INITIAL_PERSONAL_FOLDERS;
    } catch {
      return INITIAL_PERSONAL_FOLDERS;
    }
  });

  const [personalReferences, setPersonalReferences] = useState<PersonalReference[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REFERENCES);
      return stored ? JSON.parse(stored) : INITIAL_PERSONAL_REFERENCES;
    } catch {
      return INITIAL_PERSONAL_REFERENCES;
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return stored ? JSON.parse(stored) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [members, setMembers] = useState<CommunityMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [workspaceViewMode, setWorkspaceViewMode] = useState<WorkspaceViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as WorkspaceViewMode) || 'grid';
  });

  const [workspaceOrgMode, setWorkspaceOrgMode] = useState<WorkspaceOrganizationMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ORG_MODE) as WorkspaceOrganizationMode) || 'combined';
  });

  const [workspaceCommunityFilter, setWorkspaceCommunityFilter] = useState<string>('all');
  
  // Global Modals State
  const [activeViewerResourceId, setActiveViewerResourceId] = useState<string | null>(null);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isJoinCommunityOpen, setIsJoinCommunityOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadResourceOpen, setIsUploadResourceOpen] = useState(false);
  const [uploadTargetCommunityId, setUploadTargetCommunityId] = useState<string | undefined>(undefined);
  const [uploadTargetSubjectId, setUploadTargetSubjectId] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(personalFolders));
  }, [personalFolders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(personalReferences));
  }, [personalReferences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, workspaceViewMode);
  }, [workspaceViewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORG_MODE, workspaceOrgMode);
  }, [workspaceOrgMode]);

  // Communities user is a member of
  const userCommunities = useMemo(() => {
    const memberCommunityIds = new Set(
      members.filter(m => m.userId === currentUserId).map(m => m.communityId)
    );
    return communities.filter(c => memberCommunityIds.has(c.id));
  }, [communities, members, currentUserId]);

  const openResourceViewer = (resourceId: string) => {
    setActiveViewerResourceId(resourceId);
    touchResourceAccess(resourceId);
  };

  const closeResourceViewer = () => {
    setActiveViewerResourceId(null);
  };

  const openCreateCommunity = () => setIsCreateCommunityOpen(true);
  const closeCreateCommunity = () => setIsCreateCommunityOpen(false);

  const openJoinCommunity = () => setIsJoinCommunityOpen(true);
  const closeJoinCommunity = () => setIsJoinCommunityOpen(false);

  const openCreateFolder = () => setIsCreateFolderOpen(true);
  const closeCreateFolder = () => setIsCreateFolderOpen(false);

  const openUploadResource = (commId?: string, subjId?: string) => {
    setUploadTargetCommunityId(commId);
    setUploadTargetSubjectId(subjId);
    setIsUploadResourceOpen(true);
  };
  const closeUploadResource = () => {
    setIsUploadResourceOpen(false);
    setUploadTargetCommunityId(undefined);
    setUploadTargetSubjectId(undefined);
  };

  // Helper getters
  const getPersonalReferenceForResource = (resourceId: string) => {
    return personalReferences.find(
      ref => ref.resourceId === resourceId && ref.userId === currentUserId
    );
  };

  const getResource = (resourceId: string) => {
    return resources.find(r => r.id === resourceId);
  };

  const getCommunity = (communityId: string) => {
    return communities.find(c => c.id === communityId);
  };

  const getSubject = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  const getResourceComments = (resourceId: string) => {
    return comments.filter(c => c.resourceId === resourceId);
  };

  const touchResourceAccess = (resourceId: string) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r));
    setPersonalReferences(prev => prev.map(ref => {
      if (ref.resourceId === resourceId && ref.userId === currentUserId) {
        return { ...ref, lastOpenedAt: new Date().toISOString() };
      }
      return ref;
    }));
  };

  // ==========================================
  // CORE ARCHITECTURAL RULE IMPLEMENTATION:
  // Add to workspace creates a PERSONAL REFERENCE
  // The original community resource is NEVER duplicated!
  // ==========================================
  const addToWorkspace = (resourceId: string, folderId: string | null = null): PersonalReference => {
    const existing = personalReferences.find(
      ref => ref.resourceId === resourceId && ref.userId === currentUserId
    );
    if (existing) {
      if (folderId !== undefined && existing.personalFolderId !== folderId) {
        const updated = { ...existing, personalFolderId: folderId };
        setPersonalReferences(prev => prev.map(r => r.id === existing.id ? updated : r));
        return updated;
      }
      return existing;
    }

    const originalResource = resources.find(r => r.id === resourceId);
    let targetFolderId = folderId;
    if (targetFolderId === null && originalResource) {
      const matchingFolder = personalFolders.find(
        f => f.subjectMapping === originalResource.subjectId || 
             f.name.toLowerCase() === originalResource.subjectId.replace('subj-', '').toLowerCase() ||
             (originalResource.subjectId === 'subj-dsa' && f.name.toLowerCase().includes('dsa')) ||
             (originalResource.subjectId === 'subj-coa' && f.name.toLowerCase().includes('coa'))
      );
      if (matchingFolder) {
        targetFolderId = matchingFolder.id;
      }
    }

    const newRef: PersonalReference = {
      id: `pref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUserId,
      resourceId: resourceId, // Direct pointer to original community resource
      personalName: originalResource ? originalResource.title : 'Study Resource',
      personalFolderId: targetFolderId,
      personalTags: ['Added to Workspace'],
      personalNotes: '',
      starred: false,
      completed: false,
      addedAt: new Date().toISOString(),
      lastOpenedAt: new Date().toISOString(),
    };

    setPersonalReferences(prev => [newRef, ...prev]);
    return newRef;
  };

  const removeFromWorkspace = (resourceId: string) => {
    setPersonalReferences(prev =>
      prev.filter(ref => !(ref.resourceId === resourceId && ref.userId === currentUserId))
    );
  };

  const removeReferenceById = (referenceId: string) => {
    setPersonalReferences(prev => prev.filter(ref => ref.id !== referenceId));
  };

  const renamePersonalReference = (referenceId: string, newPersonalName: string) => {
    if (!newPersonalName.trim()) return;
    setPersonalReferences(prev =>
      prev.map(ref => ref.id === referenceId ? { ...ref, personalName: newPersonalName.trim() } : ref)
    );
  };

  const movePersonalReference = (referenceId: string, newFolderId: string | null) => {
    setPersonalReferences(prev =>
      prev.map(ref => ref.id === referenceId ? { ...ref, personalFolderId: newFolderId } : ref)
    );
  };

  const updatePersonalNotes = (referenceId: string, notes: string) => {
    setPersonalReferences(prev =>
      prev.map(ref => ref.id === referenceId ? { ...ref, personalNotes: notes } : ref)
    );
  };

  const updatePersonalTags = (referenceId: string, tags: string[]) => {
    setPersonalReferences(prev =>
      prev.map(ref => ref.id === referenceId ? { ...ref, personalTags: tags } : ref)
    );
  };

  const toggleStar = (referenceIdOrResourceId: string) => {
    const refById = personalReferences.find(r => r.id === referenceIdOrResourceId && r.userId === currentUserId);
    if (refById) {
      setPersonalReferences(prev =>
        prev.map(r => r.id === refById.id ? { ...r, starred: !r.starred } : r)
      );
      return;
    }

    const refByResId = personalReferences.find(r => r.resourceId === referenceIdOrResourceId && r.userId === currentUserId);
    if (refByResId) {
      setPersonalReferences(prev =>
        prev.map(r => r.id === refByResId.id ? { ...r, starred: !r.starred } : r)
      );
      return;
    }

    const newRef = addToWorkspace(referenceIdOrResourceId);
    setPersonalReferences(prev =>
      prev.map(r => r.id === newRef.id ? { ...r, starred: true } : r)
    );
  };

  const toggleCompleted = (referenceId: string) => {
    setPersonalReferences(prev =>
      prev.map(ref => ref.id === referenceId ? { ...ref, completed: !ref.completed } : ref)
    );
  };

  // Folder Operations
  const createPersonalFolder = (
    name: string, 
    color: string = '#3b82f6', 
    icon: string = 'Folder', 
    parentId: string | null = null
  ): PersonalFolder => {
    const newFolder: PersonalFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUserId,
      name: name.trim(),
      color,
      icon,
      parentId,
      createdAt: new Date().toISOString(),
    };
    setPersonalFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deletePersonalFolder = (folderId: string) => {
    setPersonalFolders(prev => prev.filter(f => f.id !== folderId));
    setPersonalReferences(prev =>
      prev.map(ref => ref.personalFolderId === folderId ? { ...ref, personalFolderId: null } : ref)
    );
  };

  const renamePersonalFolder = (folderId: string, newName: string) => {
    if (!newName.trim()) return;
    setPersonalFolders(prev =>
      prev.map(f => f.id === folderId ? { ...f, name: newName.trim() } : f)
    );
  };

  // Subject Operations
  const addSubject = (data: { code: string; name: string; color?: string; description?: string }): Subject => {
    const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'indigo', 'cyan'];
    const newSubject: Subject = {
      id: `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      color: data.color || colors[Math.floor(Math.random() * colors.length)],
      description: data.description?.trim() || `${data.name} syllabus, notes and study materials.`,
      icon: 'BookOpen',
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  // Community Operations
  const createCommunity = (data: { 
    name: string; 
    code: string; 
    description: string; 
    category: string; 
    subjects: string[];
    avatar?: string;
    bannerGradient?: string;
  }): Community => {
    const gradients = [
      'from-blue-600 to-indigo-800',
      'from-emerald-600 to-teal-800',
      'from-purple-600 to-pink-800',
      'from-amber-600 to-orange-800',
      'from-cyan-600 to-blue-800',
      'from-rose-600 to-red-800'
    ];

    let finalCode = data.code.toUpperCase().trim().replace(/\s+/g, '-');
    if (!finalCode) {
      finalCode = `${data.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}-${new Date().getFullYear()}`;
    }
    // Prevent duplicate codes
    if (communities.some(c => c.code.toUpperCase() === finalCode)) {
      finalCode = `${finalCode}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    }

    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name: data.name.trim(),
      code: finalCode,
      description: data.description?.trim() || 'A collaborative study community for students.',
      category: data.category || 'Classroom',
      membersCount: 1,
      bannerGradient: data.bannerGradient || gradients[Math.floor(Math.random() * gradients.length)],
      avatar: data.avatar || '🎓',
      subjects: data.subjects.length > 0 ? data.subjects : ['subj-dsa', 'subj-coa'],
      createdBy: currentUserId,
      createdAt: new Date().toISOString().split('T')[0],
      isAdmin: true,
    };

    setCommunities(prev => [newComm, ...prev]);

    // Immediately add current user as admin member
    const newMember: CommunityMember = {
      id: `mem-${Date.now()}`,
      communityId: newComm.id,
      userId: currentUserId,
      name: user?.name || 'Student',
      email: user?.email || 'student@college.edu',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      joinedAt: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);

    return newComm;
  };

  const joinCommunityWithCode = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    const target = communities.find(c => c.code.toUpperCase() === formattedCode);
    if (!target) {
      return { success: false, message: 'Invalid invite code. Please check and try again.' };
    }

    const alreadyMember = members.some(
      m => m.communityId === target.id && m.userId === currentUserId
    );
    if (alreadyMember) {
      return { success: false, message: 'You are already a member of this community!' };
    }

    const newMember: CommunityMember = {
      id: `mem-${Date.now()}`,
      communityId: target.id,
      userId: currentUserId,
      name: user?.name || 'Student',
      email: user?.email || 'student@college.edu',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    setMembers(prev => [...prev, newMember]);
    setCommunities(prev =>
      prev.map(c => c.id === target.id ? { ...c, membersCount: c.membersCount + 1 } : c)
    );

    return { success: true, message: `Successfully joined ${target.name}!`, community: target };
  };

  const leaveCommunity = (communityId: string) => {
    setMembers(prev =>
      prev.filter(m => !(m.communityId === communityId && m.userId === currentUserId))
    );
    setCommunities(prev =>
      prev.map(c => c.id === communityId ? { ...c, membersCount: Math.max(1, c.membersCount - 1) } : c)
    );
  };

  const createAnnouncement = (
    communityId: string, 
    title: string, 
    content: string, 
    pinned: boolean = false
  ): Announcement => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      communityId,
      title: title.trim(),
      content: content.trim(),
      authorName: user?.name || 'Admin',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRole: 'Community Admin',
      createdAt: new Date().toISOString(),
      pinned,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    return newAnn;
  };

  // Upload Resource to a community
  const uploadResource = (data: {
    title: string;
    description: string;
    type: Resource['type'];
    url: string;
    communityId: string;
    subjectId: string;
    size?: string;
    pdfContent?: string[];
  }): Resource => {
    const newRes: Resource = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      type: data.type,
      url: data.url.trim(),
      downloadUrl: data.url.trim(),
      size: data.size || (data.type === 'pdf' ? '3.4 MB' : data.type === 'video' ? 'Stream' : 'Web Link'),
      communityId: data.communityId,
      subjectId: data.subjectId,
      uploaderId: currentUserId,
      uploaderName: user?.name || 'Student',
      uploaderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      pagesCount: data.type === 'pdf' ? (data.pdfContent?.length || 12) : undefined,
      pdfContent: data.pdfContent || [
        `### ${data.title.toUpperCase()}\n\nUploaded by ${user?.name} on ${new Date().toLocaleDateString()}.\n\n#### Course Notes & Concepts\n${data.description}\n\n* Study notes uploaded to StudySpace community archive.\n* Add this resource to your personal workspace to annotate and organize into custom folders.`
      ],
    };

    setResources(prev => [newRes, ...prev]);
    return newRes;
  };

  // Discussion & Comments
  const addComment = (resourceId: string, content: string): Comment => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      resourceId,
      userId: currentUserId,
      userName: user?.name || 'Student',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    return newComment;
  };

  const addReply = (commentId: string, content: string) => {
    const reply = {
      id: `rep-${Date.now()}`,
      commentId,
      userId: currentUserId,
      userName: user?.name || 'Student',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setComments(prev =>
      prev.map(c => c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c)
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setCommunities(INITIAL_COMMUNITIES);
    setSubjects(INITIAL_SUBJECTS);
    setResources(INITIAL_RESOURCES);
    setPersonalFolders(INITIAL_PERSONAL_FOLDERS);
    setPersonalReferences(INITIAL_PERSONAL_REFERENCES);
    setComments(INITIAL_COMMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setMembers(INITIAL_MEMBERS);
    setWorkspaceOrgMode('combined');
    setWorkspaceViewMode('grid');
    setWorkspaceCommunityFilter('all');
  };

  return (
    <DataContext.Provider
      value={{
        communities,
        userCommunities,
        subjects,
        resources,
        personalFolders,
        personalReferences,
        comments,
        announcements,
        members,
        workspaceViewMode,
        setWorkspaceViewMode,
        workspaceOrgMode,
        setWorkspaceOrgMode,
        workspaceCommunityFilter,
        setWorkspaceCommunityFilter,
        activeViewerResourceId,
        openResourceViewer,
        closeResourceViewer,
        isCreateCommunityOpen,
        openCreateCommunity,
        closeCreateCommunity,
        isJoinCommunityOpen,
        openJoinCommunity,
        closeJoinCommunity,
        isCreateFolderOpen,
        openCreateFolder,
        closeCreateFolder,
        isUploadResourceOpen,
        uploadTargetCommunityId,
        uploadTargetSubjectId,
        openUploadResource,
        closeUploadResource,
        addToWorkspace,
        removeFromWorkspace,
        removeReferenceById,
        renamePersonalReference,
        movePersonalReference,
        updatePersonalNotes,
        updatePersonalTags,
        toggleStar,
        toggleCompleted,
        touchResourceAccess,
        createPersonalFolder,
        deletePersonalFolder,
        renamePersonalFolder,
        addSubject,
        createCommunity,
        joinCommunityWithCode,
        leaveCommunity,
        createAnnouncement,
        uploadResource,
        addComment,
        addReply,
        deleteComment,
        getPersonalReferenceForResource,
        getResource,
        getCommunity,
        getSubject,
        getResourceComments,
        resetToDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
