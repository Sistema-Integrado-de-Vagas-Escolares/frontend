'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCriteriosEscola,
  usePublicarCriterios,
} from '@/api/escola/use-criterios';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { CriterioAccordionItem } from '@/components/features/criterios/criterio-accordion-item';
import { ROUTES } from '@/constants/routes';
import type { Criterio } from '@/entities/criterio';
import { cn } from '@/lib/utils';

export default function EditarCriteriosPage() {
  const router = useRouter();
  const criteriosQuery = useCriteriosEscola();
  const salvarMutation = usePublicarCriterios();

  const [draft, setDraft] = useState<Criterio[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (criteriosQuery.data && draft === null) {
      setDraft(criteriosQuery.data);
    }
  }, [criteriosQuery.data, draft]);

  const criterios = useMemo(
    () => draft ?? criteriosQuery.data ?? [],
    [draft, criteriosQuery.data],
  );

  const somaAtivos = useMemo(
    () =>
      criterios
        .filter((c) => c.ativo)
        .reduce((acc, c) => acc + Number(c.pontosBase), 0),
    [criterios],
  );

  const somaExata100 = Math.abs(somaAtivos - 100) < 0.01;
  const todosTemNome = criterios.every((c) => c.nome.trim().length > 0);
  const canSave =
    !salvarMutation.isPending &&
    criterios.length > 0 &&
    somaExata100 &&
    todosTemNome;

  const diferenca = 100 - somaAtivos;

  function handleChangeItem(index: number, updated: Criterio) {
    setDraft(criterios.map((item, idx) => (idx === index ? updated : item)));
    if (saveError) setSaveError(null);
  }

  function handleRemoveItem(index: number) {
    const next = criterios.filter((_, idx) => idx !== index);
    setDraft(next);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
    if (saveError) setSaveError(null);
  }

  function handleAddNew() {
    const novo: Criterio = {
      nome: '',
      descricao: '',
      pontosBase: Math.max(0, diferenca),
      categoria: 'SOCIAL',
      tipoResposta: 'SIM_NAO',
      ativo: true,
      ordem: criterios.length + 1,
    };
    const next = [...criterios, novo];
    setDraft(next);
    setExpandedIndex(next.length - 1);
    if (saveError) setSaveError(null);
  }

  async function handleSalvar() {
    if (!somaExata100) {
      setSaveError(
        `A soma dos pesos dos critérios ativos deve ser exatamente 100% (atual: ${somaAtivos}%).`,
      );
      return;
    }
    if (!todosTemNome) {
      setSaveError('Preencha o nome de todos os critérios antes de salvar.');
      return;
    }

    setSaveError(null);
    try {
      await salvarMutation.mutateAsync(criterios);
      router.push(ROUTES.CRITERIOS);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return;
      setSaveError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível salvar os critérios.',
      );
    }
  }

  const queryError =
    criteriosQuery.error instanceof ApiError
      ? criteriosQuery.error.message
      : criteriosQuery.error
        ? 'Não foi possível carregar os critérios.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.CRITERIOS} label="Voltar para Critérios" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Editar Critérios de Fila"
            subtitle="Ajuste pesos, descrições ou adicione novos critérios"
          />

          <button
            type="button"
            onClick={() => void handleSalvar()}
            disabled={!canSave}
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
            <span>
              {salvarMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
            </span>
          </button>
        </div>
      </div>

      {/* Acompanhamento da soma das pontuações */}
      <section
        aria-label="Acompanhamento da soma dos pesos"
        className="rounded-[16px] border border-[#e8edf8] bg-white p-[18px]"
      >
        <div className="flex flex-wrap items-center justify-between gap-[8px]">
          <div>
            <p className="text-[13px] font-semibold text-[#263238]">
              Soma das pontuações ativas
            </p>
            <p className="text-[12px] text-[#979799]">
              {somaExata100
                ? 'Distribuição completa: 100% atribuído e pronto para salvar.'
                : diferenca > 0
                  ? `Faltam ${diferenca}% para completar 100%.`
                  : `Excede em ${Math.abs(diferenca)}% o limite de 100%.`}
            </p>
          </div>

          <span
            className={cn(
              'rounded-[14px] px-[12px] py-[6px] text-[13px] font-bold',
              somaExata100
                ? 'bg-[#d0fae5] text-[#007a55]'
                : diferenca > 0
                  ? 'bg-[#fef3c7] text-[#92400e]'
                  : 'bg-[#fef2f2] text-[#dc2626]',
            )}
          >
            {somaAtivos}% / 100%
          </span>
        </div>

        <div className="mt-[10px] h-[8px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              somaExata100
                ? 'bg-[#00bc7d]'
                : diferenca > 0
                  ? 'bg-[#f59e0b]'
                  : 'bg-[#ef4444]',
            )}
            style={{ width: `${Math.min(100, Math.max(0, somaAtivos))}%` }}
          />
        </div>
      </section>

      {queryError || saveError ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {saveError ?? queryError}
        </div>
      ) : null}

      {criteriosQuery.isPending ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando critérios...
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {criterios.map((criterio, index) => (
            <CriterioAccordionItem
              key={criterio.id ?? `novo-${index}`}
              criterio={criterio}
              isExpanded={expandedIndex === index}
              onToggleExpand={() =>
                setExpandedIndex((prev) => (prev === index ? null : index))
              }
              onChange={(updated) => handleChangeItem(index, updated)}
              onRemove={() => handleRemoveItem(index)}
            />
          ))}

          <button
            type="button"
            onClick={handleAddNew}
            className="mt-[4px] flex h-[48px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[16px] border border-dashed border-[#3b5fe0]/40 bg-white text-[14px] font-semibold text-[#3b5fe0] transition-colors hover:border-[#3b5fe0] hover:bg-[#f0f4ff]"
          >
            <span>+ Adicionar novo critério</span>
          </button>
        </div>
      )}
    </div>
  );
}
