'use client';

import { format, isValid, parseISO } from 'date-fns';
import type { SolicitacaoPublica } from '@/entities/consulta-publica';
import { cn } from '@/lib/utils';

const TIPO_VAGA_LABELS: Record<string, string> = {
  CRECHE: 'Creche',
  FUNDAMENTAL: 'Fundamental',
};

const TURNO_LABELS: Record<string, string> = {
  INTEGRAL: 'Integral',
  MANHA: 'Manhã',
  TARDE: 'Tarde',
};

const DOCUMENTOS_MATRICULA = [
  'RG ou certidão de nascimento da criança',
  'CPF do responsável e da criança',
  'Comprovante de residência recente',
  'Cartão de vacinação atualizado',
  'Laudo médico (se necessário para vaga especial)',
];

function formatDateBr(iso?: string | null): string {
  if (!iso) return '—';
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return '—';
  return format(parsed, 'dd/MM/yyyy');
}

interface ConsultaDetalheViewProps {
  solicitacao: SolicitacaoPublica;
  atualizadoEm: string;
  onBack?: () => void;
}

export function ConsultaDetalheView({
  solicitacao,
  atualizadoEm,
  onBack,
}: ConsultaDetalheViewProps) {
  const modalidade =
    TIPO_VAGA_LABELS[solicitacao.tipoVaga] ?? solicitacao.tipoVaga;
  const turno = TURNO_LABELS[solicitacao.turno] ?? solicitacao.turno;
  const isChamado = solicitacao.status === 'CHAMADO';
  const isEmEspera = solicitacao.status === 'EM_ESPERA';
  const isMatriculado = solicitacao.status === 'MATRICULADO';

  return (
    <div className="mx-auto flex w-full max-w-[896px] flex-col px-4 py-[32px] sm:px-[32px]">
      {onBack ? (
        <nav
          aria-label="Navegação"
          className="flex flex-wrap items-center gap-[8px] pb-[20px]"
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex cursor-pointer items-center gap-[6px] text-[14px] font-medium leading-[20px] text-[#979799] transition-colors hover:text-[#263238]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/consulta/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className="size-[16px] shrink-0"
            />
            <span>Meus filhos</span>
          </button>
          <span className="text-[16px] text-[#bfc5d2]">/</span>
          <span className="text-[16px] font-semibold leading-[24px] text-[#263238]">
            {solicitacao.alunoNome}
          </span>
        </nav>
      ) : (
        <header className="pb-[20px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#5e6062]">
            Acompanhar Matrícula
          </p>
          <h1 className="pt-[2px] text-[20px] font-bold leading-[28px] text-[#263238]">
            {solicitacao.alunoNome}
          </h1>
        </header>
      )}

      <div className="grid grid-cols-1 items-start gap-[24px] lg:grid-cols-[261px_1fr]">
        {/* Coluna esquerda */}
        <div className="flex flex-col gap-[16px]">
          <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5e6062]">
                Situação
              </h2>
              {isChamado ? (
                <span className="rounded-[14px] border border-[#fee685] bg-[#fffbeb] px-[11px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#bb4d00]">
                  Chamado
                </span>
              ) : isMatriculado ? (
                <span className="rounded-[14px] bg-[#d0fae5] px-[10px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#007a55]">
                  Matriculado
                </span>
              ) : (
                <span className="rounded-[14px] bg-[#f0f4ff] px-[10px] py-[4px] text-[12px] font-semibold leading-[16px] text-[#5e6062]">
                  Em espera
                </span>
              )}
            </div>

            <dl className="flex flex-col gap-[8px] pt-[12px] text-[14px] leading-[20px]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-[#979799]">Escola solicitada</dt>
                <dd className="text-right font-medium text-[#263238]">
                  {solicitacao.escolaNome}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#979799]">Modalidade</dt>
                <dd className="font-medium text-[#263238]">{modalidade}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#979799]">Período</dt>
                <dd className="font-semibold text-[#3b5fe0]">{turno}</dd>
              </div>
            </dl>
          </section>

          {isEmEspera && solicitacao.posicaoFila !== null ? (
            <section className="rounded-[16px] bg-[#3b5fe0] p-[20px] text-center text-white">
              <p className="text-[14px] leading-[20px] text-white/65">
                Posição na fila
              </p>
              <p className="pt-[4px] text-[64px] font-black leading-[64px]">
                #{solicitacao.posicaoFila}
              </p>
              <p className="pt-[8px] text-[12px] leading-[16px] text-white/55">
                {solicitacao.totalNaFila} na lista de espera
              </p>
              <div className="pt-[12px]">
                <div className="h-[8px] w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all"
                    style={{ width: `${solicitacao.percentualAtendidas}%` }}
                  />
                </div>
              </div>
              <p className="pt-[6px] text-[12px] leading-[16px] text-white/45">
                {solicitacao.percentualAtendidas}% já atendidas
              </p>
            </section>
          ) : null}

          {isChamado ? (
            <section className="rounded-[16px] border border-[#fee685] bg-white p-[17px]">
              <div className="flex items-center gap-[8px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/consulta/bell-amber.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-[20px] shrink-0"
                />
                <h2 className="text-[14px] font-semibold leading-[20px] text-[#bb4d00]">
                  Vaga disponível!
                </h2>
              </div>
              <p className="pt-[8px] text-[12px] leading-[19.5px] text-[#e17100]">
                Entre em contato com a escola imediatamente para confirmar
                interesse na vaga. Prazo de confirmação: 5 dias úteis.
              </p>
            </section>
          ) : null}

          <section className="flex items-center gap-[16px] rounded-[16px] border border-[#e8edf8] bg-white p-[17px]">
            <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] bg-[rgba(59,95,224,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/consulta/star-blue.svg"
                alt=""
                width={24}
                height={24}
                className="size-[24px]"
              />
            </div>
            <div>
              <p className="text-[12px] leading-[16px] text-[#979799]">
                Pontuação total
              </p>
              <p className="text-[24px] font-bold leading-[32px] text-[#263238]">
                {Number(solicitacao.pontuacaoTotal).toFixed(1)}{' '}
                <span className="text-[14px] font-normal text-[#979799]">
                  / 100
                </span>
              </p>
            </div>
          </section>

          {isEmEspera && solicitacao.vizinhos.length > 0 ? (
            <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]">
              <h2 className="text-[14px] font-semibold leading-[20px] text-[#5e6062]">
                Posições vizinhas
              </h2>

              <div className="flex flex-col gap-[8px] pt-[12px]">
                {solicitacao.vizinhos.map((vizinho) => (
                  <div
                    key={vizinho.posicao}
                    className={cn(
                      'flex items-start gap-[12px] rounded-[14px] p-[12px]',
                      vizinho.atual ? 'bg-[#3b5fe0]' : 'bg-[#f0f4ff]',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-[32px] shrink-0 items-center justify-center rounded-full',
                        vizinho.atual
                          ? 'bg-white/25'
                          : 'bg-[rgba(151,151,153,0.15)]',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          vizinho.atual
                            ? '/images/consulta/star-white.svg'
                            : '/images/consulta/users-gray.svg'
                        }
                        alt=""
                        width={16}
                        height={16}
                        className="size-[16px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-[14px] font-medium leading-[20px]',
                          vizinho.atual ? 'font-semibold text-white' : 'text-[#5e6062]',
                        )}
                      >
                        {vizinho.rotulo}
                      </p>
                      <p
                        className={cn(
                          'pt-[2px] text-[12px] leading-[16px]',
                          vizinho.atual ? 'text-white/65' : 'text-[#979799]',
                        )}
                      >
                        {vizinho.descricao}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-[6px] pt-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/consulta/info-lgpd.svg"
                  alt=""
                  width={13}
                  height={14}
                  className="h-[14px] w-[13px] shrink-0"
                />
                <p className="text-[12px] leading-[16px] text-[#979799]">
                  Identidades preservadas conforme LGPD
                </p>
              </div>
            </section>
          ) : null}
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-[16px]">
          <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
            <h2 className="text-[14px] font-semibold leading-[20px] text-[#5e6062]">
              Por que estou nessa posição?
            </h2>

            {solicitacao.criterios.length === 0 ? (
              <p className="pt-[12px] text-[13px] text-[#979799]">
                Critérios de pontuação ainda não detalhados para esta inscrição.
              </p>
            ) : (
              <div className="flex flex-col gap-[16px] pt-[16px]">
                {solicitacao.criterios.map((criterio) => {
                  const base = Number(criterio.pontosBase) || 0;
                  const obtido = Number(criterio.pontosObtidos) || 0;
                  const percent =
                    base > 0
                      ? Math.max(0, Math.min(100, (obtido / base) * 100))
                      : 0;

                  return (
                    <div key={criterio.nome}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[14px] font-medium leading-[20px] text-[#263238]">
                          {criterio.nome}
                        </p>
                        <div className="flex shrink-0 items-center gap-[8px]">
                          <span className="rounded-full bg-[#f0f4ff] px-[8px] py-[2px] text-[12px] leading-[16px] text-[#979799]">
                            Peso {Number(criterio.pesoPercent).toFixed(0)}%
                          </span>
                          <span className="text-[14px] font-bold leading-[20px] text-[#3b5fe0]">
                            {obtido.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="pt-[6px]">
                        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
                          <div
                            className="h-full rounded-full bg-[#3b5fe0] transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <p className="pt-[4px] text-[12px] leading-[16px] text-[#979799]">
                        {criterio.detalhe}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]">
            <h2 className="text-[14px] font-semibold leading-[20px] text-[#5e6062]">
              Histórico de movimentações
            </h2>

            <div className="flex flex-col gap-[12px] pt-[12px]">
              {solicitacao.historico.map((evento, index) => {
                const isEventoChamado = evento.tipo === 'CHAMADO';
                const isEventoConfirmado =
                  evento.tipo === 'CONFIRMADA' || evento.tipo === 'MATRICULADO';

                return (
                  <div
                    key={`${evento.tipo}-${index}`}
                    className="flex items-start gap-[12px]"
                  >
                    <div
                      className={cn(
                        'mt-[2px] flex size-[32px] shrink-0 items-center justify-center rounded-full',
                        isEventoChamado
                          ? 'bg-[#fef3c6]'
                          : isEventoConfirmado
                            ? 'bg-[#d0fae5]'
                            : 'bg-[#f0f4ff]',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          isEventoChamado
                            ? '/images/consulta/bell-amber.svg'
                            : isEventoConfirmado
                              ? '/images/consulta/check-green.svg'
                              : '/images/consulta/clock.svg'
                        }
                        alt=""
                        width={16}
                        height={16}
                        className="size-[16px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] leading-[20px] text-[#263238]">
                        {evento.titulo}
                      </p>
                      <p className="pt-[2px] text-[12px] leading-[16px] text-[#979799]">
                        {formatDateBr(evento.data)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[16px] border border-[#e8edf8] bg-white p-[17px]">
            <div className="flex items-center gap-[8px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/consulta/doc-blue.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0"
              />
              <h2 className="text-[14px] font-semibold leading-[20px] text-[#5e6062]">
                Documentação para matrícula
              </h2>
            </div>

            <p className="pt-[12px] text-[12px] leading-[16px] text-[#979799]">
              Separe os documentos abaixo para quando a vaga for disponibilizada:
            </p>

            <ol className="flex flex-col gap-[8px] pt-[12px]">
              {DOCUMENTOS_MATRICULA.map((doc, idx) => (
                <li
                  key={doc}
                  className="flex items-center gap-[10px] rounded-[14px] bg-[#f0f4ff] p-[10px]"
                >
                  <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[rgba(59,95,224,0.15)] text-[12px] font-bold leading-[16px] text-[#3b5fe0]">
                    {idx + 1}
                  </span>
                  <span className="text-[14px] leading-[20px] text-[#5e6062]">
                    {doc}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <footer className="pt-[24px] text-center">
        <p className="text-[12px] leading-[16px] text-[#bfc5d2]">
          Atualizado em {formatDateBr(atualizadoEm)}
        </p>
      </footer>
    </div>
  );
}
