'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginEscola, saveEscolaSession } from '@/api/auth/login';
import { ApiError } from '@/api/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { validateEscolaLogin } from '@/schemas/escola-login.schema';

export function EscolaLoginForm() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    codigo?: string;
    senha?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateEscolaLogin({ codigo, senha });
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const session = await loginEscola(validation.normalized);
      saveEscolaSession(session);
      router.push(ROUTES.ESCOLA.PAINEL);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(
          'Não foi possível conectar ao servidor. Tente novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col rounded-b-[24px] bg-white p-6 shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)]"
    >
      <div className="flex w-full flex-col">
        <Label htmlFor="codigo-escola">Código da Escola</Label>
        <div className="pt-[6px]">
          <Input
            id="codigo-escola"
            name="codigo"
            type="text"
            autoComplete="username"
            placeholder="ex: EMEI-0012"
            value={codigo}
            onChange={(event) => {
              setCodigo(event.target.value);
              if (fieldErrors.codigo) {
                setFieldErrors((prev) => ({ ...prev, codigo: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.codigo)}
          />
        </div>
        {fieldErrors.codigo ? (
          <p className="pt-1 text-xs text-red-600">{fieldErrors.codigo}</p>
        ) : null}
      </div>

      <div className="flex w-full flex-col py-4">
        <Label htmlFor="senha-escola">Senha</Label>
        <div className="relative pt-[6px]">
          <Input
            id="senha-escola"
            name="senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(event) => {
              setSenha(event.target.value);
              if (fieldErrors.senha) {
                setFieldErrors((prev) => ({ ...prev, senha: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.senha)}
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
            className="absolute right-[14px] top-[calc(50%+3px)] -translate-y-1/2 cursor-pointer p-0.5 transition-opacity hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/icon-eye.svg"
              alt=""
              width={16}
              height={16}
              className={showPassword ? 'opacity-50' : 'opacity-100'}
            />
          </button>
        </div>
        {fieldErrors.senha ? (
          <p className="pt-1 text-xs text-red-600">{fieldErrors.senha}</p>
        ) : null}
      </div>

      {submitError ? (
        <div
          role="alert"
          className="mb-4 rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
        >
          {submitError}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-[48px] w-full bg-[#3b5fe0] text-[14px] font-semibold leading-[20px] text-white hover:bg-[#3252c7]"
      >
        {isSubmitting ? 'Acessando...' : 'Acessar Painel'}
      </Button>
    </form>
  );
}
