import { differenceInYears, getYear, isAfter, isValid, parse } from 'date-fns';
import type { TipoVaga } from '@/entities/aluno';

export const NIVEIS_CRECHE = [
  'Berçário',
  'Maternal I',
  'Maternal II',
  'Fase I',
  'Fase II',
] as const;

export const NIVEIS_FUNDAMENTAL = [
  '1º Ano',
  '2º Ano',
  '3º Ano',
  '4º Ano',
  '5º Ano',
] as const;

export const TODOS_NIVEIS = [...NIVEIS_CRECHE, ...NIVEIS_FUNDAMENTAL] as const;

export function getNiveisPorTipoVaga(tipoVaga: TipoVaga): readonly string[] {
  return tipoVaga === 'CRECHE' ? NIVEIS_CRECHE : NIVEIS_FUNDAMENTAL;
}

export interface NivelMecInfo {
  etapa: string;
  matriculaObrigatoria: boolean;
  faixaEtaria: string;
  focoPedagogico: string;
}

export const NIVEIS_MEC_INFO: Record<string, NivelMecInfo> = {
  Berçário: {
    etapa: 'Creche',
    matriculaObrigatoria: false,
    faixaEtaria: '0 a 1 ano completo até 31/03',
    focoPedagogico:
      'Acolhimento, estímulos sensoriais e motores iniciais e rotina de cuidados.',
  },
  'Maternal I': {
    etapa: 'Creche',
    matriculaObrigatoria: false,
    faixaEtaria: '2 anos completos até 31/03',
    focoPedagogico:
      'Desenvolvimento da fala, coordenação motora grossa, exploração sensorial e início do processo de desfralde.',
  },
  'Maternal II': {
    etapa: 'Creche',
    matriculaObrigatoria: false,
    faixaEtaria: '3 anos completos até 31/03',
    focoPedagogico:
      'Socialização, autonomia básica (alimentação/higiene), brincadeiras simbólicas e expansão de vocabulário.',
  },
  'Fase I': {
    etapa: 'Pré-escola (Pré I)',
    matriculaObrigatoria: true,
    faixaEtaria: '4 anos completos até 31/03',
    focoPedagogico:
      'Expressão oral, noções espaciais, cores, formas, artes e convivência em grupo.',
  },
  'Fase II': {
    etapa: 'Pré-escola (Pré II)',
    matriculaObrigatoria: true,
    faixaEtaria: '5 anos completos até 31/03',
    focoPedagogico:
      'Preparação para o Ensino Fundamental, coordenação motora fina, raciocínio lógico e contato inicial com letras e números.',
  },
};

export interface SugestaoNivelPorNascimento {
  tipoVaga: TipoVaga;
  serieAno: string;
  anoLetivo: number;
  idadeNoCorte: number;
}

export function calcularNivelPorDataNascimentoBr(
  dataNascimentoBr: string,
): SugestaoNivelPorNascimento | null {
  if (dataNascimentoBr.length !== 10) return null;

  const nascimento = parse(dataNascimentoBr, 'dd/MM/yyyy', new Date());
  const hoje = new Date();
  if (!isValid(nascimento) || isAfter(nascimento, hoje)) {
    return null;
  }

  const anoLetivo = getYear(hoje);
  const dataCorte = new Date(anoLetivo, 2, 31); // 31 de março do ano corrente
  const idadeNoCorte = Math.max(0, differenceInYears(dataCorte, nascimento));

  if (idadeNoCorte <= 1) {
    return { tipoVaga: 'CRECHE', serieAno: 'Berçário', anoLetivo, idadeNoCorte };
  }
  if (idadeNoCorte === 2) {
    return {
      tipoVaga: 'CRECHE',
      serieAno: 'Maternal I',
      anoLetivo,
      idadeNoCorte,
    };
  }
  if (idadeNoCorte === 3) {
    return {
      tipoVaga: 'CRECHE',
      serieAno: 'Maternal II',
      anoLetivo,
      idadeNoCorte,
    };
  }
  if (idadeNoCorte === 4) {
    return { tipoVaga: 'CRECHE', serieAno: 'Fase I', anoLetivo, idadeNoCorte };
  }
  if (idadeNoCorte === 5) {
    return { tipoVaga: 'CRECHE', serieAno: 'Fase II', anoLetivo, idadeNoCorte };
  }

  const indiceFundamental = Math.min(idadeNoCorte - 6, NIVEIS_FUNDAMENTAL.length - 1);
  return {
    tipoVaga: 'FUNDAMENTAL',
    serieAno: NIVEIS_FUNDAMENTAL[indiceFundamental],
    anoLetivo,
    idadeNoCorte,
  };
}
