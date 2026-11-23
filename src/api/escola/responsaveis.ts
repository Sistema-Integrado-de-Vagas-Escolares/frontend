import { apiRequest } from '@/api/utils/api';
import type {
  CriarResponsavelRequest,
  Responsavel,
  ResponsavelDetalhe,
  ResponsavelResumo,
} from '@/entities/responsavel';

export interface ListarResponsaveisParams {
  busca?: string;
  comFilhos?: boolean;
}

export async function listarResponsaveisEscola(
  token: string,
  params: ListarResponsaveisParams = {},
): Promise<ResponsavelResumo[]> {
  const searchParams = new URLSearchParams();
  if (params.busca?.trim()) {
    searchParams.set('busca', params.busca.trim());
  }
  if (typeof params.comFilhos === 'boolean') {
    searchParams.set('comFilhos', String(params.comFilhos));
  }

  const query = searchParams.toString();
  const path = query
    ? `/api/escola/responsaveis?${query}`
    : '/api/escola/responsaveis';

  return apiRequest<ResponsavelResumo[]>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function buscarResponsavelDetalheEscola(
  token: string,
  responsavelId: string,
): Promise<ResponsavelDetalhe> {
  return apiRequest<ResponsavelDetalhe>(
    `/api/escola/responsaveis/${responsavelId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function cadastrarResponsavelEscola(
  token: string,
  payload: CriarResponsavelRequest,
): Promise<Responsavel> {
  return apiRequest<Responsavel>('/api/escola/responsaveis', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
