'use client';

import { useState, type FormEvent } from 'react';
import { TODOS_NIVEIS } from '@/constants/niveis';
import type { Turno } from '@/entities/aluno';
import type { Turma } from '@/entities/turma';

const TURNO_OPTIONS: { value: Turno; label: string }[] = [
  { value: 'MANHA', label: 'Manhã' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'INTEGRAL', label: 'Integral' },
];

interface TurmaFormProps {
  initialTurma?: Turma | null;
  capacidadeMaximaPermitida: number;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage?: string | null;
  onCancel?: () => void;
  onSubmit: (payload: {
    serieAno: string;
    nome: string;
    turno: Turno;
    vagasTotais: number;
  }) => Promise<void>;
}

export function TurmaForm({
  initialTurma,
  capacidadeMaximaPermitida,
  isSubmitting,
  errorMessage,
  successMessage,
  onCancel,
  onSubmit,
}: TurmaFormProps) {
  const isEditing = Boolean(initialTurma);
  const ocupadas = initialTurma
    ? Math.max(0, initialTurma.vagasTotais - initialTurma.vagasDisponiveis)
    : 0;

  const [serieAno, setSerieAno] = useState<string>(
    initialTurma?.serieAno ?? TODOS_NIVEIS[0],
  );
  const [nome, setNome] = useState(initialTurma?.nome ?? 'Turma A');
  const [turno, setTurno] = useState<Turno>(initialTurma?.turno ?? 'MANHA');
  const [vagasInput, setVagasInput] = useState(
    initialTurma ? String(initialTurma.vagasTotais) : '20',
  );
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);

    const nomeTrimmed = nome.trim();
    if (!nomeTrimmed) {
      setLocalError('Informe a identificação da turma ou sala.');
      return;
    }

    const vagasTotais = Number(vagasInput);
    if (!Number.isInteger(vagasTotais) || vagasTotais <= 0) {
      setLocalError('Informe uma quantidade de vagas maior que zero.');
      return;
    }

    if (isEditing && vagasTotais < ocupadas) {
      setLocalError(
        `O total de vagas não pode ser menor que as ${ocupadas} vagas já ocupadas.`,
      );
      return;
    }

    if (
      capacidadeMaximaPermitida > 0 &&
      vagasTotais > capacidadeMaximaPermitida
    ) {
      setLocalError(
        `A quantidade excede o limite disponível na escola (${capacidadeMaximaPermitida} vagas).`,
      );
      return;
    }

    await onSubmit({
      serieAno,
      nome: nomeTrimmed,
      turno,
      vagasTotais,
    });
  }

  const displayError = localError ?? errorMessage;

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="flex flex-col gap-[16px] rounded-[16px] border border-[#e8edf8] bg-white p-[21px]"
    >
      <div>
        <h2 className="text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-[#263238]">
          {isEditing ? 'Dados da turma' : 'Informações da nova turma'}
        </h2>
        <p className="text-[12px] font-normal leading-[16px] text-[#979799]">
          Limite disponível na capacidade da escola:{' '}
          {capacidadeMaximaPermitida} vagas
          {isEditing && ocupadas > 0
            ? ` · Mínimo permitido pelas matrículas atuais: ${ocupadas} vagas`
            : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="turma-serie"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Série / Nível *
          </label>
          <div className="relative">
            <select
              id="turma-serie"
              value={serieAno}
              onChange={(event) => setSerieAno(event.target.value)}
              className="h-[44px] w-full cursor-pointer appearance-none rounded-[14px] bg-[#f0f4ff] px-[16px] pr-10 text-[14px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            >
              {TODOS_NIVEIS.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel}
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

        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="turma-nome"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Identificação da turma / sala *
          </label>
          <input
            id="turma-nome"
            type="text"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value);
              if (localError) setLocalError(null);
            }}
            placeholder="ex: Turma A, Sala 01, Bloco B - 102"
            className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="turma-turno"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Turno *
          </label>
          <div className="relative">
            <select
              id="turma-turno"
              value={turno}
              onChange={(event) => setTurno(event.target.value as Turno)}
              className="h-[44px] w-full cursor-pointer appearance-none rounded-[14px] bg-[#f0f4ff] px-[16px] pr-10 text-[14px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            >
              {TURNO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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

        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="turma-vagas"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Quantidade total de vagas *
          </label>
          <input
            id="turma-vagas"
            type="number"
            min={Math.max(1, ocupadas)}
            step={1}
            value={vagasInput}
            onChange={(event) => {
              setVagasInput(event.target.value);
              if (localError) setLocalError(null);
            }}
            className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
        </div>
      </div>

      {displayError ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
        >
          {displayError}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          className="rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-[10px] pt-[4px]">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-[44px] cursor-pointer rounded-[14px] bg-[#f0f4ff] px-[20px] text-[14px] font-semibold text-[#5e6062] transition-colors hover:bg-[#e4ebff]"
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[44px] cursor-pointer rounded-[14px] bg-[#3b5fe0] px-[20px] text-[14px] font-semibold text-white transition-colors hover:bg-[#3252c7] disabled:opacity-50"
        >
          {isSubmitting
            ? 'Salvando...'
            : isEditing
              ? 'Salvar alterações da turma'
              : 'Cadastrar turma'}
        </button>
      </div>
    </form>
  );
}
