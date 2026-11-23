'use client';

import { format, isValid, parseISO } from 'date-fns';
import type {
  ConsultaPublicaResponse,
  SolicitacaoPublica,
} from '@/entities/consulta-publica';

const TIPO_VAGA_LABELS: Record<string, string> = {
  CRECHE: 'Creche',
  FUNDAMENTAL: 'Fundamental',
};

const TURNO_LABELS: Record<string, string> = {
  INTEGRAL: 'Integral',
  MANHA: 'Manhã',
  TARDE: 'Tarde',
};

function formatDateBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return '—';
  return format(parsed, 'dd/MM/yyyy');
}

interface ConsultaSolicitacoesViewProps {
  data: ConsultaPublicaResponse;
  onSelectSolicitacao: (item: SolicitacaoPublica) => void;
  onLogout: () => void;
}

export function ConsultaSolicitacoesView({
  data,
  onSelectSolicitacao,
  onLogout,
}: ConsultaSolicitacoesViewProps) {
  const atualizadoBr = formatDateBr(data.atualizadoEm);

  return (
    <div className="mx-auto flex w-full max-w-[896px] flex-col px-4 py-[32px] sm:px-[32px]">
      <header className="flex flex-wrap items-center justify-between gap-4 pb-[24px]">
        <div>
          <h1 className="text-[24px] font-bold leading-[32px] text-[#263238]">
            Olá, {data.responsavel.nome}
          </h1>
          <p className="pt-[2px] text-[14px] leading-[20px] text-[#979799]">
            CPF: {data.responsavel.cpf} · Atualizado em {atualizadoBr}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex cursor-pointer items-center gap-[8px] rounded-[14px] border border-[#e8edf8] bg-white px-[17px] py-[11px] text-[14px] font-medium leading-[20px] text-[#979799] transition-colors hover:border-[#cfd8eb] hover:text-[#5e6062]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/consulta/logout.svg"
            alt=""
            width={16}
            height={16}
            className="size-[16px] shrink-0"
          />
          <span>Sair</span>
        </button>
      </header>

      <section aria-label="Solicitações na lista de espera">
        <h2 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#979799]">
          Solicitações na lista de espera
        </h2>

        <div className="grid grid-cols-1 gap-[16px] pt-[16px] md:grid-cols-2">
          {data.solicitacoes.map((item) => {
            const modalidade =
              TIPO_VAGA_LABELS[item.tipoVaga] ?? item.tipoVaga;
            const turno = TURNO_LABELS[item.turno] ?? item.turno;
            const idadeTexto =
              item.idadeAnos !== null
                ? `${item.idadeAnos} ${item.idadeAnos === 1 ? 'ano' : 'anos'} · `
                : '';

            return (
              <button
                key={item.inscricaoId}
                type="button"
                onClick={() => onSelectSolicitacao(item)}
                className="flex cursor-pointer items-start gap-[16px] rounded-[16px] border border-[#e8edf8] bg-white p-[21px] text-left transition-all hover:border-[#3b5fe0]/40 hover:shadow-xs"
              >
                <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] bg-[rgba(59,95,224,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/consulta/child.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-[24px]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[16px] font-bold leading-[24px] text-[#263238]">
                    {item.alunoNome}
                  </p>
                  <p className="pt-[2px] text-[12px] font-medium leading-[16px] text-[#979799]">
                    {idadeTexto}
                    {modalidade} · {turno}
                  </p>
                  <p className="truncate pt-[2px] text-[12px] font-medium leading-[16px] text-[#5e6062]">
                    {item.escolaNome}
                  </p>

                  {item.status === 'EM_ESPERA' ? (
                    <>
                      <div className="flex flex-wrap items-center gap-[8px] pt-[10px]">
                        <span className="rounded-[14px] bg-[#f0f4ff] px-[10px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#5e6062]">
                          Em espera
                        </span>
                        {item.posicaoFila !== null ? (
                          <span className="rounded-[14px] bg-[#3b5fe0] px-[10px] py-[4px] text-[12px] font-bold leading-[16px] text-white">
                            #{item.posicaoFila}º na fila
                          </span>
                        ) : null}
                      </div>

                      <div className="pt-[10px]">
                        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
                          <div
                            className="h-full rounded-full bg-[#3b5fe0] transition-all"
                            style={{ width: `${item.percentualAtendidas}%` }}
                          />
                        </div>
                      </div>
                      <p className="pt-[4px] text-[12px] font-medium leading-[16px] text-[#979799]">
                        {item.percentualAtendidas}% das crianças já atendidas
                      </p>
                    </>
                  ) : item.status === 'CHAMADO' ? (
                    <>
                      <div className="pt-[10px]">
                        <span className="inline-block rounded-[14px] border border-[#fee685] bg-[#fffbeb] px-[11px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#bb4d00]">
                          Chamado
                        </span>
                      </div>
                      <div className="mt-[8px] rounded-[14px] border border-[#fee685] bg-[#fffbeb] p-[9px]">
                        <p className="text-[12px] font-semibold leading-[16px] text-[#bb4d00]">
                          ⚠ Vaga disponível! Entre em contato com a escola.
                        </p>
                      </div>
                    </>
                  ) : item.status === 'MATRICULADO' ? (
                    <div className="pt-[10px]">
                      <span className="inline-block rounded-[14px] bg-[#d0fae5] px-[10px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#007a55]">
                        Matriculado
                      </span>
                    </div>
                  ) : (
                    <div className="pt-[10px]">
                      <span className="inline-block rounded-[14px] bg-[#f1f5f9] px-[10px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#64748b]">
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-[16px] flex items-start gap-[12px] rounded-[16px] border border-[#fef3c6] bg-[#fffbeb] p-[17px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/consulta/bell-amber.svg"
          alt=""
          width={16}
          height={16}
          className="mt-[2px] size-[16px] shrink-0"
        />
        <p className="text-[12px] leading-[19.5px] text-[#bb4d00]">
          Quando sua posição mudar ou uma vaga for disponibilizada, você
          receberá uma notificação. Mantenha seus dados de contato atualizados
          junto à escola.
        </p>
      </div>
    </div>
  );
}
