'use client';

import type { Turno } from '@/entities/aluno';
import type { HistoricoVaga } from '@/entities/vaga';

const TURNO_LABELS: Record<Turno, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  INTEGRAL: 'Integral',
};

function formatDateBr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR');
}

interface VagasHistoryListProps {
  historico: HistoricoVaga[];
  isLoading: boolean;
}

export function VagasHistoryList({
  historico,
  isLoading,
}: VagasHistoryListProps) {
  return (
    <section
      aria-label="Histórico de atualizações de vagas"
      className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]"
    >
      <h2 className="text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-[#5e6062]">
        Histórico de atualizações de vagas
      </h2>

      {isLoading ? (
        <p className="py-6 text-center text-xs text-[#979799]">
          Carregando histórico...
        </p>
      ) : historico.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#979799]">
          Nenhuma atualização registrada até o momento.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-[#f0f4ff] pt-[12px]">
          {historico.map((item) => {
            const delta = item.vagasNovas - item.vagasAnteriores;
            const isPositive = delta >= 0;
            const deltaText = isPositive ? `+${delta}` : `${delta}`;

            return (
              <li
                key={item.id}
                className="flex items-start gap-[12px] py-[12px] first:pt-0 last:pb-0"
              >
                <div
                  className={`flex size-[36px] shrink-0 items-center justify-center rounded-[14px] ${
                    isPositive ? 'bg-[#d0fae5]' : 'bg-[#fef2f2]'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      isPositive
                        ? '/images/painel/vagas/arrows-green.svg'
                        : '/images/painel/vagas/arrows-red.svg'
                    }
                    alt=""
                    width={16}
                    height={16}
                    className="size-[16px]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] ${
                      isPositive ? 'text-[#009966]' : 'text-[#fb2c36]'
                    }`}
                  >
                    {item.vagasAnteriores} → {item.vagasNovas} vagas (
                    {deltaText})
                  </p>
                  <p className="pt-[2px] text-[12px] font-normal leading-[16px] text-[#5e6062]">
                    {item.motivo}
                    {item.serieAno
                      ? ` · ${item.serieAno}${item.turmaNome ? ` (${item.turmaNome})` : ''} · ${TURNO_LABELS[item.turno] ?? item.turno}`
                      : ''}
                  </p>
                  <p className="pt-[2px] text-[12px] font-normal leading-[16px] text-[#bfc5d2]">
                    {formatDateBr(item.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
