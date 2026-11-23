'use client';

import { use } from 'react';
import Link from 'next/link';
import { useResponsavelDetalheEscola } from '@/api/escola/use-responsaveis';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { ResponsavelProfile } from '@/components/features/responsaveis/responsavel-profile';
import { ROUTES } from '@/constants/routes';

export default function ResponsavelDetalhePage({
  params,
}: {
  params: Promise<{ responsavelId: string }>;
}) {
  const { responsavelId } = use(params);
  const responsavelQuery = useResponsavelDetalheEscola(responsavelId, {
    incluirCpfCompleto: true,
  });

  const error =
    responsavelQuery.error instanceof ApiError
      ? responsavelQuery.error.message
      : responsavelQuery.error
        ? 'Não foi possível carregar o responsável.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.RESPONSAVEIS} label="Voltar para Responsáveis" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Perfil do responsável"
            subtitle={responsavelQuery.data?.nome}
          />

          {responsavelQuery.data ? (
            <Link
              href={ROUTES.RESPONSAVEL_EDITAR(responsavelId)}
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
              <span>Editar responsável</span>
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
      ) : responsavelQuery.isPending || !responsavelQuery.data ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando perfil do responsável...
        </div>
      ) : (
        <ResponsavelProfile responsavel={responsavelQuery.data} />
      )}
    </div>
  );
}
