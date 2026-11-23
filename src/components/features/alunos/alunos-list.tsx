'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/common/empty-state';
import { ROUTES } from '@/constants/routes';
import type { AlunoResumo } from '@/entities/aluno';
import { formatIsoDateToBr } from '@/schemas/aluno.schema';

interface AlunosListProps {
  alunos: AlunoResumo[];
  isLoading: boolean;
}

export function AlunosList({ alunos, isLoading }: AlunosListProps) {
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-[#979799]">
        Carregando alunos...
      </div>
    );
  }

  if (alunos.length === 0) {
    return (
      <EmptyState message="Nenhum aluno encontrado para os filtros informados." />
    );
  }

  return (
    <section aria-label="Lista de alunos" className="pt-[16px]">
      {/* Desktop: Tabela */}
      <div className="hidden overflow-hidden rounded-[16px] border border-[#e8edf8] bg-white md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e8edf8] bg-[#f8fafd] text-[12px] font-semibold uppercase tracking-[0.4px] text-[#687386]">
              <th className="px-5 py-3.5">Nome</th>
              <th className="px-5 py-3.5">CPF</th>
              <th className="px-5 py-3.5">Data de nascimento</th>
              <th className="px-5 py-3.5">Nível / Turma</th>
              <th className="w-10 px-5 py-3.5" aria-label="Ações" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f4ff]">
            {alunos.map((aluno) => (
              <tr
                key={aluno.id}
                onClick={() => router.push(ROUTES.ALUNO_DETALHE(aluno.id))}
                className="cursor-pointer transition-colors hover:bg-[#f8fafd]"
              >
                <td className="px-5 py-4 text-[14px] font-semibold text-[#263238]">
                  <Link
                    href={ROUTES.ALUNO_DETALHE(aluno.id)}
                    onClick={(event) => event.stopPropagation()}
                    className="hover:text-[#3b5fe0]"
                  >
                    {aluno.nome}
                  </Link>
                </td>
                <td className="px-5 py-4 font-mono text-[12px] font-medium text-[#979799]">
                  {aluno.cpf}
                </td>
                <td className="px-5 py-4 text-[13px] font-medium text-[#5e6062]">
                  {formatIsoDateToBr(aluno.dataNascimento)}
                </td>
                <td className="px-5 py-4 text-[13px] font-medium text-[#5e6062]">
                  {aluno.etapaOuTurma}
                </td>
                <td className="px-5 py-4 text-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/painel/chevron-right.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="inline-block size-[16px]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Cards */}
      <div className="flex flex-col gap-[12px] md:hidden">
        {alunos.map((aluno) => (
          <Link
            key={aluno.id}
            href={ROUTES.ALUNO_DETALHE(aluno.id)}
            className="flex items-center gap-[12px] rounded-[16px] border border-[#e8edf8] bg-white p-[17px] transition-colors hover:border-[#3b5fe0]/40"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-[14px] font-semibold leading-[20px] text-[#263238]">
                {aluno.nome}
              </p>
              <p className="font-mono text-[12px] font-medium text-[#979799]">
                {aluno.cpf}
              </p>
              <p className="text-[12px] font-medium text-[#5e6062]">
                {formatIsoDateToBr(aluno.dataNascimento)} · {aluno.etapaOuTurma}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/painel/chevron-right.svg"
              alt=""
              width={16}
              height={16}
              className="size-[16px] shrink-0"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
