'use client';

import { use } from 'react';
import { AlunoEditarView } from '@/components/features/alunos/aluno-editar-view';
import { ROUTES } from '@/constants/routes';

export default function ResponsavelEditarAlunoPage({
  params,
}: {
  params: Promise<{ responsavelId: string; alunoId: string }>;
}) {
  const { responsavelId, alunoId } = use(params);

  return (
    <AlunoEditarView
      alunoId={alunoId}
      backHref={ROUTES.RESPONSAVEL_ALUNO_DETALHE(responsavelId, alunoId)}
    />
  );
}
