export interface EscolaLoginFormValues {
  codigo: string;
  senha: string;
}

export interface EscolaLoginValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof EscolaLoginFormValues, string>>;
  normalized: EscolaLoginFormValues;
}

export function validateEscolaLogin(
  values: EscolaLoginFormValues,
): EscolaLoginValidationResult {
  const codigo = values.codigo.trim().toUpperCase();
  const senha = values.senha;
  const errors: Partial<Record<keyof EscolaLoginFormValues, string>> = {};

  if (!codigo) {
    errors.codigo = 'Informe o código da escola.';
  }

  if (!senha) {
    errors.senha = 'Informe a senha de acesso.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalized: { codigo, senha },
  };
}
