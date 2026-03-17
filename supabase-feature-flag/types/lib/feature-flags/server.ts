

import { createClient } from '../supabase/server';
import { cookies } from 'next/headers';
import { FeatureFlag, FeatureFlagCheckResult } from '../../feature-flag';

export async function getFeatureFlag(key: string): Promise<FeatureFlag | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching feature flag:', error);
  }

  return data;
}

export async function isFeatureEnabled(
  key: string,
  userId?: string
): Promise<FeatureFlagCheckResult> {
  const flag = await getFeatureFlag(key);

  if (!flag) {
    return { enabled: false, reason: 'Flag not found' };
  }

  if (!flag.enabled) {
    return { enabled: false, reason: 'Flag is globally disabled' };
  }

  // Check user-specific access
  if (userId && flag.enabled_for_users.length > 0) {
    if (flag.enabled_for_users.includes(userId)) {
      return { enabled: true, reason: 'User has explicit access' };
    }
    return { enabled: false, reason: 'User not in allowed list' };
  }

  // Check percentage rollout
  if (flag.enabled_for_percent > 0) {
    const hash = simpleHash(userId || key);
    const percentage = hash % 100;
    const enabled = percentage < flag.enabled_for_percent;

    return {
      enabled,
      reason: enabled
        ? `User falls within ${flag.enabled_for_percent}% rollout`
        : `User falls outside ${flag.enabled_for_percent}% rollout`,
    };
  }

  return { enabled: true, reason: 'Flag is globally enabled' };
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}