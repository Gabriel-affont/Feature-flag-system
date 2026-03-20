'use client';

import { useState } from 'react';

interface CreateFeatureFlagModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFeatureFlagModal({ onClose, onSuccess }: CreateFeatureFlagModalProps) {
  const [form, setForm] = useState({
    key: '',
    name: '',
    description: '',
    enabled: false,
    enabled_for_users: '',
    enabled_for_percent: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.key.trim() || !form.name.trim()) {
      setError('Key and name are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSuccess();
      onClose();
    } catch (e) {
      setError('Failed to create flag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create Feature Flag</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. new-dashboard"
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full px-3 py-2 border rounded-lg font-mono text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New Dashboard"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Optional description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enable for specific users
              <span className="text-gray-400 font-normal"> (comma-separated user IDs)</span>
            </label>
            <input
              type="text"
              placeholder="user-id-1, user-id-2"
              value={form.enabled_for_users}
              onChange={(e) => setForm({ ...form, enabled_for_users: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentage rollout: {form.enabled_for_percent}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.enabled_for_percent}
              onChange={(e) => setForm({ ...form, enabled_for_percent: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="enabled" className="text-sm text-gray-700">
              Enable globally on create
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Flag'}
          </button>
        </div>
      </div>
    </div>
  );
}