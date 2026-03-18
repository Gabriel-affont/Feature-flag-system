'use client' ;
import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query';
import {FeatureFlag} from '@/types/feature-flag';

export function useFeatureFlags() {
    return useQuery<FeatureFlag[]>({ 
        queryKey: ['featureFlags'],
        queryFn: async () => {
            const response = await fetch('/api/feature-flags');
            const {data } = await response.json();
            return data || [];
        },
        staleTime: 30 * 1000,
    });
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      key,
      updates,
    }: {
      key: string;
      updates: Partial<FeatureFlag>;
    }) => {
      const response = await fetch(`/api/feature-flags/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update feature flag');
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: (data, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
      
      queryClient.invalidateQueries({
        queryKey: ['featureFlag', variables.key],
      });
      
      queryClient.invalidateQueries({ queryKey: ['featureFlag'] });
    },
  });
}
export function useDeleteFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      const response = await fetch(`/api/feature-flags/${key}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete feature flag');
      }
    },
    onSuccess: (_, key) => {
      // Invalidate and refetch feature flags list
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
      // Invalidate the specific feature flag check
      queryClient.invalidateQueries({ queryKey: ['featureFlag', key] });
    },
  });
}
export function useCreateFeatureFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flag: {
      key: string;
      name: string;
      description?: string;
      enabled?: boolean;
      enabled_for_users?: string[];
      enabled_for_percent?: number;
      metadata?: Record<string, any>;
    }) => {
      const response = await fetch('/api/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flag),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create feature flag');
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch feature flags list
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    },
  });
}