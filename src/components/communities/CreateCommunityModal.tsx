import React, { useState } from 'react';
import { X, Users, Sparkles, Hash } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ isOpen, onClose }) => {
  const { createCommunity, subjects } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['subj-dsa', 'subj-coa']);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!code || code.length <= 4) {
      // Auto-generate code slug
      const slug = val
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6);
      if (slug) setCode(`${slug}-${new Date().getFullYear()}`);
    }
  };

  const toggleSubject = (subjId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjId) ? prev.filter(s => s !== subjId) : [...prev, subjId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const newComm = createCommunity({
      name,
      code,
      description: description.trim() || 'A collaborative study community for students.',
      category,
      subjects: selectedSubjects,
    });

    onClose();
    navigate(`/communities/${newComm.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Create New Community</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Community Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. CSE Section H, Competitive Programming Club"
              className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invite Code
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CSEH-2024"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase tracking-wider border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden bg-white"
              >
                <option value="Classroom">Classroom & Section</option>
                <option value="Club & Interest">Club & Interest Group</option>
                <option value="Career & Placement">Career & Placement</option>
                <option value="Exam Archive">Exam Archive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What materials and subjects will be shared in this community?"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Subjects Included */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subjects Included
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 border border-slate-200 rounded-xl">
              {subjects.map(subj => {
                const isSelected = selectedSubjects.includes(subj.id);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => toggleSubject(subj.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border-blue-300 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {subj.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !code.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
