import type { TipoVaga, Turno } from '@/entities/aluno';

export type StatusInscricao =
  | 'EM_ESPERA'
  | 'CHAMADO'
  | 'MATRICULADO'
  | 'CANCELADO'
  | 'EXPIRADO';

export type AcaoGerenciarChamado =
  | 'ACEITAR'
  | 'RECUSAR'
  | 'DESISTIR'
  | 'REPASSAR'
  | 'DESFAZER';

export interface InscricaoEscolaResumo {
  id: string;
  alunoId: string;
  alunoNome: string;
  alunoDataNascimento: string;
  turmaId: string | null;
  etapaOuTurma: string;
  tipoVaga: TipoVaga | null;
  turno: Turno | null;
  protocolo: string;
  pontuacaoTotal: number;
  status: StatusInscricao;
  dataInscricao: string;
  dataChamada: string | null;
  posicao: number | null;
}

export interface ListaInscricoesEscolaResponse {
  itens: InscricaoEscolaResumo[];
  totalEmEspera: number;
  totalAguardandoMatricula: number;
  totalMatriculados: number;
}
