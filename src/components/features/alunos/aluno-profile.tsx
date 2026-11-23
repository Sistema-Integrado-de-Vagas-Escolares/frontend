'use client';

import { useState } from 'react';
import { differenceInYears, format, isValid, parseISO } from 'date-fns';
import { Check, Copy, Link2 } from 'lucide-react';
import { CpfReveal } from '@/components/common/cpf-reveal';
import { ROUTES } from '@/constants/routes';
import type { AlunoDetalhe, Parentesco, Turno } from '@/entities/aluno';
import { cn } from '@/lib/utils';

const TURNO_LABELS: Record<Turno, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  INTEGRAL: 'Integral',
};

const PARENTESCO_LABELS: Record<Parentesco, string> = {
  MAE: 'Mãe',
  PAI: 'Pai',
  AVOS: 'Avós',
  TUTOR_LEGAL: 'Tutor legal',
  OUTRO: 'Outro',
};

const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  EM_ESPERA: {
    label: 'Em espera',
    className: 'bg-[#fef3c7] text-[#92400e]',
  },
  CHAMADO: {
    label: 'Chamado',
    className: 'bg-[#eef2ff] text-[#3b5fe0]',
  },
  MATRICULADO: {
    label: 'Matriculado',
    className: 'bg-[#d0fae5] text-[#007a55]',
  },
  CANCELADO: {
    label: 'Cancelado',
    className: 'bg-[#fef2f2] text-[#dc2626]',
  },
  EXPIRADO: {
    label: 'Expirado',
    className: 'bg-[#f1f5f9] text-[#64748b]',
  },
};

function formatDateBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return '—';
  return format(parsed, 'dd/MM/yyyy');
}

function formatIdade(iso?: string | null): string {
  if (!iso) return '';
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return '';
  const anos = differenceInYears(new Date(), parsed);
  return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
}

