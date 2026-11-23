import type { Turno } from '@/entities/aluno';

export interface HistoricoVaga {
  id: string;
  escolaId: string;
  turmaId: string;
  serieAno: string;
  turmaNome?: string;
  turno: Turno;
  vagasAnteriores: number;
  vagasNovas: number;
  motivo: string;
  createdAt: string;
}

export interface AtualizarVagasRequest {
  turmaId: string;
  vagasDisponiveis: number;
  motivo: string;
}
