import { apiRequest } from '@/api/utils/api';
import type { Turno } from '@/entities/aluno';
import type { Turma } from '@/entities/turma';

export interface SalvarTurmaRequest {
  serieAno: string;
  nome: string;
  turno: Turno;
  vagasTotais: number;
}

export async function listarTurmasEscola(token: string): Promise<Turma[]> {
  return apiRequest<Turma[]>('/api/escola/turmas', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function buscarTurmaEscola(
  token: string,
  turmaId: string,
): Promise<Turma> {
  return apiRequest<Turma>(`/api/escola/turmas/${turmaId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cadastrarTurmaEscola(
  token: string,
  payload: SalvarTurmaRequest,
): Promise<Turma> {
  return apiRequest<Turma>('/api/escola/turmas', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function atualizarTurmaEscola(
  token: string,
  turmaId: string,
  payload: SalvarTurmaRequest,
): Promise<Turma> {
  return apiRequest<Turma>(`/api/escola/turmas/${turmaId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function excluirTurmaEscola(
  token: string,
  turmaId: string,
): Promise<void> {
  await apiRequest(`/api/escola/turmas/${turmaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
