import React, { useState, useEffect } from 'react';
import { X, Tag, Plus, Check } from 'lucide-react';
import { PersonalReference } from '../../types';
import { useData } from '../../context/DataContext';

interface PersonalTagsModalProps {
  reference: PersonalReference | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalTagsModal: React.FC<PersonalTagsModalProps> = ({
  reference,
  isOpen,
  onClose,
}) => {
  const { updatePersonalTags } = useData();
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (reference) {
      setTags(reference.personalTags || []);
    }
  }, [reference]);

  if (!isOpen || !reference) return null;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newTagInput.trim().replace(/^#/, '');
    if (!formatted || tags.includes(formatted)) return;
    const updated = [...tags, formatted];
    setTags(updated);
    setNewTagInput('');
    updatePersonalTags(reference.id, updated);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    updatePersonalTags(reference.id, updated);
  };

  const quickSuggestions = ['Midsem Exam', 'Endsem Prep', 'Must Watch', 'Numerical Practice', 'Formula Sheet', 'High Priority'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Personal Tags</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Personal tags help you categorize study materials across multiple classes in your private workspace.
          </p>

          {/* Active Tags */}
          <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No tags added yet.</span>
            ) : (
              tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-lg"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-950 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Tag Input */}
          <form onSubmit={handleAddTag} className="flex items-center gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Type tag name and press Enter..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={!newTagInput.trim()}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map(sug => {
                const isSelected = tags.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      if (!isSelected) {
                        const updated = [...tags, sug];
                        setTags(updated);
                        updatePersonalTags(reference.id, updated);
                      }
                    }}
                    disabled={isSelected}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                      isSelected 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    + {sug}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
