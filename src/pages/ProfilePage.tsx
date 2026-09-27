import React from 'react';
import { 
  User as UserIcon, 
  GraduationCap, 
  FolderLock, 
  Star, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Edit3,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { personalReferences, userCommunities } = useData();

  if (!user) return null;

  const completedCount = personalReferences.filter(r => r.completed).length;
  const starredCount = personalReferences.filter(r => r.starred).length;
  const notesCount = personalReferences.filter(r => r.personalNotes?.trim().length > 0).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span className="self-center sm:self-start text-xs font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {user.role}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{user.college}</span>
              </span>
              <span>•</span>
              <span>{user.branch}</span>
              <span>•</span>
              <span className="font-semibold text-slate-900">{user.semester}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Workspace Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <FolderLock className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-slate-900 block">{personalReferences.length}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Workspace Files
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-emerald-600 block">{completedCount}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Topics Studied
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <Star className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-amber-500 block">{starredCount}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Starred High Priority
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-2xs">
          <Edit3 className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-indigo-600 block">{notesCount}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Personal Notes
          </span>
        </div>
      </div>

      {/* Enrolled Communities */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Joined Communities ({userCommunities.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userCommunities.map(comm => (
            <div key={comm.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{comm.avatar}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{comm.name}</h4>
                  <span className="text-[10px] text-slate-400">{comm.membersCount} students</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                {comm.code}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
