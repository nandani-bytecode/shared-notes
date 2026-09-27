import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  Check, 
  Sliders, 
  FolderLock, 
  Bell, 
  User, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { 
    workspaceOrgMode, 
    setWorkspaceOrgMode, 
    workspaceViewMode, 
    setWorkspaceViewMode, 
    resetToDemoData 
  } = useData();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [branch, setBranch] = useState(user?.branch || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, college, branch, semester });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize your study workspace organization and account preferences.
        </p>
      </div>

      {/* Workspace Organization Preferences (Prompt Section 10) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <FolderLock className="w-4 h-4 text-blue-600" />
          <span>Multi-Community Organization Layer</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Multi-Community Workspace Structure
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Choose how study materials from multiple classes are grouped in your personal workspace:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setWorkspaceOrgMode('combined')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  workspaceOrgMode === 'combined'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Combine into my personal subjects</span>
                  {workspaceOrgMode === 'combined' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  DSA folder contains resources from Section H, Coding Club, and Placement Preparation grouped together.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setWorkspaceOrgMode('by-community')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  workspaceOrgMode === 'by-community'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>Keep communities separate</span>
                  {workspaceOrgMode === 'by-community' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Separates materials by their original community origin inside your drive.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Default View Mode
            </label>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setWorkspaceViewMode('grid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceViewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Grid View
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceViewMode('list')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  workspaceViewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Drive List View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-blue-600" />
          <span>Student Profile Information</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch / Department
              </label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Semester
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedMessage && (
              <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Reset Demo Data */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-900">Reset Demo Data</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Clear your local custom personal references, tags, and uploaded items and reset to initial NIT sample dataset.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Reset all personal notes, references and uploaded demo data back to default?')) {
              resetToDemoData();
              alert('StudySpace dataset reset to default state.');
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data</span>
        </button>
      </div>

    </div>
  );
};
