'use client';

import Link from 'next/link';
import { useAlunoDetalheEscola } from '@/api/escola/use-alunos';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoProfile } from '@/components/features/alunos/aluno-profile';

interface AlunoDetalheViewProps {
  alunoId: string;
  backHref: string;
  backLabel: string;
  editHref: string;
}

export function AlunoDetalheView({
  alunoId,
  backHref,
  backLabel,
  editHref,
}: AlunoDetalheViewProps) {
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
        <BackLink href={backHref} label={backLabel} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Perfil do aluno"
            subtitle={alunoQuery.data?.nome}
          />

          {alunoQuery.data ? (
            <Link
              href={editHref}
              className="inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[14px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/criterios/edit.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0 brightness-0 invert"
              />
              <span>Editar aluno</span>
            </Link>
          ) : null}
        </div>
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
