import type {
  CadastrarAlunoInscricaoRequest,
  ResponsavelVinculoInput,
  TipoVaga,
  Turno,
} from '@/entities/aluno';
import type { Endereco } from '@/entities/endereco';
import { formatCpf } from '@/schemas/responsavel.schema';

export interface AlunoFormValues {
  nome: string;
  cpf: string;
  dataNascimento: string;
  tipoVaga: TipoVaga;
  serieAno: string;
  turno: Turno;
  endereco: Endereco;
  rendaPerCapita: string;
  vulnerabilidadeSocioeconomica: boolean;
  responsavelSolo: boolean;
  moraDeAluguel: boolean;
  bolsaFamilia: boolean;
  bpcLoas: boolean;
  temNecessidadeEspecial: boolean;
  irmaoMatriculado: boolean;
  responsaveis: ResponsavelVinculoInput[];
}

export interface AlunoFormErrors {
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  serieAno?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  rendaPerCapita?: string;
  responsaveis?: string;
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatDataBrInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatIsoDateToBr(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function parseBrDateToIso(brDate: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(brDate.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return null;
  }

  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseCurrencyNumber(value: string): number {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? -1 : parsed;
}

export const PESOS_CRITERIOS = {
  rendaBaixaExtrema: 25,
  rendaBaixa: 15,
  rendaModerada: 8,
  temNecessidadeEspecial: 20,
  irmaoMatriculado: 15,
  vulnerabilidadeSocioeconomica: 12,
  bpcLoas: 10,
  bolsaFamilia: 8,
  responsavelSolo: 6,
  moraDeAluguel: 4,
} as const;

export function calcularPontuacaoRenda(rendaPerCapita: string): number {
  if (rendaPerCapita.trim() === '') return 0;
  const renda = parseCurrencyNumber(rendaPerCapita);
  if (renda < 0) return 0;
  if (renda <= 706) return PESOS_CRITERIOS.rendaBaixaExtrema;
  if (renda <= 1412) return PESOS_CRITERIOS.rendaBaixa;
  if (renda <= 2118) return PESOS_CRITERIOS.rendaModerada;
  return 0;
}

export function calcularPontuacaoEstimada(values: {
  rendaPerCapita: string;
  vulnerabilidadeSocioeconomica: boolean;
  responsavelSolo: boolean;
  moraDeAluguel: boolean;
  bolsaFamilia: boolean;
  bpcLoas: boolean;
  temNecessidadeEspecial: boolean;
  irmaoMatriculado: boolean;
}): number {
  let pontos = calcularPontuacaoRenda(values.rendaPerCapita);

  if (values.temNecessidadeEspecial) {
    pontos += PESOS_CRITERIOS.temNecessidadeEspecial;
  }
  if (values.irmaoMatriculado) {
    pontos += PESOS_CRITERIOS.irmaoMatriculado;
  }
  if (values.vulnerabilidadeSocioeconomica) {
    pontos += PESOS_CRITERIOS.vulnerabilidadeSocioeconomica;
  }
  if (values.bpcLoas) {
    pontos += PESOS_CRITERIOS.bpcLoas;
  }
  if (values.bolsaFamilia) {
    pontos += PESOS_CRITERIOS.bolsaFamilia;
  }
  if (values.responsavelSolo) {
    pontos += PESOS_CRITERIOS.responsavelSolo;
  }
  if (values.moraDeAluguel) {
    pontos += PESOS_CRITERIOS.moraDeAluguel;
  }

  return Math.min(100, pontos);
}

export function validateAlunoForm(
  values: AlunoFormValues,
  options?: { allowMaskedCpf?: boolean },
):
  | { valid: true; payload: CadastrarAlunoInscricaoRequest }
  | { valid: false; errors: AlunoFormErrors } {
  const errors: AlunoFormErrors = {};

  const nome = values.nome.trim();
  if (!nome) {
    errors.nome = 'Informe o nome completo do aluno.';
  }

  const isMaskedCpf =
    Boolean(options?.allowMaskedCpf) && values.cpf.includes('*');
  const cpfDigits = values.cpf.replace(/\D/g, '');
  if (!isMaskedCpf && cpfDigits.length !== 11) {
    errors.cpf = 'Informe um CPF válido com 11 dígitos.';
  }

  const isoDate = parseBrDateToIso(values.dataNascimento);
  if (!isoDate) {
    errors.dataNascimento =
      'Informe uma data de nascimento válida (DD/MM/AAAA) não futura.';
  }

  const serieAno = values.serieAno.trim();
  if (!serieAno) {
    errors.serieAno = 'Selecione o nível escolar pretendido.';
  }

  const cepDigits = values.endereco.cep.replace(/\D/g, '');
  if (cepDigits.length !== 8) {
    errors.cep = 'Informe um CEP válido com 8 dígitos.';
  }

  const rua = values.endereco.rua.trim();
  if (!rua) {
    errors.rua = 'Informe a rua.';
  }

  const numero = values.endereco.numero.trim();
  if (!numero) {
    errors.numero = 'Informe o número.';
  }

  const bairro = values.endereco.bairro.trim();
  if (!bairro) {
    errors.bairro = 'Informe o bairro.';
  }

  const cidade = values.endereco.cidade.trim();
  if (!cidade) {
    errors.cidade = 'Informe a cidade.';
  }

  const estado = values.endereco.estado.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(estado)) {
    errors.estado = 'Informe a UF (2 letras).';
  }

  const rendaParsed = parseCurrencyNumber(values.rendaPerCapita);
  if (rendaParsed < 0) {
    errors.rendaPerCapita = 'Informe um valor numérico válido (0 ou maior).';
  }

  if (values.responsaveis.length === 0) {
    errors.responsaveis = 'Vincule pelo menos um responsável ao aluno.';
  }

  if (Object.keys(errors).length > 0 || !isoDate) {
    return { valid: false, errors };
  }

  const complemento = values.endereco.complemento?.trim() || undefined;

  return {
    valid: true,
    payload: {
      nome,
      cpf: isMaskedCpf ? values.cpf.trim() : formatCpf(cpfDigits),
      dataNascimento: isoDate,
      tipoVaga: values.tipoVaga,
      serieAno,
      turno: values.turno,
      endereco: {
        cep: formatCep(cepDigits),
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
      rendaPerCapita: Number(rendaParsed.toFixed(2)),
      vulnerabilidadeSocioeconomica: values.vulnerabilidadeSocioeconomica,
      responsavelSolo: values.responsavelSolo,
      moraDeAluguel: values.moraDeAluguel,
      bolsaFamilia: values.bolsaFamilia,
      bpcLoas: values.bpcLoas,
      temNecessidadeEspecial: values.temNecessidadeEspecial,
      irmaoMatriculado: values.irmaoMatriculado,
      responsaveis: values.responsaveis,
    },
  };
}
