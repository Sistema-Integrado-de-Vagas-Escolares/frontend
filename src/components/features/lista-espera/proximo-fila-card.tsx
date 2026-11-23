'use client';

import type { InscricaoEscolaResumo } from '@/entities/inscricao';

interface ProximoFilaCardProps {
  proximo: InscricaoEscolaResumo | null;
  isCalling: boolean;
  onChamarProximo: (inscricaoId: string) => void;
}

const TURNO_LABELS: Record<string, string> = {
  INTEGRAL: 'Integral',
  MANHA: 'Manhã',
  TARDE: 'Tarde',
};

export function ProximoFilaCard({
  proximo,
  isCalling,
  onChamarProximo,
}: ProximoFilaCardProps) {
  const turnoLabel = proximo?.turno
    ? (TURNO_LABELS[proximo.turno] ?? proximo.turno)
    : '—';

  return (
    <section
      aria-label="Próximo da fila"
      className="flex flex-col gap-4 rounded-[16px] border border-[#e8edf8] bg-white p-[20px] sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-[14px] font-semibold leading-[20px] text-[#263238]">
          Próximo da fila
        </p>
        <p className="pt-[2px] text-[13px] font-normal leading-[18px] text-[#687386]">
          {proximo
            ? `#${proximo.posicao ?? 1}º — ${proximo.alunoNome} · ${turnoLabel}`
            : 'Nenhum aluno aguardando na fila no momento'}
        </p>
      </div>

      <button
        type="button"
        disabled={!proximo || isCalling}
        onClick={() => proximo && onChamarProximo(proximo.id)}
        className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-[#3b5fe0] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#3252c7] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/painel/phone-white.svg"
          alt=""
          width={16}
          height={16}
          className="size-[16px] shrink-0"
        />
        <span>{isCalling ? 'Chamando...' : 'Chamar próximo'}</span>
      </button>
    </section>
  );
}
