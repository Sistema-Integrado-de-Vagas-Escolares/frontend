'use client';

import { useState } from 'react';
import type {
  AcaoGerenciarChamado,
  InscricaoEscolaResumo,
} from '@/entities/inscricao';
import type { Turma } from '@/entities/turma';
import { cn } from '@/lib/utils';
import {
  calcularDiasRestantesMatricula,
  calcularIdadeResumo,
} from './inscricao-list-item';

interface GerenciarChamadoModalProps {
  inscricao: InscricaoEscolaResumo;
  turmas: Turma[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirmAction: (
    acao: AcaoGerenciarChamado,
    turmaId?: string,
  ) => Promise<void>;
}

const TURNO_LABELS: Record<string, string> = {
  INTEGRAL: 'Integral',
  MANHA: 'Manhã',
  TARDE: 'Tarde',
};

const ACAO_CONFIRM_CONFIG: Record<
  AcaoGerenciarChamado,
  {
    title: string;
    description: (nome: string) => string;
    confirmLabel: string;
    buttonClass: string;
  }
> = {
  ACEITAR: {
    title: 'Registrar aceite?',
    description: (nome) => `Confirme o aceite da vaga para ${nome}.`,
    confirmLabel: 'Confirmar aceite',
    buttonClass: 'bg-[#3b5fe0] hover:bg-[#3252c7]',
  },
  RECUSAR: {
    title: 'Registrar recusa?',
    description: (nome) =>
      `Confirme que o responsável por ${nome} recusou a vaga.`,
    confirmLabel: 'Confirmar recusa',
    buttonClass: 'bg-[#bb2635] hover:bg-[#9f1f2c]',
  },
  DESISTIR: {
    title: 'Registrar desistência?',
    description: (nome) =>
      `Confirme a desistência do responsável por ${nome} neste chamado.`,
    confirmLabel: 'Confirmar desistência',
    buttonClass: 'bg-[#bb2635] hover:bg-[#9f1f2c]',
  },
  REPASSAR: {
    title: 'Repassar vaga?',
    description: (nome) =>
      `${nome} será registrado como não compareceu no prazo. A vaga ficará disponível para um novo chamado.`,
    confirmLabel: 'Repassar vaga',
    buttonClass: 'bg-[#bb2635] hover:bg-[#9f1f2c]',
  },
  DESFAZER: {
    title: 'Desfazer chamado?',
    description: (nome) =>
      `O chamado de ${nome} será desfeito e ele retornará para a lista de espera.`,
    confirmLabel: 'Desfazer chamado',
    buttonClass: 'bg-[#934500] hover:bg-[#783800]',
  },
};

function formatDataHoraBr(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function GerenciarChamadoModal({
  inscricao,
  turmas,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirmAction,
}: GerenciarChamadoModalProps) {
  const [selectedAction, setSelectedAction] =
    useState<AcaoGerenciarChamado | null>(null);
  const turmasDisponiveis = turmas.filter((t) => t.vagasDisponiveis > 0);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(
    inscricao.turmaId ?? turmasDisponiveis[0]?.id ?? '',
  );
  const [turmaError, setTurmaError] = useState<string | null>(null);

  const diasRestantes = calcularDiasRestantesMatricula(inscricao.dataChamada);
  const idade = calcularIdadeResumo(inscricao.alunoDataNascimento);
  const turnoLabel = inscricao.turno
    ? (TURNO_LABELS[inscricao.turno] ?? inscricao.turno)
    : '—';
  const dataChamadaBr = formatDataHoraBr(inscricao.dataChamada);
  const pontuacao = Number(inscricao.pontuacaoTotal ?? 0).toFixed(1);

  if (selectedAction) {
    const config = ACAO_CONFIRM_CONFIG[selectedAction];
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <div className="flex w-full max-w-[480px] flex-col gap-[20px] rounded-[16px] border border-[#e5e9f2] bg-white p-[24px] shadow-[0px_12px_40px_0px_rgba(15,26,51,0.14)]">
          <h2
            id="confirm-modal-title"
            className="text-[20px] font-semibold leading-[30px] text-[#263238]"
          >
            {config.title}
          </h2>

          <p className="text-[12px] font-normal leading-[18px] text-[#626975]">
            {inscricao.alunoNome} · Chamado em: {dataChamadaBr}
          </p>

          <p className="text-[14px] font-normal leading-[21px] text-[#626975]">
            {config.description(inscricao.alunoNome)}
          </p>

          {selectedAction === 'ACEITAR' ? (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="turma-matricula-select"
                className="text-[12px] font-semibold text-[#5e6062]"
              >
                Turma para matrícula
              </label>
              <select
                id="turma-matricula-select"
                value={selectedTurmaId}
                onChange={(event) => {
                  setSelectedTurmaId(event.target.value);
                  if (turmaError) setTurmaError(null);
                }}
                className="h-[42px] w-full rounded-[10px] border border-[#e2e7f0] bg-[#f8fafd] px-3 text-[14px] text-[#263238] focus:border-[#3b5fe0] focus:outline-none"
              >
                <option value="">Selecione uma turma</option>
                {turmasDisponiveis.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.serieAno} · {turma.nome} ·{' '}
                    {TURNO_LABELS[turma.turno] ?? turma.turno} (
                    {turma.vagasDisponiveis}{' '}
                    {turma.vagasDisponiveis === 1 ? 'vaga' : 'vagas'})
                  </option>
                ))}
              </select>
              {turmasDisponiveis.length === 0 ? (
                <p className="text-xs text-amber-700">
                  Não há turmas com vagas disponíveis no momento.
                </p>
              ) : null}
              {turmaError ? (
                <p className="text-xs text-red-600">{turmaError}</p>
              ) : null}
            </div>
          ) : null}

