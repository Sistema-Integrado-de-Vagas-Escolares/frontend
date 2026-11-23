'use client';

import { useResponsavelDetalheEscola } from '@/api/escola/use-responsaveis';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { ResponsavelForm } from '@/components/features/responsaveis/responsavel-form';

interface ResponsavelEditarViewProps {
  responsavelId: string;
  backHref: string;
}

export function ResponsavelEditarView({
  responsavelId,
  backHref,
}: ResponsavelEditarViewProps) {
  const responsavelQuery = useResponsavelDetalheEscola(responsavelId, {
    incluirCpfCompleto: true,
  });

  const error =
    responsavelQuery.error instanceof ApiError
      ? responsavelQuery.error.message
      : responsavelQuery.error
        ? 'Não foi possível carregar os dados do responsável.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={backHref} label="Voltar para o perfil" />
        <PageHeader
          title="Editar responsável"
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
          Carregando dados do responsável...
        </div>
      ) : (
        <ResponsavelForm
          initialResponsavel={responsavelQuery.data}
          redirectToAfterSave={backHref}
        />
      )}
    </div>
  );
}
