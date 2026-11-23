'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CpfRevealProps {
  cpf: string;
  className?: string;
}

function maskCpf(cpf: string): string {
  if (!cpf) return '—';
  if (cpf.includes('*')) return cpf;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `***.${digits.slice(3, 6)}.***-**`;
}

function formatFullCpf(cpf: string): string {
  if (!cpf) return '—';
  if (cpf.includes('*')) return cpf;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function CpfReveal({ cpf, className }: CpfRevealProps) {
  const [revealed, setRevealed] = useState(false);

  const displayedCpf = revealed ? formatFullCpf(cpf) : maskCpf(cpf);
  const canToggle = Boolean(cpf && !cpf.includes('*'));

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="font-mono">{displayedCpf}</span>
      {canToggle ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setRevealed((prev) => !prev);
          }}
          aria-label={revealed ? 'Ocultar CPF' : 'Revelar CPF'}
          title={revealed ? 'Ocultar CPF' : 'Revelar CPF'}
          className="inline-flex size-5 cursor-pointer items-center justify-center rounded-md text-[#687386] transition-colors hover:bg-[#eef2ff] hover:text-[#3b5fe0]"
        >
          {revealed ? (
            <EyeOff className="size-3.5" aria-hidden="true" />
          ) : (
            <Eye className="size-3.5" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </span>
  );
}
