'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAlunosEscola } from '@/api/escola/use-alunos';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { FilterBar, type FilterBarOption } from '@/components/common/filter-bar';
import { PageHeader } from '@/components/common/page-header';
import { AlunosList } from '@/components/features/alunos/alunos-list';
import { TODOS_NIVEIS } from '@/constants/niveis';
import { ROUTES } from '@/constants/routes';
import { useDebouncedValue } from '@/hooks/use-debounce';

export default function AlunosPage() {
  const [busca, setBusca] = useState('');
  const [serieAno, setSerieAno] = useState('');
  const debouncedBusca = useDebouncedValue(busca, 250);

  const alunosQuery = useAlunosEscola({
    busca: debouncedBusca,
    serieAno: serieAno || undefined,
  });

  const nivelOptions: FilterBarOption[] = useMemo(
    () => [
      { label: 'Todos os níveis', value: '' },
      ...TODOS_NIVEIS.map((nivel) => ({
        label: nivel,
        value: nivel,
      })),
    ],
    [],
  );

  const alunos = alunosQuery.data ?? [];
  const isLoading = alunosQuery.isPending;
  const error =
    alunosQuery.error instanceof ApiError
      ? alunosQuery.error.message
      : alunosQuery.error
        ? 'Não foi possível carregar os alunos.'
        : null;

  const subtitle = isLoading
    ? 'Carregando...'
    : `${alunos.length} ${alunos.length === 1 ? 'registrada' : 'registradas'}`;

  return (
    <>
      <BackLink href={ROUTES.HOME} />
      <div className="flex flex-col gap-4 pb-[24px] sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Alunos" subtitle={subtitle} />

        <Link
          href={ROUTES.ALUNOS_NOVO}
          className="inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[14px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/plus-white.svg"
            alt=""
            width={16}
            height={16}
            className="size-[16px] shrink-0"
          />
          <span>Cadastrar Aluno</span>
        </Link>
      </div>

      <FilterBar
        searchValue={busca}
        onSearchChange={setBusca}
        searchPlaceholder="Buscar por nome, CPF ou responsável"
        filterLabel="Nível"
        filterValue={serieAno}
        onFilterChange={setSerieAno}
        filterOptions={nivelOptions}
        defaultFilterValue=""
        onRefresh={() => void alunosQuery.refetch()}
        isRefreshing={alunosQuery.isFetching}
      />

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}

      <AlunosList alunos={alunos} isLoading={isLoading} />
    </>
  );
}
