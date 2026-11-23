export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LISTA_ESPERA: '/lista-de-espera',
  LISTA_ESPERA_ALUNO_DETALHE: (alunoId: string) =>
    `/lista-de-espera/alunos/${alunoId}`,
  LISTA_ESPERA_ALUNO_EDITAR: (alunoId: string) =>
    `/lista-de-espera/alunos/${alunoId}/editar`,
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
  RESPONSAVEL_DETALHE: (responsavelId: string) =>
    `/responsaveis/${responsavelId}`,
  RESPONSAVEL_ALUNO_DETALHE: (responsavelId: string, alunoId: string) =>
    `/responsaveis/${responsavelId}/alunos/${alunoId}`,
  RESPONSAVEL_ALUNO_EDITAR: (responsavelId: string, alunoId: string) =>
    `/responsaveis/${responsavelId}/alunos/${alunoId}/editar`,
  ALUNOS: '/alunos',
  ALUNOS_NOVO: '/alunos/novo',
  ALUNO_DETALHE: (alunoId: string) => `/alunos/${alunoId}`,
  ALUNO_EDITAR: (alunoId: string) => `/alunos/${alunoId}/editar`,
  BUSCAR_CPF: '/buscar-cpf',
} as const;
