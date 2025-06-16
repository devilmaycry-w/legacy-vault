import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Camera, Edit3, Save, X } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinary';
import { saveVaultSettings, loadVaultSettings } from '../services/vaultStorage';

interface EditableVaultHeaderProps {
  vaultName: string;
  backgroundImage: string;
  onUpdate: (name: string, image: string) => void;
}

const EditableVaultHeader: React.FC<EditableVaultHeaderProps> = ({
  vaultName,
  backgroundImage,
  onUpdate
}) => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(vaultName);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadVaultSettings();
    if (savedSettings) {
      onUpdate(savedSettings.name, savedSettings.backgroundImage);
      setEditName(savedSettings.name);
    }
  }, [onUpdate]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      showSuccess('Uploading Image', 'Updating vault background...');
      
      const imageUrl = await uploadToCloudinary(file);
      
      // Save to local storage
      saveVaultSettings(editName, imageUrl);
      
      onUpdate(editName, imageUrl);
      
      showSuccess('Background Updated', 'Vault background image updated successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      showError('Upload Failed', 'Failed to update background image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (editName.trim() !== vaultName) {
      // Save to local storage
      saveVaultSettings(editName.trim(), backgroundImage);
      
      onUpdate(editName.trim(), backgroundImage);
      showSuccess('Vault Updated', 'Vault name updated successfully!');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(vaultName);
    setIsEditing(false);
  };

  return (
    <section className="relative mb-8">
      <div 
        className="bg-cover bg-center flex flex-col justify-end overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[380px] rounded-2xl shadow-xl relative group"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(24, 20, 17, 0.7) 0%, rgba(24, 20, 17, 0) 40%), url("${backgroundImage}")`
        }}
      >
        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Uploading background...</p>
            </div>
          </div>
        )}

        {/* Edit controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            title="Change background image"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
              title="Edit vault name"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-all duration-200"
                title="Save changes"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all duration-200"
                title="Cancel editing"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Vault title */}
        <div className="p-6 sm:p-8 relative z-10">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-transparent border-b-2 border-[#e9883e] text-white text-3xl sm:text-4xl font-bold font-serif focus:outline-none w-full max-w-md"
              placeholder="Enter vault name"
              autoFocus
            />
          ) : (
            <h1 className="text-white tracking-tight text-3xl sm:text-4xl font-bold font-serif">
              {vaultName}
            </h1>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
          className="hidden"
        />
      </div>
    </section>
  );
};

export default EditableVaultHeader;