import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { AlunoForm } from '@/components/features/alunos/aluno-form';
import { ROUTES } from '@/constants/routes';

export default function NovoAlunoPage() {
  return (
    <>
      <div className="pb-[12px]">
        <Link
          href={ROUTES.ALUNOS}
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

      <PageHeader
        title="Cadastrar aluno"
        subtitle="Nova inscrição na lista de espera"
      />

      <AlunoForm />
    </>
  );
}
