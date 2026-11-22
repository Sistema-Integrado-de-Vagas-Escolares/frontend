'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Início',
    href: ROUTES.ESCOLA.PAINEL,
    icon: '/images/painel/nav-home.svg',
  },
  {
    label: 'Lista de Espera',
    href: ROUTES.ESCOLA.LISTA_ESPERA,
    icon: '/images/painel/nav-waitlist.svg',
  },
  {
    label: 'Gestão de Vagas',
    href: ROUTES.ESCOLA.GESTAO_VAGAS,
    icon: '/images/painel/nav-slots.svg',
  },
  {
    label: 'Histórico',
    href: ROUTES.ESCOLA.HISTORICO,
    icon: '/images/painel/nav-history.svg',
  },
  {
    label: 'Responsáveis',
    href: ROUTES.ESCOLA.RESPONSAVEIS,
    icon: '/images/painel/nav-guardians.svg',
  },
  {
    label: 'Alunos',
    href: ROUTES.ESCOLA.ALUNOS,
    icon: '/images/painel/nav-students.svg',
  },
  {
    label: 'Buscar por CPF',
    href: ROUTES.ESCOLA.BUSCAR_CPF,
    icon: '/images/painel/nav-search.svg',
  },
];

interface PainelSidebarProps {
  escolaNome: string;
  escolaCidade: string;
  totalEmEspera: number | null;
  vagasDisponiveis: number | null;
  capacidadeTotal: number | null;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function PainelSidebar({
  escolaNome,
  escolaCidade,
  totalEmEspera,
  vagasDisponiveis,
  capacidadeTotal,
  onLogout,
  onNavigate,
}: PainelSidebarProps) {
  const pathname = usePathname();

  const kpis = [
    { label: 'Espera', value: totalEmEspera },
    { label: 'Vagas', value: vagasDisponiveis },
    { label: 'Capacidade', value: capacidadeTotal },
  ];

  return (
    <aside className="flex h-full w-[288px] flex-col bg-[#3b5fe0]">
      <div className="border-b border-white/15 px-[20px] pb-[21px] pt-[20px]">
        <div className="flex items-center gap-[12px] pb-[4px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-sive-s.png"
            alt="Logo SIVE"
            width={37}
            height={56}
            className="h-[56px] w-[37px] shrink-0 object-contain"
          />
          <div className="min-w-0 flex-1 pt-[4px]">
            <p className="break-words text-[16px] font-bold leading-snug tracking-[-0.1504px] text-white">
              {escolaNome}
            </p>
            <p className="truncate text-[12px] font-normal leading-[16px] text-white/60">
              {escolaCidade}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-white/15 px-[16px] py-[12px]">
        <div className="grid grid-cols-3 gap-[8px]">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex h-[66px] flex-col items-center justify-center rounded-[14px] bg-white/10 p-[10px]"
            >
              <p className="text-[20px] font-bold leading-[28px] tracking-[-0.4492px] text-white">
                {kpi.value !== null ? kpi.value : '—'}
              </p>
              <p className="pt-[2px] text-[12px] font-normal leading-[16px] text-white/45">
                {kpi.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <nav aria-label="Menu do painel" className="flex-1 overflow-y-auto p-[12px]">
        <ul className="flex flex-col gap-[4px]">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === ROUTES.ESCOLA.PAINEL
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex w-full items-center gap-[12px] rounded-[14px] px-[12px] py-[10px] text-[14px] font-medium leading-[20px] tracking-[-0.1504px] transition-colors',
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'text-white/55 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className={cn(
                      'size-[16px] shrink-0',
                      !isActive && 'opacity-70',
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-[16px] pb-[20px] pt-[16px]">
        <div className="pt-[12px]">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border border-white/40 text-[14px] font-semibold leading-[20px] tracking-[-0.1504px] text-white transition-colors hover:bg-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/painel/nav-logout.svg"
              alt=""
              width={16}
              height={16}
              className="size-[16px] shrink-0"
            />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
