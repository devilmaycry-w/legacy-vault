import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const ProfileAvatar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Unknown';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (!currentUser) return null;

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e9883e] text-[#181411] font-bold text-sm hover:opacity-90 transition-opacity border-2 border-[#382f29] hover:border-[#e9883e]"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[rgba(24,20,17,0.95)] backdrop-blur-md border border-[#382f29] rounded-xl shadow-xl z-50">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#e9883e] text-[#181411] font-bold text-xl">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{displayName}</h3>
                <p className="text-sm text-[#b8a99d]">Family Member</p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#b8a99d] mb-1">Email</label>
                <p className="text-sm text-white">{currentUser.email}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#b8a99d] mb-1">Member Since</label>
                <p className="text-sm text-white">{formatDate(currentUser.metadata.creationTime)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#b8a99d] mb-1">Last Sign In</label>
                <p className="text-sm text-white">{formatDate(currentUser.metadata.lastSignInTime)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#382f29] pt-4">
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full text-left text-sm text-[#b8a99d] hover:text-[#e9883e] transition-colors py-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;