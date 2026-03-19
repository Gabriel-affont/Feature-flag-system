'use client';

import { ReactNode } from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface FeatureFlagGateProps {
  flagKey: string;
  userId?: string;
  children: ReactNode;
  fallback?: ReactNode;
  showLoading?: ReactNode;
}

export function FeatureFlagGate({
  flagKey,
  userId,
  children,
  fallback = null,
  showLoading = null,
}: FeatureFlagGateProps) {
  const { enabled, loading } = useFeatureFlag(flagKey, userId);

  if (loading && showLoading !== null) {
    return <>{showLoading}</>;
  }

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}