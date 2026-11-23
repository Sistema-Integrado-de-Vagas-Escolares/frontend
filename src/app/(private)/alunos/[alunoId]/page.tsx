'use client';

import { use } from 'react';
import { AlunoDetalheView } from '@/components/features/alunos/aluno-detalhe-view';
import { ROUTES } from '@/constants/routes';

export default function AlunoDetalhePage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = use(params);

  return (
    <AlunoDetalheView
      alunoId={alunoId}
      backHref={ROUTES.ALUNOS}
      backLabel="Voltar para Alunos"
      editHref={ROUTES.ALUNO_EDITAR(alunoId)}
    />
  );
}
