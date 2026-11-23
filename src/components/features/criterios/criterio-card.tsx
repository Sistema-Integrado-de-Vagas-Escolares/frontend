'use client';

import {
  TIPO_RESPOSTA_LABELS,
  type Criterio,
} from '@/entities/criterio';
import { cn } from '@/lib/utils';

interface CriterioCardProps {
  criterio: Criterio;
}

export function CriterioCard({ criterio }: CriterioCardProps) {
  const pesoPercent = Math.max(0, Math.min(100, Number(criterio.pontosBase)));

  return (
    <article
      className={cn(
        'rounded-[16px] border border-[#e8edf8] bg-white p-[17px] transition-opacity',
        !criterio.ativo && 'opacity-65',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[8px]">
            <h3 className="text-[14px] font-semibold leading-[20px] text-[#263238]">
              {criterio.nome}
            </h3>
            <span className="rounded-full bg-[#f0f4ff] px-[8px] py-[2px] text-[12px] font-normal leading-[16px] text-[#5e6062]">
              {TIPO_RESPOSTA_LABELS[criterio.tipoResposta]}
            </span>
            <span
              className={cn(
                'rounded-full px-[8px] py-[2px] text-[11px] font-semibold leading-[16px]',
                criterio.ativo
                  ? 'bg-[#ecfdf5] text-[#009966]'
                  : 'bg-[#f1f5f9] text-[#64748b]',
              )}
            >
              {criterio.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {criterio.descricao ? (
            <p className="pt-[4px] text-[12px] font-normal leading-[19.5px] text-[#979799]">
              {criterio.descricao}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[24px] font-bold leading-[24px] text-[#3b5fe0]">
            {pesoPercent}%
          </p>
          <p className="text-[12px] font-normal leading-[16px] text-[#979799]">
            peso
          </p>
        </div>
      </div>

      <div className="pt-[10px]">
        <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
          <div
            className={cn(
              'h-[8px] rounded-full transition-all',
              criterio.ativo ? 'bg-[#3b5fe0]' : 'bg-[#bfc5d2]',
            )}
            style={{ width: `${pesoPercent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
