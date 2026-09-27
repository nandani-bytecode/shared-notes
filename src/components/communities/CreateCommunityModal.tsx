import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  Hash, 
  Dices, 
  Plus, 
  Check, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

interface CreateCommunityModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const { 
    isCreateCommunityOpen, 
    closeCreateCommunity, 
    createCommunity, 
    subjects, 
    addSubject 
  } = useData();
  const navigate = useNavigate();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : isCreateCommunityOpen;
  const handleModalClose = () => {
    if (propOnClose) propOnClose();
    closeCreateCommunity();
  };

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['subj-dsa', 'subj-coa']);
  const [selectedAvatar, setSelectedAvatar] = useState('💻');
  const [selectedGradient, setSelectedGradient] = useState('from-blue-600 to-indigo-800');
  const [error, setError] = useState('');

  // Add custom subject inline state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjCode, setNewSubjCode] = useState('');

  if (!isModalOpen) return null;

  const avatarOptions = ['💻', '⚡', '🎓', '📚', '🎯', '🚀', '🔬', '🤖', '🧠', '🎨', '🧪', '💡', '📝', '🏆', '🌐'];

  const gradientOptions = [
    { label: 'Deep Blue', value: 'from-blue-600 to-indigo-800' },
    { label: 'Emerald', value: 'from-emerald-600 to-teal-800' },
    { label: 'Purple Violet', value: 'from-purple-600 to-pink-800' },
    { label: 'Warm Amber', value: 'from-amber-600 to-orange-800' },
    { label: 'Cyan Ocean', value: 'from-cyan-600 to-blue-800' },
    { label: 'Crimson Rose', value: 'from-rose-600 to-red-800' },
  ];

  const generateRandomCode = (baseName: string) => {
    const slug = baseName
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 6) || 'STUDY';
    const rand = Math.floor(100 + Math.random() * 900);
    return `${slug}-${rand}`;
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setError('');
    // Auto generate code if user hasn't explicitly customized it
    if (!code || code.includes('-')) {
      const slug = val
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6);
      if (slug) {
        setCode(`${slug}-${new Date().getFullYear()}`);
      }
    }
  };

  const toggleSubject = (subjId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjId) ? prev.filter(s => s !== subjId) : [...prev, subjId]
    );
  };

  const handleAddNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const codeToUse = newSubjCode.trim() 
      ? newSubjCode.trim().toUpperCase() 
      : newSubjName.slice(0, 3).toUpperCase() + '101';

    const created = addSubject({
      name: newSubjName.trim(),
      code: codeToUse,
    });

    setSelectedSubjects(prev => [...prev, created.id]);
    setNewSubjName('');
    setNewSubjCode('');
    setShowAddSubject(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a community name (e.g., CSE Section B).');
      return;
    }

    const codeToUse = code.trim() ? code.trim().toUpperCase().replace(/\s+/g, '-') : generateRandomCode(name);

    if (selectedSubjects.length === 0) {
      setError('Please select or add at least one subject for this community.');
      return;
    }

    try {
      const newComm = createCommunity({
        name: name.trim(),
        code: codeToUse,
        description: description.trim() || `Class community for ${name.trim()} students.`,
        category,
        subjects: selectedSubjects,
        avatar: selectedAvatar,
        bannerGradient: selectedGradient,
      });

      handleModalClose();
      setName('');
      setCode('');
      setDescription('');
      navigate(`/communities/${newComm.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to create community.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in overflow-y-auto"
      onClick={handleModalClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Create Your Own Community</h3>
              <p className="text-[11px] text-slate-400">Share study materials with your section, batch, or club</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleModalClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Live Preview Card */}
          <div className={`h-24 bg-gradient-to-r ${selectedGradient} rounded-2xl p-4 flex items-center justify-between text-white shadow-md relative overflow-hidden`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-white/90 backdrop-blur-xs w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0">
                {selectedAvatar}
              </span>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm sm:text-base truncate">
                  {name || 'Community Name Preview'}
                </h4>
                <p className="text-xs text-white/80 flex items-center gap-2">
                  <span>{category}</span>
                  <span>•</span>
                  <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                    {code || 'CODE-2026'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Error Callout */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Community Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Community Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. CSE Section B, AI & ML Study Hub, Semester 5"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              autoFocus
            />
          </div>

          {/* Avatar and Theme Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Choose Icon / Avatar
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedAvatar(emoji)}
                    className={`w-7 h-7 flex items-center justify-center text-sm rounded-lg transition-transform ${
                      selectedAvatar === emoji ? 'scale-125 bg-blue-100 ring-2 ring-blue-500' : 'hover:scale-110'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Theme Color
              </label>
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {gradientOptions.map(grad => (
                  <button
                    key={grad.value}
                    type="button"
                    onClick={() => setSelectedGradient(grad.value)}
                    className={`w-7 h-7 rounded-lg bg-gradient-to-r ${grad.value} transition-transform ${
                      selectedGradient === grad.value ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'
                    }`}
                    title={grad.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Invite Code & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Invite Code
                </label>
                <button
                  type="button"
                  onClick={() => setCode(generateRandomCode(name))}
                  className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
                >
                  <Dices className="w-3 h-3" />
                  <span>Randomize</span>
                </button>
              </div>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CSEB-2026"
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
                <option value="Department">Department Hub</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What materials and topics will members share here?"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden resize-none"
            />
          </div>

          {/* Subjects Selection & Inline Subject Creator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Subjects Included *
              </label>
              <button
                type="button"
                onClick={() => setShowAddSubject(!showAddSubject)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Subject</span>
              </button>
            </div>

            {/* Custom Subject Form */}
            {showAddSubject && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl mb-2.5 space-y-2 animate-fade-in text-xs">
                <span className="font-bold text-blue-900 block text-[11px]">
                  Add a New Subject to StudySpace:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newSubjName}
                    onChange={(e) => setNewSubjName(e.target.value)}
                    placeholder="Subject Name (e.g. AI / DBMS)"
                    className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-xs focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={(e) => setNewSubjCode(e.target.value.toUpperCase())}
                    placeholder="Code (e.g. CS305)"
                    className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-xs uppercase font-mono focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSubject(false)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewSubject}
                    disabled={!newSubjName.trim()}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Subject
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
              {subjects.map(subj => {
                const isSelected = selectedSubjects.includes(subj.id);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => toggleSubject(subj.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{subj.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Create Community & Become Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
