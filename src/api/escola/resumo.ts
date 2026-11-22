import { apiRequest } from '@/api/utils/api';
import type { ResumoPainelEscola } from '@/entities/painel';

export async function getResumoPainelEscola(
  token: string,
): Promise<ResumoPainelEscola> {
  return apiRequest<ResumoPainelEscola>('/api/escola/resumo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
