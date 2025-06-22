import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { uploadToCloudinary } from '../services/cloudinary';
import { createMemory } from '../services/firestore';
import { Camera, Video, Music, FileText, Upload, X } from 'lucide-react';
import { logActivity } from '../utils/logActivity';

interface FilePreview {
  file: File;
  id: string;
  preview?: string;
}

const UploadPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FilePreview[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video' | 'audio' | 'text'>('photo');
  const [privacy, setPrivacy] = useState<'auto-approved' | 'admin-reviewed' | 'personal'>('auto-approved');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FilePreview[] = Array.from(selectedFiles).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setFiles(prev => [...prev, ...newFiles]);

    if (newFiles.length === 1) {
      showSuccess('File Selected', `${newFiles[0].file.name} ready for upload`);
    } else {
      showSuccess('Files Selected', `${newFiles.length} files ready for upload`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    showSuccess('File Removed', 'File removed from upload queue');
  };

  const handleContentTypeSelect = (type: 'photo' | 'video' | 'audio' | 'text') => {
    setContentType(type);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showError('Missing Title', 'Please enter a title for your memory');
      return;
    }

    if (files.length === 0 && contentType !== 'text') {
      showError('No Files Selected', 'Please select at least one file to upload');
      return;
    }

    if (!currentUser) {
      showError('Authentication Error', 'You must be logged in to upload memories');
      return;
    }

    setUploading(true);

    try {
      let mediaUrl = '';

      if (files.length > 0) {
        showSuccess('Upload Started', 'Uploading your files to Cloudinary...');
        const firstFile = files[0];
        setUploadProgress(prev => ({ ...prev, [firstFile.id]: 10 }));

        try {
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const current = prev[firstFile.id] || 10;
              if (current < 90) {
                return { ...prev, [firstFile.id]: current + 10 };
              }
              return prev;
            });
          }, 200);

          mediaUrl = await uploadToCloudinary(firstFile.file);

          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [firstFile.id]: 100 }));

          showSuccess('Upload Complete', `${firstFile.file.name} uploaded successfully!`);
        } catch (error) {
          console.error(`Failed to upload ${firstFile.file.name}:`, error);
          showError('Upload Failed', `Failed to upload ${firstFile.file.name}`);
          throw error;
        }
      }

      showSuccess('Saving Memory', 'Saving your memory to the vault...');

      // HERE is the important change: only set "approved: false" for admin-reviewed
      const memoryData = {
        title: title.trim(),
        description: description.trim(),
        mediaUrl: mediaUrl || '',
        mediaType: contentType,
        uploaderId: currentUser.uid,
        uploaderName: currentUser.displayName || currentUser.email || 'Unknown User',
        privacy,
        tags: [],
        reactions: {},
        vaultId: 'default-vault', // Replace with actual vault ID if needed
        ...(privacy === 'admin-reviewed' ? { approved: false } : {}) // <-- Only add this for admin-reviewed
      };

      const memoryId = await createMemory(memoryData);

      await logActivity({
        user: currentUser.displayName || currentUser.email || 'Unknown User',
        avatar: currentUser.photoURL || '',
        action: 'uploaded a new memory',
        target: title.trim(),
        type: contentType,
      });

      showSuccess('Memory Saved!', 'Your memory has been successfully added to the vault');

      setFiles([]);
      setTitle('');
      setDescription('');
      setContentType('photo');
      setPrivacy('auto-approved');
      setUploadProgress({});

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      showError('Upload Failed', 'Failed to save your memory. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-8 h-8 mb-1" />;
      case 'video': return <Video className="w-8 h-8 mb-1" />;
      case 'audio': return <Music className="w-8 h-8 mb-1" />;
      case 'text': return <FileText className="w-8 h-8 mb-1" />;
      default: return <Camera className="w-8 h-8 mb-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#181411] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[rgba(56,47,41,0.5)] backdrop-blur-lg border border-[rgba(83,70,60,0.7)] rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8 font-serif">Upload a New Memory</h1>

          {/* File Upload Area */}
          <div
            className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[rgba(83,70,60,0.7)] px-6 py-14 mb-8 hover:border-[#e9883e] transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-[#b8a99d]" />
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Drag & drop files here</p>
              <p className="text-sm text-[#b8a99d]">or click to browse</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="mb-8 space-y-3">
              {files.map((filePreview) => (
                <div
                  key={filePreview.id}
                  className="flex items-center gap-4 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg"
                >
                  {filePreview.preview ? (
                    <img src={filePreview.preview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-[#382f29] rounded flex items-center justify-center">
                      {getContentTypeIcon('file')}
                    </div>
                  )}
                  <span className="text-sm font-medium flex-1 truncate">{filePreview.file.name}</span>
                  {uploadProgress[filePreview.id] !== undefined && (
                    <div className="w-24 bg-[#382f29] rounded-full h-2">
                      <div
                        className="bg-[#e9883e] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[filePreview.id]}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(filePreview.id);
                    }}
                    className="text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Content Type Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-3 font-serif">Select Content Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { type: 'photo', label: 'Photo', icon: 'photo' },
                  { type: 'video', label: 'Video', icon: 'video' },
                  { type: 'audio', label: 'Audio', icon: 'audio' },
                  { type: 'text', label: 'Text', icon: 'text' }
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleContentTypeSelect(type as any)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl h-24 text-sm font-medium transition-all duration-200 ${
                      contentType === type
                        ? 'bg-[#e9883e] text-[#181411] scale-105 shadow-lg'
                        : 'bg-[rgba(56,47,41,0.5)] border border-[rgba(83,70,60,0.7)] hover:bg-opacity-70 hover:scale-102'
                    }`}
                  >
                    {getContentTypeIcon(icon)}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#b8a99d]">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-[rgba(56,47,41,0.5)] backdrop-blur-sm border-none rounded-xl px-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e] transition-all"
                  placeholder="Give your memory a title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-[#b8a99d]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-[rgba(56,47,41,0.5)] backdrop-blur-sm border-none rounded-xl px-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e] resize-none transition-all"
                  placeholder="Add a description (optional)"
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div>
              <h3 className="text-xl font-semibold mb-3 font-serif">Privacy Settings</h3>
              <div className="space-y-3">
                {[
                  {
                    value: 'auto-approved',
                    title: 'Auto-Approved',
                    description: 'Automatically approved for all family members'
                  },
                  {
                    value: 'admin-reviewed',
                    title: 'Admin-Reviewed',
                    description: 'Requires admin approval before sharing'
                  },
                  {
                    value: 'personal',
                    title: 'Personal',
                    description: 'Only visible to you'
                  }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      privacy === option.value
                        ? 'border-[#e9883e] bg-[rgba(233,136,62,0.1)] scale-102'
                        : 'border-[rgba(83,70,60,0.7)] hover:border-[#e9883e] hover:bg-[rgba(233,136,62,0.05)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={option.value}
                      checked={privacy === option.value}
                      onChange={(e) => setPrivacy(e.target.value as any)}
                      className="w-5 h-5 text-[#e9883e] bg-transparent border-2 border-[rgba(83,70,60,0.7)] focus:ring-[#e9883e] focus:ring-offset-0"
                    />
                    <div>
                      <p className="font-medium">{option.title}</p>
                      <p className="text-sm text-[#b8a99d]">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !title.trim()}
              className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 ${
                uploading || !title.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#e9883e] text-[#181411] hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#181411] border-t-transparent rounded-full animate-spin"></div>
                  Uploading Memory...
                </div>
              ) : (
                'Upload Memory'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
