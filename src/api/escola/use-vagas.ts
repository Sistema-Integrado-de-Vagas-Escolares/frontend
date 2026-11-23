'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearEscolaSession } from '@/api/auth/login';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';
import { turmasKeys } from '@/api/escola/use-inscricoes';
import {
  atualizarVagasEscola,
  listarHistoricoVagasEscola,
} from '@/api/escola/vagas';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';
import type { AtualizarVagasRequest } from '@/entities/vaga';

export const vagasKeys = {
  all: ['escola', 'vagas'] as const,
  historico: (turmaId?: string) =>
    [...vagasKeys.all, 'historico', turmaId ?? 'all'] as const,
};

export function useHistoricoVagasEscola(turmaId?: string) {
  const query = useQuery({
    queryKey: vagasKeys.historico(turmaId),
    queryFn: () => listarHistoricoVagasEscola(requireEscolaToken(), turmaId),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useAtualizarVagasEscola() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AtualizarVagasRequest) =>
      atualizarVagasEscola(requireEscolaToken(), payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: vagasKeys.all }),
        queryClient.invalidateQueries({ queryKey: turmasKeys.all }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        clearEscolaSession();
        router.replace(ROUTES.LOGIN);
      }
    },
  });
}
