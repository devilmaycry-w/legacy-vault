import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required configuration
const requiredConfig = ['apiKey', 'authDomain', 'projectId'];
const missingConfig = requiredConfig.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingConfig.length > 0) {
  console.error('Missing Firebase configuration:', missingConfig);
  throw new Error(`Missing Firebase configuration: ${missingConfig.join(', ')}`);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only if measurementId is provided and not in development
let analytics = null;
if (firebaseConfig.measurementId && import.meta.env.PROD) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

export { analytics };

// Configure Firestore settings for better connectivity
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Enable offline persistence and configure settings
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Disable offline persistence to prevent "INTERNAL ASSERTION FAILED: Unexpected state" error
// This is a common issue with IndexedDB persistence in certain environments
// Enable offline persistence (optional, helps with offline functionality)
// if (typeof window !== 'undefined') {
//   enableIndexedDbPersistence(db).catch((err) => {
//     if (err.code === 'failed-precondition') {
//       console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
//     } else if (err.code === 'unimplemented') {
//       console.warn('The current browser does not support all of the features required to enable persistence');
//     }
//   });
// }

// Add connection monitoring
let isOnline = true;

export const checkFirestoreConnection = async () => {
  try {
    // Only check connection status, don't force network operations
    // Firestore manages its own network connectivity automatically
    isOnline = navigator.onLine;
    return isOnline;
  } catch (error) {
    console.error('Firestore connection check failed:', error);
    isOnline = false;
    return false;
  }
};

export const getConnectionStatus = () => isOnline;

// Monitor online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network connection restored');
    // Remove manual enableNetwork call - Firestore handles this automatically
    isOnline = true;
  });

  window.addEventListener('offline', () => {
    console.log('Network connection lost');
    isOnline = false;
  });
}

export default app;