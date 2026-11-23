'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccordionSectionProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  hasError?: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function AccordionSection({
  title,
  subtitle,
  badge,
  hasError = false,
  isExpanded,
  onToggle,
  children,
}: AccordionSectionProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[16px] border bg-white transition-colors',
        hasError
          ? 'border-red-300'
          : isExpanded
            ? 'border-[#3b5fe0]/50 shadow-xs'
            : 'border-[#e8edf8]',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center justify-between gap-[12px] px-[21px] py-[16px] text-left transition-colors hover:bg-[#f8fafd]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[8px]">
            <h2 className="text-[16px] font-bold leading-[24px] tracking-[-0.3125px] text-[#263238]">
              {title}
            </h2>
            {hasError ? (
              <span className="rounded-full bg-[#fef2f2] px-[8px] py-[2px] text-[11px] font-semibold text-[#dc2626]">
                Atenção
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="pt-[2px] text-[12px] leading-[16px] text-[#979799]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-[12px]">
          {badge}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/chevron-down.svg"
            alt=""
            width={18}
            height={18}
            className={cn(
              'size-[18px] shrink-0 transition-transform',
              isExpanded && 'rotate-180',
            )}
          />
        </div>
      </button>

      {isExpanded ? (
        <div className="border-t border-[#f0f4ff] p-[21px]">{children}</div>
      ) : null}
    </section>
  );
}
