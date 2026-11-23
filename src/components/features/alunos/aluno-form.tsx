'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { clearEscolaSession, getEscolaSession } from '@/api/auth/login';
import { cadastrarAlunoEscola } from '@/api/escola/alunos';
import { listarResponsaveisEscola } from '@/api/escola/responsaveis';
import { alunosKeys } from '@/api/escola/use-alunos';
import { inscricoesKeys } from '@/api/escola/use-inscricoes';
import { ApiError } from '@/api/utils/api';
import { usePainel } from '@/components/features/escola-painel/painel-context';
import { Button } from '@/components/ui/button';
import {
  calcularNivelPorDataNascimentoBr,
  getNiveisPorTipoVaga,
  NIVEIS_MEC_INFO,
  type SugestaoNivelPorNascimento,
} from '@/constants/niveis';
import { ROUTES } from '@/constants/routes';
import type { Parentesco, TipoVaga, Turno } from '@/entities/aluno';
import type { ResponsavelResumo } from '@/entities/responsavel';
import { cn } from '@/lib/utils';
import {
  calcularPontuacaoEstimada,
  calcularPontuacaoRenda,
  formatCep,
  formatDataBrInput,
  PESOS_CRITERIOS,
  validateAlunoForm,
  type AlunoFormErrors,
} from '@/schemas/aluno.schema';
import { formatCpf } from '@/schemas/responsavel.schema';

type CriterioToggleKey =
  | 'vulnerabilidadeSocioeconomica'
  | 'responsavelSolo'
  | 'moraDeAluguel'
  | 'bolsaFamilia'
  | 'bpcLoas'
  | 'temNecessidadeEspecial'
  | 'irmaoMatriculado';

const CRITERIOS_TOGGLES: {
  key: CriterioToggleKey;
  title: string;
  description: string;
}[] = [
  {
    key: 'vulnerabilidadeSocioeconomica',
    title: 'Família em situação de vulnerabilidade socioeconômica',
    description: 'CadÚnico, CRAS ou comprovação de vulnerabilidade',
  },
  {
    key: 'responsavelSolo',
    title: 'Responsável solo (mãe ou pai solteiro)',
    description: 'Único responsável legal, sem cônjuge ou companheiro',
  },
  {
    key: 'moraDeAluguel',
    title: 'Aluno mora de aluguel',
    description: 'Família não possui imóvel próprio',
  },
  {
    key: 'bolsaFamilia',
    title: 'Beneficiário do Bolsa Família',
    description: 'Família inscrita e ativa no programa federal',
  },
  {
    key: 'bpcLoas',
    title: 'Beneficiário do BPC/LOAS',
    description: 'Benefício de Prestação Continuada ativo',
  },
  {
    key: 'temNecessidadeEspecial',
    title: 'Aluno com deficiência ou necessidade especial',
    description: 'Laudo médico comprobatório',
  },
  {
    key: 'irmaoMatriculado',
    title: 'Irmão já matriculado na mesma escola',
    description: 'Irmão biológico ou adotivo matriculado na unidade',
  },
];

const PARENTESCO_OPTIONS: { label: string; value: Parentesco }[] = [
  { label: 'Mãe', value: 'MAE' },
  { label: 'Pai', value: 'PAI' },
  { label: 'Avós', value: 'AVOS' },
  { label: 'Tutor legal', value: 'TUTOR_LEGAL' },
  { label: 'Outro', value: 'OUTRO' },
];

interface ResponsavelVinculadoItem {
  responsavel: ResponsavelResumo;
  parentesco: Parentesco;
}

