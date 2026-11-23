'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useCriteriosEscola } from '@/api/escola/use-criterios';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { EmptyState } from '@/components/common/empty-state';
import { PageHeader } from '@/components/common/page-header';
import { CriterioCard } from '@/components/features/criterios/criterio-card';
import { CriteriosChart } from '@/components/features/criterios/criterios-chart';
import { ROUTES } from '@/constants/routes';

export default function CriteriosPage() {
  const criteriosQuery = useCriteriosEscola();
  const criterios = useMemo(
    () => criteriosQuery.data ?? [],
    [criteriosQuery.data],
  );

  const somaAtivos = useMemo(
    () =>
      criterios
        .filter((c) => c.ativo)
        .reduce((acc, c) => acc + Number(c.pontosBase), 0),
    [criterios],
  );

  const queryError =
    criteriosQuery.error instanceof ApiError
      ? criteriosQuery.error.message
      : criteriosQuery.error
        ? 'Não foi possível carregar os critérios.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.HOME} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Critérios de Fila"
            subtitle="Pesos e regras de classificação da lista de espera"
          />

          <Link
            href={ROUTES.CRITERIOS_EDITAR}
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
            <span>Editar Critérios</span>
          </Link>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]">
        <div className="flex flex-wrap items-center justify-between gap-[12px]">
          <div className="flex items-start gap-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/painel/criterios/info-blue.svg"
              alt=""
              width={16}
              height={16}
              className="mt-[2px] size-[16px] shrink-0"
            />
            <p className="text-[12px] font-normal leading-[19.5px] text-[#979799]">
              A soma dos pesos dos critérios ativos deve ser exatamente{' '}
              <strong className="font-bold text-[#5e6062]">100%</strong>. Em
              caso de empate na pontuação total, o desempate segue a{' '}
              <strong className="font-bold text-[#5e6062]">
                data de inscrição
              </strong>{' '}
              mais antiga.
            </p>
          </div>

          <span className="rounded-[14px] bg-[#d0fae5] px-[12px] py-[6px] text-[12px] font-semibold text-[#007a55]">
            {somaAtivos}% atribuído
          </span>
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

      {criteriosQuery.isPending ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando critérios...
        </div>
      ) : criterios.length === 0 ? (
        <EmptyState message="Nenhum critério cadastrado até o momento." />
      ) : (
        <>
          <div className="flex flex-col gap-[12px]">
            {criterios.map((criterio, index) => (
              <CriterioCard
                key={criterio.id ?? `${criterio.nome}-${index}`}
                criterio={criterio}
              />
            ))}
          </div>

          <CriteriosChart criterios={criterios} />
        </>
      )}
    </div>
  );
}
