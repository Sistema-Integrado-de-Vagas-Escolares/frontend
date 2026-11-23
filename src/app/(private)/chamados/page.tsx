'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useChamarInscricao,
  useGerenciarChamado,
  useInscricoesEscola,
  useTurmasEscola,
} from '@/api/escola/use-inscricoes';
import { ApiError } from '@/api/utils/api';
import { BackLink } from '@/components/common/back-link';
import { EmptyState } from '@/components/common/empty-state';
import { FilterBar, type FilterBarOption } from '@/components/common/filter-bar';
import { PageHeader } from '@/components/common/page-header';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { GerenciarChamadoModal } from '@/components/features/lista-espera/gerenciar-chamado-modal';
import { InscricaoList } from '@/components/features/lista-espera/inscricao-list-item';
import {
  ListaEsperaTabs,
  type ListaEsperaTabStatus,
} from '@/components/features/lista-espera/lista-espera-tabs';
import { ProximoFilaCard } from '@/components/features/lista-espera/proximo-fila-card';
import { TODOS_NIVEIS } from '@/constants/niveis';
import { ROUTES } from '@/constants/routes';
import type {
  AcaoGerenciarChamado,
  InscricaoEscolaResumo,
} from '@/entities/inscricao';
import { useDebouncedValue } from '@/hooks/use-debounce';

export default function ListaDeEsperaPage() {
  const { escola, refreshResumo } = usePainel();

  const [activeTab, setActiveTab] = useState<ListaEsperaTabStatus>('EM_ESPERA');
  const [busca, setBusca] = useState('');
  const [serieAno, setSerieAno] = useState('');
  const debouncedBusca = useDebouncedValue(busca, 200);

  const [totais, setTotais] = useState({
    emEspera: 0,
    aguardandoMatricula: 0,
    matriculados: 0,
  });

  const [callingId, setCallingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [chamadoSelecionado, setChamadoSelecionado] =
    useState<InscricaoEscolaResumo | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const isDefaultEmEsperaView =
    activeTab === 'EM_ESPERA' && !debouncedBusca.trim() && !serieAno;

  const inscricoesQuery = useInscricoesEscola({
    status: activeTab,
    busca: debouncedBusca,
    serieAno: serieAno || undefined,
  });

  const filaGeralQuery = useInscricoesEscola(
    { status: 'EM_ESPERA' },
    { enabled: !isDefaultEmEsperaView },
  );

  const turmasQuery = useTurmasEscola();
  const chamarMutation = useChamarInscricao();
  const gerenciarMutation = useGerenciarChamado();

  useEffect(() => {
    if (inscricoesQuery.data) {
      setTotais({
        emEspera: inscricoesQuery.data.totalEmEspera,
        aguardandoMatricula: inscricoesQuery.data.totalAguardandoMatricula,
        matriculados: inscricoesQuery.data.totalMatriculados,
      });
    }
  }, [inscricoesQuery.data]);

  const nivelOptions: FilterBarOption[] = useMemo(
    () => [
      { label: 'Todos os níveis', value: '' },
      ...TODOS_NIVEIS.map((nivel) => ({
        label: nivel,
        value: nivel,
      })),
    ],
    [],
  );

  const itens = inscricoesQuery.data?.itens ?? [];
  const proximoDaFila = isDefaultEmEsperaView
    ? (itens[0] ?? null)
    : (filaGeralQuery.data?.itens[0] ?? null);

  const queryError =
    inscricoesQuery.error instanceof ApiError
      ? inscricoesQuery.error.message
      : inscricoesQuery.error
        ? 'Não foi possível carregar a lista de espera.'
        : null;
  const error = actionError ?? queryError;

  function handleRefresh() {
    setActionError(null);
    void Promise.all([
      inscricoesQuery.refetch(),
      !isDefaultEmEsperaView ? filaGeralQuery.refetch() : Promise.resolve(),
      refreshResumo(),
    ]);
  }

  async function handleChamar(inscricaoId: string) {
    setCallingId(inscricaoId);
    setActionError(null);

    try {
      await chamarMutation.mutateAsync(inscricaoId);
      await refreshResumo();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return;
      }
      setActionError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível chamar o aluno.',
      );
    } finally {
      setCallingId(null);
    }
  }

  async function handleConfirmGerenciarChamado(
    acao: AcaoGerenciarChamado,
    turmaIdDestino?: string,
  ) {
    if (!chamadoSelecionado) return;

    setModalError(null);

    try {
      await gerenciarMutation.mutateAsync({
        inscricaoId: chamadoSelecionado.id,
        payload: {
          acao,
          turmaId: turmaIdDestino,
        },
      });
      setChamadoSelecionado(null);
      await refreshResumo();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        return;
      }
      setModalError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível atualizar o chamado.',
      );
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <BackLink href={ROUTES.HOME} />
        <PageHeader title="Chamados" subtitle={escola?.nome} />
      </div>

      <ProximoFilaCard
        proximo={proximoDaFila}
        isCalling={callingId !== null && callingId === proximoDaFila?.id}
        onChamarProximo={(id) => void handleChamar(id)}
      />

      <ListaEsperaTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalEmEspera={totais.emEspera}
        totalAguardandoMatricula={totais.aguardandoMatricula}
        totalMatriculados={totais.matriculados}
      />

      <FilterBar
        searchValue={busca}
        onSearchChange={setBusca}
        searchPlaceholder="Buscar por nome, CPF ou responsável"
        filterLabel="Nível"
        filterValue={serieAno}
        onFilterChange={setSerieAno}
        filterOptions={nivelOptions}
        defaultFilterValue=""
        onRefresh={handleRefresh}
        isRefreshing={inscricoesQuery.isFetching}
      />

      {error ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}

      {inscricoesQuery.isPending ? (
        <div className="py-12 text-center text-sm text-[#979799]">
          Carregando inscrições...
        </div>
      ) : itens.length === 0 ? (
        <EmptyState message="Nenhuma inscrição encontrada nesta etapa." />
      ) : (
        <InscricaoList
          itens={itens}
          showPosicao={activeTab !== 'MATRICULADO'}
          callingId={callingId}
          onChamar={(id) => void handleChamar(id)}
          onGerenciarChamado={(selecionado) => {
            setModalError(null);
            setChamadoSelecionado(selecionado);
          }}
        />
      )}

      {chamadoSelecionado ? (
        <GerenciarChamadoModal
          inscricao={chamadoSelecionado}
          turmas={turmasQuery.data ?? []}
          isSubmitting={gerenciarMutation.isPending}
          errorMessage={modalError}
          onClose={() => {
            if (!gerenciarMutation.isPending) {
              setChamadoSelecionado(null);
              setModalError(null);
            }
          }}
          onConfirmAction={handleConfirmGerenciarChamado}
        />
      ) : null}
    </div>
  );
}
