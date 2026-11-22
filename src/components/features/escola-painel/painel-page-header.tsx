'use client';

import { PageHeader } from '@/components/common/page-header';
import { usePainel } from './painel-context';

export function PainelPageHeader({ title }: { title: string }) {
  const { escola } = usePainel();
  return <PageHeader title={title} subtitle={escola?.nome} />;
}