          {errorMessage ? (
            <div
              role="alert"
              className="rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
            >
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-[12px]">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setSelectedAction(null);
                setTurmaError(null);
              }}
              className="w-[86px] cursor-pointer rounded-[10px] bg-[#f0f4ff] p-[12px] text-[13px] font-semibold leading-[20px] text-[#3b5fe0] transition-colors hover:bg-[#e3ebff]"
            >
              Voltar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (selectedAction === 'ACEITAR' && !selectedTurmaId) {
                  setTurmaError('Selecione uma turma para confirmar a matrícula.');
                  return;
                }
                void onConfirmAction(
                  selectedAction,
                  selectedAction === 'ACEITAR' ? selectedTurmaId : undefined,
                );
              }}
              className={cn(
                'w-[220px] cursor-pointer rounded-[10px] p-[12px] text-[13px] font-semibold leading-[20px] text-white transition-colors disabled:opacity-60',
                config.buttonClass,
              )}
            >
              {isSubmitting ? 'Processando...' : config.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gerenciar-chamado-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col gap-[20px] overflow-y-auto rounded-[16px] border border-[#e5e9f2] bg-white p-[24px] shadow-[0px_12px_40px_0px_rgba(15,26,51,0.14)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="gerenciar-chamado-title"
              className="text-[22px] font-semibold leading-[32px] text-[#263238]"
            >
              Gerenciar chamado
            </h2>
            <p className="pt-1 text-[13px] font-normal leading-[19px] text-[#626975]">
              Escolha a ação para este chamado.
            </p>
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex h-[40px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#f0f4ff] text-[14px] font-semibold text-[#626975] hover:bg-[#e3ebff]"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-[6px] rounded-[12px] bg-[#f0f4ff] p-[16px]">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] font-semibold leading-[22px] text-[#263238]">
              {inscricao.alunoNome}
            </p>
            <span className="rounded-full bg-[#fffbeb] px-3 py-0.5 text-[11px] font-semibold leading-[16px] text-[#934500]">
              Chamado
            </span>
          </div>
          <p className="text-[12px] text-[#626975]">
            {inscricao.posicao ? `#${inscricao.posicao} · ` : ''}
            {pontuacao} pts · Chamado em: {dataChamadaBr}
          </p>
          <p className="text-[12px] text-[#626975]">
            {idade} · {inscricao.etapaOuTurma} · {turnoLabel}
          </p>
        </div>

        <div className="rounded-[12px] bg-[#fffbeb] px-[16px] py-[12px]">
          <p className="text-[13px] font-semibold text-[#934500]">
            Fase 2: responsável deve matricular
          </p>
          <p className="pt-0.5 text-[12px] text-[#934500]">
            {diasRestantes} dia(s) restante(s) para matrícula
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold text-[#626975]">
            Resposta ao chamado
          </p>
          {[
            {
              acao: 'ACEITAR' as const,
              title: 'Registrar aceite',
              desc: 'O responsável aceitou a vaga.',
              titleColor: 'text-[#263238]',
            },
            {
              acao: 'RECUSAR' as const,
              title: 'Registrar recusa',
              desc: 'O responsável recusou a vaga.',
              titleColor: 'text-[#263238]',
            },
            {
              acao: 'DESISTIR' as const,
              title: 'Registrar desistência',
              desc: 'O responsável desistiu do chamado.',
              titleColor: 'text-[#263238]',
            },
          ].map((option) => (
            <button
              key={option.acao}
              type="button"
              onClick={() => setSelectedAction(option.acao)}
              className="flex w-full cursor-pointer items-center justify-between rounded-[12px] border border-[#e5e9f2] bg-white px-[16px] py-[12px] text-left transition-colors hover:bg-[#f8fafd]"
            >
              <div>
                <p className={cn('text-[14px] font-semibold', option.titleColor)}>
                  {option.title}
                </p>
                <p className="pt-0.5 text-[12px] text-[#626975]">
                  {option.desc}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/chevron-right.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold text-[#626975]">
            Outras ações
          </p>
          {[
            {
              acao: 'REPASSAR' as const,
              title: 'Repassar vaga',
              desc: 'Não compareceu no prazo.',
              titleColor: 'text-[#bb2635]',
            },
            {
              acao: 'DESFAZER' as const,
              title: 'Desfazer chamado',
              desc: 'Retornar para lista de espera.',
              titleColor: 'text-[#934500]',
            },
          ].map((option) => (
            <button
              key={option.acao}
              type="button"
              onClick={() => setSelectedAction(option.acao)}
              className="flex w-full cursor-pointer items-center justify-between rounded-[12px] border border-[#e5e9f2] bg-white px-[16px] py-[12px] text-left transition-colors hover:bg-[#f8fafd]"
            >
              <div>
                <p className={cn('text-[14px] font-semibold', option.titleColor)}>
                  {option.title}
                </p>
                <p className="pt-0.5 text-[12px] text-[#626975]">
                  {option.desc}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/chevron-right.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0"
              />
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-[10px] bg-[#f0f4ff] px-[20px] py-[10px] text-[13px] font-semibold text-[#3b5fe0] hover:bg-[#e3ebff]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
