import { createClient } from '../supabase/client';
import { FeatureFlag , FeatureFlagCheckResult} from '../../.next/types/feature-flag';

const cache = new Map<string, { data: FeatureFlag | null; expires: number }>();
const CACHE_TTL = 5000; // 5 seconds - short enough to not interfere with React Query invalidation

function getCached(key: string): FeatureFlag | null | undefined {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  return undefined;
}

function setCached(key: string, data: FeatureFlag | null): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}