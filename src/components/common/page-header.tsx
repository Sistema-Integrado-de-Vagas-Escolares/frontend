interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="flex w-full flex-col items-start">
      <h1 className="text-[24px] font-bold leading-[32px] tracking-[0.0703px] text-[#263238]">
        {title}
      </h1>
      {subtitle ? (
        <p className="pt-[2px] text-[14px] font-normal leading-[20px] tracking-[-0.1504px] text-[#979799]">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
