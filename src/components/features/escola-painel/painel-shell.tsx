'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearEscolaSession, getEscolaSession } from '@/api/auth/login';
import { getResumoPainelEscola } from '@/api/escola/resumo';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';
import type { Escola } from '@/entities/auth';
import type { ResumoPainelEscola } from '@/entities/painel';
import { PainelProvider } from './painel-context';
import { PainelSidebar } from './painel-sidebar';

export function PainelShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [escola, setEscola] = useState<Escola | null>(null);
  const [resumo, setResumo] = useState<ResumoPainelEscola | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const loadResumo = useCallback(async () => {
    const session = getEscolaSession();
    if (!session?.token) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setEscola(session.escola);
    setError(null);

    try {
      const data = await getResumoPainelEscola(session.token);
      setResumo(data);
      setEscola(data.escola);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearEscolaSession();
        router.replace(ROUTES.LOGIN);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar os dados do painel.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadResumo();
  }, [loadResumo]);

  function handleLogout() {
    clearEscolaSession();
    router.replace(ROUTES.LOGIN);
  }

  if (!escola && isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f0f4ff]">
        <p className="text-sm font-medium text-[#5e6062]">
          Carregando painel...
        </p>
      </div>
    );
  }

  if (!escola) {
    return null;
  }

  return (
    <PainelProvider
      value={{
        escola,
        resumo,
        isLoading,
        error,
        refreshResumo: loadResumo,
      }}
    >
      <div className="min-h-screen w-full bg-[#f0f4ff]">
        {/* Mobile header */}
        <div className="flex items-center justify-between bg-[#3b5fe0] px-4 py-3 text-white lg:hidden">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-sive-s.png"
              alt="Logo SIVE"
              width={24}
              height={36}
              className="h-9 w-6 object-contain"
            />
            <span className="text-sm font-bold">{escola.nome}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-white/30 px-3 py-1.5 text-xs font-semibold"
          >
            {isMobileMenuOpen ? 'Fechar' : 'Menu'}
          </button>
        </div>

        {/* Desktop fixed sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:block">
          <PainelSidebar
            escolaNome={escola.nome}
            escolaCidade={escola.cidade}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile drawer sidebar */}
        {isMobileMenuOpen ? (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div className="relative z-10 h-full">
              <PainelSidebar
                escolaNome={escola.nome}
                escolaCidade={escola.cidade}
                onLogout={handleLogout}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-black/40"
            />
          </div>
        ) : null}

        <div className="lg:pl-[288px]">
          <main className="w-full max-w-[1200px] p-6 sm:p-[32px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </PainelProvider>
  );
}
