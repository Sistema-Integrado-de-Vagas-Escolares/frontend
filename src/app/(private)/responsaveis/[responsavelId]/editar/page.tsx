'use client';

import { use } from 'react';
import { ResponsavelEditarView } from '@/components/features/responsaveis/responsavel-editar-view';
import { ROUTES } from '@/constants/routes';

export default function EditarResponsavelPage({
  params,
}: {
  params: Promise<{ responsavelId: string }>;
}) {
  const { responsavelId } = use(params);

  return (
    <ResponsavelEditarView
      responsavelId={responsavelId}
      backHref={ROUTES.RESPONSAVEL_DETALHE(responsavelId)}
    />
  );
}
