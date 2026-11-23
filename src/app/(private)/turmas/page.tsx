'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTurmasEscola } from '@/api/escola/use-inscricoes';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { TurmasList } from '@/components/features/turmas/turmas-list';
import { ROUTES } from '@/constants/routes';

export default function TurmasPage() {
  const { escola } = usePainel();
  const turmasQuery = useTurmasEscola();

  const turmas = useMemo(() => turmasQuery.data ?? [], [turmasQuery.data]);
  const totalAlocado = useMemo(
    () => turmas.reduce((acc, turma) => acc + turma.vagasTotais, 0),
    [turmas],
  );
  const capacidadeTotal = escola?.capacidadeTotal ?? totalAlocado;

  const queryError =
    turmasQuery.error instanceof ApiError
      ? turmasQuery.error.message
      : turmasQuery.error
        ? 'Não foi possível carregar as turmas.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.HOME} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Turmas e Vagas"
            subtitle={
              turmasQuery.isPending
                ? 'Carregando...'
                : `${turmas.length} ${turmas.length === 1 ? 'turma cadastrada' : 'turmas cadastradas'} · ${totalAlocado} de ${capacidadeTotal} vagas alocadas`
            }
          />

          <Link
            href={ROUTES.TURMAS_NOVO}
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
            <span>Nova Turma</span>
          </Link>
        </div>
      </div>

      {queryError ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {queryError}
        </div>
      ) : null}

      <TurmasList turmas={turmas} isLoading={turmasQuery.isPending} />
    </div>
  );
}
