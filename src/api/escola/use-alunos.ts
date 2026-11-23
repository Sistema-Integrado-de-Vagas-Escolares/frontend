'use client';

import { useQuery } from '@tanstack/react-query';
import {
  buscarAlunoDetalheEscola,
  listarAlunosEscola,
  type ListarAlunosParams,
} from '@/api/escola/alunos';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';

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
  detail: (alunoId: string) => [...alunosKeys.all, 'detail', alunoId] as const,
};

export function useAlunosEscola(params: ListarAlunosParams) {
  const query = useQuery({
    queryKey: alunosKeys.list(params),
    queryFn: () => listarAlunosEscola(requireEscolaToken(), params),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useAlunoDetalheEscola(alunoId: string) {
  const query = useQuery({
    queryKey: alunosKeys.detail(alunoId),
    queryFn: () => buscarAlunoDetalheEscola(requireEscolaToken(), alunoId),
    enabled: Boolean(alunoId),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}
