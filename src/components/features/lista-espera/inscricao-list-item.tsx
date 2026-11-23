'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { InscricaoEscolaResumo } from '@/entities/inscricao';
import { cn } from '@/lib/utils';

export const TURNO_LABELS: Record<string, string> = {
  INTEGRAL: 'Integral',
  MANHA: 'Manhã',
  TARDE: 'Tarde',
};

const PRAZO_MATRICULA_DIAS = 3;

export function calcularIdadeResumo(isoDate: string): string {
  if (!isoDate) return '—';
  const nascimento = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(nascimento.getTime())) return '—';

  const hoje = new Date();
  let totalMeses =
    (hoje.getFullYear() - nascimento.getFullYear()) * 12 +
    (hoje.getMonth() - nascimento.getMonth());
  if (hoje.getDate() < nascimento.getDate()) {
    totalMeses -= 1;
  }
  totalMeses = Math.max(0, totalMeses);
  const anos = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  return `${anos}a ${meses}m`;
}

export function calcularDiasRestantesMatricula(
  dataChamada: string | null,
): number {
  if (!dataChamada) return PRAZO_MATRICULA_DIAS;
  const chamadaDate = new Date(dataChamada);
  if (Number.isNaN(chamadaDate.getTime())) return PRAZO_MATRICULA_DIAS;

  const diffMs = Date.now() - chamadaDate.getTime();
  const diasPassados = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  return Math.max(0, PRAZO_MATRICULA_DIAS - diasPassados);
}

interface InscricaoListProps {
  itens: InscricaoEscolaResumo[];
  showPosicao: boolean;
  callingId: string | null;
  onChamar: (inscricaoId: string) => void;
  onGerenciarChamado: (item: InscricaoEscolaResumo) => void;
}

