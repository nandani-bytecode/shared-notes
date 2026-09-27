export type ResourceType = 'pdf' | 'document' | 'image' | 'video' | 'link';

export type UserRole = 'student' | 'cr' | 'ta' | 'professor';
export type CommunityRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  branch: string;
  semester: string;
  role: UserRole;
  joinedAt: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

export interface Community {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  membersCount: number;
  bannerGradient: string;
  avatar: string;
  subjects: string[]; // Subject IDs
  createdBy: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: CommunityRole;
  joinedAt: string;
}

export interface Resource {
  id: string; // Unique community resource ID (e.g., "res-001")
  title: string; // Original community resource title (e.g., "DSA Lecture 1.pdf")
  description: string;
  type: ResourceType;
  url: string;
  downloadUrl?: string;
  size: string;
  communityId: string;
  subjectId: string;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar: string;
  createdAt: string;
  viewsCount: number;
  pagesCount?: number;
  pdfContent?: string[]; // Page-by-page text content for realistic in-app PDF preview
  authorSummary?: string;
  previewUrl?: string;
}

export interface PersonalReference {
  id: string; // e.g. "pref-001"
  userId: string;
  resourceId: string; // Points to unchanged original resource
  personalName: string; // Custom personal display name e.g. "🔥 MUST DO — Linked Lists"
  personalFolderId: string | null; // e.g. "folder-dsa", "folder-important", or null for root
  personalTags: string[]; // e.g. ["Midsem Exam", "High Priority"]
  personalNotes: string; // Custom student scratchpad notes
  starred: boolean;
  completed: boolean;
  addedAt: string;
  lastOpenedAt: string;
}

export interface PersonalFolder {
  id: string;
  userId: string;
  name: string; // e.g. "DSA", "COA", "Maths", "Important"
  color: string;
  icon: string;
  parentId: string | null;
  createdAt: string;
  subjectMapping?: string; // Optional auto-mapping to subject ID for combined mode
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  replies: CommentReply[];
}

export interface Announcement {
  id: string;
  communityId: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  createdAt: string;
  pinned: boolean;
}

export type WorkspaceViewMode = 'grid' | 'list';
export type WorkspaceOrganizationMode = 'combined' | 'by-community';