export function AlunoForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshResumo } = usePainel();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoVaga, setTipoVaga] = useState<TipoVaga>('CRECHE');
  const [serieAno, setSerieAno] = useState<string>(
    getNiveisPorTipoVaga('CRECHE')[0],
  );
  const [turno, setTurno] = useState<Turno>('INTEGRAL');
  const [cep, setCep] = useState('');
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepMessage, setCepMessage] = useState<string | null>(null);
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [rendaPerCapita, setRendaPerCapita] = useState('');

  const [criterios, setCriterios] = useState<
    Record<CriterioToggleKey, boolean>
  >({
    vulnerabilidadeSocioeconomica: false,
    responsavelSolo: false,
    moraDeAluguel: false,
    bolsaFamilia: false,
    bpcLoas: false,
    temNecessidadeEspecial: false,
    irmaoMatriculado: false,
  });

  const [cpfBusca, setCpfBusca] = useState('');
  const [isSearchingCpf, setIsSearchingCpf] = useState(false);
  const [cpfSearchError, setCpfSearchError] = useState<string | null>(null);
  const [vinculados, setVinculados] = useState<ResponsavelVinculadoItem[]>([]);

  const [fieldErrors, setFieldErrors] = useState<AlunoFormErrors>({});
  const [nivelSugerido, setNivelSugerido] =
    useState<SugestaoNivelPorNascimento | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pontuacaoEstimada = calcularPontuacaoEstimada({
    rendaPerCapita,
    ...criterios,
  });

  function toggleCriterio(key: CriterioToggleKey) {
    setCriterios((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleCepChange(rawValue: string) {
    const formatted = formatCep(rawValue);
    setCep(formatted);
    setCepMessage(null);
    if (fieldErrors.cep) {
      setFieldErrors((prev) => ({ ...prev, cep: undefined }));
    }

    const digits = formatted.replace(/\D/g, '');
    if (digits.length !== 8) return;

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      if (!response.ok) {
        setCepMessage('Não foi possível consultar o CEP automaticamente.');
        return;
      }
      const data = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };

      if (data.erro) {
        setCepMessage('CEP não encontrado. Preencha os campos manualmente.');
        return;
      }

      if (data.logradouro) setRua(data.logradouro);
      if (data.bairro) setBairro(data.bairro);
      if (data.localidade) setCidade(data.localidade);
      if (data.uf) setEstado(data.uf.toUpperCase());

      setFieldErrors((prev) => ({
        ...prev,
        rua: data.logradouro ? undefined : prev.rua,
        bairro: data.bairro ? undefined : prev.bairro,
        cidade: data.localidade ? undefined : prev.cidade,
        estado: data.uf ? undefined : prev.estado,
      }));
    } catch {
      setCepMessage('Não foi possível consultar o CEP automaticamente.');
    } finally {
      setIsFetchingCep(false);
    }
  }

  async function handleBuscarResponsavel() {
    setCpfSearchError(null);
    const cpfDigits = cpfBusca.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setCpfSearchError('Digite um CPF completo com 11 dígitos para buscar.');
      return;
    }

    const session = getEscolaSession();
    if (!session?.token) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    setIsSearchingCpf(true);
    try {
      const encontrados = await listarResponsaveisEscola(session.token, {
        busca: cpfDigits,
      });

      const match = encontrados[0];

      if (!match) {
        setCpfSearchError('Nenhum responsável encontrado com este CPF.');
        return;
      }

      if (vinculados.some((v) => v.responsavel.id === match.id)) {
        setCpfSearchError('Este responsável já está vinculado.');
        return;
      }

      setVinculados((prev) => [
        ...prev,
        { responsavel: match, parentesco: 'MAE' },
      ]);
      setCpfBusca('');
      if (fieldErrors.responsaveis) {
        setFieldErrors((prev) => ({ ...prev, responsaveis: undefined }));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearEscolaSession();
          router.replace(ROUTES.LOGIN);
          return;
        }
        setCpfSearchError(error.message);
      } else {
        setCpfSearchError('Não foi possível buscar o responsável.');
      }
    } finally {
      setIsSearchingCpf(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateAlunoForm({
      nome,
      cpf,
      dataNascimento,
      tipoVaga,
      serieAno,
      turno,
      endereco: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
      rendaPerCapita,
      ...criterios,
      responsaveis: vinculados.map((v) => ({
        responsavelId: v.responsavel.id,
        parentesco: v.parentesco,
      })),
    });

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
      await cadastrarAlunoEscola(session.token, validation.payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: alunosKeys.all }),
        queryClient.invalidateQueries({ queryKey: inscricoesKeys.all }),
        refreshResumo(),
      ]);
      router.push(ROUTES.ALUNOS);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearEscolaSession();
          router.replace(ROUTES.LOGIN);
          return;
        }
        setSubmitError(error.message);
      } else {
        setSubmitError('Não foi possível cadastrar o aluno. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-[448px] flex-col gap-[16px] pt-[24px]"
    >
      {/* Card 1: Dados do aluno */}
      <section className="flex flex-col rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h2 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5e6062]">
          Dados do aluno
        </h2>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="aluno-nome"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Nome do aluno
          </label>
          <input
            id="aluno-nome"
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value);
              if (fieldErrors.nome) {
                setFieldErrors((prev) => ({ ...prev, nome: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.nome)}
            className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
          {fieldErrors.nome ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.nome}</p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="aluno-cpf"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            CPF do aluno
          </label>
          <input
            id="aluno-cpf"
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
            className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
          {fieldErrors.cpf ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.cpf}</p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="aluno-nascimento"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Data de nascimento
          </label>
          <input
            id="aluno-nascimento"
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            value={dataNascimento}
            onChange={(event) => {
              const formatted = formatDataBrInput(event.target.value);
              setDataNascimento(formatted);
              if (fieldErrors.dataNascimento) {
                setFieldErrors((prev) => ({
                  ...prev,
                  dataNascimento: undefined,
                }));
              }
              const sugestao = calcularNivelPorDataNascimentoBr(formatted);
              setNivelSugerido(sugestao);
              if (sugestao) {
                setTipoVaga(sugestao.tipoVaga);
                setSerieAno(sugestao.serieAno);
                if (fieldErrors.serieAno) {
                  setFieldErrors((prev) => ({ ...prev, serieAno: undefined }));
                }
              }
            }}
            aria-invalid={Boolean(fieldErrors.dataNascimento)}
            className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
          {fieldErrors.dataNascimento ? (
            <p className="pt-1 text-xs text-red-600">
              {fieldErrors.dataNascimento}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <span className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
            Tipo de vaga
          </span>
          <div className="grid grid-cols-2 gap-[8px] pt-[8px]">
            {(
              [
                { label: 'Creche', value: 'CRECHE' },
                { label: 'Fundamental', value: 'FUNDAMENTAL' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTipoVaga(option.value);
                  const niveis = getNiveisPorTipoVaga(option.value);
                  setSerieAno(niveis[0] ?? '');
                  if (fieldErrors.serieAno) {
                    setFieldErrors((prev) => ({ ...prev, serieAno: undefined }));
                  }
                }}
                className={cn(
                  'h-[40px] cursor-pointer rounded-[14px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] transition-colors',
                  tipoVaga === option.value
                    ? 'bg-[#3b5fe0] text-white'
                    : 'bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ebff]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col pt-[16px]">
          <label
            htmlFor="aluno-nivel"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Nível escolar
          </label>
          <select
            id="aluno-nivel"
            value={serieAno}
            onChange={(event) => {
              setSerieAno(event.target.value);
              if (fieldErrors.serieAno) {
                setFieldErrors((prev) => ({ ...prev, serieAno: undefined }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.serieAno)}
            className="mt-[6px] h-[44px] w-full cursor-pointer rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          >
            {getNiveisPorTipoVaga(tipoVaga).map((nivel) => (
              <option key={nivel} value={nivel}>
                {nivel}
              </option>
            ))}
          </select>
          {fieldErrors.serieAno ? (
            <p className="pt-1 text-xs text-red-600">{fieldErrors.serieAno}</p>
          ) : null}

          {nivelSugerido ? (
            <p
              className={cn(
                'pt-[6px] text-[11px] leading-[15px]',
                nivelSugerido.serieAno === serieAno
                  ? 'text-[#3b5fe0]'
                  : 'text-amber-700',
              )}
            >
              {nivelSugerido.serieAno === serieAno
                ? `Pré-selecionado pela regra do MEC (corte 31/03/${nivelSugerido.anoLetivo}). Você pode ajustar manualmente se necessário.`
                : `Pela idade em 31/03/${nivelSugerido.anoLetivo} (${nivelSugerido.idadeNoCorte} anos), o nível padrão seria ${nivelSugerido.serieAno}.`}
            </p>
          ) : null}

          {NIVEIS_MEC_INFO[serieAno] ? (
            <div className="mt-[8px] rounded-[12px] border border-[#e8edf8] bg-[#f8fafd] p-[12px]">
              <div className="flex flex-wrap items-center gap-[6px]">
                <span className="text-[12px] font-semibold text-[#263238]">
                  {NIVEIS_MEC_INFO[serieAno].etapa}
                </span>
                <span
                  className={cn(
                    'rounded-full px-[8px] py-[2px] text-[11px] font-medium',
                    NIVEIS_MEC_INFO[serieAno].matriculaObrigatoria
                      ? 'bg-[#eef2ff] text-[#3b5fe0]'
                      : 'bg-white text-[#5e6062]',
                  )}
                >
                  {NIVEIS_MEC_INFO[serieAno].matriculaObrigatoria
                    ? 'Matrícula obrigatória por lei'
                    : 'Matrícula opcional'}
                </span>
              </div>
              <p className="pt-[4px] text-[11px] font-medium text-[#5e6062]">
                Faixa etária: {NIVEIS_MEC_INFO[serieAno].faixaEtaria}
              </p>
              <p className="pt-[2px] text-[11px] leading-[15px] text-[#979799]">
                Foco pedagógico: {NIVEIS_MEC_INFO[serieAno].focoPedagogico}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          <span className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
            Período solicitado
          </span>
          <div className="grid grid-cols-3 gap-[8px] pt-[8px]">
            {(
              [
                { label: 'Integral', value: 'INTEGRAL' },
                { label: 'Manhã', value: 'MANHA' },
                { label: 'Tarde', value: 'TARDE' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTurno(option.value)}
                className={cn(
                  'h-[40px] cursor-pointer rounded-[14px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] transition-colors',
                  turno === option.value
                    ? 'bg-[#3b5fe0] text-white'
                    : 'bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ebff]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[12px] pt-[16px]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <label
                htmlFor="aluno-cep"
                className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
              >
                CEP
              </label>
              {isFetchingCep ? (
                <span className="text-[11px] font-medium text-[#3b5fe0]">
                  Buscando CEP...
                </span>
              ) : null}
            </div>
            <input
              id="aluno-cep"
              type="text"
              inputMode="numeric"
              placeholder="00000-000"
              value={cep}
              onChange={(event) => void handleCepChange(event.target.value)}
              aria-invalid={Boolean(fieldErrors.cep)}
              className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
            {fieldErrors.cep ? (
              <p className="pt-1 text-xs text-red-600">{fieldErrors.cep}</p>
            ) : cepMessage ? (
              <p className="pt-1 text-xs text-amber-700">{cepMessage}</p>
            ) : null}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="aluno-rua"
              className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
            >
              Rua
            </label>
            <input
              id="aluno-rua"
              type="text"
              placeholder="Nome da rua ou avenida"
              value={rua}
              onChange={(event) => {
                setRua(event.target.value);
                if (fieldErrors.rua) {
                  setFieldErrors((prev) => ({ ...prev, rua: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.rua)}
              className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
            {fieldErrors.rua ? (
              <p className="pt-1 text-xs text-red-600">{fieldErrors.rua}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
            <div className="flex flex-col">
              <label
                htmlFor="aluno-numero"
                className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
              >
                Número
              </label>
              <input
                id="aluno-numero"
                type="text"
                placeholder="123"
                value={numero}
                onChange={(event) => {
                  setNumero(event.target.value);
                  if (fieldErrors.numero) {
                    setFieldErrors((prev) => ({ ...prev, numero: undefined }));
                  }
                }}
                aria-invalid={Boolean(fieldErrors.numero)}
                className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
              />
              {fieldErrors.numero ? (
                <p className="pt-1 text-xs text-red-600">{fieldErrors.numero}</p>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="aluno-complemento"
                className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
              >
                Complemento (opcional)
              </label>
              <input
                id="aluno-complemento"
                type="text"
                placeholder="Apto, bloco..."
                value={complemento}
                onChange={(event) => setComplemento(event.target.value)}
                className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="aluno-bairro"
              className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
            >
              Bairro
            </label>
            <input
              id="aluno-bairro"
              type="text"
              placeholder="Nome do bairro"
              value={bairro}
              onChange={(event) => {
                setBairro(event.target.value);
                if (fieldErrors.bairro) {
                  setFieldErrors((prev) => ({ ...prev, bairro: undefined }));
                }
              }}
              aria-invalid={Boolean(fieldErrors.bairro)}
              className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
            {fieldErrors.bairro ? (
              <p className="pt-1 text-xs text-red-600">{fieldErrors.bairro}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-3">
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="aluno-cidade"
                className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
              >
                Cidade
              </label>
              <input
                id="aluno-cidade"
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(event) => {
                  setCidade(event.target.value);
                  if (fieldErrors.cidade) {
                    setFieldErrors((prev) => ({ ...prev, cidade: undefined }));
                  }
                }}
                aria-invalid={Boolean(fieldErrors.cidade)}
                className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
              />
              {fieldErrors.cidade ? (
                <p className="pt-1 text-xs text-red-600">{fieldErrors.cidade}</p>
              ) : null}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="aluno-estado"
                className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
              >
                Estado (UF)
              </label>
              <input
                id="aluno-estado"
                type="text"
                maxLength={2}
                placeholder="SP"
                value={estado}
                onChange={(event) => {
                  setEstado(event.target.value.toUpperCase());
                  if (fieldErrors.estado) {
                    setFieldErrors((prev) => ({ ...prev, estado: undefined }));
                  }
                }}
                aria-invalid={Boolean(fieldErrors.estado)}
                className="mt-[6px] h-[44px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] uppercase tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
              />
              {fieldErrors.estado ? (
                <p className="pt-1 text-xs text-red-600">{fieldErrors.estado}</p>
              ) : null}
            </div>
          </div>

          <p className="text-[12px] leading-[16px] text-[#979799]">
            Usado para calcular a distância até a escola solicitada.
          </p>
        </div>
      </section>

      {/* Card 2: Critérios de pontuação */}
      <section className="flex flex-col rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5e6062]">
            Critérios de pontuação
          </h2>
          <span className="rounded-[14px] bg-[#3b5fe0] px-[12px] py-[6px] text-[12px] font-bold leading-[16px] text-white">
            Score: {pontuacaoEstimada} / 100
          </span>
        </div>

        <div className="flex flex-col pt-[16px]">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="aluno-renda"
              className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
            >
              Renda familiar per capita
            </label>
            <span className="rounded-full bg-[#eef2ff] px-[8px] py-[2px] text-[11px] font-semibold text-[#3b5fe0]">
              +{calcularPontuacaoRenda(rendaPerCapita)} /{' '}
              {PESOS_CRITERIOS.rendaBaixaExtrema} pts
            </span>
          </div>
          <input
            id="aluno-renda"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={rendaPerCapita}
            onChange={(event) => {
              setRendaPerCapita(event.target.value);
              if (fieldErrors.rendaPerCapita) {
                setFieldErrors((prev) => ({
                  ...prev,
                  rendaPerCapita: undefined,
                }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.rendaPerCapita)}
            className="mt-[6px] h-[42.5px] w-full rounded-[14px] bg-[#f0f4ff] px-[16px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
          />
          <p className="pt-[4px] text-[11px] leading-[15px] text-[#979799]">
            Até R$ 706: +{PESOS_CRITERIOS.rendaBaixaExtrema} pts · Até R$ 1.412: +
            {PESOS_CRITERIOS.rendaBaixa} pts · Até R$ 2.118: +
            {PESOS_CRITERIOS.rendaModerada} pts
          </p>
          {fieldErrors.rendaPerCapita ? (
            <p className="pt-1 text-xs text-red-600">
              {fieldErrors.rendaPerCapita}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col pt-[16px]">
          {CRITERIOS_TOGGLES.map((item) => {
            const active = criterios[item.key];
            const peso = PESOS_CRITERIOS[item.key];
            return (
              <div
                key={item.key}
                className="flex items-start gap-[12px] border-b border-[#f0f4ff] py-[12px] last:border-b-0"
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  aria-label={item.title}
                  onClick={() => toggleCriterio(item.key)}
                  className={cn(
                    'mt-[2px] flex h-[24px] w-[48px] shrink-0 cursor-pointer items-center rounded-full px-[2px] transition-colors',
                    active ? 'bg-[#3b5fe0]' : 'bg-[#e8edf8]',
                  )}
                >
                  <span
                    className={cn(
                      'size-[20px] rounded-full bg-white shadow-sm transition-transform',
                      active ? 'translate-x-[24px]' : 'translate-x-0',
                    )}
                  />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-[#263238]">
                      {item.title}
                    </p>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-[8px] py-[2px] text-[11px] font-semibold',
                        active
                          ? 'bg-[#3b5fe0] text-white'
                          : 'bg-[#f0f4ff] text-[#687386]',
                      )}
                    >
                      +{peso} pts
                    </span>
                  </div>
                  <p className="pt-[2px] text-[12px] leading-[16px] text-[#979799]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-[16px]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold leading-[16px] text-[#5e6062]">
              Pontuação estimada
            </span>
            <span className="text-[14px] font-bold leading-[20px] tracking-[-0.1504px] text-[#3b5fe0]">
              {pontuacaoEstimada} / 100
            </span>
          </div>
          <div className="mt-[6px] h-[10px] w-full overflow-hidden rounded-full bg-[#f0f4ff]">
            <div
              className="h-full rounded-full bg-[#3b5fe0] transition-all"
              style={{ width: `${pontuacaoEstimada}%` }}
            />
          </div>
          <p className="pt-[4px] text-[12px] leading-[16px] text-[#979799]">
            * Distância calculada após confirmação do endereço
          </p>
        </div>
      </section>

      {/* Card 3: Responsáveis vinculados */}
      <section className="flex flex-col rounded-[16px] border border-[#e8edf8] bg-white p-[21px]">
        <h2 className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5e6062]">
          Responsáveis vinculados ({vinculados.length})
        </h2>

        {vinculados.length > 0 ? (
          <div className="flex flex-col gap-2 pt-[12px]">
            {vinculados.map((item) => (
              <div
                key={item.responsavel.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-[#f8fafd] p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#263238]">
                    {item.responsavel.nome}
                  </p>
                  <p className="font-mono text-xs text-[#979799]">
                    {item.responsavel.cpf}
                  </p>
                </div>

                <select
                  aria-label={`Parentesco de ${item.responsavel.nome}`}
                  value={item.parentesco}
                  onChange={(event) => {
                    const value = event.target.value as Parentesco;
                    setVinculados((prev) =>
                      prev.map((v) =>
                        v.responsavel.id === item.responsavel.id
                          ? { ...v, parentesco: value }
                          : v,
                      ),
                    );
                  }}
                  className="rounded-lg border border-[#e2e7f0] bg-white px-2 py-1 text-xs text-[#263238]"
                >
                  {PARENTESCO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    setVinculados((prev) =>
                      prev.filter((v) => v.responsavel.id !== item.responsavel.id),
                    )
                  }
                  className="cursor-pointer text-xs font-medium text-red-600 hover:underline"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-[16px] border-t border-[#f0f4ff] pt-[17px]">
          <label
            htmlFor="buscar-responsavel-cpf"
            className="text-[12px] font-semibold leading-[16px] text-[#5e6062]"
          >
            Buscar responsável por CPF
          </label>
          <div className="flex gap-[8px] pt-[12px]">
            <input
              id="buscar-responsavel-cpf"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpfBusca}
              onChange={(event) => {
                setCpfBusca(formatCpf(event.target.value));
                if (cpfSearchError) setCpfSearchError(null);
              }}
              className="h-[40px] min-w-0 flex-1 rounded-[14px] bg-[#f0f4ff] px-[12px] text-[14px] tracking-[-0.1504px] text-[#263238] placeholder:text-[#bfc5d2] focus:outline-none focus:ring-2 focus:ring-[#3b5fe0]"
            />
            <button
              type="button"
              onClick={() => void handleBuscarResponsavel()}
              disabled={isSearchingCpf}
              className="inline-flex h-[40px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[14px] bg-[#263238] px-[16px] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-[#1c2529] disabled:opacity-60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/painel/search-white.svg"
                alt=""
                width={16}
                height={16}
                className="size-[16px] shrink-0"
              />
              <span>{isSearchingCpf ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </div>
          {cpfSearchError ? (
            <p className="pt-2 text-xs text-red-600">{cpfSearchError}</p>
          ) : null}
          {fieldErrors.responsaveis ? (
            <p className="pt-2 text-xs text-red-600">
              {fieldErrors.responsaveis}
            </p>
          ) : null}
        </div>
      </section>

      {submitError ? (
        <div
          role="alert"
          className="rounded-[12px] border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
        >
          {submitError}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-[48px] w-full rounded-[14px] bg-[#3b5fe0] text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white hover:bg-[#3252c7]"
      >
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar na lista de espera'}
      </Button>
    </form>
  );
}