function formatCurrency(value?: number | null): string {
  return Number(value ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function AlunoProfile({ aluno }: { aluno: AlunoDetalhe }) {
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const statusInfo = aluno.statusInscricao
    ? (STATUS_STYLE[aluno.statusInscricao] ?? {
        label: aluno.statusInscricao,
        className: 'bg-[#f1f5f9] text-[#475569]',
      })
    : null;
  const idade = formatIdade(aluno.dataNascimento);

  async function handleCopyProtocol() {
    if (!aluno.protocolo) return;
    try {
      await navigator.clipboard.writeText(aluno.protocolo);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  }

  async function handleCopyTrackingLink() {
    if (!aluno.protocolo) return;
    try {
      const url = `${window.location.origin}${ROUTES.CONSULTA_PROTOCOLO(aluno.protocolo)}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  }

  const enderecoFormatado = aluno.endereco
    ? `${aluno.endereco.rua}, ${aluno.endereco.numero}${
        aluno.endereco.complemento ? ` - ${aluno.endereco.complemento}` : ''
      } · ${aluno.endereco.bairro}, ${aluno.endereco.cidade}/${aluno.endereco.estado} · CEP ${aluno.endereco.cep}`
    : 'Não informado';

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Resumo principal */}
      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div>
            <div className="flex flex-wrap items-center gap-[8px]">
              <h2 className="text-[20px] font-bold leading-[28px] text-[#263238]">
                {aluno.nome}
              </h2>
              {statusInfo ? (
                <span
                  className={cn(
                    'rounded-full px-[10px] py-[3px] text-[12px] font-semibold',
                    statusInfo.className,
                  )}
                >
                  {statusInfo.label}
                </span>
              ) : null}
              {aluno.temNecessidadeEspecial ? (
                <span className="rounded-full bg-[#eef2ff] px-[10px] py-[3px] text-[12px] font-semibold text-[#3b5fe0]">
                  PcD
                </span>
              ) : null}
            </div>
            <p className="flex flex-wrap items-center gap-x-[6px] pt-[4px] text-[13px] text-[#687386]">
              <span className="inline-flex items-center gap-1">
                <span>CPF:</span>
                <CpfReveal cpf={aluno.cpf} />
              </span>
              <span>
                · Nascimento: {formatDateBr(aluno.dataNascimento)}
                {idade ? ` (${idade})` : ''}
              </span>
            </p>
          </div>

          <div className="rounded-[14px] bg-[#f0f4ff] px-[16px] py-[10px] text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#5e6062]">
              Pontuação
            </p>
            <p className="text-[22px] font-bold leading-[26px] text-[#3b5fe0]">
              {Number(aluno.pontuacaoTotal ?? 0).toFixed(1)} pts
            </p>
          </div>
        </div>
      </section>

      {/* Inscrição e Turma */}
      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
            Inscrição na escola
          </h3>
          {aluno.protocolo ? (
            <button
              type="button"
              onClick={handleCopyTrackingLink}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#dce4f7] bg-[#f8faff] px-3 py-1.5 text-[12px] font-semibold text-[#3b5fe0] transition-colors hover:bg-[#eef2ff]"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-[#007a55]" aria-hidden="true" />
                  <span className="text-[#007a55]">Link copiado</span>
                </>
              ) : (
                <>
                  <Link2 className="size-3.5" aria-hidden="true" />
                  <span>Copiar link de acompanhamento</span>
                </>
              )}
            </button>
          ) : null}
        </div>
        <dl className="grid grid-cols-1 gap-[14px] pt-[14px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[12px] text-[#979799]">Protocolo</dt>
            <dd className="flex items-center gap-1.5 pt-[2px] text-[14px] font-semibold text-[#263238]">
              <span>{aluno.protocolo ?? '—'}</span>
              {aluno.protocolo ? (
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  aria-label={
                    copiedProtocol ? 'Protocolo copiado' : 'Copiar protocolo'
                  }
                  title={
                    copiedProtocol ? 'Protocolo copiado' : 'Copiar protocolo'
                  }
                  className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-[#687386] transition-colors hover:bg-[#eef2ff] hover:text-[#3b5fe0]"
                >
                  {copiedProtocol ? (
                    <Check
                      className="size-3.5 text-[#007a55]"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy className="size-3.5" aria-hidden="true" />
                  )}
                </button>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">Nível / Turma</dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#263238]">
              {aluno.etapaOuTurma ?? '—'}
              {aluno.turmaNome ? ` · ${aluno.turmaNome}` : ''}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">Turno solicitado</dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#263238]">
              {aluno.turno ? (TURNO_LABELS[aluno.turno] ?? aluno.turno) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">Data da inscrição</dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#263238]">
              {formatDateBr(aluno.dataInscricao)}
            </dd>
          </div>
        </dl>
      </section>

      {/* Endereço e Renda */}
      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
          Dados socioeconômicos e endereço
        </h3>
        <dl className="grid grid-cols-1 gap-[14px] pt-[14px] sm:grid-cols-2">
          <div>
            <dt className="text-[12px] text-[#979799]">
              Renda familiar per capita
            </dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#263238]">
              {formatCurrency(aluno.rendaPerCapita)}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">
              Deficiência / necessidade especial
            </dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#263238]">
              {aluno.temNecessidadeEspecial ? 'Sim' : 'Não'}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[12px] text-[#979799]">Endereço residencial</dt>
            <dd className="pt-[2px] text-[14px] font-medium text-[#263238]">
              {enderecoFormatado}
            </dd>
          </div>
        </dl>
      </section>

      {/* Responsáveis vinculados */}
      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
          Responsáveis vinculados ({aluno.responsaveis.length})
        </h3>
        {aluno.responsaveis.length === 0 ? (
          <p className="pt-[12px] text-sm text-[#979799]">
            Nenhum responsável vinculado.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#f0f4ff] pt-[12px]">
            {aluno.responsaveis.map((resp) => (
              <li
                key={resp.id}
                className="flex flex-wrap items-center justify-between gap-[12px] py-[12px] first:pt-0 last:pb-0"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <p className="text-[14px] font-semibold text-[#263238]">
                      {resp.nome}
                    </p>
                    <span className="rounded-full bg-[#f0f4ff] px-[8px] py-[2px] text-[11px] font-medium text-[#5e6062]">
                      {PARENTESCO_LABELS[resp.parentesco] ?? resp.parentesco}
                    </span>
                    {resp.contatoPrincipal ? (
                      <span className="rounded-full bg-[#d0fae5] px-[8px] py-[2px] text-[11px] font-semibold text-[#007a55]">
                        Contato principal
                      </span>
                    ) : null}
                  </div>
                  <p className="flex items-center gap-1 pt-[2px] text-[12px] text-[#979799]">
                    <span>CPF:</span>
                    <CpfReveal cpf={resp.cpf} />
                  </p>
                </div>

                <p className="text-[13px] font-medium text-[#3b5fe0]">
                  {resp.telefone}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
