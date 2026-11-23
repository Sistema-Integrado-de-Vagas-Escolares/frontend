export interface Responsavel {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelResumo extends Responsavel {
  totalFilhos: number;
}

export interface CriarResponsavelRequest {
  nome: string;
  cpf: string;
  telefone: string;
}
