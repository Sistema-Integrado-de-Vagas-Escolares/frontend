'use client';

import { use } from 'react';
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
  const responsavelQuery = useResponsavelDetalheEscola(responsavelId);

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
        <PageHeader
          title="Perfil do responsável"
          subtitle={responsavelQuery.data?.nome}
        />
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
