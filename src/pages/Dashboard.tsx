import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Memory, VaultMember } from '../types';
import { getMemories } from '../services/firestore';
import { loadVaultSettingsForUser } from '../services/vaultStorage';
import MemoryCard from '../components/MemoryCard';
import { Plus, Settings } from 'lucide-react';

// Firestore imports for real-time users
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { showError } = useToast();

  const [memories, setMemories] = useState<Memory[]>([]);
  const [members, setMembers] = useState<VaultMember[]>([]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'audio' | 'text'>('all');
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);

  // Static vault header values (default, non-editable)
  const [vaultName, setVaultName] = useState('The Family Vault');
  const [vaultBackground, setVaultBackground] = useState(
    'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg'
  );

  // Load vault settings from Firestore for current user (but not editable here)
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const savedSettings = await loadVaultSettingsForUser(currentUser.uid);
        if (savedSettings) {
          setVaultName(savedSettings.name || 'The Family Vault');
          setVaultBackground(savedSettings.backgroundImage || 'https://i.postimg.cc/wj8D601C/c0a7e1aa519091ad9578e2529686a296.jpg');
        } else if (currentUser.displayName) {
          setVaultName(`The ${currentUser.displayName.split(' ')[0]} Family Vault`);
        }
      } catch (err) {}
    })();
  }, [currentUser]);

  // Load memories for the current user
  useEffect(() => {
    if (!currentUser) return;

    const loadMemories = async () => {
      try {
        setLoading(true);
        setPermissionError(false);

        const fetchedMemories = await getMemories(currentUser);
        setMemories(fetchedMemories);
      } catch (error: any) {
        if (
          error?.code === 'permission-denied' ||
          error?.message?.includes('Missing or insufficient permissions')
        ) {
          setPermissionError(true);
          showError(
            'Permission Denied',
            'Unable to access memories. Please check your Firebase Security Rules or contact your administrator.'
          );
        } else {
          showError('Failed to Load Memories', 'There was an error loading your memories. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, [currentUser, showError]);

  // Real-time listener for members (users collection)
  useEffect(() => {
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
        showError('Failed to fetch members', error.message);
      }
    );
    return () => unsubscribe();
  }, [showError]);

  const filteredMemories = memories.filter(
    (memory) => filter === 'all' || memory.mediaType === filter
  );

  // Find current user info in members (for admin check)
  const currentUserInfo = members.find(m => m.email === currentUser?.email);
  // Helper: is current user admin/owner? (adjust as needed for your role system)
  const isAdmin = currentUserInfo && (currentUserInfo.role === 'admin' || currentUserInfo.role === 'owner');

  // Get the avatar URL or fallback initial for the current user
  const renderUserAvatarCog = () => {
    const size = 'w-9 h-9 sm:w-10 sm:h-10';
    if (currentUserInfo && currentUserInfo.avatar) {
      return (
        <span className="relative inline-block">
          <img
            src={currentUserInfo.avatar}
            alt={currentUserInfo.name}
            className={`rounded-full border-2 border-[#e9883e] bg-[#e9883e] object-cover ${size}`}
          />
          <span className="absolute bottom-[-2px] right-[-2px] bg-[#181411] rounded-full p-0.5">
            <Settings className="w-4 h-4 text-[#e9883e]" />
          </span>
        </span>
      );
    } else {
      // Fallback: use initial
      const initial =
        (currentUserInfo?.name && currentUserInfo.name[0]?.toUpperCase()) ||
        (currentUserInfo?.email && currentUserInfo.email[0]?.toUpperCase()) ||
        '?';
      return (
        <span className="relative inline-block">
          <div
            className={`flex items-center justify-center rounded-full border-2 border-[#e9883e] bg-[#e9883e] text-[#181411] font-bold text-lg ${size}`}
          >
            {initial}
          </div>
          <span className="absolute bottom-[-2px] right-[-2px] bg-[#181411] rounded-full p-0.5">
            <Settings className="w-4 h-4 text-[#e9883e]" />
          </span>
        </span>
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-[#181411] text-white"
      style={{
        backgroundImage: `
          radial-gradient(circle at top left, rgba(233, 136, 62, 0.05), transparent 30%),
          radial-gradient(circle at bottom right, rgba(56, 47, 41, 0.1), transparent 30%)
        `
      }}
    >
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-8">
        {/* Static Hero Section */}
        <div
          className="rounded-2xl shadow-xl mb-8 overflow-hidden relative"
          style={{
            backgroundImage: `url(${vaultBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '180px',
          }}
        >
          <div
            className="bg-[#18141133] p-8 flex flex-col items-start justify-center min-h-[180px]"
          >
            <h1 className="text-3xl font-bold font-serif mb-2" style={{textShadow: '0 2px 6px #181411bb'}}>{vaultName}</h1>
          </div>
        </div>

        {/* Members Section */}
        <section className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold font-serif">Members</h2>
            {/* User avatar + settings cog button */}
            <button
              onClick={() => setAdminDrawerOpen(!adminDrawerOpen)}
              className="flex items-center justify-center focus:outline-none"
              aria-label="Open Admin Tools"
            >
              {renderUserAvatarCog()}
            </button>
          </div>
          <div className="flex items-center -space-x-2 sm:-space-x-3">
            {members.slice(0, 5).map((member) =>
              member.avatar ? (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={`${member.name} (${member.role})`}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 sm:border-3 border-[#181411] hover:scale-110 transition-transform cursor-pointer bg-[#e9883e] object-cover"
                />
              ) : (
                <div
                  key={member.id}
                  title={`${member.name} (${member.role})`}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border-2 sm:border-3 border-[#181411] bg-[#e9883e] text-[#181411] font-bold text-lg sm:text-xl md:text-2xl hover:scale-110 transition-transform cursor-pointer select-none"
                >
                  {(member.name && member.name[0]?.toUpperCase()) ||
                    (member.email && member.email[0]?.toUpperCase()) ||
                    '?'}
                </div>
              )
            )}
            <Link
              to="/members"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#e9883e] text-[#181411] hover:bg-opacity-90 transition-colors ml-1 shadow-md"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Link>
          </div>
        </section>

        {/* Memories Section */}
        <section className="bg-[rgba(56,47,41,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold font-serif">Memories</h2>
            <div className="flex gap-2 flex-wrap w-full sm:w-auto">
              {(['all', 'photo', 'video', 'audio', 'text'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                    filter === filterType
                      ? 'bg-[#e9883e] text-[#181411] shadow-[0_0_10px_0px_#e9883e]'
                      : 'bg-[#382f29] text-[#b8a99d] hover:bg-[#e9883e] hover:text-[#181411]'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'all' ? 's' : 's'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[#b8a99d]">Loading memories...</div>
            </div>
          ) : permissionError ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-red-400 mb-2">Permission Denied</h3>
              <p className="text-[#b8a99d] mb-4 max-w-md mx-auto text-sm">
                Unable to load memories due to insufficient permissions. This usually means your Firebase Security Rules need to be updated.
              </p>
            </div>
          ) : filteredMemories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#b8a99d] mb-4 text-sm sm:text-base">
                {filter === 'all' ? 'No memories found.' : `No ${filter} memories found.`}
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-[#e9883e] text-[#181411] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Your First Memory
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Admin Drawer */}
      {adminDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-full max-w-sm bg-[rgba(24,20,17,0.95)] backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold font-serif">Admin Tools</h3>
              <button
                onClick={() => setAdminDrawerOpen(false)}
                className="text-[#b8a99d] hover:text-[#e9883e] transition-colors"
              >
                ✕
              </button>
            </div>
            <nav className="space-y-3">
              <Link
                to="/members"
                className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                onClick={() => setAdminDrawerOpen(false)}
              >
                Manage Members
              </Link>
              <Link
                to="/settings"
                className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                onClick={() => setAdminDrawerOpen(false)}
              >
                Vault Settings
              </Link>
              <Link
                to="/activity"
                className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                onClick={() => setAdminDrawerOpen(false)}
              >
                Activity Log
              </Link>
              <Link
                to="/storage"
                className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                onClick={() => setAdminDrawerOpen(false)}
              >
                Storage Usage
              </Link>
              {/* Only show to admins/owners if you have a 'role' field */}
              {isAdmin && (
                <Link
                  to="/admin/review"
                  className="block text-[#b8a99d] hover:text-[#e9883e] transition-colors"
                  onClick={() => setAdminDrawerOpen(false)}
                >
                  Review Memories
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
