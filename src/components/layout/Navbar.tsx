import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  BookOpen, 
  FolderLock, 
  Users, 
  MessageSquare, 
  Plus, 
  Menu, 
  X, 
  UserCheck, 
  LogOut, 
  Settings, 
  User as UserIcon,
  RotateCcw,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenJoinCommunity: () => void;
  onOpenCreateCommunity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenSearch, 
  onOpenJoinCommunity,
  onOpenCreateCommunity 
}) => {
  const { user, logout, switchUser, availableUsers } = useAuth();
  const { announcements, resetToDemoData, personalReferences } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/workspace' && location.pathname.startsWith('/workspace')) return true;
    if (path === '/communities' && location.pathname.startsWith('/communities')) return true;
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Layers },
    { name: 'My Workspace', path: '/workspace', icon: FolderLock, badge: personalReferences.length },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Discussions', path: '/discussions', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  StudySpace
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-blue-600 -mt-1">
                  Shared Drive & Notes
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        active 
                          ? 'bg-blue-50 text-blue-700 shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span>{link.name}</span>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                          active ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Search Bar & Global Triggers */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200/80 transition-all text-left shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="truncate">Search resources, subjects, discussions...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <>
                {/* Fast Switch User Role Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                    className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                    title="Switch user demo role"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Role: {user.role.toUpperCase()}</span>
                  </button>

                  {showUserSwitcher && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setShowUserSwitcher(false)}
                    >
                      <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Switch Demo Persona
                      </div>
                      {availableUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setShowUserSwitcher(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors ${
                            u.id === user.id ? 'bg-amber-50/60 font-semibold text-amber-900' : 'text-slate-700'
                          }`}
                        >
                          <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                          <div className="flex-1 truncate">
                            <div className="truncate font-medium">{u.name}</div>
                            <div className="text-[10px] text-slate-400 capitalize">{u.role} • {u.semester}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative"
                    title="Announcements & Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {announcements.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {showNotifications && (
                    <div 
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-fade-in"
                      onMouseLeave={() => setShowNotifications(false)}
                    >
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <span className="font-semibold text-sm text-slate-900">Community Announcements</span>
                        <span className="text-xs text-blue-600 font-medium">{announcements.length} new</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {announcements.slice(0, 4).map((ann) => (
                          <div key={ann.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-slate-900 line-clamp-1">{ann.title}</span>
                              {ann.pinned && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                                  PINNED
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                              <span>{ann.authorName}</span>
                              <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 pt-2 border-t border-slate-100 text-center">
                        <Link 
                          to="/communities" 
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all in communities →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Avatar & Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500"
                    />
                    <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <p className="text-[10px] text-blue-600 font-medium mt-0.5">{user.college}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Reset all personal notes, references and uploaded demo data back to default?')) {
                              resetToDemoData();
                              setShowUserMenu(false);
                            }
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                        >
                          <RotateCcw className="w-4 h-4 text-slate-400" />
                          <span>Reset Demo Data</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinCommunity();
              }}
              className="text-xs font-semibold text-blue-600 py-1.5"
            >
              + Join Community by Code
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCreateCommunity();
              }}
              className="text-xs font-semibold text-slate-700 py-1.5"
            >
              + Create Community
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
