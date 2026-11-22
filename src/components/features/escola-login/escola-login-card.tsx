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
    </section>
  );
}
