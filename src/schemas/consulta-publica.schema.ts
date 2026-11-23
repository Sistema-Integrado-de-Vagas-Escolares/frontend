import { formatCpf } from '@/schemas/responsavel.schema';

export interface ConsultaPublicaFormValues {
  cpf: string;
  protocolo: string;
}

export interface ConsultaPublicaFormErrors {
  cpf?: string;
  protocolo?: string;
}

export function validateConsultaPublica(values: ConsultaPublicaFormValues):
  | { valid: true; payload: ConsultaPublicaFormValues }
  | { valid: false; errors: ConsultaPublicaFormErrors } {
  const errors: ConsultaPublicaFormErrors = {};

  const cpfDigits = values.cpf.replace(/\D/g, '');
  if (cpfDigits.length !== 11) {
    errors.cpf = 'Informe um CPF válido com 11 dígitos.';
  }

  const protocolo = values.protocolo.trim().toUpperCase();
  if (!protocolo) {
    errors.protocolo = 'Informe o protocolo do chamado.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    payload: {
      cpf: formatCpf(cpfDigits),
      protocolo,
    },
  };
}
