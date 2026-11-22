'use client';

import { InicioQuickActions } from '@/components/features/escola-painel/inicio-quick-actions';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { PainelPageHeader } from '@/components/features/escola-painel/painel-page-header';

export default function EscolaPainelInicioPage() {
  const { resumo, isLoading, error } = usePainel();

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
      <InicioQuickActions resumo={resumo} isLoading={isLoading} />
    </>
  );
}
