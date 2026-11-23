'use client';

interface VagasSummaryCardsProps {
  vagasDisponiveis: number;
  alunosMatriculados: number;
  capacidadeTotal: number;
  isLoading?: boolean;
}

export function VagasSummaryCards({
  vagasDisponiveis,
  alunosMatriculados,
  capacidadeTotal,
  isLoading = false,
}: VagasSummaryCardsProps) {
  const cards = [
    {
      label: 'Vagas disponíveis',
      value: vagasDisponiveis,
      valueColor: 'text-[#22c55e]',
    },
    {
      label: 'Alunos matriculados',
      value: alunosMatriculados,
      valueColor: 'text-[#3b5fe0]',
    },
    {
      label: 'Capacidade total',
      value: capacidadeTotal,
      valueColor: 'text-[#5e6062]',
    },
  ];

  return (
    <section
      aria-label="Resumo de vagas"
      className="grid grid-cols-1 gap-[12px] sm:grid-cols-3"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col items-center justify-center rounded-[16px] border border-[#e8edf8] bg-white p-[17px]"
        >
          <p
            className={`text-[24px] font-bold leading-[32px] tracking-[0.0703px] ${card.valueColor}`}
          >
            {isLoading ? '—' : card.value}
          </p>
          <p className="pt-[4px] text-[12px] font-normal leading-[16.5px] text-[#979799]">
            {card.label}
          </p>
        </div>
      ))}
    </section>
  );
}
