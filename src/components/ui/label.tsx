import * as React from 'react';
import { cn } from '@/lib/utils';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          'block text-[12px] font-semibold leading-[16px] text-[#5e6062]',
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = 'Label';
