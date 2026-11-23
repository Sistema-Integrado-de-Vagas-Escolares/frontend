'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/common/empty-state';
import { ROUTES } from '@/constants/routes';
import type { Turno } from '@/entities/aluno';
import type { Turma } from '@/entities/turma';

const TURNO_LABELS: Record<Turno, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  INTEGRAL: 'Integral',
};

interface TurmasListProps {
  turmas: Turma[];
  isLoading: boolean;
}

export function TurmasList({ turmas, isLoading }: TurmasListProps) {
  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-[#979799]">
        Carregando turmas...
      </div>
    );
  }

  if (turmas.length === 0) {
    return <EmptyState message="Nenhuma turma cadastrada até o momento." />;
  }

  return (
    <div className="grid grid-cols-1 gap-[12px] md:grid-cols-2">
      {turmas.map((turma) => {
        const ocupadas = Math.max(
          0,
          turma.vagasTotais - turma.vagasDisponiveis,
        );
        const ocupacaoPercent =
          turma.vagasTotais > 0
            ? Math.round((ocupadas / turma.vagasTotais) * 100)
            : 0;

        return (
          <Link
            key={turma.id}
            href={ROUTES.TURMA_DETALHE(turma.id)}
            className="group flex flex-col gap-[12px] rounded-[16px] border border-[#e8edf8] bg-white p-[18px] transition-all hover:border-[#3b5fe0]/40 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-[12px]">
              <div>
                <h2 className="text-[16px] font-semibold leading-[22px] text-[#263238] group-hover:text-[#3b5fe0]">
                  {turma.serieAno} · {turma.nome}
                </h2>
                <span className="mt-[4px] inline-flex rounded-full bg-[#f0f4ff] px-[10px] py-[2px] text-[12px] font-medium text-[#3b5fe0]">
                  {TURNO_LABELS[turma.turno] ?? turma.turno}
                </span>
              </div>

              <div className="flex items-center gap-[10px]">
                <div className="text-right">
                  <p className="text-[20px] font-bold leading-[24px] text-[#22c55e]">
                    {turma.vagasDisponiveis}
                  </p>
                  <p className="text-[11px] text-[#979799]">
                    de {turma.vagasTotais} vagas livres
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/painel/chevron-right.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-[16px] shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[12px] text-[#687386]">
                <span>Ocupação ({ocupadas} matriculados)</span>
                <span className="font-semibold text-[#263238]">
                  {ocupacaoPercent}%
                </span>
              </div>
              <div className="mt-[6px] h-[8px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
                <div
                  className="h-full rounded-full bg-[#3b5fe0] transition-all"
                  style={{ width: `${ocupacaoPercent}%` }}
                />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
