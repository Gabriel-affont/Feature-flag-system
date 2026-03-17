export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  enabled_for_users: string[];
  enabled_for_percent: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlagCheckResult {
  enabled: boolean;
  reason?: string;
}