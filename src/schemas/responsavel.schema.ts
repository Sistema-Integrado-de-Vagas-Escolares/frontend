import type { CriarResponsavelRequest } from '@/entities/responsavel';

export interface ResponsavelFormValues {
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelFormErrors {
  nome?: string;
  cpf?: string;
  telefone?: string;
}

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatTelefone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validateResponsavelForm(values: ResponsavelFormValues):
  | { valid: true; payload: CriarResponsavelRequest }
  | { valid: false; errors: ResponsavelFormErrors } {
  const errors: ResponsavelFormErrors = {};

  const nome = values.nome.trim();
  if (!nome) {
    errors.nome = 'Informe o nome completo do responsável.';
  }

  const cpfDigits = values.cpf.replace(/\D/g, '');
  if (cpfDigits.length !== 11) {
    errors.cpf = 'Informe um CPF válido com 11 dígitos.';
  }

  const telefoneDigits = values.telefone.replace(/\D/g, '');
  if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
    errors.telefone = 'Informe um telefone válido com DDD.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    payload: {
      nome,
      cpf: formatCpf(cpfDigits),
      telefone: formatTelefone(telefoneDigits),
    },
  };
}
