'use client';

import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  variant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/50 p-4 backdrop-blur-[2px]"
    >
      <div className="relative flex w-full max-w-[420px] flex-col rounded-[20px] border border-[#e8edf8] bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          disabled={isConfirming}
          aria-label="Fechar modal"
          className="absolute right-4 top-4 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#687386] transition-colors hover:bg-[#f0f4ff] hover:text-[#263238] disabled:opacity-50"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3.5">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              variant === 'danger'
                ? 'bg-[#fef2f2] text-[#bb2635]'
                : 'bg-[#fef3c7] text-[#b45309]',
            )}
          >
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1 pr-6">
            <h2
              id="confirm-dialog-title"
              className="text-[17px] font-bold leading-[24px] text-[#263238]"
            >
              {title}
            </h2>
            <p className="pt-1.5 text-[13px] leading-[19px] text-[#687386]">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="inline-flex cursor-pointer items-center justify-center rounded-[14px] border border-[#dce4f7] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#5e6062] transition-colors hover:bg-[#f8faff] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={cn(
              'inline-flex cursor-pointer items-center justify-center rounded-[14px] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              variant === 'danger'
                ? 'bg-[#bb2635] hover:bg-[#9f1f2c]'
                : 'bg-[#3b5fe0] hover:bg-[#3252c7]',
            )}
          >
            {isConfirming ? 'Confirmando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
