import { useState } from "react";
import {
  Users, School, CheckCircle, Star, TrendingUp, BarChart3, LogOut, X,
  Building2, Plus, ChevronRight, Edit3, Globe, Palette,
  MapPin, Baby, Eye, ArrowLeft,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  PortalLayout, ContentArea, SideNavItem, PageTitle,
  BackToPortals, Card, StatCard, PrimaryBtn, SecondaryBtn, FormField,
} from "../components/Shared";
import { seducMonthly, seducPie, topSchools, schools } from "../data";
import { useNavigate } from "react-router";
import siveIcon from "@/imports/SIVE_teste__6_-removebg-preview-1.png";
import siveLogo from "@/imports/SIVE_teste__6_-removebg-preview-2.png";

// ==================== TYPES ====================

type Screen = "login" | "dashboard";
type DashTab = "overview" | "schools" | "trends" | "prefeituras";

interface Prefeitura {
  id: number;
  name: string;
  city: string;
  state: string;
  cnpj: string;
  schools: number;
  waitlist: number;
  active: boolean;
  primaryColor: string;
  systemName: string;
  subtitle: string;
  contactEmail: string;
  waitlistUrl: string;
  mapaUrl: string;
  escolaUrl: string;
}

// ==================== MOCK DATA ====================

const initPrefeituras: Prefeitura[] = [
  {
    id: 1, name: "Prefeitura Municipal de São Paulo", city: "São Paulo", state: "SP",
    cnpj: "46.395.000/0001-39", schools: 34, waitlist: 1247, active: true,
    primaryColor: "#3b5fe0", systemName: "VagaEscolar", subtitle: "Sistema de Vagas Escolares",
    contactEmail: "educacao@saopaulo.sp.gov.br",
    waitlistUrl: "responsavel.saopaulo.sive.gov.br",
    mapaUrl: "mapa.saopaulo.sive.gov.br",
    escolaUrl: "escola.saopaulo.sive.gov.br",
  },
  {
    id: 2, name: "Prefeitura Municipal de Campinas", city: "Campinas", state: "SP",
    cnpj: "51.885.242/0001-40", schools: 18, waitlist: 523, active: true,
    primaryColor: "#2d7dd2", systemName: "VagaEduca", subtitle: "Vagas na Educação",
    contactEmail: "educacao@campinas.sp.gov.br",
    waitlistUrl: "responsavel.campinas.sive.gov.br",
    mapaUrl: "mapa.campinas.sive.gov.br",
    escolaUrl: "escola.campinas.sive.gov.br",
  },
  {
    id: 3, name: "Prefeitura Municipal de Ribeirão Preto", city: "Ribeirão Preto", state: "SP",
    cnpj: "44.082.465/0001-60", schools: 12, waitlist: 318, active: false,
    primaryColor: "#7c3aed", systemName: "VagasRP", subtitle: "Vagas Escolares de RP",
    contactEmail: "educacao@ribeiraopreto.sp.gov.br",
    waitlistUrl: "responsavel.rp.sive.gov.br",
    mapaUrl: "mapa.rp.sive.gov.br",
    escolaUrl: "escola.rp.sive.gov.br",
  },
];

// ==================== LOGO COMPONENT ====================

export function SiveLogo({ className = "", scale = 1 }: { className?: string; scale?: number }) {
  const icon = Math.round(40 * scale);
  const inner = Math.round(34 * scale);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="bg-[#7DA5FF] rounded-xl flex items-center justify-center shrink-0"
        style={{ width: icon, height: icon }}
      >
        <img src={siveIcon} alt="" style={{ width: inner, height: inner }} />
      </div>
      <div>
        <p className="text-white/60 font-normal leading-tight" style={{ fontSize: 14 }}>Vagas Escolares</p>
        <p className="text-white font-bold leading-tight" style={{ fontSize: 24 }}>Painel SEDUC</p>
      </div>
    </div>
  );
}

// ==================== BRAND PREVIEW ====================

