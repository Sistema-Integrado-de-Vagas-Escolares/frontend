'use client';

import { use } from 'react';
import { AlunoDetalheView } from '@/components/features/alunos/aluno-detalhe-view';
import { ROUTES } from '@/constants/routes';

export default function ResponsavelAlunoDetalhePage({
  params,
}: {
  params: Promise<{ responsavelId: string; alunoId: string }>;
}) {
  const { responsavelId, alunoId } = use(params);

  return (
    <AlunoDetalheView
      alunoId={alunoId}
      backHref={ROUTES.RESPONSAVEL_DETALHE(responsavelId)}
      backLabel="Voltar para o responsável"
      editHref={ROUTES.RESPONSAVEL_ALUNO_EDITAR(responsavelId, alunoId)}
    />
  );
}
