'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useCadastrarTurmaEscola,
  useTurmasEscola,
} from '@/api/escola/use-inscricoes';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { PageHeader } from '@/components/common/page-header';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { TurmaForm } from '@/components/features/turmas/turma-form';
import { ROUTES } from '@/constants/routes';
import type { Turno } from '@/entities/aluno';

export default function NovaTurmaPage() {
  const router = useRouter();
  const { escola, refreshResumo } = usePainel();
  const turmasQuery = useTurmasEscola();
  const cadastrarMutation = useCadastrarTurmaEscola();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalAlocado = useMemo(
    () => (turmasQuery.data ?? []).reduce((acc, t) => acc + t.vagasTotais, 0),
    [turmasQuery.data],
  );
  const capacidadeRestante = Math.max(
    0,
    (escola?.capacidadeTotal ?? 0) - totalAlocado,
  );

  async function handleSubmit(payload: {
    serieAno: string;
    nome: string;
    turno: Turno;
    vagasTotais: number;
  }) {
    setSubmitError(null);
    try {
      await cadastrarMutation.mutateAsync(payload);
      await refreshResumo();
      router.push(ROUTES.TURMAS);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return;
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível cadastrar a turma.',
      );
    }
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <BackLink href={ROUTES.TURMAS} label="Voltar para Turmas" />
        <PageHeader title="Nova Turma" subtitle={escola?.nome} />
      </div>

      <TurmaForm
        capacidadeMaximaPermitida={capacidadeRestante}
        isSubmitting={cadastrarMutation.isPending}
        errorMessage={submitError}
        onCancel={() => router.push(ROUTES.TURMAS)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
