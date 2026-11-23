import { apiRequest } from '@/api/utils/api';
import type { AtualizarVagasRequest, HistoricoVaga } from '@/entities/vaga';

export async function listarHistoricoVagasEscola(
  token: string,
  turmaId?: string,
): Promise<HistoricoVaga[]> {
  const path = turmaId
    ? `/api/escola/vagas/historico?turmaId=${encodeURIComponent(turmaId)}`
    : '/api/escola/vagas/historico';

  return apiRequest<HistoricoVaga[]>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function atualizarVagasEscola(
  token: string,
  payload: AtualizarVagasRequest,
): Promise<HistoricoVaga> {
  return apiRequest<HistoricoVaga>('/api/escola/vagas', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
