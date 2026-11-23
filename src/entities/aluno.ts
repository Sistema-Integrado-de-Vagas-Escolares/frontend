import type { Endereco } from '@/entities/endereco';

export type TipoVaga = 'CRECHE' | 'FUNDAMENTAL';

export type Turno = 'INTEGRAL' | 'MANHA' | 'TARDE';

export type Parentesco = 'MAE' | 'PAI' | 'AVOS' | 'TUTOR_LEGAL' | 'OUTRO';

export interface AlunoResumo {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  endereco: Endereco | null;
  rendaPerCapita: number;
  temNecessidadeEspecial: boolean;
  etapaOuTurma: string;
  tipoVaga: TipoVaga | null;
  turno: Turno | null;
  pontuacaoTotal: number;
  statusInscricao: string;
  protocolo?: string | null;
}

export interface ResponsavelVinculoInput {
  responsavelId: string;
  parentesco: Parentesco;
}

export interface CadastrarAlunoInscricaoRequest {
  nome: string;
  cpf: string;
  dataNascimento: string;
  tipoVaga: TipoVaga;
  serieAno: string;
  turno: Turno;
  endereco: Endereco;
  rendaPerCapita: number;
  vulnerabilidadeSocioeconomica: boolean;
  responsavelSolo: boolean;
  moraDeAluguel: boolean;
  bolsaFamilia: boolean;
  bpcLoas: boolean;
  temNecessidadeEspecial: boolean;
  irmaoMatriculado: boolean;
  responsaveis: ResponsavelVinculoInput[];
}

export interface ResponsavelVinculadoDetalhe {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  parentesco: Parentesco;
  contatoPrincipal: boolean;
}

export interface AlunoDetalhe {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  endereco: Endereco | null;
  rendaPerCapita: number;
  temNecessidadeEspecial: boolean;
  vulnerabilidadeSocioeconomica: boolean;
  responsavelSolo: boolean;
  moraDeAluguel: boolean;
  bolsaFamilia: boolean;
  bpcLoas: boolean;
  irmaoMatriculado: boolean;
  protocolo: string | null;
  etapaOuTurma: string | null;
  serieAno: string | null;
  turmaNome: string | null;
  tipoVaga: TipoVaga | null;
  turno: Turno | null;
  pontuacaoTotal: number;
  statusInscricao: string | null;
  dataInscricao: string | null;
  dataChamada: string | null;
  responsaveis: ResponsavelVinculadoDetalhe[];
}
