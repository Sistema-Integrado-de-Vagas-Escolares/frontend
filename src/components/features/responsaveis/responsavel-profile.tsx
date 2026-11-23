'use client';

import Link from 'next/link';
import { format, isValid, parseISO } from 'date-fns';
import { ROUTES } from '@/constants/routes';
import type { Parentesco } from '@/entities/aluno';
import type { ResponsavelDetalhe } from '@/entities/responsavel';
import { cn } from '@/lib/utils';

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

export function ResponsavelProfile({
  responsavel,
}: {
  responsavel: ResponsavelDetalhe;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
          Dados do responsável
        </h2>
        <dl className="grid grid-cols-1 gap-[14px] pt-[14px] sm:grid-cols-3">
          <div>
            <dt className="text-[12px] text-[#979799]">Nome completo</dt>
            <dd className="pt-[2px] text-[15px] font-semibold text-[#263238]">
              {responsavel.nome}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">CPF</dt>
            <dd className="pt-[2px] font-mono text-[14px] font-medium text-[#263238]">
              {responsavel.cpf}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] text-[#979799]">Telefone</dt>
            <dd className="pt-[2px] text-[14px] font-semibold text-[#3b5fe0]">
              {responsavel.telefone}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h2 className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
          Filhos vinculados ({responsavel.filhos.length})
        </h2>

        {responsavel.filhos.length === 0 ? (
          <p className="pt-[12px] text-sm text-[#979799]">
            Nenhum aluno vinculado a este responsável.
          </p>
        ) : (
          <div className="flex flex-col gap-[10px] pt-[14px]">
            {responsavel.filhos.map((filho) => {
              const statusInfo = filho.statusInscricao
                ? (STATUS_STYLE[filho.statusInscricao] ?? {
                    label: filho.statusInscricao,
                    className: 'bg-[#f1f5f9] text-[#475569]',
                  })
                : null;

              return (
                <Link
                  key={filho.id}
                  href={ROUTES.RESPONSAVEL_ALUNO_DETALHE(
                    responsavel.id,
                    filho.id,
                  )}
                  className="group flex items-center justify-between gap-[12px] rounded-[14px] border border-[#e8edf8] bg-[#f8fafd] p-[16px] transition-all hover:border-[#3b5fe0]/40 hover:bg-white"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-[8px]">
                      <p className="text-[15px] font-semibold text-[#263238] group-hover:text-[#3b5fe0]">
                        {filho.nome}
                      </p>
                      <span className="rounded-full bg-white px-[8px] py-[2px] text-[11px] font-medium text-[#5e6062]">
                        {PARENTESCO_LABELS[filho.parentesco] ??
                          filho.parentesco}
                      </span>
                      {filho.contatoPrincipal ? (
                        <span className="rounded-full bg-[#d0fae5] px-[8px] py-[2px] text-[11px] font-semibold text-[#007a55]">
                          Contato principal
                        </span>
                      ) : null}
                      {statusInfo ? (
                        <span
                          className={cn(
                            'rounded-full px-[8px] py-[2px] text-[11px] font-semibold',
                            statusInfo.className,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      ) : null}
                    </div>

                    <p className="pt-[4px] text-[12px] text-[#687386]">
                      CPF: {filho.cpf} · Nascimento:{' '}
                      {formatDateBr(filho.dataNascimento)} ·{' '}
                      {filho.etapaOuTurma}
                      {filho.turmaNome ? ` (${filho.turmaNome})` : ''}
                      {filho.pontuacaoTotal !== null
                        ? ` · ${Number(filho.pontuacaoTotal).toFixed(1)} pts`
                        : ''}
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
