import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { VaultMember } from '../types';
import { saveInvitation } from '../services/firestore';
import MemberCard from '../components/MemberCard';
import { UserPlus, Search, X, Send, ExternalLink } from 'lucide-react';

// Firestore imports
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Make sure this path is correct

const APP_LINK = 'https://legacy-memories.netlify.app/';

const ManageMembers: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [members, setMembers] = useState<VaultMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor' | 'owner'>('viewer');
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Real-time Firestore listener
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) => {
        const users: VaultMember[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            name: data.name || data.email?.split('@')[0] || 'Unknown',
            avatar: data.avatar || '',
            role: data.role || 'viewer',
            status: data.status || 'active',
            joinedAt: data.joinedAt?.toDate ? data.joinedAt.toDate() : new Date(),
          };
        });
        setMembers(users);
      },
      (error) => {
        showError('Realtime fetch failed', error.message);
      }
    );
    // Cleanup on unmount
    return () => unsubscribe();
  }, [showError]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only owner can change roles
  const handleRoleChange = async (memberId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    // Find the current user in the members list
    const currentUserInfo = members.find(m => m.email === currentUser?.email);

    // Only allow owners to change roles
    if (!currentUserInfo || currentUserInfo.role !== 'owner') {
      showWarning(
        'Sit Back & Enjoy!',
        'Role changes can only be done by admin. So sit back and enjoy! 😎'
      );
      return;
    }

    setMembers(prev =>
      prev.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    showSuccess('Role Updated', `Member role changed to ${newRole}`);

    // Update role in Firestore
    try {
      await updateDoc(doc(db, 'users', memberId), { role: newRole });
    } catch (error: any) {
      showError('Failed to update role in Firestore', error.message);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(APP_LINK);
    showSuccess('Link Copied!', 'App link copied to clipboard.');
  };

  // Share link to WhatsApp
  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`Join our family vault: ${APP_LINK}`)}`;
    window.open(url, '_blank');
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showError('Authentication Error', 'You must be logged in to send invitations');
      return;
    }

    setLoading(true);

    try {
      showInfo('Saving Invitation', 'Saving invitation to database...');
      const invitationData = {
        email: inviteEmail,
        role: inviteRole,
        status: 'pending' as const,
        invitedByUserId: currentUser.uid,
        invitedByUserName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Family Member',
        vaultId: 'default-vault' // Replace with actual vault ID when vault system is implemented
      };

      await saveInvitation(invitationData);

      // Add pending member to local state for immediate UI feedback
      const newMember: VaultMember = {
        id: Date.now().toString(),
        email: inviteEmail,
        name: inviteEmail.split('@')[0],
        avatar: '',
        role: inviteRole,
        status: 'pending',
        joinedAt: new Date()
      };

      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('viewer');
      setShowShare(true); // Show share modal
    } catch (error: any) {
      console.error('Failed to save invite:', error);
      showError('Invitation Failed', 'Failed to save invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Find the current user info for conditional UI (optional, e.g., to pass to MemberCard)
  const currentUserInfo = members.find(m => m.email === currentUser?.email);

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif">Manage Members</h1>
            <button
              onClick={() => setShowInviteForm(true)}
              className="flex items-center justify-center gap-2 bg-[#e9883e] text-[#181411] font-bold px-4 sm:px-6 py-3 rounded-full hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Invite New Member</span>
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#b8a99d]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members by name or email..."
                className="w-full bg-[#2c2520] border-none rounded-full pl-12 pr-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e]"
              />
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onRoleChange={handleRoleChange}
                canEditRoles={true}
              />
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#b8a99d] mb-4">No members found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[rgba(24,20,17,0.95)] backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-[#382f29] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white font-serif">Invite a New Member</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-[#b8a99d] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#b8a99d] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full bg-[#2c2520] border border-[#382f29] rounded-lg px-4 py-3 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-2 focus:ring-[#e9883e] focus:border-[#e9883e]"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#b8a99d] mb-1">
                  Assign Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'viewer' | 'editor' | 'owner')}
                  className="w-full bg-[#2c2520] border border-[#382f29] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e9883e] focus:border-[#e9883e] appearance-none"
                >
                  <option value="viewer">Viewer - Can view memories</option>
                  <option value="editor">Editor - Can upload and edit</option>
                  <option value="owner">Owner - Full access (Use with caution)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !inviteEmail.trim()}
                className={`w-full flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-lg transition-all duration-200 ${
                  loading || !inviteEmail.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#e9883e] text-[#181411] hover:opacity-90 hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#181411] border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Invitation...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Save Invitation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Share Link Modal */}
      {showShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[rgba(24,20,17,0.95)] backdrop-blur-md rounded-2xl p-6 w-full max-w-xs border border-[#382f29]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white font-serif">Share App Link</h4>
              <button
                onClick={() => {
                  setShowShare(false);
                  setShowInviteForm(false);
                }}
                className="text-[#b8a99d] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-[#2c2520] rounded-lg px-3 py-2">
                <span className="text-[#e9883e] font-mono text-xs break-all">{APP_LINK}</span>
                <button onClick={handleCopyLink} className="ml-auto text-[#e9883e] hover:text-white transition">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#1EBE5D] transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M16.003 4.003a11.963 11.963 0 0 0-10.438 17.35L4 28l6.779-1.56A11.963 11.963 0 1 0 16.003 4.003zm0 2.17a9.78 9.78 0 0 1 8.607 14.573l-.183.312.444 2.523-2.59-.43-.3.177a9.779 9.779 0 1 1-6.978-17.155zm-5.495 6.38c-.17.005-.342.032-.508.082-.515.151-.844.641-.737 1.156.19 1.017.68 2.017 1.39 2.918.817 1.033 2.06 2.216 3.812 2.697 1.014.27 1.844.218 2.483.055.541-.14.831-.77.554-1.27l-.797-1.448c-.17-.312-.542-.454-.872-.343l-.716.242a.302.302 0 0 1-.234-.017c-.53-.265-1.537-1.034-2.121-2.273a.292.292 0 0 1-.012-.245l.253-.695a.713.713 0 0 0-.367-.893l-1.483-.727a.873.873 0 0 0-.139-.035z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
