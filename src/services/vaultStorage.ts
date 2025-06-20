// src/services/vaultStorage.ts

// Local storage service for vault settings persistence
export interface VaultSettings {
  name: string;
  backgroundImage: string;
  lastUpdated: number;
}

const VAULT_STORAGE_KEY = 'legacy_vault_settings';

// LocalStorage functions (keep these if you want fallback/offline)
export const saveVaultSettings = (name: string, backgroundImage: string): void => {
  try {
    const settings: VaultSettings = {
      name,
      backgroundImage,
      lastUpdated: Date.now()
    };
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save vault settings:', error);
  }
};

export const loadVaultSettings = (): VaultSettings | null => {
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load vault settings:', error);
  }
  return null;
};

export const clearVaultSettings = (): void => {
  try {
    localStorage.removeItem(VAULT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear vault settings:', error);
  }
};

// ------------ FIRESTORE (PER-USER) FUNCTIONS ------------
import { db } from './firebase'; // Adjust this path as needed
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Save vault settings for a user in Firestore
export const saveVaultSettingsForUser = async (
  userId: string,
  settings: { name: string; backgroundImage: string }
): Promise<void> => {
  try {
    await setDoc(doc(db, 'vaultSettings', userId), {
      ...settings,
      lastUpdated: Date.now()
    });
  } catch (error) {
    console.error('Failed to save vault settings for user:', error);
    throw error;
  }
};

// Load vault settings for a user from Firestore
export const loadVaultSettingsForUser = async (userId: string): Promise<VaultSettings | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'vaultSettings', userId));
    return docSnap.exists() ? (docSnap.data() as VaultSettings) : null;
  } catch (error) {
    console.error('Failed to load vault settings for user:', error);
    return null;
  }
};
