'use client';

import { useAlunoDetalheEscola } from '@/api/escola/use-alunos';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoForm } from '@/components/features/alunos/aluno-form';

interface AlunoEditarViewProps {
  alunoId: string;
  backHref: string;
}

export function AlunoEditarView({ alunoId, backHref }: AlunoEditarViewProps) {
  const alunoQuery = useAlunoDetalheEscola(alunoId);

  const error =
    alunoQuery.error instanceof ApiError
      ? alunoQuery.error.message
      : alunoQuery.error
        ? 'Não foi possível carregar os dados do aluno.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={backHref} label="Voltar para o perfil" />
        <PageHeader title="Editar aluno" subtitle={alunoQuery.data?.nome} />
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
          Carregando dados do aluno...
        </div>
      ) : (
        <AlunoForm
          initialAluno={alunoQuery.data}
          redirectToAfterSave={backHref}
        />
      )}
    </div>
  );
}
