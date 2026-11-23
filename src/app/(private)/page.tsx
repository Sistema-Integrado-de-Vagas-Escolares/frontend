'use client';

import { useCriteriosEscola } from '@/api/escola/use-criterios';
import { CriteriosChart } from '@/components/features/criterios/criterios-chart';
import { InicioMetrics } from '@/components/features/escola-painel/inicio-metrics';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { PainelPageHeader } from '@/components/features/escola-painel/painel-page-header';

export default function EscolaPainelInicioPage() {
  const { escola, resumo, isLoading, error } = usePainel();
  const criteriosQuery = useCriteriosEscola();

  return (
    <>
      <PainelPageHeader title="Início" />
      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}
      <InicioMetrics escola={escola} resumo={resumo} isLoading={isLoading} />
      <div className="pt-[16px]">
        <CriteriosChart criterios={criteriosQuery.data ?? []} />
      </div>
    </>
  );
}
