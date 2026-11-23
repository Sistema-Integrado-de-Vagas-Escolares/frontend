import type { Turno } from '@/entities/aluno';

export interface Turma {
  id: string;
  escolaId: string;
  serieAno: string;
  nome: string;
  turno: Turno;
  vagasTotais: number;
  vagasDisponiveis: number;
}
