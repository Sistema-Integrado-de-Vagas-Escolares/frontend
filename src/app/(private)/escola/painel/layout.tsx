import { PainelShell } from '@/components/features/escola-painel/painel-shell';

export default function EscolaPainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PainelShell>{children}</PainelShell>;
}
