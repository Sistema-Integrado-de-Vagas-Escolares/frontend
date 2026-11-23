import { BackLink } from '@/components/common/back-link';
import { PainelPageHeader } from '@/components/features/escola-painel/painel-page-header';
import { ROUTES } from '@/constants/routes';

export default function HistoricoPage() {
  return (
    <>
      <BackLink href={ROUTES.HOME} />
      <PainelPageHeader title="Histórico" />
    </>
  );
}
