'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearEscolaSession, getEscolaSession } from '@/api/auth/login';
import { ApiError } from '@/api/utils/api';
import { ROUTES } from '@/constants/routes';

export function requireEscolaToken(): string {
  const session = getEscolaSession();
  if (!session?.token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Sessão expirada.');
  }
  return session.token;
}

export function useRedirectOnUnauthorized(error: unknown) {
  const router = useRouter();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      clearEscolaSession();
      router.replace(ROUTES.LOGIN);
    }
  }, [error, router]);
}
