'use client';

import { createContext, useContext } from 'react';
import type { Escola } from '@/entities/auth';
import type { ResumoPainelEscola } from '@/entities/painel';

export interface PainelContextValue {
  escola: Escola | null;
  resumo: ResumoPainelEscola | null;
  isLoading: boolean;
  error: string | null;
  refreshResumo: () => Promise<void>;
}

const PainelContext = createContext<PainelContextValue | undefined>(undefined);

export function PainelProvider({
  value,
  children,
}: {
  value: PainelContextValue;
  children: React.ReactNode;
}) {
  return (
    <PainelContext.Provider value={value}>{children}</PainelContext.Provider>
  );
}

export function usePainel(): PainelContextValue {
  const context = useContext(PainelContext);
  if (!context) {
    throw new Error('usePainel deve ser utilizado dentro de PainelProvider.');
  }
  return context;
}
