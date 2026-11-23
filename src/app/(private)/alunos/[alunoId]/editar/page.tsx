'use client';

import { use } from 'react';
import { AlunoEditarView } from '@/components/features/alunos/aluno-editar-view';
import { ROUTES } from '@/constants/routes';

export default function EditarAlunoPage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = use(params);

  return (
    <AlunoEditarView
      alunoId={alunoId}
      backHref={ROUTES.ALUNO_DETALHE(alunoId)}
    />
  );
}
