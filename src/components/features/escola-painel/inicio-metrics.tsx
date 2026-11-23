'use client';

import type { Escola } from '@/entities/auth';
import type { ResumoPainelEscola } from '@/entities/painel';

interface InicioMetricsProps {
  escola: Escola | null;
  resumo: ResumoPainelEscola | null;
  isLoading: boolean;
}

export function InicioMetrics({
  escola,
  resumo,
  isLoading,
}: InicioMetricsProps) {
  const vagasDisponiveis = resumo?.vagasDisponiveis ?? 0;
  const totalEmEspera = resumo?.totalEmEspera ?? 0;
  const totalMatriculados = resumo?.totalMatriculados ?? 0;
  const capacidadeTotal =
    resumo?.capacidadeTotal ?? escola?.capacidadeTotal ?? 0;

  const cards = [
    {
      label: 'Vagas disponíveis',
      value: isLoading ? '—' : vagasDisponiveis,
      valueColor: 'text-[#22c55e]',
    },
    {
      label: 'Em lista de espera',
      value: isLoading ? '—' : totalEmEspera,
      valueColor: 'text-[#d97706]',
    },
    {
      label: 'Alunos matriculados',
      value: isLoading ? '—' : totalMatriculados,
      valueColor: 'text-[#3b5fe0]',
    },
    {
      label: 'Capacidade total',
      value: isLoading ? '—' : capacidadeTotal,
      valueColor: 'text-[#5e6062]',
    },
  ];

  return (
    <section
      aria-label="Indicadores da escola"
      className="grid grid-cols-1 gap-[12px] pt-[24px] sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col items-center justify-center rounded-[16px] border border-[#e8edf8] bg-white p-[17px] text-center"
        >
          <p
            className={`text-[24px] font-bold leading-[32px] tracking-[0.0703px] ${card.valueColor}`}
          >
            {card.value}
          </p>
          <p className="pt-[4px] text-[12px] font-normal leading-[16.5px] text-[#979799]">
            {card.label}
          </p>
        </div>
      ))}
    </section>
  );
}
