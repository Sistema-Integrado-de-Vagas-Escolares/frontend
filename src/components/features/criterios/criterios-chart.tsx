'use client';

import type { Criterio } from '@/entities/criterio';

interface CriteriosChartProps {
  criterios: Criterio[];
}

export function CriteriosChart({ criterios }: CriteriosChartProps) {
  const ativos = criterios.filter((c) => c.ativo);

  if (ativos.length === 0) {
    return null;
  }

  const maxPeso = Math.max(50, ...ativos.map((c) => Number(c.pontosBase)));
  const ticks = [0, Math.round(maxPeso * 0.3), Math.round(maxPeso * 0.6), maxPeso];

  return (
    <section
      aria-label="Distribuição dos pesos ativos"
      className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]"
    >
      <h2 className="text-[14px] font-semibold leading-[20px] text-[#5e6062]">
        Distribuição dos pesos ativos
      </h2>

      <div className="flex flex-col gap-[10px] pt-[16px]">
        {ativos.map((criterio, index) => {
          const peso = Number(criterio.pontosBase);
          const widthPercent = Math.max(2, (peso / maxPeso) * 100);

          return (
            <div
              key={criterio.id ?? `${criterio.nome}-${index}`}
              className="grid grid-cols-[140px_1fr_42px] items-center gap-[12px] sm:grid-cols-[200px_1fr_48px]"
            >
              <span className="truncate text-right text-[11px] font-normal leading-[14px] text-[#5e6062]">
                {criterio.nome}
              </span>
              <div className="h-[18px] w-full overflow-hidden rounded-[6px] bg-[#f8fafd]">
                <div
                  className="h-full rounded-[6px] bg-[#3b5fe0] transition-all"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span className="text-right text-[11px] font-semibold text-[#3b5fe0]">
                {peso}%
              </span>
            </div>
          );
        })}

        <div className="grid grid-cols-[140px_1fr_42px] items-center gap-[12px] pt-[4px] sm:grid-cols-[200px_1fr_48px]">
          <span />
          <div className="flex justify-between text-[10px] text-[#979799]">
            {ticks.map((tick) => (
              <span key={tick}>{tick}%</span>
            ))}
          </div>
          <span />
        </div>
      </div>
    </section>
  );
}
