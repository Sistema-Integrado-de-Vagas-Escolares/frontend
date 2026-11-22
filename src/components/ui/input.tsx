import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex h-[44px] w-full rounded-[14px] border border-transparent bg-[#f0f4ff] px-4 py-3 text-[14px] text-[#1f2937] placeholder:text-[#bfc5d2] transition-colors focus:border-[#3b5fe0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
