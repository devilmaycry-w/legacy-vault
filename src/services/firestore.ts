import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  enableNetwork,
  disableNetwork,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, checkFirestoreConnection } from './firebase';
import { Memory, Invitation, VaultMember } from '../types';

// Enhanced error handling wrapper
const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  retries: number = 3
): Promise<T> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Check connection before attempting operation
      const isConnected = await checkFirestoreConnection();
      if (!isConnected && attempt === 1) {
        console.warn(`${operationName}: Firestore appears to be offline, attempting operation anyway...`);
      }

      const result = await operation();
      return result;
    } catch (error: any) {
      console.error(`${operationName} attempt ${attempt} failed:`, error);
      
      // If it's a network error and we have retries left, wait and retry
      if (attempt < retries && (
        error.code === 'unavailable' || 
        error.code === 'deadline-exceeded' ||
        error.message?.includes('offline') ||
        error.message?.includes('network')
      )) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
        console.log(`Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's the final attempt or a non-retryable error, throw
      throw error;
    }
  }
  
  throw new Error(`${operationName} failed after ${retries} attempts`);
};

// Vault operations
export const createVault = async (vaultData: any) => {
  return withErrorHandling(
    () => addDoc(collection(db, 'vaults'), {
      ...vaultData,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    'createVault'
  );
};

export const getVault = async (vaultId: string) => {
  return withErrorHandling(
    async () => {
      const docRef = doc(db, 'vaults', vaultId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Vault not found');
      }
    },
    'getVault'
  );
};

export const updateVault = async (vaultId: string, updates: any) => {
  return withErrorHandling(
    () => updateDoc(doc(db, 'vaults', vaultId), {
      ...updates,
      updatedAt: new Date()
    }),
    'updateVault'
  );
};

export const getUserVaults = async (userId: string) => {
  return withErrorHandling(
    async () => {
      const q = query(
        collection(db, 'vaults'),
        where('members', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    'getUserVaults'
  );
};

// Fixed addUserToVault function with correct parameters
export const addUserToVault = async (
  userId: string, 
  email: string, 
  name: string, 
  role: 'owner' | 'editor' | 'viewer', 
  vaultId: string
) => {
  return withErrorHandling(
    async () => {
      const vaultRef = doc(db, 'vaults', vaultId);
      
      // Create a complete VaultMember object
      const memberData: VaultMember = {
        id: userId,
        email,
        name,
        avatar: '', // Will be updated when user uploads avatar
        role,
        status: 'active',
        joinedAt: new Date()
      };
      
      await updateDoc(vaultRef, {
        members: arrayUnion(userId),
        memberDetails: arrayUnion(memberData),
        updatedAt: new Date()
      });
    },
    'addUserToVault'
  );
};

// Memory operations
export const createMemory = async (memoryData: any) => {
  return withErrorHandling(
    () => addDoc(collection(db, 'memories'), {
      ...memoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    'createMemory'
  );
};

export const getMemory = async (memoryId: string) => {
  return withErrorHandling(
    async () => {
      const docRef = doc(db, 'memories', memoryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Memory not found');
      }
    },
    'getMemory'
  );
};

export const getMemoryById = async (memoryId: string): Promise<Memory | null> => {
  return withErrorHandling(
    async () => {
      const docRef = doc(db, 'memories', memoryId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
        } as Memory;
      } else {
        return null;
      }
    },
    'getMemoryById'
  );
};

export const getMemories = async (user: User): Promise<Memory[]> => {
  return withErrorHandling(
    async () => {
      try {
        // First try the original query with composite index
        const q = query(
          collection(db, 'memories'),
          where('vaultId', '==', 'default-vault'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to Date if needed
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
          } as Memory;
        });
      } catch (error: any) {
        // If the composite index is still building, fall back to a simpler query
        if (error.message?.includes('index') || error.message?.includes('building')) {
          console.warn('Composite index still building, using fallback query without ordering');
          
          const fallbackQuery = query(
            collection(db, 'memories'),
            where('vaultId', '==', 'default-vault')
          );
          
          const querySnapshot = await getDocs(fallbackQuery);
          const memories = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
            } as Memory;
          });
          
          // Sort in memory as a temporary workaround
          return memories.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
        }
        
        // Re-throw other errors
        throw error;
      }
    },
    'getMemories'
  );
};

export const getVaultMemories = async (vaultId: string) => {
  return withErrorHandling(
    async () => {
      try {
        // First try the original query with composite index
        const q = query(
          collection(db, 'memories'),
          where('vaultId', '==', vaultId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error: any) {
        // If the composite index is still building, fall back to a simpler query
        if (error.message?.includes('index') || error.message?.includes('building')) {
          console.warn('Composite index still building, using fallback query without ordering');
          
          const fallbackQuery = query(
            collection(db, 'memories'),
            where('vaultId', '==', vaultId)
          );
          
          const querySnapshot = await getDocs(fallbackQuery);
          const memories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort in memory as a temporary workaround
          return memories.sort((a: any, b: any) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
        }
        
        // Re-throw other errors
        throw error;
      }
    },
    'getVaultMemories'
  );
};

export const updateMemory = async (memoryId: string, updates: any) => {
  return withErrorHandling(
    () => updateDoc(doc(db, 'memories', memoryId), {
      ...updates,
      updatedAt: new Date()
    }),
    'updateMemory'
  );
};

export const deleteMemory = async (memoryId: string) => {
  return withErrorHandling(
    () => deleteDoc(doc(db, 'memories', memoryId)),
    'deleteMemory'
  );
};

// Invitation operations
export const saveInvitation = async (invitationData: Omit<Invitation, 'id' | 'createdAt'>) => {
  return withErrorHandling(
    () => addDoc(collection(db, 'invitations'), {
      ...invitationData,
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    'saveInvitation'
  );
};

export const getInvitationByEmail = async (email: string): Promise<Invitation | null> => {
  return withErrorHandling(
    async () => {
      const q = query(
        collection(db, 'invitations'),
        where('email', '==', email),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt
        } as Invitation;
      }
      return null;
    },
    'getInvitationByEmail'
  );
};

export const updateInvitationStatus = async (invitationId: string, status: 'accepted' | 'declined') => {
  return withErrorHandling(
    () => updateDoc(doc(db, 'invitations', invitationId), {
      status,
      acceptedAt: status === 'accepted' ? new Date() : null,
      updatedAt: new Date()
    }),
    'updateInvitationStatus'
  );
};

// Real-time listeners with error handling
export const subscribeToVaultMemories = (vaultId: string, callback: (memories: any[]) => void) => {
  const q = query(
    collection(db, 'memories'),
    where('vaultId', '==', vaultId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, 
    (querySnapshot) => {
      const memories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(memories);
    },
    (error) => {
      console.error('Error in memory subscription:', error);
      // You might want to show a toast notification here
      if (error.code === 'permission-denied') {
        console.error('Permission denied - check Firestore security rules');
      }
    }
  );
};

// Connection utilities
export const forceReconnect = async () => {
  try {
    await disableNetwork(db);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await enableNetwork(db);
    console.log('Firestore reconnection attempted');
  } catch (error) {
    console.error('Failed to reconnect to Firestore:', error);
  }
};