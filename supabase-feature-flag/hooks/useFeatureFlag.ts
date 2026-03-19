'use client';

import {useQuery} from '@tanstack/react-query';
import { isFeatureEnabled } from '../lib/feature-flags/server';
import { FeatureFlagCheckResult } from '../.next/types/feature-flag';

export function useFeatureFlag(key: string, userId?: string) {
  const {
    data: result = { enabled: false, reason: 'Loading...' },
    isLoading: loading,
    error,
  } = useQuery<FeatureFlagCheckResult>({
    queryKey: ['featureFlag', key, userId],
    queryFn: () => isFeatureEnabled(key, userId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return { ...result, loading, error };
}