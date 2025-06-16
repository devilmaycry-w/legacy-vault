// Local storage service for vault settings persistence
interface VaultSettings {
  name: string;
  backgroundImage: string;
  lastUpdated: number;
}

const VAULT_STORAGE_KEY = 'legacy_vault_settings';

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