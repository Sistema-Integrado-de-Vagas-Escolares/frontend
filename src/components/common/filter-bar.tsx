'use client';

import { cn } from '@/lib/utils';

export interface FilterBarOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterLabel?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterBarOption[];
  defaultFilterValue?: string;
  summaryText?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterLabel,
  filterValue = '',
  onFilterChange,
  filterOptions,
  defaultFilterValue,
  summaryText,
  onRefresh,
  isRefreshing = false,
}: FilterBarProps) {
  const hasSelectConfig = Boolean(
    filterLabel && onFilterChange && filterOptions && filterOptions.length > 0,
  );
  const initialFilterValue =
    defaultFilterValue ?? filterOptions?.[0]?.value ?? '';
  const hasSearch = searchValue.trim().length > 0;
  const hasSelectFilter =
    hasSelectConfig && filterValue !== initialFilterValue;
  const hasAnyFilter = hasSearch || hasSelectFilter;

  const selectedOptionLabel =
    filterOptions?.find((option) => option.value === filterValue)?.label ??
    filterValue;

  function handleClearAll() {
    onSearchChange('');
    if (onFilterChange) {
      onFilterChange(initialFilterValue);
    }
  }

  return (
    <section
      aria-label="Filtros"
      className="flex w-full flex-col gap-[12px] border-b border-[#e2e7f0] pb-[16px]"
    >
      {summaryText ? (
        <div className="flex justify-end">
          <p className="text-[12px] font-normal leading-[18px] text-[#687386]">
            {summaryText}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-[16px] md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-[10px] rounded-[10px] border border-[#e2e7f0] bg-white px-[12px] py-[11px] focus-within:border-[#3b5fe0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/painel/search.svg"
            alt=""
            width={20}
            height={20}
            className="size-[20px] shrink-0"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-[14px] font-normal leading-[20px] text-[#263238] placeholder:text-[#687386] focus:outline-none"
          />
          {hasSearch ? (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => onSearchChange('')}
              className="shrink-0 cursor-pointer px-1 text-sm font-semibold text-[#687386] hover:text-[#263238]"
            >
              ×
            </button>
          ) : null}
        </label>

        {hasSelectConfig || onRefresh ? (
          <div className="flex items-center gap-[8px]">
            {hasSelectConfig ? (
              <div
                className={cn(
                  'relative flex flex-1 items-center gap-[8px] rounded-[10px] border bg-white px-[12px] py-[11px] focus-within:border-[#3b5fe0] md:w-[260px] md:flex-none',
                  hasSelectFilter ? 'border-[#3b5fe0]' : 'border-[#e2e7f0]',
                )}
              >
                <span className="shrink-0 text-[14px] font-normal leading-[20px] text-[#687386]">
                  {filterLabel}:
                </span>
                <select
                  aria-label={filterLabel}
                  value={filterValue}
                  onChange={(event) => onFilterChange?.(event.target.value)}
                  className={cn(
                    'w-full cursor-pointer appearance-none bg-transparent pr-8 text-[14px] font-normal leading-[20px] focus:outline-none',
                    hasSelectFilter
                      ? 'font-medium text-[#3b5fe0]'
                      : 'text-[#263238]',
                  )}
                >
                  {filterOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/painel/chevron-down.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="pointer-events-none absolute right-[14px] size-[18px] shrink-0"
                />
              </div>
            ) : null}

            {onRefresh ? (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="Atualizar lista"
                title="Atualizar lista"
                className="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e2e7f0] bg-white text-[#687386] transition-colors hover:border-[#3b5fe0] hover:text-[#3b5fe0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={cn('size-[18px]', isRefreshing && 'animate-spin')}
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {hasAnyFilter ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-normal text-[#687386]">
            Aplicados:
          </span>

          {hasSearch ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-[#3b5fe0] shadow-xs hover:bg-[#f8fafd]"
            >
              <span>Busca: {searchValue.trim()}</span>
              <span aria-hidden="true">×</span>
            </button>
          ) : null}

          {hasSelectFilter ? (
            <button
              type="button"
              onClick={() => onFilterChange?.(initialFilterValue)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-[12px] font-medium text-[#3b5fe0] shadow-xs hover:bg-[#f8fafd]"
            >
              <span>
                {filterLabel}: {selectedOptionLabel}
              </span>
              <span aria-hidden="true">×</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleClearAll}
            className="cursor-pointer px-1 text-[12px] font-semibold text-[#3b5fe0] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      ) : null}
    </section>
  );
}
