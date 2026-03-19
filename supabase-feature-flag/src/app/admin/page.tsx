'use client';

import { useState } from 'react';
import { CreateFeatureFlagModal } from '@/components/CreateFeatureFlagModal';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

export default function AdminPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: flags = [], isLoading: loading } = useFeatureFlags();

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Feature Flags Admin
            </h1>
            <p className='mt-2 text-sm text-gray-600'>
              Manage your feature flags and rollouts
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Create Feature Flag
          </button>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            <p className='mt-4 text-gray-600'>Loading feature flags...</p>
          </div>
        ) : (
          <FeatureFlagList flags={flags} />
        )}

        {showCreateModal && (
          <CreateFeatureFlagModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}