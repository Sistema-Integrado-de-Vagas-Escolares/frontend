'use client';

import { use } from 'react';
import { useAlunoDetalheEscola } from '@/api/escola/use-alunos';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoProfile } from '@/components/features/alunos/aluno-profile';
import { ROUTES } from '@/constants/routes';

export default function AlunoDetalhePage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = use(params);
  const alunoQuery = useAlunoDetalheEscola(alunoId);

  const error =
    alunoQuery.error instanceof ApiError
      ? alunoQuery.error.message
      : alunoQuery.error
        ? 'Não foi possível carregar o perfil do aluno.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.ALUNOS} label="Voltar para Alunos" />
        <PageHeader
          title="Perfil do aluno"
          subtitle={alunoQuery.data?.nome}
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : alunoQuery.isPending || !alunoQuery.data ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando perfil do aluno...
        </div>
      ) : (
        <AlunoProfile aluno={alunoQuery.data} />
      )}
    </div>
  );
}
