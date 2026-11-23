'use client';

import { use } from 'react';
import { AlunoDetalheView } from '@/components/features/alunos/aluno-detalhe-view';
import { ROUTES } from '@/constants/routes';

export default function ListaEsperaAlunoDetalhePage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = use(params);

  return (
    <AlunoDetalheView
      alunoId={alunoId}
      backHref={ROUTES.CHAMADOS}
      backLabel="Voltar para Chamados"
      editHref={ROUTES.CHAMADOS_ALUNO_EDITAR(alunoId)}
    />
  );
}
