'use client';

import { use, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAtualizarTurmaEscola,
  useExcluirTurmaEscola,
  useTurmaEscola,
  useTurmasEscola,
} from '@/api/escola/use-inscricoes';
import {
  useAtualizarVagasEscola,
  useHistoricoVagasEscola,
} from '@/api/escola/use-vagas';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { TurmaForm } from '@/components/features/turmas/turma-form';
import { VagasHistoryList } from '@/components/features/vagas/vagas-history-list';
import { VagasUpdateForm } from '@/components/features/vagas/vagas-update-form';
import { ROUTES } from '@/constants/routes';
import type { Turno } from '@/entities/aluno';

export default function EditarTurmaPage({
  params,
}: {
  params: Promise<{ turmaId: string }>;
}) {
  const { turmaId } = use(params);
  const router = useRouter();
  const { escola, refreshResumo } = usePainel();

  const turmaQuery = useTurmaEscola(turmaId);
  const turmasQuery = useTurmasEscola();
  const historicoQuery = useHistoricoVagasEscola(turmaId);
  const atualizarTurmaMutation = useAtualizarTurmaEscola(turmaId);
  const excluirTurmaMutation = useExcluirTurmaEscola();
  const atualizarVagasMutation = useAtualizarVagasEscola();

  const [turmaError, setTurmaError] = useState<string | null>(null);
  const [turmaSuccess, setTurmaSuccess] = useState<string | null>(null);
  const [vagasError, setVagasError] = useState<string | null>(null);
  const [vagasSuccess, setVagasSuccess] = useState<string | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const turma = turmaQuery.data ?? null;

  const capacidadeMaximaPermitida = useMemo(() => {
    const vagasOutrasTurmas = (turmasQuery.data ?? [])
      .filter((t) => t.id !== turmaId)
      .reduce((acc, t) => acc + t.vagasTotais, 0);
    return Math.max(0, (escola?.capacidadeTotal ?? 0) - vagasOutrasTurmas);
  }, [turmasQuery.data, turmaId, escola?.capacidadeTotal]);

  async function handleSalvarTurma(payload: {
    serieAno: string;
    nome: string;
    turno: Turno;
    vagasTotais: number;
  }) {
    setTurmaError(null);
    setTurmaSuccess(null);
    try {
      await atualizarTurmaMutation.mutateAsync(payload);
      await refreshResumo();
      setTurmaSuccess('Dados da turma atualizados com sucesso.');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return;
      setTurmaError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível atualizar a turma.',
      );
    }
  }

  async function handleAtualizarVagas(payload: {
    turmaId: string;
    vagasDisponiveis: number;
    motivo: string;
  }) {
    setVagasError(null);
    setVagasSuccess(null);
    try {
      await atualizarVagasMutation.mutateAsync(payload);
      await refreshResumo();
      setVagasSuccess('Disponibilidade de vagas atualizada com sucesso.');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return;
      setVagasError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível atualizar as vagas.',
      );
    }
  }

  async function handleExcluirTurma() {
    setDeleteError(null);
    try {
      await excluirTurmaMutation.mutateAsync(turmaId);
      await refreshResumo();
      router.push(ROUTES.TURMAS);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return;
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível excluir a turma.',
      );
    }
  }

  const loadError =
    turmaQuery.error instanceof ApiError
      ? turmaQuery.error.message
      : turmaQuery.error
        ? 'Não foi possível carregar os dados da turma.'
        : null;

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.TURMAS} label="Voltar para Turmas" />
        <PageHeader
          title={turma ? `${turma.serieAno} · ${turma.nome}` : 'Editar Turma'}
          subtitle={escola?.nome}
        />
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {loadError}
        </div>
      ) : turmaQuery.isPending || !turma ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando turma...
        </div>
      ) : (
        <>
          <TurmaForm
            key={`${turma.id}-${turma.vagasTotais}-${turma.vagasDisponiveis}`}
            initialTurma={turma}
            capacidadeMaximaPermitida={capacidadeMaximaPermitida}
            isSubmitting={atualizarTurmaMutation.isPending}
            errorMessage={turmaError}
            successMessage={turmaSuccess}
            onSubmit={handleSalvarTurma}
          />

          <VagasUpdateForm
            turma={turma}
            isSubmitting={atualizarVagasMutation.isPending}
            errorMessage={vagasError}
            successMessage={vagasSuccess}
            onSubmit={handleAtualizarVagas}
          />

          <VagasHistoryList
            historico={historicoQuery.data ?? []}
            isLoading={historicoQuery.isPending}
          />

          <section className="rounded-[16px] border border-[#fee2e2] bg-white p-[21px]">
            <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[14px] font-bold text-[#991b1b]">
                  Excluir turma
                </h2>
                <p className="text-[12px] text-[#687386]">
                  Permitido apenas quando não houver alunos ou inscrições
                  vinculados a esta turma.
                </p>
              </div>

              {!confirmandoExclusao ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError(null);
                    setConfirmandoExclusao(true);
                  }}
                  className="inline-flex h-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] bg-[#fef2f2] px-[16px] text-[13px] font-semibold text-[#dc2626] transition-colors hover:bg-[#fee2e2]"
                >
                  Excluir turma
                </button>
              ) : (
                <div className="flex items-center gap-[8px]">
                  <button
                    type="button"
                    disabled={excluirTurmaMutation.isPending}
                    onClick={() => setConfirmandoExclusao(false)}
                    className="h-[40px] cursor-pointer rounded-[14px] bg-[#f0f4ff] px-[14px] text-[13px] font-semibold text-[#5e6062] hover:bg-[#e4ebff]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={excluirTurmaMutation.isPending}
                    onClick={() => void handleExcluirTurma()}
                    className="h-[40px] cursor-pointer rounded-[14px] bg-[#dc2626] px-[14px] text-[13px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
                  >
                    {excluirTurmaMutation.isPending
                      ? 'Excluindo...'
                      : 'Confirmar exclusão'}
                  </button>
                </div>
              )}
            </div>

            {deleteError ? (
              <div
                role="alert"
                className="mt-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700"
              >
                {deleteError}
              </div>
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
