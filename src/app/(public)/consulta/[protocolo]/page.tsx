'use client';

import { use, useEffect, useState } from 'react';
import { consultarPosicaoPorProtocolo } from '@/api/publico/consulta';
import { ApiError } from '@/api/utils/api';
import { ConsultaDetalheView } from '@/components/features/consulta-publica/consulta-detalhe-view';
import type { ConsultaPublicaResponse } from '@/entities/consulta-publica';

export default function ConsultaProtocoloDiretoPage({
  params,
}: {
  params: Promise<{ protocolo: string }>;
}) {
  const { protocolo } = use(params);
  const decodedProtocolo = decodeURIComponent(protocolo);

  const [data, setData] = useState<ConsultaPublicaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    consultarPosicaoPorProtocolo(decodedProtocolo)
      .then((response) => {
        if (!active) return;
        setData(response);
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(
            'Não foi possível carregar o acompanhamento desta matrícula.',
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [decodedProtocolo]);

  const solicitacao = data?.solicitacoes?.[0];

  return (
    <main className="min-h-screen w-full bg-[#f0f4ff]">
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center p-4 text-sm text-[#687386]">
          Carregando acompanhamento da matrícula...
        </div>
      ) : error || !solicitacao || !data ? (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            role="alert"
            className="w-full max-w-[420px] rounded-[16px] border border-red-200 bg-white p-6 text-center shadow-xs"
          >
            <h1 className="text-[18px] font-bold text-[#263238]">
              Acompanhamento indisponível
            </h1>
            <p className="pt-2 text-sm text-red-600">
              {error ?? 'Protocolo não encontrado.'}
            </p>
          </div>
        </div>
      ) : (
        <ConsultaDetalheView
          solicitacao={solicitacao}
          atualizadoEm={data.atualizadoEm}
        />
      )}
    </main>
  );
}
