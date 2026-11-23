'use client';

import {
  TIPO_RESPOSTA_LABELS,
  TIPO_RESPOSTA_OPTIONS,
  type Criterio,
  type TipoRespostaCriterio,
} from '@/entities/criterio';
import { cn } from '@/lib/utils';

interface CriterioAccordionItemProps {
  criterio: Criterio;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updated: Criterio) => void;
  onRemove: () => void;
}

export function CriterioAccordionItem({
  criterio,
  isExpanded,
  onToggleExpand,
  onChange,
  onRemove,
}: CriterioAccordionItemProps) {
  const pesoPercent = Math.max(0, Math.min(100, Number(criterio.pontosBase)));

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[16px] border bg-white transition-colors',
        isExpanded ? 'border-[#3b5fe0]/50 shadow-xs' : 'border-[#e8edf8]',
      )}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center justify-between gap-[12px] px-[18px] py-[14px] text-left transition-colors hover:bg-[#f8fafd]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="truncate text-[14px] font-semibold leading-[20px] text-[#263238]">
              {criterio.nome.trim() || 'Novo critério (sem nome)'}
            </span>
            <span className="rounded-full bg-[#f0f4ff] px-[8px] py-[2px] text-[11px] font-medium text-[#5e6062]">
              {TIPO_RESPOSTA_LABELS[criterio.tipoResposta]}
            </span>
            <span
              className={cn(
                'rounded-full px-[8px] py-[2px] text-[11px] font-semibold',
                criterio.ativo
                  ? 'bg-[#ecfdf5] text-[#009966]'
                  : 'bg-[#f1f5f9] text-[#64748b]',
              )}
            >
              {criterio.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[12px]">
          <span className="text-[16px] font-bold text-[#3b5fe0]">
            {pesoPercent}%
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/chevron-down.svg"
            alt=""
            width={18}
            height={18}
            className={cn(
              'size-[18px] transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        </div>
      </button>

      {isExpanded ? (
        <div className="flex flex-col gap-[16px] border-t border-[#f0f4ff] px-[18px] py-[18px]">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
              Nome do critério *
            </label>
            <input
              type="text"
              value={criterio.nome}
              onChange={(event) =>
                onChange({ ...criterio, nome: event.target.value })
              }
              placeholder="ex: Renda familiar per capita"
              className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
              Descrição / como é avaliado
            </label>
            <textarea
              value={criterio.descricao}
              onChange={(event) =>
                onChange({ ...criterio, descricao: event.target.value })
              }
              placeholder="Explique como esse critério será avaliado e quais documentos comprovam..."
              rows={2}
              className="min-h-[72px] w-full resize-y rounded-[14px] bg-[#f0f4ff] px-[16px] py-[12px] text-[14px] leading-[20px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
          </div>

          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
                Peso na pontuação (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={criterio.pontosBase}
                onChange={(event) => {
                  const val = Number(event.target.value);
                  onChange({
                    ...criterio,
                    pontosBase: Number.isNaN(val) ? 0 : Math.max(0, Math.min(100, val)),
                  });
                }}
                className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
                Tipo de resposta
              </label>
              <div className="relative">
                <select
                  value={criterio.tipoResposta}
                  onChange={(event) => {
                    const tipoResposta = event.target
                      .value as TipoRespostaCriterio;
                    onChange({
                      ...criterio,
                      tipoResposta,
                      categoria:
                        tipoResposta === 'DISTANCIA' ? 'GEOGRAFICO' : 'SOCIAL',
                    });
                  }}
                  className="h-[44px] w-full cursor-pointer appearance-none rounded-[14px] bg-[#f0f4ff] px-[16px] pr-10 text-[14px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
                >
                  {TIPO_RESPOSTA_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/painel/chevron-down.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="pointer-events-none absolute right-[12px] top-1/2 size-[20px] -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#f0f4ff] pt-[12px]">
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                role="switch"
                aria-checked={criterio.ativo}
                aria-label="Critério ativo"
                onClick={() =>
                  onChange({ ...criterio, ativo: !criterio.ativo })
                }
                className={cn(
                  'flex h-[24px] w-[48px] shrink-0 cursor-pointer items-center rounded-full px-[2px] transition-colors',
                  criterio.ativo ? 'bg-[#00bc7d]' : 'bg-[#e8edf8]',
                )}
              >
                <span
                  className={cn(
                    'size-[20px] rounded-full bg-white shadow-sm transition-transform',
                    criterio.ativo ? 'translate-x-[24px]' : 'translate-x-0',
                  )}
                />
              </button>
              <div>
                <p className="text-[13px] font-medium text-[#263238]">
                  Critério ativo
                </p>
                <p className="text-[11px] text-[#979799]">
                  Critérios inativos não entram na soma nem na pontuação
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex cursor-pointer items-center gap-[6px] rounded-[14px] bg-[#fef2f2] px-[12px] py-[8px] text-[12px] font-semibold text-[#ff6467] transition-colors hover:bg-[#fee2e2]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/criterios/trash-red.svg"
                alt=""
                width={14}
                height={14}
                className="size-[14px]"
              />
              <span>Remover critério</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