function BrandPreview({ pref }: { pref: Prefeitura }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e8edf8] shadow-sm">
      <p className="text-[#979799] text-xs font-semibold px-3 py-2 bg-[#f0f4ff] border-b border-[#e8edf8]">
        Pré-visualização
      </p>
      {/* Mini sidebar */}
      <div className="flex h-36">
        <div className="w-40 flex flex-col p-3" style={{ backgroundColor: pref.primaryColor }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white/60 leading-none" style={{ fontSize: 7 }}>Prefeitura Municipal</p>
              <p className="text-white font-bold leading-none" style={{ fontSize: 11 }}>{pref.systemName}</p>
            </div>
          </div>
          {["Visão Geral", "Escolas", "Responsáveis"].map((item) => (
            <div key={item} className="flex items-center gap-1.5 px-2 py-1 rounded-lg mb-0.5 bg-white/10">
              <div className="w-2 h-2 rounded-sm bg-white/50" />
              <p className="text-white/80" style={{ fontSize: 8 }}>{item}</p>
            </div>
          ))}
        </div>
        {/* Mini content */}
        <div className="flex-1 bg-[#f0f4ff] p-3 space-y-2">
          <p className="text-[#263238] font-bold" style={{ fontSize: 10 }}>{pref.systemName} — {pref.city}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[["1.247", "Em espera"], ["89", "Vagas"]].map(([v, l]) => (
              <div key={l} className="bg-white rounded-lg p-1.5">
                <p className="font-bold" style={{ color: pref.primaryColor, fontSize: 12 }}>{v}</p>
                <p className="text-[#979799]" style={{ fontSize: 7 }}>{l}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-1.5">
            <p className="text-[#263238] font-medium" style={{ fontSize: 8 }}>{pref.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PREFEITURA EDITOR ====================

function PrefeituraEditor({
  pref, onBack, onSave,
}: {
  pref: Prefeitura; onBack: () => void; onSave: (p: Prefeitura) => void;
}) {
  const [form, setForm] = useState({ ...pref });
  const update = (k: keyof Prefeitura, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <>
      <SubHeader title={form.name} subtitle="Configurações da Prefeitura" onBack={onBack} />
      <ContentArea>
        <PageTitle title={form.name} subtitle="Configurações e identidade visual" onBack={onBack} />

        <div className="max-w-2xl space-y-5">
          {/* Dados básicos */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-[#3b5fe0]" />
              <p className="text-[#263238] font-semibold text-sm">Dados da Prefeitura</p>
            </div>
            <FormField label="Nome da Prefeitura" placeholder="Prefeitura Municipal de..." value={form.name} onChange={(v) => update("name", v)} />
            <FormField label="Cidade" placeholder="Nome da cidade" value={form.city} onChange={(v) => update("city", v)} />
            <FormField label="Estado (UF)" placeholder="SP" value={form.state} onChange={(v) => update("state", v)} />
            <FormField label="CNPJ" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={(v) => update("cnpj", v)} />
            <FormField label="E-mail de contato" placeholder="educacao@prefeitura.gov.br" type="email" value={form.contactEmail} onChange={(v) => update("contactEmail", v)} />

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => update("active", !form.active)}
                className={`w-12 h-6 rounded-full transition-colors shrink-0 ${form.active ? "bg-[#3b5fe0]" : "bg-[#e8edf8]"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.active ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <p className="text-[#263238] text-sm font-medium">
                {form.active ? "Prefeitura ativa no sistema" : "Prefeitura inativa"}
              </p>
            </div>
          </Card>

          {/* Identidade visual */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="w-4 h-4 text-[#3b5fe0]" />
              <p className="text-[#263238] font-semibold text-sm">Identidade Visual</p>
            </div>
            <FormField label="Nome do sistema" placeholder="ex: VagaEscolar" value={form.systemName} onChange={(v) => update("systemName", v)} hint="Aparece no cabeçalho de todos os portais desta prefeitura." />
            <FormField label="Subtítulo / Slogan" placeholder="ex: Sistema de Vagas Escolares" value={form.subtitle} onChange={(v) => update("subtitle", v)} />
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Cor primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="w-12 h-10 rounded-xl border border-[#e8edf8] cursor-pointer p-1"
                />
                <div className="flex-1 bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm font-mono">
                  {form.primaryColor}
                </div>
                <div className="w-10 h-10 rounded-xl border border-[#e8edf8] shrink-0" style={{ backgroundColor: form.primaryColor }} />
              </div>
            </div>

            {/* Preview */}
            <BrandPreview pref={form} />
          </Card>

          {/* URLs dos portais */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-[#3b5fe0]" />
              <p className="text-[#263238] font-semibold text-sm">Portais habilitados</p>
            </div>
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
                <Baby className="w-3.5 h-3.5 inline mr-1" />Lista de Espera (Responsáveis)
              </label>
              <div className="flex items-center gap-2 bg-[#f0f4ff] rounded-xl px-4 py-3">
                <p className="text-[#979799] text-xs">https://</p>
                <input
                  type="text"
                  value={form.waitlistUrl}
                  onChange={(e) => update("waitlistUrl", e.target.value)}
                  className="flex-1 bg-transparent text-[#263238] text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />Mapa de Vagas
              </label>
              <div className="flex items-center gap-2 bg-[#f0f4ff] rounded-xl px-4 py-3">
                <p className="text-[#979799] text-xs">https://</p>
                <input
                  type="text"
                  value={form.mapaUrl}
                  onChange={(e) => update("mapaUrl", e.target.value)}
                  className="flex-1 bg-transparent text-[#263238] text-sm outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
                <School className="w-3.5 h-3.5 inline mr-1" />Painel da Escola
              </label>
              <div className="flex items-center gap-2 bg-[#f0f4ff] rounded-xl px-4 py-3">
                <p className="text-[#979799] text-xs">https://</p>
                <input
                  type="text"
                  value={form.escolaUrl}
                  onChange={(e) => update("escolaUrl", e.target.value)}
                  className="flex-1 bg-transparent text-[#263238] text-sm outline-none"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <PrimaryBtn onClick={() => onSave(form)}>Salvar configurações</PrimaryBtn>
            <SecondaryBtn onClick={onBack}>Cancelar</SecondaryBtn>
          </div>
        </div>
      </ContentArea>
    </>
  );
}

// ==================== PREFEITURAS LIST ====================

function PrefeiturasList({
  prefeituras, onSelect, onNew,
}: {
  prefeituras: Prefeitura[];
  onSelect: (p: Prefeitura) => void;
  onNew: () => void;
}) {
  const total = prefeituras.reduce((a, p) => a + p.waitlist, 0);
  const totalSchools = prefeituras.reduce((a, p) => a + p.schools, 0);

  return (
    <ContentArea>
      <div className="flex items-center justify-between">
        <PageTitle title="Prefeituras" subtitle={`${prefeituras.length} municípios cadastrados`} />
        <button
          onClick={onNew}
          className="hidden lg:flex items-center gap-2 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2f4fc4] transition-colors mb-6"
        >
          <Plus className="w-4 h-4" /> Nova Prefeitura
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Municípios ativos" value={prefeituras.filter((p) => p.active).length} icon={Building2} color="#3b5fe0" />
        <StatCard label="Total em lista de espera" value={total.toLocaleString("pt-BR")} icon={Users} color="#7c3aed" />
        <StatCard label="Escolas cadastradas" value={totalSchools} icon={School} color="#5e6062" />
      </div>

      <PrimaryBtn onClick={onNew} className="lg:hidden">
        <span className="flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Nova Prefeitura</span>
      </PrimaryBtn>

      {/* List */}
      <div className="space-y-3">
        {prefeituras.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 border border-[#e8edf8] text-left hover:shadow-md active:scale-[0.97] transition-all"
          >
            {/* Color swatch */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.primaryColor }}>
              <School className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-[#263238] text-sm truncate">{p.name}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-[#f0f4ff] text-[#979799]"}`}>
                  {p.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <p className="text-[#979799] text-xs">{p.city} — {p.state} · {p.systemName}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[#5e6062] text-xs">{p.schools} escolas</span>
                <span className="text-[#5e6062] text-xs">{p.waitlist.toLocaleString("pt-BR")} em espera</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-[#f0f4ff] flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-[#5e6062]" />
              </div>
              <div className="flex gap-1">
                {[p.waitlistUrl, p.mapaUrl, p.escolaUrl].map((url) => (
                  <div key={url} className="w-1.5 h-1.5 rounded-full bg-emerald-400" title={url} />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ContentArea>
  );
}

// ==================== SIDEBAR ====================

function SeducSidebar({ tab, setTab, onLogout }: { tab: DashTab; setTab: (t: DashTab) => void; onLogout: () => void }) {
  const nav = [
    { key: "overview", icon: BarChart3, label: "Visão Geral" },
    { key: "schools", icon: School, label: "Escolas" },
    { key: "trends", icon: TrendingUp, label: "Tendências" },
    { key: "prefeituras", icon: Building2, label: "Prefeituras" },
  ];
  return (
    <div className="bg-[#3b5fe0] h-full flex flex-col">
      <div className="px-5 py-6 border-b border-white/15">
        <SiveLogo />
        <p className="text-white/40 text-xs mt-3">Atualizado em 03/07/2026</p>
      </div>
      <div className="px-4 py-4 border-b border-white/15 space-y-2">
        <div className="bg-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between">
          <p className="text-white/60 text-xs">Em lista de espera</p>
          <p className="font-bold text-sm text-white">2.088</p>
        </div>
        <div className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-between">
          <p className="text-[#5e6062] text-xs">Municípios ativos</p>
          <p className="font-bold text-sm text-[#3b5fe0]">2</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => (
          <SideNavItem key={item.key} icon={item.icon} label={item.label} active={tab === item.key} onClick={() => setTab(item.key as DashTab)} />
        ))}
      </nav>
      <div className="px-4 pb-5 pt-4 space-y-3">
        <div className="flex justify-center">
          <img src={siveLogo} alt="SIVE" className="h-10 w-auto object-contain opacity-80" />
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 border border-white/40 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN ====================

// Inline SubHeader since it's used locally (avoids dark-prop issues)
function SubHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <div className="bg-[#3b5fe0] px-5 pt-12 pb-6 lg:hidden">
      {onBack && (
        <button onClick={onBack} className="mb-4 flex items-center gap-1.5 text-white/60">
          <ArrowLeft className="w-4 h-4" /><span className="text-sm">Voltar</span>
        </button>
      )}
      <h2 className="text-white text-xl font-bold leading-tight">{title}</h2>
      {subtitle && <p className="text-white/60 text-sm mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function SeducApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<DashTab>("overview");
  const [prefeituras, setPrefeituras] = useState<Prefeitura[]>(initPrefeituras);
  const [selPref, setSelPref] = useState<Prefeitura | null>(null);
  const [showNewPref, setShowNewPref] = useState(false);
  const navigate = useNavigate();

  const savePref = (updated: Prefeitura) => {
    setPrefeituras((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setSelPref(null);
  };

  const createPref = (newP: Prefeitura) => {
    const newId = Math.max(...prefeituras.map((p) => p.id)) + 1;
    setPrefeituras((prev) => [...prev, { ...newP, id: newId }]);
    setShowNewPref(false);
  };

  const blankPref: Prefeitura = {
    id: 0, name: "", city: "", state: "", cnpj: "", schools: 0, waitlist: 0, active: true,
    primaryColor: "#3b5fe0", systemName: "VagaEscolar", subtitle: "Sistema de Vagas Escolares",
    contactEmail: "", waitlistUrl: "", mapaUrl: "", escolaUrl: "",
  };

  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex flex-col font-[Inter,sans-serif] lg:items-center lg:justify-center">
        <div className="w-full max-w-sm mx-auto">
          <BackToPortals alwaysShow />
          <div className="bg-[#3b5fe0] px-6 pt-8 pb-8 lg:rounded-t-3xl">
            <SiveLogo scale={1.1} />
            <p className="text-white/55 text-sm mt-3">Painel Secretaria da Educação</p>
          </div>
          <div className="bg-white px-6 py-6 space-y-4 lg:rounded-b-3xl shadow-xl">
            <FormField label="E-mail institucional" placeholder="nome@seduc.gov.br" type="email" />
            <FormField label="Senha" placeholder="••••••••" type="password" />
            <PrimaryBtn onClick={() => setScreen("dashboard")}>Acessar Painel</PrimaryBtn>
          </div>
        </div>
      </div>
    );
  }

  // ---- PREFEITURA EDITOR ----
  if (selPref) {
    return (
      <PortalLayout sidebar={<SeducSidebar tab={tab} setTab={setTab} onLogout={() => setScreen("login")} />}>
        <BackToPortals />
        <PrefeituraEditor pref={selPref} onBack={() => setSelPref(null)} onSave={savePref} />
      </PortalLayout>
    );
  }

  if (showNewPref) {
    return (
      <PortalLayout sidebar={<SeducSidebar tab={tab} setTab={setTab} onLogout={() => setScreen("login")} />}>
        <BackToPortals />
        <PrefeituraEditor pref={blankPref} onBack={() => setShowNewPref(false)} onSave={createPref} />
      </PortalLayout>
    );
  }

  // ---- DASHBOARD ----
  const MobileTabHeader = () => (
    <div className="bg-[#3b5fe0] px-5 pt-4 pb-5 lg:hidden">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <SiveLogo scale={0.75} />
        </div>
        <button onClick={() => setScreen("login")} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-white/35 text-xs mb-3 mt-2">Painel Secretaria da Educação · 03/07/2026</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {([
          { key: "overview", label: "Visão Geral" },
          { key: "schools", label: "Escolas" },
          { key: "trends", label: "Tendências" },
          { key: "prefeituras", label: "Prefeituras" },
        ] as { key: DashTab; label: string }[]).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === t.key ? "bg-white text-[#3b5fe0]" : "bg-white/15 text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="font-[Inter,sans-serif]">
      <PortalLayout sidebar={<SeducSidebar tab={tab} setTab={setTab} onLogout={() => setScreen("login")} />}>
        <BackToPortals />
        <MobileTabHeader />

        {/* ---- PREFEITURAS TAB ---- */}
        {tab === "prefeituras" && (
          <PrefeiturasList
            prefeituras={prefeituras}
            onSelect={setSelPref}
            onNew={() => setShowNewPref(true)}
          />
        )}

        {/* ---- METRICS TABS ---- */}
        {tab !== "prefeituras" && (
          <ContentArea>
            <PageTitle
              title={tab === "overview" ? "Visão Geral" : tab === "schools" ? "Escolas" : "Tendências"}
              subtitle="Dados consolidados de todos os municípios · 03/07/2026"
            />

            {tab === "overview" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard label="Em lista de espera" value="2.088" icon={Users} color="#3b5fe0" />
                  <StatCard label="Vagas disponíveis" value="178" icon={CheckCircle} color="#22c55e" />
                  <StatCard label="Escolas cadastradas" value="64" icon={School} color="#5e6062" />
                  <StatCard label="Municípios ativos" value="2" icon={Building2} color="#7c3aed" />
                </div>
                <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                  <Card className="p-4">
                    <p className="text-[#5e6062] text-sm font-semibold mb-3">Distribuição por modalidade</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={seducPie} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value">
                          {seducPie.map((e) => <Cell key={e.name} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} alunos`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-6">
                      {seducPie.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <p className="text-[#5e6062] text-sm">{item.name} ({item.value})</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-[#5e6062] text-sm font-semibold mb-3">Oferta vs Demanda — 2026</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={seducMonthly} barSize={10}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="espera" fill="#3b5fe0" name="Em espera" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="vagas" fill="#7da5ff" name="Vagas" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </>
            )}

            {tab === "schools" && (
              <>
                <Card className="p-4">
                  <p className="text-[#5e6062] text-sm font-semibold mb-4">Escolas mais procuradas</p>
                  <div className="space-y-3">
                    {topSchools.map((s, i) => (
                      <div key={s.name}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[#263238] text-sm truncate flex-1 pr-2">{s.name}</p>
                          <p className="text-[#3b5fe0] font-bold text-sm shrink-0">{s.demand}</p>
                        </div>
                        <div className="h-2 bg-[#f0f4ff] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(s.demand / 89) * 100}%`, backgroundColor: i === 0 ? "#3b5fe0" : i < 3 ? "#7da5ff" : "#979799" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {schools.map((school) => (
                    <Card key={school.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#263238] text-sm">{school.name}</p>
                          <p className="text-[#979799] text-xs mt-0.5">{school.address}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-lg font-semibold shrink-0 ${school.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}>
                          {school.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#f0f4ff] text-center">
                        {[
                          { v: school.vacancies, l: "vagas", c: "#3b5fe0" },
                          { v: school.waitlist, l: "espera", c: "#263238" },
                          { v: school.total, l: "capacidade", c: "#5e6062" },
                          { v: school.rooms, l: "salas", c: "#979799" },
                        ].map((s) => (
                          <div key={s.l}>
                            <p className="font-bold text-sm" style={{ color: s.c }}>{s.v}</p>
                            <p className="text-[#979799] text-xs">{s.l}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {tab === "trends" && (
              <>
                <Card className="p-4">
                  <p className="text-[#5e6062] text-sm font-semibold mb-3">Evolução da lista de espera — 2026</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={seducMonthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="espera" stroke="#3b5fe0" strokeWidth={2.5} dot={{ fill: "#3b5fe0", r: 4 }} name="Em espera" />
                      <Line type="monotone" dataKey="vagas" stroke="#7da5ff" strokeWidth={2.5} dot={{ fill: "#7da5ff", r: 4 }} name="Vagas" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
                <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                  <Card className="p-4">
                    <p className="text-[#5e6062] text-sm font-semibold mb-3">Períodos de maior procura</p>
                    <div className="space-y-3">
                      {[
                        { period: "Jan — Fev", reason: "Início do ano letivo", level: 95 },
                        { period: "Out — Nov", reason: "Pré-matrícula anual", level: 80 },
                        { period: "Julho", reason: "Férias escolares", level: 60 },
                      ].map((item) => (
                        <div key={item.period} className="p-3 bg-[#f0f4ff] rounded-xl">
                          <div className="flex justify-between mb-1.5">
                            <p className="text-[#263238] text-sm font-semibold">{item.period}</p>
                            <p className="text-[#3b5fe0] font-bold text-sm">{item.level}%</p>
                          </div>
                          <div className="h-1.5 bg-white rounded-full overflow-hidden mb-1.5">
                            <div className="h-full bg-[#3b5fe0] rounded-full" style={{ width: `${item.level}%` }} />
                          </div>
                          <p className="text-[#979799] text-xs">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <div className="space-y-3">
                    <Card className="p-4">
                      <TrendingUp className="w-6 h-6 text-red-400 mb-2" />
                      <p className="text-[#263238] text-3xl font-bold">+27%</p>
                      <p className="text-[#979799] text-sm mt-1">Aumento na demanda em 2026</p>
                    </Card>
                    <Card className="p-4">
                      <School className="w-6 h-6 text-[#3b5fe0] mb-2" />
                      <p className="text-[#263238] text-3xl font-bold">3 salas</p>
                      <p className="text-[#979799] text-sm mt-1">Potencial de expansão mapeado</p>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </ContentArea>
        )}
      </PortalLayout>
    </div>
  );
}
