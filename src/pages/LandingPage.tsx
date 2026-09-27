import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  FolderLock, 
  Users, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Search, 
  MessageSquare,
  Layers,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              StudySpace
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Go to My Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  Join Your Class Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Academic Workspace for Modern College Students</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Where messy WhatsApp study chats turn into{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            organized personal study drives.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stop scrolling through 2,000 unread messages looking for that one PYQ or lecture slide. Join your section communities, discuss difficult questions, and curate your personalized study drive with zero duplicate files.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Studying with StudySpace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/workspace"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <FolderLock className="w-4 h-4 text-blue-600" />
            <span>Explore Demo Workspace</span>
          </Link>
        </div>

        {/* The Core Concept Interactive Demonstration Preview */}
        <div className="mt-16 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-600 block">
                The Core Architecture
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Shared Community Resources + Personal Organization Layer
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              Zero File Duplication
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Community A */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                <span className="text-base">💻</span>
                <span>Community A: CSE Section H</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">DSA Lecture 1.pdf</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">DSA PYQ.pdf</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">COA Unit 1.pdf</span>
                </div>
              </div>
            </div>

            {/* Community B */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3">
                <span className="text-base">⚡</span>
                <span>Community B: Coding Club</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">DSA Notes.pdf</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">DSA Important Questions.pdf</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">COA Unit 3.pdf</span>
                </div>
              </div>
            </div>

            {/* Student's Personal Workspace */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border-2 border-blue-300">
              <div className="flex items-center justify-between text-xs font-bold text-blue-950 mb-3">
                <div className="flex items-center gap-1.5">
                  <FolderLock className="w-4 h-4 text-blue-600" />
                  <span>My Workspace (Arjun)</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                  Combined
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-700 text-[11px] flex items-center gap-1">
                  <span>📁 DSA (Aggregated):</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800 truncate">DSA Lecture 1.pdf</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">CSE-H</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-blue-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800 truncate">DSA Notes.pdf</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded">Coding</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-300 bg-amber-50/50 flex items-center justify-between">
                  <span className="font-semibold text-amber-900 truncate">🔥 MUST DO — Linked Lists</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded">Personalized</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-100/80 rounded-xl text-xs text-slate-600 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>
              When a student renames a reference or moves it to <strong className="text-slate-900">Important</strong>, the original community resource remains completely unchanged for everyone else.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Engineered for Exam Preparation
            </h3>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Everything students need during exam week
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">In-App PDF & Resource Viewer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preview lecture notes, formula sheets, and past year questions instantly in-browser without having to re-download files over and over.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Contextual Resource Discussions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every document has its own dedicated comment thread. Ask questions like "Does this cover page 18?" and get answers right where the file lives.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Multi-Community Organization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combine materials from multiple clubs, classes, and sections into your own subject folders with private tags, star bookmarks, and personal notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">StudySpace</span>
            <span className="text-slate-400 text-xs ml-2">Shared Community Resources + Personal Organization Layer</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/workspace" className="hover:text-white transition-colors">Workspace</Link>
            <Link to="/communities" className="hover:text-white transition-colors">Communities</Link>
            <Link to="/discussions" className="hover:text-white transition-colors">Discussions</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
