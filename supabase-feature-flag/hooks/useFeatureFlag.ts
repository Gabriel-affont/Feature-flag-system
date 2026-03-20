'use client';

import { useQuery } from '@tanstack/react-query';
import { FeatureFlagCheckResult } from '../.next/types/feature-flag';

async function fetchFeatureFlag(key: string, userId?: string): Promise<FeatureFlagCheckResult> {
  const url = userId
    ? `/api/feature-flags/${key}/check?userId=${userId}`
    : `/api/feature-flags/${key}/check`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch feature flag');
  return res.json();
}

export function useFeatureFlag(key: string, userId?: string) {
  const {
    data: result = { enabled: false, reason: 'Loading...' },
    isLoading: loading,
    error,
  } = useQuery<FeatureFlagCheckResult>({
    queryKey: ['featureFlag', key, userId],
    queryFn: () => fetchFeatureFlag(key, userId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return { ...result, loading, error };
}