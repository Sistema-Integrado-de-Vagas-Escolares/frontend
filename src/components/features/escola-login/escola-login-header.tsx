export function EscolaLoginHeader() {
  return (
    <header className="flex w-full flex-col items-center rounded-t-[24px] bg-[#3b5fe0] px-6 py-8">
      <div className="flex h-[56px] items-end">
        <div className="relative h-[48px] w-[32px] shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-sive-s.png"
            alt="SIVE"
            className="pointer-events-none absolute top-0 left-[-25.02%] h-full w-[143.79%] max-w-none"
          />
        </div>
        <span className="text-[40px] font-bold leading-[36px] tracking-tight text-white">
          ive
        </span>
      </div>

      <h1 className="pt-5 text-center text-[24px] font-bold leading-[28px] text-white">
        Painel da Escola
      </h1>
    </header>
  );
}
