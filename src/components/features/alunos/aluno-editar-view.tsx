'use client';

import { useState } from 'react';
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
  const alunoQuery = useAlunoDetalheEscola(alunoId, {
    incluirCpfCompleto: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title="Editar aluno" subtitle={alunoQuery.data?.nome} />

          {alunoQuery.data ? (
            <button
              type="submit"
              form="aluno-form"
              disabled={isSubmitting}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/criterios/save-white.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0"
              />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar alterações'}</span>
            </button>
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
          Carregando dados do aluno...
        </div>
      ) : (
        <AlunoForm
          formId="aluno-form"
          initialAluno={alunoQuery.data}
          redirectToAfterSave={backHref}
          onSubmittingChange={setIsSubmitting}
        />
      )}
    </div>
  );
}
