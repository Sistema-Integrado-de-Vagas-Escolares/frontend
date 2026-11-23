'use client';

import { useState } from 'react';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoForm } from '@/components/features/alunos/aluno-form';
import { ROUTES } from '@/constants/routes';

export default function NovoAlunoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <BackLink href={ROUTES.ALUNOS} label="Voltar" />
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

      <AlunoForm formId="aluno-form" onSubmittingChange={setIsSubmitting} />
    </div>
  );
}
