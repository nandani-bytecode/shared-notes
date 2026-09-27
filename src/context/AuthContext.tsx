import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { CURRENT_USER, DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'studyspace_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored auth user', e);
    }
    return CURRENT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Check if user matches any of our demo users or create a session
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return true;
    }
    // Allow new student login with custom email
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: 'National Institute of Technology',
      branch: 'Computer Science & Engineering',
      semester: 'Semester 5',
      role: 'student',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return true;
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: userData.name || 'Student',
      email: userData.email || 'student@college.edu',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: userData.college || 'National Institute of Technology',
      branch: userData.branch || 'Computer Science & Engineering',
      semester: userData.semester || 'Semester 5',
      role: 'student',
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const target = DEMO_USERS.find(u => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchUser,
        availableUsers: DEMO_USERS,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
