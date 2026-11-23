export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LISTA_ESPERA: '/lista-de-espera',
  INSCRICAO_MATRICULA: (inscricaoId: string) =>
    `/lista-de-espera/${inscricaoId}/matricula`,
  TURMAS: '/turmas',
  TURMAS_NOVO: '/turmas/novo',
  TURMA_DETALHE: (turmaId: string) => `/turmas/${turmaId}`,
  CRITERIOS: '/criterios',
  CRITERIOS_EDITAR: '/criterios/editar',
  HISTORICO: '/historico',
  RESPONSAVEIS: '/responsaveis',
  RESPONSAVEIS_NOVO: '/responsaveis/novo',
  ALUNOS: '/alunos',
  ALUNOS_NOVO: '/alunos/novo',
  ALUNO_DETALHE: (alunoId: string) => `/alunos/${alunoId}`,
  BUSCAR_CPF: '/buscar-cpf',
} as const;
