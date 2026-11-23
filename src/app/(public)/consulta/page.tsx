'use client';

import { useState } from 'react';
import { ConsultaDetalheView } from '@/components/features/consulta-publica/consulta-detalhe-view';
import { ConsultaLoginCard } from '@/components/features/consulta-publica/consulta-login-card';
import { ConsultaSolicitacoesView } from '@/components/features/consulta-publica/consulta-solicitacoes-view';
import type {
  ConsultaPublicaResponse,
  SolicitacaoPublica,
} from '@/entities/consulta-publica';

export default function ConsultaPublicaPage() {
  const [consultaData, setConsultaData] =
    useState<ConsultaPublicaResponse | null>(null);
  const [selectedSolicitacao, setSelectedSolicitacao] =
    useState<SolicitacaoPublica | null>(null);

  if (!consultaData) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f0f4ff] p-4">
        <ConsultaLoginCard
          onSuccess={(response) => {
            setConsultaData(response);
            setSelectedSolicitacao(null);
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#f0f4ff]">
      {selectedSolicitacao ? (
        <ConsultaDetalheView
          solicitacao={selectedSolicitacao}
          atualizadoEm={consultaData.atualizadoEm}
          onBack={() => setSelectedSolicitacao(null)}
        />
      ) : (
        <ConsultaSolicitacoesView
          data={consultaData}
          onSelectSolicitacao={setSelectedSolicitacao}
          onLogout={() => {
            setConsultaData(null);
            setSelectedSolicitacao(null);
          }}
        />
      )}
    </main>
  );
}
