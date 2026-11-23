'use client';

import { useQuery } from '@tanstack/react-query';
import {
  buscarResponsavelDetalheEscola,
  listarResponsaveisEscola,
  type ListarResponsaveisParams,
} from '@/api/escola/responsaveis';
import {
  requireEscolaToken,
  useRedirectOnUnauthorized,
} from '@/api/escola/use-escola-auth-guard';

export const responsaveisKeys = {
  all: ['escola', 'responsaveis'] as const,
  list: (params: ListarResponsaveisParams) =>
    [
      ...responsaveisKeys.all,
      {
        busca: params.busca?.trim() ?? '',
        comFilhos:
          typeof params.comFilhos === 'boolean' ? params.comFilhos : null,
      },
    ] as const,
  detail: (responsavelId: string, incluirCpfCompleto = false) =>
    [...responsaveisKeys.all, 'detail', responsavelId, { incluirCpfCompleto }] as const,
};

export function useResponsaveisEscola(params: ListarResponsaveisParams) {
  const query = useQuery({
    queryKey: responsaveisKeys.list(params),
    queryFn: () => listarResponsaveisEscola(requireEscolaToken(), params),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}

export function useResponsavelDetalheEscola(
  responsavelId: string,
  options?: { incluirCpfCompleto?: boolean },
) {
  const incluirCpfCompleto = Boolean(options?.incluirCpfCompleto);
  const query = useQuery({
    queryKey: responsaveisKeys.detail(responsavelId, incluirCpfCompleto),
    queryFn: () =>
      buscarResponsavelDetalheEscola(requireEscolaToken(), responsavelId, {
        incluirCpfCompleto,
      }),
    enabled: Boolean(responsavelId),
  });

  useRedirectOnUnauthorized(query.error);

  return query;
}
