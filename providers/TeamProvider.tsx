import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

const STORAGE_KEY = 'selected_team_id';

export const [TeamProvider, useTeam] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const teamQuery = useQuery({
    queryKey: ['selectedTeam'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('[TeamProvider] Loaded stored team:', stored);
      return stored;
    },
  });

  useEffect(() => {
    if (teamQuery.isSuccess) {
      setSelectedTeamId(teamQuery.data ?? null);
      setHasLoaded(true);
    }
  }, [teamQuery.isSuccess, teamQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (teamId: string) => {
      await AsyncStorage.setItem(STORAGE_KEY, teamId);
      console.log('[TeamProvider] Saved team:', teamId);
      return teamId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selectedTeam'] });
    },
  });

  const selectTeam = useCallback(
    (teamId: string) => {
      setSelectedTeamId(teamId);
      saveMutation.mutate(teamId);
    },
    [saveMutation]
  );

  const clearTeam = useCallback(async () => {
    setSelectedTeamId(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    queryClient.invalidateQueries({ queryKey: ['selectedTeam'] });
  }, [queryClient]);

  return {
    selectedTeamId,
    selectTeam,
    clearTeam,
    hasLoaded,
    hasSelectedTeam: selectedTeamId !== null,
  };
});