function StatusBadge({ status }: { status: InscricaoEscolaResumo['status'] }) {
  if (status === 'EM_ESPERA') {
    return (
      <span className="inline-block rounded-full bg-[#f1f4f9] px-2.5 py-0.5 text-[11px] font-semibold text-[#5e6062]">
        Em espera
      </span>
    );
  }
  if (status === 'CHAMADO') {
    return (
      <span className="inline-block rounded-full border border-[#f5d576] bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-semibold text-[#934500]">
        Aguardando matrícula
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full border border-[#a3e6b8] bg-[#ecfdf5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
      Matriculado
    </span>
  );
}

function ActionButtons({
  item,
  isCalling,
  onChamar,
  onGerenciarChamado,
}: {
  item: InscricaoEscolaResumo;
  isCalling: boolean;
  onChamar: (inscricaoId: string) => void;
  onGerenciarChamado: (item: InscricaoEscolaResumo) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-[8px]">
      {item.status === 'EM_ESPERA' ? (
        <button
          type="button"
          disabled={isCalling}
          onClick={() => onChamar(item.id)}
          className="inline-flex h-[36px] cursor-pointer items-center justify-center gap-[6px] rounded-[10px] bg-[#3b5fe0] px-[14px] text-[13px] font-semibold text-white transition-colors hover:bg-[#3252c7] disabled:opacity-60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/bell-white.svg"
            alt=""
            width={14}
            height={14}
            className="size-[14px] shrink-0"
          />
          <span>{isCalling ? 'Chamando...' : 'Chamar'}</span>
        </button>
      ) : null}

      {item.status === 'CHAMADO' ? (
        <button
          type="button"
          onClick={() => onGerenciarChamado(item)}
          className="inline-flex h-[36px] cursor-pointer items-center justify-center rounded-[10px] bg-[#3b5fe0] px-[14px] text-[13px] font-semibold text-white transition-colors hover:bg-[#3252c7]"
        >
          Gerenciar chamado
        </button>
      ) : null}

      {item.status === 'MATRICULADO' ? (
        <Link
          href={ROUTES.INSCRICAO_MATRICULA(item.id)}
          className="inline-flex h-[36px] items-center justify-center rounded-[10px] bg-[#3b5fe0] px-[14px] text-[13px] font-semibold text-white transition-colors hover:bg-[#3252c7]"
        >
          Ver matrícula
        </Link>
      ) : null}

      <Link
        href={ROUTES.LISTA_ESPERA_ALUNO_DETALHE(item.alunoId)}
        className="inline-flex h-[36px] items-center justify-center rounded-[10px] bg-[#f0f4ff] px-[14px] text-[13px] font-semibold text-[#5e6062] transition-colors hover:bg-[#e3ebff]"
      >
        Ver perfil
      </Link>
    </div>
  );
}

export function InscricaoList({
  itens,
  showPosicao,
  callingId,
  onChamar,
  onGerenciarChamado,
}: InscricaoListProps) {
  return (
    <section aria-label="Inscrições">
      {/* Desktop: Tabela */}
      <div className="hidden overflow-hidden rounded-[16px] border border-[#e8edf8] bg-white lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e8edf8] bg-[#f8fafd] text-[12px] font-semibold uppercase tracking-[0.4px] text-[#687386]">
              {showPosicao ? <th className="w-20 px-5 py-3.5">Posição</th> : null}
              <th className="px-5 py-3.5">Aluno</th>
              <th className="px-5 py-3.5">Situação</th>
              <th className="px-5 py-3.5">Pontuação</th>
              <th className="px-5 py-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4ff]">
            {itens.map((item) => {
              const idade = calcularIdadeResumo(item.alunoDataNascimento);
              const turnoLabel = item.turno
                ? (TURNO_LABELS[item.turno] ?? item.turno)
                : '—';
              const metadados = `${idade} · ${item.etapaOuTurma} · ${turnoLabel}`;
              const pontuacaoFormatada = Number(
                item.pontuacaoTotal ?? 0,
              ).toFixed(1);
              const diasRestantes = calcularDiasRestantesMatricula(
                item.dataChamada,
              );

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-[#f8fafd]"
                >
                  {showPosicao ? (
                    <td className="px-5 py-4">
                      {item.posicao !== null ? (
                        <span className="inline-flex size-[36px] items-center justify-center rounded-[10px] bg-[#f0f4ff] text-[13px] font-bold text-[#3b5fe0]">
                          #{item.posicao}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  ) : null}

                  <td className="px-5 py-4">
                    <p className="text-[14px] font-semibold text-[#263238]">
                      {item.alunoNome}
                    </p>
                    <p className="pt-[2px] text-[12px] text-[#979799]">
                      {metadados}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={item.status} />
                      {item.status === 'CHAMADO' ? (
                        <span className="text-[12px] font-medium text-[#5e6062]">
                          Resta {diasRestantes}{' '}
                          {diasRestantes === 1 ? 'dia' : 'dias'}
                        </span>
                      ) : item.status === 'MATRICULADO' ? (
                        <span className="text-[12px] font-medium text-[#047857]">
                          Matrícula concluída
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-[13px] font-bold text-[#3b5fe0]">
                    {pontuacaoFormatada} pts
                  </td>

                  <td className="px-5 py-4">
                    <ActionButtons
                      item={item}
                      isCalling={callingId === item.id}
                      onChamar={onChamar}
                      onGerenciarChamado={onGerenciarChamado}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet: Cards */}
      <div className="flex flex-col gap-[12px] lg:hidden">
        {itens.map((item) => {
          const idade = calcularIdadeResumo(item.alunoDataNascimento);
          const turnoLabel = item.turno
            ? (TURNO_LABELS[item.turno] ?? item.turno)
            : '—';
          const metadados = `${idade} · ${item.etapaOuTurma} · ${turnoLabel}`;
          const pontuacaoFormatada = Number(item.pontuacaoTotal ?? 0).toFixed(
            1,
          );
          const diasRestantes = calcularDiasRestantesMatricula(
            item.dataChamada,
          );

          const cardBorderClass =
            item.status === 'CHAMADO'
              ? 'border-[#f5d576]'
              : item.status === 'MATRICULADO'
                ? 'border-[#a3e6b8]'
                : 'border-[#e8edf8]';

          return (
            <article
              key={item.id}
              className={cn(
                'flex flex-col gap-4 rounded-[16px] border bg-white p-[17px]',
                cardBorderClass,
              )}
            >
              <div className="flex min-w-0 items-center gap-[14px]">
                {showPosicao && item.posicao !== null ? (
                  <div className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#f0f4ff] text-[13px] font-bold text-[#3b5fe0]">
                    #{item.posicao}
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-[#263238]">
                    {item.alunoNome}
                  </p>
                  <p className="truncate pt-[2px] text-[12px] text-[#979799]">
                    {metadados}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-[13px] font-bold text-[#3b5fe0]">
                    {pontuacaoFormatada} pts
                  </span>
                  {item.status === 'CHAMADO' ? (
                    <span className="text-[12px] text-[#5e6062]">
                      · Resta {diasRestantes}{' '}
                      {diasRestantes === 1 ? 'dia' : 'dias'}
                    </span>
                  ) : null}
                </div>

                <ActionButtons
                  item={item}
                  isCalling={callingId === item.id}
                  onChamar={onChamar}
                  onGerenciarChamado={onGerenciarChamado}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
