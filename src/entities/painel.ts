import type { Escola } from '@/entities/auth';

export interface ResumoPainelEscola {
  escola: Escola;
  totalEmEspera: number;
  vagasDisponiveis: number;
  capacidadeTotal: number;
  totalResponsaveis: number;
  totalAlunos: number;
  totalMatriculados: number;
}
