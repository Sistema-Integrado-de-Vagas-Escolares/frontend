'use client';

import { useEffect, useState, type FormEvent } from 'react';
import type { Turma } from '@/entities/turma';

interface VagasUpdateFormProps {
  turma: Turma;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  onSubmit: (payload: {
    turmaId: string;
    vagasDisponiveis: number;
    motivo: string;
  }) => Promise<void>;
}

export function VagasUpdateForm({
  turma,
  isSubmitting,
  errorMessage,
  successMessage,
  onSubmit,
}: VagasUpdateFormProps) {
  const [vagasInput, setVagasInput] = useState(String(turma.vagasDisponiveis));
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    setVagasInput(String(turma.vagasDisponiveis));
  }, [turma.vagasDisponiveis]);

  const vagasNumero = Number(vagasInput);
  const vagasValidas =
    vagasInput.trim() !== '' &&
    Number.isInteger(vagasNumero) &&
    vagasNumero >= 0 &&
    vagasNumero <= turma.vagasTotais &&
    vagasNumero !== turma.vagasDisponiveis;

  const canSubmit = !isSubmitting && vagasValidas && motivo.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      turmaId: turma.id,
      vagasDisponiveis: vagasNumero,
      motivo: motivo.trim(),
    });
    setMotivo('');
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="flex flex-col gap-[16px] rounded-[16px] border border-[#e8edf8] bg-white p-[21px]"
    >
      <div className="flex items-center gap-[12px]">
        <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[14px] bg-[rgba(59,95,224,0.1)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/vagas/arrows-blue.svg"
            alt=""
            width={20}
            height={20}
            className="size-[20px]"
          />
        </div>
        <div>
          <h2 className="text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-[#263238]">
            Atualizar disponibilidade de vagas
          </h2>
          <p className="text-[12px] font-normal leading-[16px] text-[#979799]">
            Ajuste manual de vagas disponíveis desta turma com registro no
            histórico.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="vagas-quantidade"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Nova quantidade de vagas disponíveis
          </label>
          <input
            id="vagas-quantidade"
            type="number"
            min={0}
            max={turma.vagasTotais}
            step={1}
            value={vagasInput}
            onChange={(event) => setVagasInput(event.target.value)}
            className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
          <p className="text-[11px] text-[#979799]">
            Atual: {turma.vagasDisponiveis} vagas · Capacidade da turma:{' '}
            {turma.vagasTotais} vagas
          </p>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label
            htmlFor="vagas-motivo"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Motivo da atualização *
          </label>
          <input
            id="vagas-motivo"
            type="text"
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            placeholder="ex: Cancelamento de matrícula ou Novas matrículas"
            className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
        >
          {errorMessage}
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex h-[44px] cursor-pointer items-center justify-center rounded-[14px] bg-[#3b5fe0] px-[20px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#3252c7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Confirmar atualização de vagas'}
        </button>
      </div>
    </form>
  );
}
