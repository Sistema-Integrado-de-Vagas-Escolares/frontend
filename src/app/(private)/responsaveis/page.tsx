'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useResponsaveisEscola } from '@/api/escola/use-responsaveis';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { FilterBar } from '@/components/common/filter-bar';
import { PageHeader } from '@/components/common/page-header';
import { ResponsaveisList } from '@/components/features/responsaveis/responsaveis-list';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/use-debounce';

export default function ResponsaveisPage() {
  const [busca, setBusca] = useState('');
  const debouncedBusca = useDebouncedValue(busca, 250);

  const responsaveisQuery = useResponsaveisEscola({
    busca: debouncedBusca,
  });

  const responsaveis = responsaveisQuery.data ?? [];
  const isLoading = responsaveisQuery.isPending;
  const error =
    responsaveisQuery.error instanceof ApiError
      ? responsaveisQuery.error.message
      : responsaveisQuery.error
        ? 'Não foi possível carregar os responsáveis.'
        : null;

  const subtitle = isLoading
    ? 'Carregando...'
    : `${responsaveis.length} ${responsaveis.length === 1 ? 'cadastrado' : 'cadastrados'}`;

  return (
    <>
      <BackLink href={ROUTES.HOME} />
      <div className="flex flex-col gap-4 pb-[24px] sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Responsáveis" subtitle={subtitle} />

        <Link
          href={ROUTES.RESPONSAVEIS_NOVO}
          className="inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[14px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/user-plus.svg"
            alt=""
            width={16}
            height={16}
            className="size-[16px] shrink-0"
          />
          <span>Novo Responsável</span>
        </Link>
      </div>

      <FilterBar
        searchValue={busca}
        onSearchChange={setBusca}
        searchPlaceholder="Buscar por nome ou CPF do responsável"
        onRefresh={() => void responsaveisQuery.refetch()}
        isRefreshing={responsaveisQuery.isFetching}
      />

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}

      <ResponsaveisList responsaveis={responsaveis} isLoading={isLoading} />
    </>
  );
}
