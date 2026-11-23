import { apiRequest } from '@/api/utils/api';
import type {
  AlunoDetalhe,
  AlunoResumo,
  CadastrarAlunoInscricaoRequest,
} from '@/entities/aluno';

export interface ListarAlunosParams {
  busca?: string;
  serieAno?: string;
}

export async function listarAlunosEscola(
  token: string,
  params: ListarAlunosParams = {},
): Promise<AlunoResumo[]> {
  const searchParams = new URLSearchParams();
  if (params.busca?.trim()) {
    searchParams.set('busca', params.busca.trim());
  }
  if (params.serieAno?.trim()) {
    searchParams.set('serieAno', params.serieAno.trim());
  }

  const query = searchParams.toString();
  const path = query ? `/api/escola/alunos?${query}` : '/api/escola/alunos';

  return apiRequest<AlunoResumo[]>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function buscarAlunoDetalheEscola(
  token: string,
  alunoId: string,
  options?: { incluirCpfCompleto?: boolean },
): Promise<AlunoDetalhe> {
  const query = options?.incluirCpfCompleto ? '?incluirCpfCompleto=true' : '';
  return apiRequest<AlunoDetalhe>(`/api/escola/alunos/${alunoId}${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cadastrarAlunoEscola(
  token: string,
  payload: CadastrarAlunoInscricaoRequest,
): Promise<AlunoResumo> {
  return apiRequest<AlunoResumo>('/api/escola/alunos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function atualizarAlunoEscola(
  token: string,
  alunoId: string,
  payload: CadastrarAlunoInscricaoRequest,
): Promise<AlunoDetalhe> {
  return apiRequest<AlunoDetalhe>(`/api/escola/alunos/${alunoId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
