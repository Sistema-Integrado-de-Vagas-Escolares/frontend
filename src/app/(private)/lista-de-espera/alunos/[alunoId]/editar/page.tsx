'use client';

import { use } from 'react';
import { AlunoEditarView } from '@/components/features/alunos/aluno-editar-view';
import { ROUTES } from '@/constants/routes';

export default function ListaEsperaEditarAlunoPage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = use(params);

  return (
    <AlunoEditarView
      alunoId={alunoId}
      backHref={ROUTES.LISTA_ESPERA_ALUNO_DETALHE(alunoId)}
    />
  );
}
