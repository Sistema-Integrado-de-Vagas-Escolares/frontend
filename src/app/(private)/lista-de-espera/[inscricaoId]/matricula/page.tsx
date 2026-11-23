import Link from 'next/link';
import { PainelPageHeader } from '@/components/features/escola-painel/painel-page-header';
import { ROUTES } from '@/constants/routes';

export default function InscricaoMatriculaPage() {
  return (
    <>
      <div className="pb-[12px]">
        <Link
          href={ROUTES.LISTA_ESPERA}
          className="inline-flex items-center gap-[6px] text-[12px] font-medium leading-[16px] text-[#979799] transition-colors hover:text-[#263238]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/arrow-left.svg"
            alt=""
            width={14}
            height={14}
            className="size-[14px] shrink-0"
          />
          <span>Voltar</span>
        </Link>
      </div>
      <PainelPageHeader title="Detalhes da matrícula" />
    </>
  );
}
