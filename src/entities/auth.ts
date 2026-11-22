export interface Escola {
  id: string;
  codigo: string;
  nome: string;
  bairro: string;
  cidade: string;
  capacidadeTotal: number;
}

export interface LoginEscolaRequest {
  codigo: string;
  senha: string;
}

export interface LoginEscolaResponse {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  escola: Escola;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
