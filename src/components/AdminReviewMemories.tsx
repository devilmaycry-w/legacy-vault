import React, { useEffect, useState } from 'react';
import { getMemories, updateMemory, deleteMemory } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';

const AdminReviewMemories: React.FC = () => {
  const { currentUser } = useAuth();
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      if (!currentUser) {
        setMemories([]);
        setLoading(false);
        return;
      }
      const allMemories = await getMemories(currentUser);
      const reviewMemories = allMemories.filter(
        (m: any) => m.privacy === 'admin-reviewed' && !m.approved
      );
      setMemories(reviewMemories);
      setLoading(false);
    };
    fetchMemories();
  }, [currentUser]);

  // Approve a memory
  const handleApprove = async (memoryId: string) => {
    await updateMemory(memoryId, { approved: true });
    setMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  // Delete a memory
  const handleDelete = async (memoryId: string) => {
    await deleteMemory(memoryId);
    setMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  if (!currentUser) {
    return <div>Please log in as an admin to review memories.</div>;
  }

  // Optional: Only allow admins
  if (currentUser.role && currentUser.role !== 'admin') {
    return <div>Access denied. Admins only.</div>;
  }

  if (loading) return <div>Loading pending admin-reviewed memories...</div>;
  if (memories.length === 0) return <div>No memories pending admin review.</div>;

  return (
    <div>
      <h2>Pending Admin Review</h2>
      <ul>
        {memories.map(memory => (
          <li key={memory.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <div><strong>Title:</strong> {memory.title}</div>
            <div><strong>Description:</strong> {memory.description}</div>
            <div><strong>Uploader:</strong> {memory.uploaderName || memory.uploaderId}</div>
            <div>
              <button onClick={() => handleApprove(memory.id)} style={{ marginRight: 10 }}>
                Approve
              </button>
              <button onClick={() => handleDelete(memory.id)}>
                Reject/Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReviewMemories;
