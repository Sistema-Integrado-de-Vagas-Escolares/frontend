import type { StatusInscricao } from '@/entities/inscricao';

export interface ConsultaPublicaRequest {
  cpf: string;
  protocolo: string;
}

export interface ResponsavelPublico {
  id: string;
  nome: string;
  cpf: string;
}

export interface CriterioPontuacaoPublico {
  nome: string;
  pesoPercent: number;
  pontosObtidos: number;
  pontosBase: number;
  detalhe: string;
}

export interface VizinhoFilaPublico {
  posicao: number;
  rotulo: string;
  descricao: string;
  atual: boolean;
}

export interface MovimentacaoPublica {
  tipo: 'CHAMADO' | 'MATRICULADO' | 'POSICAO' | 'CONFIRMADA' | string;
  titulo: string;
  data: string;
}

export interface SolicitacaoPublica {
  inscricaoId: string;
  protocolo: string;
  alunoNome: string;
  idadeAnos: number | null;
  escolaNome: string;
  tipoVaga: string;
  serieAno: string | null;
  turno: string;
  status: StatusInscricao;
  pontuacaoTotal: number;
  posicaoFila: number | null;
  totalNaFila: number;
  percentualAtendidas: number;
  dataInscricao: string | null;
  dataChamada: string | null;
  criterios: CriterioPontuacaoPublico[];
  vizinhos: VizinhoFilaPublico[];
  historico: MovimentacaoPublica[];
}

export interface ConsultaPublicaResponse {
  responsavel: ResponsavelPublico;
  protocoloConsultado: string;
  atualizadoEm: string;
  solicitacoes: SolicitacaoPublica[];
}
