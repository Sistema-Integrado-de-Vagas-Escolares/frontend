'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { clearEscolaSession, getEscolaSession } from '@/api/auth/login';
import {
  atualizarResponsavelEscola,
  cadastrarResponsavelEscola,
} from '@/api/escola/responsaveis';
import { responsaveisKeys } from '@/api/escola/use-responsaveis';
import { ApiError } from '@/api/utils/api';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import type { ResponsavelDetalhe } from '@/entities/responsavel';
import {
  formatCpf,
  formatTelefone,
  validateResponsavelForm,
  type ResponsavelFormErrors,
} from '@/schemas/responsavel.schema';

interface ResponsavelFormProps {
  initialResponsavel?: ResponsavelDetalhe;
  redirectToAfterSave?: string;
}

export function ResponsavelForm({
  initialResponsavel,
  redirectToAfterSave,
}: ResponsavelFormProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshResumo } = usePainel();

  const isEditing = Boolean(initialResponsavel);

  const [nome, setNome] = useState(initialResponsavel?.nome ?? '');
  const [cpf, setCpf] = useState(initialResponsavel?.cpf ?? '');
  const [telefone, setTelefone] = useState(initialResponsavel?.telefone ?? '');
  const [fieldErrors, setFieldErrors] = useState<ResponsavelFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateResponsavelForm(
      {
        nome,
        cpf,
        telefone,
      },
      { allowMaskedCpf: isEditing },
    );

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    const session = getEscolaSession();
    if (!session?.token) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      if (isEditing && initialResponsavel) {
        const updated = await atualizarResponsavelEscola(
          session.token,
          initialResponsavel.id,
          validation.payload,
        );
        queryClient.setQueryData(
          responsaveisKeys.detail(initialResponsavel.id),
          updated,
        );
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: responsaveisKeys.all }),
          refreshResumo(),
        ]);
        router.push(
          redirectToAfterSave ??
            ROUTES.RESPONSAVEL_DETALHE(initialResponsavel.id),
        );
      } else {
        await cadastrarResponsavelEscola(session.token, validation.payload);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: responsaveisKeys.all }),
          refreshResumo(),
        ]);
        router.push(ROUTES.RESPONSAVEIS);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearEscolaSession();
          router.replace(ROUTES.LOGIN);
          return;
        }
        setSubmitError(error.message);
      } else {
        setSubmitError(
          isEditing
            ? 'Não foi possível atualizar o responsável. Tente novamente.'
            : 'Não foi possível cadastrar o responsável. Tente novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-[24px]">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[576px] flex-col rounded-[16px] border border-[#e8edf8] bg-white p-[21px]"
      >
        <div className="flex flex-col">
          <label
            htmlFor="responsavel-nome"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Nome completo
          </label>
          <div className="pt-[6px]">
            <input
              id="responsavel-nome"
              name="nome"
              type="text"
              placeholder="Nome do responsável"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                if (fieldErrors.nome) {
                  setFieldErrors((prev) => ({ ...prev, nome: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.nome)}
              className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
          </div>
          {fieldErrors.nome ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.nome}</p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="responsavel-cpf"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            CPF
          </label>
          <div className="pt-[6px]">
            <input
              id="responsavel-cpf"
              name="cpf"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(event) => {
                setCpf(formatCpf(event.target.value));
                if (fieldErrors.cpf) {
                  setFieldErrors((prev) => ({ ...prev, cpf: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.cpf)}
              className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
          </div>
          {fieldErrors.cpf ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.cpf}</p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="responsavel-telefone"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Telefone / WhatsApp
          </label>
          <div className="pt-[6px]">
            <input
              id="responsavel-telefone"
              name="telefone"
              type="tel"
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={(event) => {
                setTelefone(formatTelefone(event.target.value));
                if (fieldErrors.telefone) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    telefone: undefined,
                  }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.telefone)}
              className="h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
          </div>
          {fieldErrors.telefone ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.telefone}</p>
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

        <div className="pt-[24px]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[48px] w-full rounded-[14px] bg-[#3b5fe0] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white hover:bg-[#3252c7]"
          >
            {isSubmitting
              ? isEditing
                ? 'Salvando...'
                : 'Cadastrando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Cadastrar Responsável'}
          </Button>
        </div>
      </form>
    </div>
  );
}
