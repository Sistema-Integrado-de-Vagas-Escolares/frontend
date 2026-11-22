import { apiRequest } from '@/api/utils/api';
import type { LoginEscolaRequest, LoginEscolaResponse } from '@/entities/auth';

export const ESCOLA_AUTH_STORAGE_KEY = 'sive.escola.auth';

export async function loginEscola(
  payload: LoginEscolaRequest,
): Promise<LoginEscolaResponse> {
  return apiRequest<LoginEscolaResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function saveEscolaSession(session: LoginEscolaResponse): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ESCOLA_AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getEscolaSession(): LoginEscolaResponse | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(ESCOLA_AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LoginEscolaResponse;
  } catch {
    return null;
  }
}

export function clearEscolaSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ESCOLA_AUTH_STORAGE_KEY);
}
