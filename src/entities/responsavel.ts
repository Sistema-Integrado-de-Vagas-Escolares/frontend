import type { Parentesco } from '@/entities/aluno';

export interface Responsavel {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelResumo extends Responsavel {
  totalFilhos: number;
}

export interface FilhoVinculadoResumo {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string | null;
  etapaOuTurma: string;
  turmaNome: string | null;
  statusInscricao: string | null;
  pontuacaoTotal: number | null;
  parentesco: Parentesco;
  contatoPrincipal: boolean;
}

export interface ResponsavelDetalhe extends Responsavel {
  filhos: FilhoVinculadoResumo[];
}

export interface CriarResponsavelRequest {
  nome: string;
  cpf: string;
  telefone: string;
}
