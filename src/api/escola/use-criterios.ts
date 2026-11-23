'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearEscolaSession } from '@/api/auth/login';
import {
  listarCriteriosEscola,
  publicarCriteriosEscola,
} from '@/api/escola/criterios';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';
import type { Criterio } from '@/entities/criterio';

export const criteriosKeys = {
  all: ['escola', 'criterios'] as const,
};

export function useCriteriosEscola() {
  const query = useQuery({
    queryKey: criteriosKeys.all,
    queryFn: () => listarCriteriosEscola(requireEscolaToken()),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function usePublicarCriterios() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (criterios: Criterio[]) =>
      publicarCriteriosEscola(requireEscolaToken(), criterios),
    onSuccess: async (data) => {
      queryClient.setQueryData(criteriosKeys.all, data);
      await queryClient.invalidateQueries({ queryKey: criteriosKeys.all });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        clearEscolaSession();
        router.replace(ROUTES.LOGIN);
      }
    },
  });
}
