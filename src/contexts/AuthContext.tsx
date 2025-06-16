import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (user: User, additionalData: any = {}) => {
    if (!user) return;

    // Move destructuring to the beginning of the function
    const { displayName, email, photoURL } = user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          displayName: displayName || email?.split('@')[0] || 'User',
          email,
          photoURL: photoURL || null,
          createdAt,
          updatedAt: createdAt,
          role: 'member',
          status: 'active',
          preferences: {
            notifications: true,
            privacy: 'family'
          },
          ...additionalData
        });
        console.log('User document created successfully');
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      // Update existing user document with latest info
      try {
        await setDoc(userRef, {
          displayName: displayName || userSnap.data().displayName,
          email,
          photoURL: photoURL || userSnap.data().photoURL,
          updatedAt: serverTimestamp(),
          ...additionalData
        }, { merge: true });
        console.log('User document updated successfully');
      } catch (error) {
        console.error('Error updating user document:', error);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update user document on login
    await createUserDocument(result.user);
  };

  const signup = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Set a display name based on email
    const displayName = email.split('@')[0];
    await updateProfile(result.user, {
      displayName: displayName
    });

    // Create user document in Firestore
    await createUserDocument(result.user, {
      signupMethod: 'email',
      isNewUser: true
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Create or update user document in Firestore
    await createUserDocument(result.user, {
      signupMethod: 'google',
      isNewUser: result.user.metadata.creationTime === result.user.metadata.lastSignInTime
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Ensure user document exists whenever auth state changes
        await createUserDocument(user);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};