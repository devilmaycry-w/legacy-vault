
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Memory, Comment } from '../types';
import { getMemoryById } from '../services/firestore';
import AudioPlayer from '../components/AudioPlayer';
import { Home, Share, Download, Play, ArrowLeft } from 'lucide-react';
import { db } from '../services/firebase';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const reactionEmojis = ['❤️', '😂', '😢', '😮'];

const MemoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper function to get user initials for fallback avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get display name
  const getDisplayName = () => {
    if (!currentUser) return 'User';
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  // Helper function to get user avatar
  const getUserAvatar = () => {
    return currentUser?.photoURL || null;
  };

  // Fetch memory details
  useEffect(() => {
    const loadMemory = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedMemory = await getMemoryById(id);
        if (fetchedMemory) {
          setMemory({ ...fetchedMemory, id });
        }
      } catch (error) {
        console.error('Error loading memory:', error);
        showError('Failed to Load Memory', 'Could not load the memory details.');
      } finally {
        setLoading(false);
      }
    };
    loadMemory();
  }, [id, showError]);

  // Listen for comments in Firestore
  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'memories', id, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
    return unsubscribe;
  }, [id]);

  // Refresh memory after reaction
  const refreshMemory = async () => {
    if (!id) return;
    const docRef = doc(db, 'memories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setMemory({ ...docSnap.data(), id } as Memory);
    }
  };

  // Handle reaction click
  const handleReaction = async (emoji: string) => {
    if (!memory || !currentUser) return;
    const memoryRef = doc(db, 'memories', memory.id);
    const currentReactions: string[] = Array.isArray(memory.reactions?.[emoji]) ? memory.reactions[emoji] : [];
    const hasReacted = currentReactions.includes(currentUser.uid);

    try {
      await updateDoc(memoryRef, {
        [`reactions.${emoji}`]: hasReacted
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });
      showSuccess(
        hasReacted ? 'Reaction Removed' : 'Reaction Added',
        hasReacted
          ? `You removed your ${emoji} reaction`
          : `You reacted with ${emoji}`
      );
      refreshMemory();
    } catch (error) {
      showError('Reaction Failed', 'Could not update your reaction.');
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !memory?.id) return;

    try {
      await addDoc(collection(db, 'memories', memory.id, 'comments'), {
        content: newComment.trim(),
        userId: currentUser.uid,
        userName: getDisplayName(),
        userAvatar: getUserAvatar() || '',
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      showSuccess('Comment Added', 'Your comment has been posted!');
    } catch (error) {
      showError('Comment Failed', 'Could not post your comment.');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && memory) {
        await navigator.share({
          title: memory.title,
          text: memory.description,
          url: window.location.href,
        });
        showSuccess('Shared Successfully', 'Memory shared!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('Link Copied', 'Memory link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showError('Share Failed', 'Could not share the memory.');
    }
  };

  const handleDownload = () => {
    if (memory?.mediaUrl) {
      const link = document.createElement('a');
      link.href = memory.mediaUrl;
      link.download = `${memory.title}.${memory.mediaType === 'audio' ? 'mp3' : 'jpg'}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('Download Started', 'Memory download initiated!');
    } else {
      showError('Download Failed', 'No media available for download.');
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date instanceof Date ? date : date.toDate?.() || new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#e9883e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b8a99d]">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-[#181411] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Memory not found</h2>
          <Link to="/dashboard" className="text-[#e9883e] hover:underline flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181411] text-white">
      {/* Background blur effect */}
      {memory.mediaType === 'photo' && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-lg brightness-50"
          style={{ backgroundImage: `url("${memory.mediaUrl}")` }}
        />
      )}

      <div className="relative z-10 p-4 md:p-8">
        {/* Back button */}
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-[#b8a99d] hover:text-[#e9883e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full max-w-6xl mx-auto">
          {/* Media Display */}
          <div className="w-full lg:w-3/4">
            {memory.mediaType === 'audio' ? (
              <AudioPlayer audioUrl={memory.mediaUrl} title={memory.title} />
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                {memory.mediaType === 'photo' ? (
                  <img
                    src={memory.mediaUrl}
                    alt={memory.title}
                    className="w-full h-full object-contain"
                  />
                ) : memory.mediaType === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={memory.mediaUrl}
                      alt={memory.title}
                      className="w-full h-full object-contain"
                    />
                    <button className="absolute flex items-center justify-center w-16 h-16 bg-black/50 rounded-full text-white hover:bg-[#e9883e] transition-colors">
                      <Play className="w-8 h-8" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#382f29] to-[#181411]">
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold mb-4">{memory.title}</h3>
                      <p className="text-[#b8a99d]">{memory.description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4 lg:gap-6">
            {/* Memory Details */}
            <div className="bg-[rgba(56,47,41,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-[#e9883e] mb-3 font-serif">{memory.title}</h3>
              {memory.description && (
                <p className="text-[#b8a99d] text-sm mb-3 leading-relaxed">{memory.description}</p>
              )}
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-white">Uploaded by:</span> <span className="text-[#b8a99d]">{memory.uploaderName}</span></p>
                <p><span className="font-medium text-white">Date:</span> <span className="text-[#b8a99d]">{formatDate(memory.createdAt)}</span></p>
                {memory.tags.length > 0 && (
                  <div className="mt-3">
                    <span className="font-medium text-white text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {memory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-[#382f29] text-[#e9883e] text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reactions */}
            <div className="bg-[rgba(56,47,41,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-3 shadow-lg">
              <div className="grid grid-cols-4 gap-2">
                {reactionEmojis.map((emoji) => {
                  const users: string[] = Array.isArray(memory.reactions?.[emoji]) ? memory.reactions[emoji] : [];
                  const userReacted = currentUser && users.includes(currentUser.uid);
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`text-2xl transition-transform flex flex-col items-center p-2 rounded-lg hover:bg-[rgba(233,136,62,0.1)] ${
                        userReacted ? 'scale-110 text-[#e9883e] font-bold' : 'hover:scale-125'
                      }`}
                    >
                      <span>{emoji}</span>
                      <span className="text-xs text-[#b8a99d] mt-1">{users.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Form */}
            <div className="bg-[rgba(56,47,41,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-4 shadow-lg">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border border-[#382f29] rounded-md px-3 py-2 text-white placeholder-[#b8a99d] focus:outline-none focus:ring-1 focus:ring-[#e9883e] resize-none text-sm"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="mt-2 w-full bg-[#e9883e] text-[#181411] py-2 px-4 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="bg-[rgba(56,47,41,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-4 shadow-lg">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center text-white hover:text-[#e9883e] transition-colors group p-2 rounded-lg hover:bg-[rgba(233,136,62,0.1)]"
                >
                  <Share className="w-5 h-5 mb-1" />
                  <span className="text-xs">Share</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center text-white hover:text-[#e9883e] transition-colors group p-2 rounded-lg hover:bg-[rgba(233,136,62,0.1)]"
                >
                  <Download className="w-5 h-5 mb-1" />
                  <span className="text-xs">Download</span>
                </button>
                <Link
                  to="/dashboard"
                  className="flex flex-col items-center text-white hover:text-[#e9883e] transition-colors group p-2 rounded-lg hover:bg-[rgba(233,136,62,0.1)]"
                >
                  <Home className="w-5 h-5 mb-1" />
                  <span className="text-xs">Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-[rgba(56,47,41,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 font-serif">Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    {/* Real User Avatar */}
                    {comment.userAvatar ? (
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#e9883e]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const initialsDiv = document.createElement('div');
                            initialsDiv.className =
                              'w-10 h-10 rounded-full bg-[#e9883e] text-[#181411] flex items-center justify-center text-sm font-bold border-2 border-[#e9883e]';
                            initialsDiv.textContent = getUserInitials(comment.userName);
                            parent.appendChild(initialsDiv);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#e9883e] text-[#181411] flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 border-[#e9883e]">
                        {getUserInitials(comment.userName)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{comment.userName}</span>
                        <span className="text-xs text-[#b8a99d]">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-[#b8a99d] text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryDetail;
