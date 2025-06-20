import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { loadVaultSettingsForUser, saveVaultSettingsForUser } from '../services/vaultStorage';
import { useToast } from '../contexts/ToastContext';

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { showError } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      loadVaultSettingsForUser(currentUser.uid).then(settings => {
        if (settings) {
          setName(settings.name || '');
          setDescription(settings.description || '');
        }
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await saveVaultSettingsForUser(currentUser.uid, {
        name,
        description,
        backgroundImage: '', // No change here
      });
    } catch (err) {
      showError('Error', 'Could not save settings');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[rgba(56,47,41,0.8)] rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-semibold mb-6 font-serif">Vault Settings</h1>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Vault Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 rounded bg-[#181411] text-white border-none focus:ring-2 focus:ring-[#e9883e]"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-2">Vault Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-3 rounded bg-[#181411] text-white border-none focus:ring-2 focus:ring-[#e9883e]"
          rows={4}
        />
      </div>
      <button
        onClick={handleSave}
        className="bg-[#e9883e] text-[#181411] px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default Settings;
