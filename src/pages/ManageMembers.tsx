import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { VaultMember } from '../types';
import { saveInvitation } from '../services/firestore';
import MemberCard from '../components/MemberCard';
import { UserPlus, Search, X, Send, Mail, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

const ManageMembers: React.FC = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  const [members, setMembers] = useState<VaultMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor' | 'owner'>('viewer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock members data - Replace with Firebase queries
    const mockMembers: VaultMember[] = [
      {
        id: '1',
        email: 'sophia@example.com',
        name: 'Sophia Carter',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        role: 'owner',
        status: 'active',
        joinedAt: new Date('2023-01-01')
      },
      {
        id: '2',
        email: 'ethan@example.com',
        name: 'Ethan Carter',
        avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg',
        role: 'editor',
        status: 'active',
        joinedAt: new Date('2023-02-15')
      },
      {
        id: '3',
        email: 'olivia@example.com',
        name: 'Olivia Carter',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        role: 'viewer',
        status: 'pending',
        joinedAt: new Date('2023-03-20')
      }
    ];

    setMembers(mockMembers);
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (memberId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    setMembers(prev =>
      prev.map(member =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    showSuccess('Role Updated', `Member role changed to ${newRole}`);
    // TODO: Update role in Firebase
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      showError('Authentication Error', 'You must be logged in to send invitations');
      return;
    }

    setLoading(true);

    try {
      // Show immediate feedback
      showInfo('Saving Invitation', 'Saving invitation to database...');
      
      // Save invitation to Firestore (this will work)
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
        name: inviteEmail.split('@')[0], // Temporary name until they join
        avatar: '',
        role: inviteRole,
        status: 'pending',
        joinedAt: new Date()
      };

      setMembers(prev => [...prev, newMember]);
      setInviteEmail('');
      setInviteRole('viewer');
      setShowInviteForm(false);
      
      // Show alternative invitation methods
      showWarning(
        'Invitation Saved!', 
        'Invitation saved to database. Since Firebase email links require Firebase hosting, please manually share the app link with the invited user.'
      );
      
    } catch (error: any) {
      console.error('Failed to save invite:', error);
      showError('Invitation Failed', 'Failed to save invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

            {/* Alternative Invitation Info */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm mb-1">Alternative Invitation Method</h4>
                  <p className="text-blue-200 text-xs leading-relaxed mb-2">
                    Since this app is deployed on Netlify (not Firebase hosting), automatic email invitations aren't available. The invitation will be saved to the database, and you can manually share the app link.
                  </p>
                  <a 
                    href="https://dashing-ganache-46c719.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-xs"
                  >
                    App Link <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
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
    </div>
  );
};

export default ManageMembers;