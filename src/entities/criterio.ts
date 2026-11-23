export type TipoRespostaCriterio =
  | 'FAIXA_VALORES'
  | 'SIM_NAO'
  | 'DISTANCIA';

export type CategoriaCriterio = 'SOCIAL' | 'GEOGRAFICO' | 'FAMILIAR';

export interface Criterio {
  id?: string;
  nome: string;
  descricao: string;
  pontosBase: number;
  categoria: CategoriaCriterio;
  tipoResposta: TipoRespostaCriterio;
  ativo: boolean;
  ordem: number;
}

export const TIPO_RESPOSTA_LABELS: Record<TipoRespostaCriterio, string> = {
  FAIXA_VALORES: 'Faixa de valores',
  SIM_NAO: 'Sim / Não',
  DISTANCIA: 'Distância (km)',
};

export const TIPO_RESPOSTA_OPTIONS: {
  value: TipoRespostaCriterio;
  label: string;
}[] = [
  { value: 'FAIXA_VALORES', label: 'Faixa de valores' },
  { value: 'SIM_NAO', label: 'Sim / Não' },
  { value: 'DISTANCIA', label: 'Distância (km)' },
];
