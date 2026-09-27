import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  FileCheck
} from 'lucide-react';
import { ResourceType, Community, Subject } from '../../types';
import { useData } from '../../context/DataContext';

interface UploadResourceModalProps {
  communityId?: string;
  defaultSubjectId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  communityId: initialCommunityId,
  defaultSubjectId,
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const { 
    isUploadResourceOpen,
    closeUploadResource,
    uploadTargetCommunityId,
    uploadTargetSubjectId,
    communities, 
    userCommunities, 
    subjects, 
    uploadResource 
  } = useData();

  const isModalOpen = propIsOpen !== undefined ? propIsOpen : isUploadResourceOpen;
  const handleModalClose = () => {
    if (propOnClose) propOnClose();
    closeUploadResource();
  };

  const commIdToUse = initialCommunityId || uploadTargetCommunityId || userCommunities[0]?.id || communities[0]?.id || '';
  const subjIdToUse = defaultSubjectId || uploadTargetSubjectId || subjects[0]?.id || '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('pdf');
  const [targetCommunityId, setTargetCommunityId] = useState<string>(commIdToUse);
  const [targetSubjectId, setTargetSubjectId] = useState<string>(subjIdToUse);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Upload simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Size check (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File exceeds the 50 MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage('');
      if (!title) {
        setTitle(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide a title for the study resource.');
      return;
    }

    if (!targetCommunityId) {
      setErrorMessage('Please select a community to share this resource with.');
      return;
    }

    if (!targetSubjectId) {
      setErrorMessage('Please select an academic subject.');
      return;
    }

    if (type === 'pdf' || type === 'document' || type === 'image') {
      if (!selectedFile && !linkUrl) {
        setErrorMessage('Please select a document or paste a valid file URL.');
        return;
      }
    } else {
      if (!linkUrl.trim()) {
        setErrorMessage('Please provide a valid web or video URL.');
        return;
      }
    }

    // Start upload simulation with realistic progress bar
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    let resourceUrl = linkUrl.trim() || 'https://example.com/sample.pdf';
    if (selectedFile) {
      try {
        resourceUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(URL.createObjectURL(selectedFile));
          reader.readAsDataURL(selectedFile);
        });
      } catch {
        resourceUrl = URL.createObjectURL(selectedFile);
      }
    }

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus('success');

      const fileSize = selectedFile 
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
        : type === 'video' ? 'Stream' : 'Web Link';

      uploadResource({
        title: title.trim(),
        description: description.trim() || 'Shared study notes uploaded to community archive.',
        type,
        url: resourceUrl,
        communityId: targetCommunityId,
        subjectId: targetSubjectId,
        size: fileSize,
      });

      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('idle');
        setUploadProgress(0);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setLinkUrl('');
        handleModalClose();
      }, 700);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Upload Study Resource</h3>
          </div>
          <button 
            type="button"
            onClick={handleModalClose} 
            disabled={isUploading}
            className="p-1 text-slate-400 hover:text-slate-600 rounded disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Target Community & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Community
              </label>
              <select
                value={targetCommunityId}
                onChange={(e) => setTargetCommunityId(e.target.value)}
                disabled={isUploading}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden bg-white"
              >
                {communities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.avatar} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Subject
              </label>
              <select
                value={targetSubjectId}
                onChange={(e) => setTargetSubjectId(e.target.value)}
                disabled={isUploading}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden bg-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resource Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Resource Type
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: 'pdf', label: 'PDF Notes', Icon: FileText },
                { id: 'video', label: 'YouTube / Video', Icon: Video },
                { id: 'link', label: 'External Link', Icon: LinkIcon },
                { id: 'image', label: 'Diagram / Image', Icon: ImageIcon },
              ].map(item => {
                const isSelected = type === item.id;
                const IconComponent = item.Icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as ResourceType)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border-blue-400 font-semibold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mb-1" />
                    <span className="text-[11px] truncate w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resource Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DSA Lecture 1 - Complexity & Arrays.pdf"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* File Upload Zone or URL Input based on type */}
          {type === 'pdf' || type === 'image' || type === 'document' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select File or Drop here
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={type === 'pdf' ? '.pdf' : type === 'image' ? 'image/*' : '*'}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-medium">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-semibold">{selectedFile.name}</span>
                    <span className="text-slate-400">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-600">
                      Click to browse or drag and drop your {type.toUpperCase()} file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Maximum size 50 MB</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resource Web URL / Video Link
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder={type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Topics Covered
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Unit 1 slides covering time complexity and Big-O notation..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between text-xs text-blue-900 font-medium">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  {uploadStatus === 'success' ? 'Resource Published!' : 'Uploading & processing...'}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-40"
            >
              {isUploading ? 'Publishing...' : 'Share with Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
