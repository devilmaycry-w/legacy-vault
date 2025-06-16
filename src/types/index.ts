export interface Memory {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video' | 'audio' | 'text';
  uploaderId: string;
  uploaderName: string;
  createdAt: Date;
  privacy: 'auto-approved' | 'admin-reviewed' | 'personal';
  tags: string[];
  reactions: Record<string, number>;
  vaultId: string;
}

export interface VaultMember {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  joinedAt: Date;
}

export interface Comment {
  id: string;
  memoryId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

export interface Vault {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  ownerId: string;
  createdAt: Date;
  members: VaultMember[];
}

export interface Invitation {
  id: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  invitedByUserId: string;
  invitedByUserName: string;
  vaultId: string;
  createdAt: Date;
  acceptedAt?: Date;
}