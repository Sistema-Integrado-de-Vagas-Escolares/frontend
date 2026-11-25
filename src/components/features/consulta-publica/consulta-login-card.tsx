'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { consultarPosicaoPublica } from '@/api/publico/consulta';
import { ApiError } from '@/api/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import type { ConsultaPublicaResponse } from '@/entities/consulta-publica';
import {
  validateConsultaPublica,
  type ConsultaPublicaFormErrors,
} from '@/schemas/consulta-publica.schema';
import { formatCpf } from '@/schemas/responsavel.schema';

interface ConsultaLoginCardProps {
  onSuccess: (response: ConsultaPublicaResponse) => void;
}

export function ConsultaLoginCard({ onSuccess }: ConsultaLoginCardProps) {
  const [cpf, setCpf] = useState('');
  const [protocolo, setProtocolo] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ConsultaPublicaFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateConsultaPublica({ cpf, protocolo });
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await consultarPosicaoPublica(validation.payload);
      onSuccess(response);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(
          'Não foi possível consultar a fila no momento. Tente novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Acompanhar matrícula"
      className="flex w-full max-w-[384px] flex-col items-start"
    >
      <header className="flex w-full flex-col items-center rounded-t-[24px] bg-[#3b5fe0] px-6 py-8">
        <div className="flex h-[56px] items-end">
          <div className="relative h-[48px] w-[32px] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-sive-s.png"
              alt="SIVE"
              className="pointer-events-none absolute top-0 left-[-25.02%] h-full w-[143.79%] max-w-none"
            />
          </div>
          <span className="text-[40px] font-bold leading-[36px] tracking-tight text-white">
            ive
          </span>
        </div>

        <h1 className="pt-5 text-center text-[24px] font-bold leading-[28px] text-white">
          Acompanhar Matrícula
        </h1>
        <p className="pt-2 text-center text-[13px] leading-[18px] text-white/80">
          Informe o CPF do responsável e o protocolo do chamado para acompanhar a
          posição na fila.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col rounded-b-[24px] bg-white p-6 shadow-[0px_20px_12.5px_rgba(0,0,0,0.1),0px_8px_5px_rgba(0,0,0,0.1)]"
      >
        <div className="flex w-full flex-col">
          <Label htmlFor="consulta-cpf">CPF do responsável</Label>
          <div className="pt-[6px]">
            <Input
              id="consulta-cpf"
              name="cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) => {
                setCpf(formatCpf(event.target.value));
                if (fieldErrors.cpf) {
                  setFieldErrors((prev) => ({ ...prev, cpf: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.cpf)}
            />
          </div>
          {fieldErrors.cpf ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.cpf}</p>
          ) : null}
        </div>

        <div className="flex w-full flex-col py-4">
          <Label htmlFor="consulta-protocolo">Protocolo do chamado</Label>
          <div className="pt-[6px]">
            <Input
              id="consulta-protocolo"
              name="protocolo"
              type="text"
              autoComplete="off"
              placeholder="SIVE-XXXXXXXX"
              value={protocolo}
              onChange={(event) => {
                setProtocolo(event.target.value.toUpperCase());
                if (fieldErrors.protocolo) {
                  setFieldErrors((prev) => ({ ...prev, protocolo: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.protocolo)}
              className="font-mono uppercase placeholder:font-sans placeholder:normal-case"
            />
          </div>
          {fieldErrors.protocolo ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.protocolo}</p>
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
          {isSubmitting ? 'Consultando...' : 'Consultar Posição'}
        </Button>
      </form>

      <p className="w-full pt-[20px] text-center text-[13px] text-[#687386]">
        É gestor escolar?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-[#3b5fe0] hover:underline"
        >
          Acessar painel da escola
        </Link>
      </p>
    </section>
  );
}
