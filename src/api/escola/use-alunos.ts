'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { clearEscolaSession } from '@/api/auth/login';
import {
  atualizarAlunoEscola,
  buscarAlunoDetalheEscola,
  listarAlunosEscola,
  type ListarAlunosParams,
} from '@/api/escola/alunos';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';
import { inscricoesKeys } from '@/api/escola/use-inscricoes';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';
import type { CadastrarAlunoInscricaoRequest } from '@/entities/aluno';

export const alunosKeys = {
  all: ['escola', 'alunos'] as const,
  list: (params: ListarAlunosParams) =>
    [
      ...alunosKeys.all,
      {
        busca: params.busca?.trim() ?? '',
        serieAno: params.serieAno?.trim() ?? '',
      },
    ] as const,
  detail: (alunoId: string, incluirCpfCompleto = false) =>
    [...alunosKeys.all, 'detail', alunoId, { incluirCpfCompleto }] as const,
};

export function useAlunosEscola(params: ListarAlunosParams) {
  const query = useQuery({
    queryKey: alunosKeys.list(params),
    queryFn: () => listarAlunosEscola(requireEscolaToken(), params),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useAlunoDetalheEscola(
  alunoId: string,
  options?: { incluirCpfCompleto?: boolean },
) {
  const incluirCpfCompleto = Boolean(options?.incluirCpfCompleto);
  const query = useQuery({
    queryKey: alunosKeys.detail(alunoId, incluirCpfCompleto),
    queryFn: () =>
      buscarAlunoDetalheEscola(requireEscolaToken(), alunoId, {
        incluirCpfCompleto,
      }),
    enabled: Boolean(alunoId),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useAtualizarAlunoEscola(alunoId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CadastrarAlunoInscricaoRequest) =>
      atualizarAlunoEscola(requireEscolaToken(), alunoId, payload),
    onSuccess: async (data) => {
      queryClient.setQueryData(alunosKeys.detail(alunoId), data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: alunosKeys.all }),
        queryClient.invalidateQueries({ queryKey: inscricoesKeys.all }),
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
