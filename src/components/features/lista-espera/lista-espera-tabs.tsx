'use client';

import type { StatusInscricao } from '@/entities/inscricao';
import { cn } from '@/lib/utils';

export type ListaEsperaTabStatus = Extract<
  StatusInscricao,
  'EM_ESPERA' | 'CHAMADO' | 'MATRICULADO'
>;

interface ListaEsperaTabsProps {
  activeTab: ListaEsperaTabStatus;
  onTabChange: (tab: ListaEsperaTabStatus) => void;
  totalEmEspera: number;
  totalAguardandoMatricula: number;
  totalMatriculados: number;
}

export function ListaEsperaTabs({
  activeTab,
  onTabChange,
  totalEmEspera,
  totalAguardandoMatricula,
  totalMatriculados,
}: ListaEsperaTabsProps) {
  const tabs: {
    id: ListaEsperaTabStatus;
    label: string;
    count: number;
  }[] = [
    { id: 'EM_ESPERA', label: 'Lista de espera', count: totalEmEspera },
    {
      id: 'CHAMADO',
      label: 'Aguardando matrícula',
      count: totalAguardandoMatricula,
    },
    { id: 'MATRICULADO', label: 'Matriculados', count: totalMatriculados },
  ];

  return (
    <div
      role="tablist"
      aria-label="Etapas da lista de espera"
      className="flex flex-wrap gap-6 border-b border-[#e2e7f0]"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              '-mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 pt-1 text-[14px] font-semibold leading-[20px] transition-colors',
              isActive
                ? 'border-[#3b5fe0] text-[#3b5fe0]'
                : 'border-transparent text-[#687386] hover:text-[#263238]',
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-[14px]',
                isActive
                  ? 'bg-[#e8eeff] text-[#3b5fe0]'
                  : 'bg-[#eef1f6] text-[#687386]',
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
