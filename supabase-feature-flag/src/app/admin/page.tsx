'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FeatureFlagList } from '../../../components/admin/FeatureFlagList';
import { CreateFeatureFlagModal } from '../../../components/admin/CreateFeatureFlagModal';
import { useFeatureFlags } from '../../../hooks/useFeatureFlags';

export default function AdminPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: flags = [], isLoading: loading } = useFeatureFlags();
  const queryClient = useQueryClient();

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['feature-flags'] });

  const handleToggle = async (key: string, enabled: boolean) => {
    await fetch(`/api/feature-flags/${key}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    refetch();
  };

  const handleDelete = async (key: string) => {
    await fetch(`/api/feature-flags/${key}`, { method: 'DELETE' });
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Flags Admin</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your feature flags and rollouts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Feature Flag
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading feature flags...</p>
          </div>
        ) : (
          <FeatureFlagList
            flags={flags}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

        {showCreateModal && (
          <CreateFeatureFlagModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
}