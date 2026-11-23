import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { EscolaLoginForm } from './escola-login-form';
import { EscolaLoginHeader } from './escola-login-header';

export function EscolaLoginCard() {
  return (
    <section
      aria-label="Login do Painel da Escola"
      className="flex w-full max-w-[384px] flex-col items-start"
    >
      <EscolaLoginHeader />
      <EscolaLoginForm />
      <p className="w-full pt-[20px] text-center text-[13px] text-[#687386]">
        É responsável?{' '}
        <Link
          href={ROUTES.CONSULTA}
          className="font-semibold text-[#3b5fe0] hover:underline"
        >
          Consultar posição na fila
        </Link>
      </p>
    </section>
  );
}
