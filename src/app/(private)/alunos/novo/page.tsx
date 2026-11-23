'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoForm } from '@/components/features/alunos/aluno-form';
import { ROUTES } from '@/constants/routes';

function NovoAlunoContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const responsavelId = searchParams.get('responsavelId') ?? undefined;
  const backHref = responsavelId
    ? ROUTES.RESPONSAVEL_DETALHE(responsavelId)
    : ROUTES.ALUNOS;

  return (
    <div>
      <BackLink href={backHref} label="Voltar" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Cadastrar aluno"
          subtitle="Nova inscrição na lista de espera"
        />

        <button
          type="submit"
          form="aluno-form"
          disabled={isSubmitting}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/plus-white.svg"
            alt=""
            width={16}
            height={16}
            className="size-[16px] shrink-0"
          />
          <span>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar na lista de espera'}
          </span>
        </button>
      </div>

      <AlunoForm
        formId="aluno-form"
        initialResponsavelId={responsavelId}
        onSubmittingChange={setIsSubmitting}
      />
    </div>
  );
}

export default function NovoAlunoPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando formulário...
        </div>
      }
    >
      <NovoAlunoContent />
    </Suspense>
  );
}
