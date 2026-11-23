import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
  iconSize?: number;
}

export function Select({
  className,
  wrapperClassName,
  iconSize = 18,
  children,
  ...props
}: SelectProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <select
        {...props}
        className={cn(
          'w-full cursor-pointer appearance-none pr-[42px] focus:outline-none',
          className,
        )}
      >
        {children}
      </select>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/painel/chevron-down.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        style={{ width: iconSize, height: iconSize }}
        className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
