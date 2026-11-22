import type { ApiErrorResponse } from '@/entities/auth';

const DEFAULT_API_BASE_URL = 'http://localhost:8080';

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  error: string;

  constructor(status: number, error: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    if (isJson) {
      const data = (await response.json()) as Partial<ApiErrorResponse>;
      throw new ApiError(
        data.status ?? response.status,
        data.error ?? response.statusText,
        data.message ?? 'Não foi possível concluir a requisição.',
      );
    }

    const text = await response.text();
    throw new ApiError(
      response.status,
      response.statusText,
      text || 'Não foi possível concluir a requisição.',
    );
  }

  return (await response.json()) as T;
}
