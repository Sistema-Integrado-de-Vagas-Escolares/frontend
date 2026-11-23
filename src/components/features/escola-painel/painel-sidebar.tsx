'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  invertIcon?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Início',
    href: ROUTES.HOME,
    icon: '/images/painel/nav-home.svg',
  },
  {
    label: 'Lista de Espera',
    href: ROUTES.LISTA_ESPERA,
    icon: '/images/painel/nav-waitlist.svg',
  },
  {
    label: 'Turmas',
    href: ROUTES.TURMAS,
    icon: '/images/painel/nav-slots.svg',
  },
  {
    label: 'Critérios de Fila',
    href: ROUTES.CRITERIOS,
    icon: '/images/painel/criterios/sliders-blue.svg',
    invertIcon: true,
  },
  {
    label: 'Histórico',
    href: ROUTES.HISTORICO,
    icon: '/images/painel/nav-history.svg',
  },
  {
    label: 'Responsáveis',
    href: ROUTES.RESPONSAVEIS,
    icon: '/images/painel/nav-guardians.svg',
  },
  {
    label: 'Alunos',
    href: ROUTES.ALUNOS,
    icon: '/images/painel/nav-students.svg',
  },
];

interface PainelSidebarProps {
  escolaNome: string;
  escolaCidade: string;
  onLogout: () => void;
  onNavigate?: () => void;
}

export function PainelSidebar({
  escolaNome,
  escolaCidade,
  onLogout,
  onNavigate,
}: PainelSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[288px] flex-col bg-[#3b5fe0]">
      <div className="border-b border-white/15 px-[20px] py-[18px]">
        <p className="break-words text-[16px] font-bold leading-snug tracking-[-0.1504px] text-white">
          {escolaNome}
        </p>
        <p className="mt-[2px] truncate text-[12px] font-normal leading-[16px] text-white/60">
          {escolaCidade}
        </p>
      </div>

      <nav aria-label="Menu do painel" className="flex-1 overflow-y-auto p-[12px]">
        <ul className="flex flex-col gap-[4px]">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === ROUTES.HOME
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
                      item.invertIcon && 'brightness-0 invert',
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
