export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CONSULTA: '/consulta',
  CONSULTA_PROTOCOLO: (protocolo: string) =>
    `/consulta/${encodeURIComponent(protocolo)}`,
  CHAMADOS: '/chamados',
  CHAMADOS_ALUNO_DETALHE: (alunoId: string) =>
    `/chamados/alunos/${alunoId}`,
  CHAMADOS_ALUNO_EDITAR: (alunoId: string) =>
    `/chamados/alunos/${alunoId}/editar`,
  INSCRICAO_MATRICULA: (inscricaoId: string) =>
    `/chamados/${inscricaoId}/matricula`,
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
  RESPONSAVEL_EDITAR: (responsavelId: string) =>
    `/responsaveis/${responsavelId}/editar`,
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
