'use client';

import { useState } from 'react';

interface FeatureFlag {
  key: string;
  name: string;
  description?: string | null;
  enabled: boolean;
  enabled_for_users: string[];
  enabled_for_percent: number;
  created_at: string;
}

interface FeatureFlagListProps {
  flags: FeatureFlag[];
  onToggle: (key: string, enabled: boolean) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}

export function FeatureFlagList({ flags, onToggle, onDelete }: FeatureFlagListProps) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleToggle = async (key: string, current: boolean) => {
    setLoadingKey(key);
    await onToggle(key, !current);
    setLoadingKey(null);
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete flag "${key}"?`)) return;
    setLoadingKey(key);
    await onDelete(key);
    setLoadingKey(null);
  };

  if (flags.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No feature flags yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {flags.map((flag) => (
        <div
          key={flag.key}
          className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-gray-800">
                {flag.key}
              </span>
              <span className="text-gray-400">—</span>
              <span className="text-sm text-gray-600">{flag.name}</span>
            </div>
            {flag.description && (
              <p className="text-xs text-gray-400 mt-1">{flag.description}</p>
            )}
            <div className="flex gap-3 mt-1 text-xs text-gray-400">
              {flag.enabled_for_users.length > 0 && (
                <span>{flag.enabled_for_users.length} users</span>
              )}
              {flag.enabled_for_percent > 0 && (
                <span>{flag.enabled_for_percent}% rollout</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            {/* Toggle */}
            <button
              onClick={() => handleToggle(flag.key, flag.enabled)}
              disabled={loadingKey === flag.key}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${flag.enabled ? 'bg-purple-600' : 'bg-gray-200'}
                ${loadingKey === flag.key ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${flag.enabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>

            {/* Delete */}
            <button
              onClick={() => handleDelete(flag.key)}
              disabled={loadingKey === flag.key}
              className="text-red-400 hover:text-red-600 text-sm disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}