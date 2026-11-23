import { apiRequest } from '@/api/utils/api';
import type {
  AcaoGerenciarChamado,
  ListaInscricoesEscolaResponse,
  StatusInscricao,
} from '@/entities/inscricao';

export interface ListarInscricoesParams {
  status?: StatusInscricao;
  busca?: string;
  serieAno?: string;
}

export async function listarInscricoesEscola(
  token: string,
  params: ListarInscricoesParams = {},
): Promise<ListaInscricoesEscolaResponse> {
  const searchParams = new URLSearchParams();
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.busca?.trim()) {
    searchParams.set('busca', params.busca.trim());
  }
  if (params.serieAno?.trim()) {
    searchParams.set('serieAno', params.serieAno.trim());
  }

  const query = searchParams.toString();
  const path = query
    ? `/api/escola/inscricoes?${query}`
    : '/api/escola/inscricoes';

  return apiRequest<ListaInscricoesEscolaResponse>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function chamarInscricaoEscola(
  token: string,
  inscricaoId: string,
): Promise<void> {
  await apiRequest(`/api/escola/inscricoes/${inscricaoId}/chamar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function gerenciarChamadoEscola(
  token: string,
  inscricaoId: string,
  payload: { acao: AcaoGerenciarChamado; turmaId?: string },
): Promise<void> {
  await apiRequest(`/api/escola/inscricoes/${inscricaoId}/chamado`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
