import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import siveIcon from "@/imports/SIVE_teste__6_-removebg-preview-1.png";

// ==================== LOGO ====================

/**
 * Logotipo VagaEscolar: ícone de escola + "PREFEITURA MUNICIPAL" + "SISTEMA DE INTEGRAÇÃO DE VAGAS".
 * Projetado para fundos azuis. Use className no wrapper e scale para tamanhos maiores.
 */
export function SiveLogo({
  className = "",
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  const icon = Math.round(40 * scale);
  const inner = Math.round(34 * scale);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={siveIcon}
        alt=""
        className="shrink-0"
        style={{ width: inner, height: inner }}
      />
      <div>
        <p
          className="text-white font-bold leading-tight"
          style={{ fontSize: 24 }}
        >
          Sistema de Integração <br />
          de Vagas Escolares
        </p>
      </div>
    </div>
  );
}

// ==================== LAYOUT ====================

/**
 * Two-column desktop shell: fixed sidebar + scrollable content.
 * On mobile the sidebar is hidden and `children` render full-width.
 */
export function PortalLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Sidebar fixed to absolute left edge of viewport */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-72 fixed left-0 top-0 bottom-0 z-20 overflow-y-auto">
        {sidebar}
      </aside>
      {/* Main: offset by sidebar width, background extends full screen width */}
      <main className="min-h-screen lg:pl-64 xl:pl-72 bg-[#f0f4ff]">
        {children}
      </main>
    </div>
  );
}

/** Constrains readable content width inside the main area. Centered within available space. */
export function ContentArea({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`px-4 pt-4 pb-8 lg:px-8 lg:py-8 max-w-[1200px] mx-auto space-y-4 ${className}`}
    >
      {children}
    </div>
  );
}

/** Sidebar nav item. */
export function SideNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/55 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

/** Desktop page title (shown above content on lg screens). */
export function PageTitle({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  return (
    <div className="hidden lg:block mb-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#979799] text-xs mb-3 hover:text-[#5e6062] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </button>
      )}
      <h2 className="text-[#263238] text-2xl font-bold">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#979799] text-sm mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ==================== MOBILE HEADERS ====================

export function SubHeader({
  title,
  subtitle,
  dark = false,
  onBack,
}: {
  title: string;
  subtitle?: string;
  dark?: boolean;
  onBack?: () => void;
}) {
  const bg = dark ? "bg-[#263238]" : "bg-[#3b5fe0]";
  return (
    <div className={`${bg} px-5 pt-12 pb-6 lg:hidden`}>
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-white/60 active:opacity-70"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </button>
      )}
      <h2 className="text-white text-xl font-bold leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/60 text-sm mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function MobileHeader({
  title,
  subtitle,
  dark = false,
  children,
}: {
  title: string;
  subtitle?: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  const bg = dark ? "bg-[#263238]" : "bg-[#3b5fe0]";
  return (
    <div className={`${bg} px-5 pt-12 pb-5 lg:hidden`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/50 text-xs">{subtitle}</p>
          <h2 className="text-white text-lg font-bold leading-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Back to portal selector.
 * alwaysShow=true: visible on both mobile and desktop (use on login screens).
 * Default: mobile-only (logged-in screens use sidebar nav on desktop).
 */
export function BackToPortals({
  alwaysShow = false,
}: {
  alwaysShow?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`px-4 pt-3 pb-1 ${alwaysShow ? "" : "lg:hidden"}`}
    >
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-[#979799] text-xs hover:text-[#5e6062] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Início — Portal SIVE
      </button>
    </div>
  );
}

// ==================== CARD ====================

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#e8edf8] ${className}`}
    >
      {children}
    </div>
  );
}

// ==================== TABS ====================

export function TabBar({
  tabs,
  active,
  onChange,
  dark = false,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
  dark?: boolean;
}) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            active === t.key
              ? dark
                ? "bg-white text-[#263238]"
                : "bg-white text-[#3b5fe0]"
              : "bg-white/15 text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ==================== FORM ====================

export function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  hint,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  hint?: string;
}) {
  const [showPwd, setShowPwd] = useState(false);
  return (
    <div>
      <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={
            type === "password"
              ? showPwd
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] placeholder-[#bfc5d2] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm pr-11"
        />
        {type === "password" && (
          <button
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#979799]"
          >
            {showPwd ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {hint && (
        <p className="text-[#979799] text-xs mt-1">{hint}</p>
      )}
    </div>
  );
}

// ==================== BUTTONS ====================

export function PrimaryBtn({
  children,
  onClick,
  dark = false,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  dark?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  const bg = dark
    ? "bg-[#263238] hover:bg-[#1a2428]"
    : "bg-[#3b5fe0] hover:bg-[#2f4fc4]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${bg} text-white font-semibold py-3.5 rounded-xl text-sm active:scale-95 transition-all disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryBtn({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-[#f0f4ff] hover:bg-[#e4ecff] text-[#5e6062] font-semibold py-3.5 rounded-xl text-sm active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );
}

// ==================== BADGES / MISC ====================

export function VacancyBadge({
  vacancies,
}: {
  vacancies: number;
}) {
  const status =
    vacancies === 0
      ? "esgotado"
      : vacancies < 10
        ? "limitado"
        : "disponivel";
  const styles = {
    esgotado: {
      bg: "bg-red-50 border border-red-100",
      text: "text-red-500",
    },
    limitado: {
      bg: "bg-amber-50 border border-amber-100",
      text: "text-amber-500",
    },
    disponivel: {
      bg: "bg-emerald-50 border border-emerald-100",
      text: "text-emerald-500",
    },
  };
  const s = styles[status];
  return (
    <div
      className={`${s.bg} rounded-xl px-3 py-2 text-center min-w-[58px]`}
    >
      <p className={`text-xl font-bold leading-none ${s.text}`}>
        {vacancies}
      </p>
      <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>
        vagas
      </p>
    </div>
  );
}

export function InfoBox({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "amber" | "green";
}) {
  const styles = {
    blue: "bg-[#7da5ff]/15 text-[#5e6062]",
    amber: "bg-amber-50 border border-amber-100 text-amber-700",
    green:
      "bg-emerald-50 border border-emerald-100 text-emerald-700",
  };
  return (
    <div
      className={`rounded-2xl p-4 text-sm leading-relaxed ${styles[color]}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color = "#3b5fe0",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <Card className="p-4">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-[#263238] text-2xl font-bold leading-none">
        {value}
      </p>
      <p className="text-[#979799] text-xs mt-1 leading-snug">
        {label}
      </p>
    </Card>
  );
}

export function TypePill({
  type,
}: {
  type: "creche" | "fundamental";
}) {
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        type === "creche"
          ? "bg-[#7da5ff]/25 text-[#3b5fe0]"
          : "bg-[#263238]/10 text-[#263238]"
      }`}
    >
      {type === "creche" ? "Creche" : "Fundamental"}
    </span>
  );
}

export function ScoreBar({
  score,
  label,
  weight,
  description,
}: {
  score: number;
  label: string;
  weight: number;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[#263238] text-sm font-medium">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[#979799] text-xs bg-[#f0f4ff] px-2 py-0.5 rounded-full">
            Peso {weight}%
          </span>
          <span className="text-[#3b5fe0] font-bold text-sm">
            {score}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-[#f0f4ff] rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-[#3b5fe0] rounded-full"
          style={{ width: `${score * 10}%` }}
        />
      </div>
      <p className="text-[#979799] text-xs">{description}</p>
    </div>
  );
}