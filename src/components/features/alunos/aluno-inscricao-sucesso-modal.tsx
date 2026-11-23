'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Copy, Link2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ROUTES } from '@/constants/routes';

interface AlunoInscricaoSucessoModalProps {
  nomeAluno: string;
  protocolo: string;
  onClose: () => void;
}

export function AlunoInscricaoSucessoModal({
  nomeAluno,
  protocolo,
  onClose,
}: AlunoInscricaoSucessoModalProps) {
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const relativePath = ROUTES.CONSULTA_PROTOCOLO(protocolo);
  const trackingUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${relativePath}`
      : relativePath;

  async function handleCopyProtocol() {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inscricao-sucesso-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px]"
    >
      <div className="relative flex w-full max-w-[440px] flex-col rounded-[20px] border border-[#e8edf8] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#687386] transition-colors hover:bg-[#f0f4ff] hover:text-[#263238]"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#d0fae5] text-[#007a55]">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </div>

          <h2
            id="inscricao-sucesso-titulo"
            className="pt-3 text-[18px] font-bold leading-[24px] text-[#263238]"
          >
            Inscrição realizada com sucesso!
          </h2>
          <p className="pt-1 text-[13px] leading-[18px] text-[#687386]">
            <span className="font-semibold text-[#263238]">{nomeAluno}</span>{' '}
            foi adicionado(a) à lista de espera.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-[14px] border border-[#e8edf8] bg-[#f8faff] px-4 py-3">
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#979799]">
              Protocolo
            </p>
            <p className="font-mono text-[15px] font-bold text-[#263238]">
              {protocolo}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyProtocol}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#dce4f7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#3b5fe0] transition-colors hover:bg-[#eef2ff]"
          >
            {copiedProtocol ? (
              <>
                <Check className="size-3.5 text-[#007a55]" aria-hidden="true" />
                <span className="text-[#007a55]">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" aria-hidden="true" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center rounded-[16px] border border-[#e8edf8] bg-white p-4">
          <p className="pb-3 text-[12px] font-medium text-[#5e6062]">
            Escaneie o QR Code para acompanhar a fila
          </p>
          <div className="rounded-[12px] border border-[#e8edf8] bg-white p-3">
            <QRCodeSVG
              value={trackingUrl}
              size={168}
              level="M"
              bgColor="#ffffff"
              fgColor="#263238"
            />
          </div>
          <p className="mt-3 max-w-full truncate font-mono text-[11px] text-[#687386]">
            {trackingUrl}
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#3b5fe0] bg-[#eef2ff] px-4 py-2.5 text-[14px] font-semibold text-[#3b5fe0] transition-colors hover:bg-[#e0e7ff]"
          >
            {copiedLink ? (
              <>
                <Check className="size-4 text-[#007a55]" aria-hidden="true" />
                <span className="text-[#007a55]">Link copiado!</span>
              </>
            ) : (
              <>
                <Link2 className="size-4" aria-hidden="true" />
                <span>Copiar link</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-[14px] bg-[#3b5fe0] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#3252c7]"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
