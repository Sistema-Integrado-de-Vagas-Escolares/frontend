'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clearEscolaSession } from '@/api/auth/login';
import {
  chamarInscricaoEscola,
  gerenciarChamadoEscola,
  listarInscricoesEscola,
  type ListarInscricoesParams,
} from '@/api/escola/inscricoes';
import {
  atualizarTurmaEscola,
  buscarTurmaEscola,
  cadastrarTurmaEscola,
  excluirTurmaEscola,
  listarTurmasEscola,
  type SalvarTurmaRequest,
} from '@/api/escola/turmas';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';
import { vagasKeys } from '@/api/escola/use-vagas';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';
import type { AcaoGerenciarChamado } from '@/entities/inscricao';

export const inscricoesKeys = {
  all: ['escola', 'inscricoes'] as const,
  list: (params: ListarInscricoesParams) =>
    [
      ...inscricoesKeys.all,
      {
        status: params.status ?? null,
        busca: params.busca?.trim() ?? '',
        serieAno: params.serieAno?.trim() ?? '',
      },
    ] as const,
};

export const turmasKeys = {
  all: ['escola', 'turmas'] as const,
  detail: (turmaId: string) => [...turmasKeys.all, turmaId] as const,
};

export function useInscricoesEscola(
  params: ListarInscricoesParams,
  options?: { enabled?: boolean },
) {
  const query = useQuery({
    queryKey: inscricoesKeys.list(params),
    queryFn: () => listarInscricoesEscola(requireEscolaToken(), params),
    enabled: options?.enabled ?? true,
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useTurmasEscola() {
  return useQuery({
    queryKey: turmasKeys.all,
    queryFn: () => listarTurmasEscola(requireEscolaToken()),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTurmaEscola(turmaId: string) {
  const query = useQuery({
    queryKey: turmasKeys.detail(turmaId),
    queryFn: () => buscarTurmaEscola(requireEscolaToken(), turmaId),
    enabled: Boolean(turmaId),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useCadastrarTurmaEscola() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SalvarTurmaRequest) =>
      cadastrarTurmaEscola(requireEscolaToken(), payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: turmasKeys.all }),
        queryClient.invalidateQueries({ queryKey: vagasKeys.all }),
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

export function useAtualizarTurmaEscola(turmaId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SalvarTurmaRequest) =>
      atualizarTurmaEscola(requireEscolaToken(), turmaId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: turmasKeys.all }),
        queryClient.invalidateQueries({ queryKey: vagasKeys.all }),
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

export function useExcluirTurmaEscola() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (turmaId: string) =>
      excluirTurmaEscola(requireEscolaToken(), turmaId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: turmasKeys.all }),
        queryClient.invalidateQueries({ queryKey: vagasKeys.all }),
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

export function useChamarInscricao() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inscricaoId: string) =>
      chamarInscricaoEscola(requireEscolaToken(), inscricaoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inscricoesKeys.all });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        clearEscolaSession();
        router.replace(ROUTES.LOGIN);
      }
    },
  });
}

export function useGerenciarChamado() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inscricaoId,
      payload,
    }: {
      inscricaoId: string;
      payload: { acao: AcaoGerenciarChamado; turmaId?: string };
    }) => gerenciarChamadoEscola(requireEscolaToken(), inscricaoId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: inscricoesKeys.all }),
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
