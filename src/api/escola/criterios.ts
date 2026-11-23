import { apiRequest } from '@/api/utils/api';
import type { Criterio } from '@/entities/criterio';

export async function listarCriteriosEscola(
  token: string,
): Promise<Criterio[]> {
  return apiRequest<Criterio[]>('/api/escola/criterios', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function publicarCriteriosEscola(
  token: string,
  criterios: Criterio[],
): Promise<Criterio[]> {
  return apiRequest<Criterio[]>('/api/escola/criterios', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(criterios),
  });
}
