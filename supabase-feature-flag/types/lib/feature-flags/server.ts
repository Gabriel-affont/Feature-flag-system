// In feature-flags/server.ts
import { createClient } from '../supabase/server';
import { cookies } from 'next/headers';
import { FeatureFlag, FeatureFlagCheckResult } from '../../feature-flag';

export async function getFeatureFlag(key: string): Promise<FeatureFlag | null> {
  const cookieStore =  cookies();
  const supabase = await createClient(cookieStore); 
  const { data, error } = await supabase 
    .from('feature_flags')
    .select('*')
    .eq('key', key)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching feature flag:', error);
    return null;
  }

  return data;
}