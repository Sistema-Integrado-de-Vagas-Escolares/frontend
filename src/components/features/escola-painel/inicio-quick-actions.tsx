'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import type { ResumoPainelEscola } from '@/entities/painel';

interface InicioQuickActionsProps {
  resumo: ResumoPainelEscola | null;
  isLoading: boolean;
}

export function InicioQuickActions({
  resumo,
  isLoading,
}: InicioQuickActionsProps) {
  const totalEmEspera = resumo?.totalEmEspera ?? 0;
  const totalResponsaveis = resumo?.totalResponsaveis ?? 0;
  const totalAlunos = resumo?.totalAlunos ?? 0;

  const cards = [
    {
      title: 'Lista de Espera',
      subtitle: isLoading
        ? 'Carregando...'
        : `${totalEmEspera} ${totalEmEspera === 1 ? 'aluno aguardando' : 'alunos aguardando'}`,
      href: ROUTES.ESCOLA.LISTA_ESPERA,
      icon: '/images/painel/card-waitlist.svg',
      iconBg: 'bg-[rgba(59,95,224,0.09)]',
    },
    {
      title: 'Responsáveis',
      subtitle: isLoading
        ? 'Carregando...'
        : `${totalResponsaveis} ${totalResponsaveis === 1 ? 'cadastrado' : 'cadastrados'}`,
      href: ROUTES.ESCOLA.RESPONSAVEIS,
      icon: '/images/painel/card-guardians.svg',
      iconBg: 'bg-[rgba(94,96,98,0.09)]',
    },
    {
      title: 'Alunos',
      subtitle: isLoading
        ? 'Carregando...'
        : `${totalAlunos} ${totalAlunos === 1 ? 'registrada' : 'registradas'}`,
      href: ROUTES.ESCOLA.ALUNOS,
      icon: '/images/painel/card-students.svg',
      iconBg: 'bg-[rgba(38,50,56,0.09)]',
    },
    {
      title: 'Buscar por CPF',
      subtitle: 'Localizar responsável no sistema',
      href: ROUTES.ESCOLA.BUSCAR_CPF,
      icon: '/images/painel/card-search.svg',
      iconBg: 'bg-[rgba(125,165,255,0.09)]',
    },
  ];

  return (
    <section
      aria-label="Ações rápidas"
      className="grid grid-cols-1 gap-[12px] pt-[24px] md:grid-cols-2"
    >
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="flex items-center gap-[16px] rounded-[16px] border border-[#e8edf8] bg-white p-[21px] transition-shadow hover:shadow-sm"
        >
          <div
            className={`flex size-[48px] shrink-0 items-center justify-center rounded-[14px] ${card.iconBg}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.icon}
              alt=""
              width={24}
              height={24}
              className="size-[24px]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.3125px] text-[#263238]">
              {card.title}
            </p>
            <p className="pt-[2px] text-[14px] font-medium leading-[20px] tracking-[-0.1504px] text-[#979799]">
              {card.subtitle}
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
    </section>
  );
}
