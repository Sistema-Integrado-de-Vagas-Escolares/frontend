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
      className="flex w-full max-w-[400px] flex-col items-center"
    >
      <div className="flex flex-col items-center pb-[28px] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/painel/logo-sive-blue.png"
          alt="Logo SIVE"
          width={56}
          height={56}
          className="h-[56px] w-auto object-contain"
        />
        <h1 className="pt-[16px] text-[24px] font-bold leading-[32px] tracking-[-0.3px] text-[#263238]">
          Acompanhar Matrícula
        </h1>
        <p className="pt-[4px] text-[14px] leading-[20px] text-[#687386]">
          Informe o CPF do responsável e o protocolo do chamado para acompanhar a
          posição na fila.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-col rounded-[16px] border border-[#e8edf8] bg-white p-[24px] shadow-xs"
      >
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="consulta-cpf">CPF do responsável</Label>
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
            className="h-[44px] rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] text-[#263238] placeholder:text-[#bfc5d2]"
          />
          {fieldErrors.cpf ? (
            <p className="text-xs text-red-600">{fieldErrors.cpf}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-[6px] pt-[16px]">
          <Label htmlFor="consulta-protocolo">Protocolo do chamado</Label>
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
            className="h-[44px] rounded-[14px] bg-[#f0f4ff] px-[16px] font-mono text-[14px] uppercase text-[#263238] placeholder:font-sans placeholder:normal-case placeholder:text-[#bfc5d2]"
          />
          {fieldErrors.protocolo ? (
            <p className="text-xs text-red-600">{fieldErrors.protocolo}</p>
          ) : null}
        </div>

        {submitError ? (
          <div
            role="alert"
            className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
          >
            {submitError}
          </div>
        ) : null}

        <div className="pt-[20px]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[46px] w-full rounded-[14px] bg-[#3b5fe0] text-[14px] font-semibold text-white hover:bg-[#3252c7]"
          >
            {isSubmitting ? 'Consultando...' : 'Consultar posição'}
          </Button>
        </div>
      </form>

      <p className="pt-[20px] text-center text-[13px] text-[#687386]">
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
