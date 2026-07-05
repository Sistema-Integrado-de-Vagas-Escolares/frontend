import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Baby,
  MapPin,
  Building2,
  BarChart3,
  ArrowRight,
  LogOut,
  Users,
  CheckCircle,
  School,
  TrendingUp,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  BackToPortals,
  Card,
  PrimaryBtn,
  FormField,
  StatCard,
  ContentArea,
} from "../components/Shared";
import siveLogo from "@/imports/SIVE_teste__6_-removebg-preview-2.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ==================== DADOS DE CARAGUATATUBA ====================

const MUNICIPIO = {
  name: "Prefeitura de Caraguatatuba",
  city: "Caraguatatuba",
  state: "SP",
  primaryColor: "#3b5fe0",
  systemName: "VagaEscolar",
  subtitle: "Sistema de Vagas Escolares",
  waitlistUrl: "responsavel.caraguatatuba.sive.gov.br",
  mapaUrl: "mapa.caraguatatuba.sive.gov.br",
  escolaUrl: "escola.caraguatatuba.sive.gov.br",
};

const schools = [
  {
    id: 1,
    name: "EMEI Jardim das Flores",
    type: "creche" as const,
    waitlist: 47,
    vacancies: 5,
    total: 120,
    rooms: 6,
  },
  {
    id: 2,
    name: "EMEF Paulo Freire",
    type: "fundamental" as const,
    waitlist: 23,
    vacancies: 12,
    total: 200,
    rooms: 10,
  },
  {
    id: 3,
    name: "EMEI Sol Nascente",
    type: "creche" as const,
    waitlist: 89,
    vacancies: 0,
    total: 80,
    rooms: 5,
  },
  {
    id: 4,
    name: "EMEF Santos Dumont",
    type: "fundamental" as const,
    waitlist: 15,
    vacancies: 30,
    total: 150,
    rooms: 8,
  },
  {
    id: 5,
    name: "EMEI Mundo Feliz",
    type: "creche" as const,
    waitlist: 62,
    vacancies: 3,
    total: 100,
    rooms: 6,
  },
  {
    id: 6,
    name: "EMEF Monteiro Lobato",
    type: "fundamental" as const,
    waitlist: 18,
    vacancies: 25,
    total: 180,
    rooms: 9,
  },
  {
    id: 7,
    name: "EMEI Arco-Íris",
    type: "creche" as const,
    waitlist: 33,
    vacancies: 8,
    total: 90,
    rooms: 5,
  },
  {
    id: 8,
    name: "EMEF Tiradentes",
    type: "fundamental" as const,
    waitlist: 25,
    vacancies: 20,
    total: 250,
    rooms: 12,
  },
];

const monthlyData = [
  { month: "Jan", espera: 240, vagas: 130 },
  { month: "Fev", espera: 268, vagas: 118 },
  { month: "Mar", espera: 285, vagas: 110 },
  { month: "Abr", espera: 298, vagas: 107 },
  { month: "Mai", espera: 305, vagas: 104 },
  { month: "Jun", espera: 312, vagas: 103 },
];

const totalWaitlist = schools.reduce(
  (a, s) => a + s.waitlist,
  0,
);
const totalVacancies = schools.reduce(
  (a, s) => a + s.vacancies,
  0,
);

type Screen = "login" | "home" | "dashboard";
type DashTab = "escolas" | "tendencias";

// ==================== LOGIN ====================

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen font-[Inter,sans-serif] lg:flex">
      {/* Desktop: left blue panel */}
      <div className="hidden lg:flex lg:flex-col lg:w-[420px] xl:w-[480px] shrink-0 px-12 py-12 bg-[#3b5fe0]">
        {/* Logo — tamanho máximo com destaque */}
        <div className="mb-6">
          <img src={siveLogo} alt="SIVE" className="h-[238px] w-auto object-contain" />
        </div>

        {/* Linha divisória em azul claro */}
        <div className="w-full h-px bg-[#7da5ff]/50 mb-8" />

        {/* Headline + description + bullets */}
        <div className="flex-1">
          <h1 className="text-white font-black leading-[1.15] mb-4 text-[36px]">Sistema Integrado de Vagas Escolares</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Plataforma white-label para gestão transparente das vagas escolares e listas de espera da rede municipal de ensino.
          </p>
          <div className="space-y-3.5">
            {[
              "Painel da Prefeitura com indicadores estratégicos para vagas",
              "Gestão da lista de espera pelas escolas",
              "Consulta da lista de espera para responsáveis",
              "Mapa público de vagas por região",
            ].map((txt) => (
              <div key={txt} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                  </svg>
                </div>
                <p className="text-white/75 text-sm leading-snug">{txt}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs mt-10">
          sive.gov.br · Todos os acessos são protegidos e auditados · Dados protegidos pela LGPD
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Mobile header */}
        <div className="bg-[#3b5fe0] px-5 pt-12 pb-8 lg:hidden">
          <img src={siveLogo} alt="SIVE" className="h-12 w-auto object-contain mb-3" />
          <h2 className="text-white text-xl font-bold">Sistema Integrado de Vagas Escolares</h2>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm px-8 py-12">
            <div className="mb-8">
              <h2 className="text-[#263238] text-3xl font-black leading-tight">
                Bem-vindo ao SIVE
              </h2>
              <p className="text-[#979799] text-sm mt-2">
                Acesse com suas credenciais institucionais
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                label="E-mail institucional"
                placeholder="nome@municipio.sp.gov.br"
                type="email"
              />
              <FormField
                label="Senha"
                placeholder="••••••••"
                type="password"
              />
              <PrimaryBtn onClick={onLogin}>Acessar o SIVE</PrimaryBtn>
            </div>

            {/* Support note — no self-service recovery */}
            <div className="mt-5 bg-[#f0f4ff] rounded-2xl p-4">
              <p className="text-[#5e6062] text-xs text-center leading-relaxed">
                <strong>Esqueceu sua senha?</strong> O acesso ao SIVE é gerenciado centralmente.
                Entre em contato com o suporte para redefinição:
              </p>
              <a href="mailto:suporte@sive.com.br"
                className="flex items-center justify-center gap-1.5 text-[#3b5fe0] text-sm font-bold mt-2 hover:underline">
                suporte@sive.com.br
              </a>
              <p className="text-[#bfc5d2] text-[10px] text-center mt-2">
                Não é possível recuperar senha por e-mail — acesso restrito.
              </p>
            </div>

            <p className="text-center text-[#bfc5d2] text-xs mt-4 leading-relaxed">
              Todos os acessos são protegidos e auditados.<br />Dados protegidos pela LGPD.
            </p>

            {/* Discrete admin access */}
            <div className="mt-6 text-center">
              <button onClick={() => navigate("/sive-admin")}
                className="text-[#e8edf8] text-[10px] hover:text-[#979799] transition-colors">
                Administrador SIVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PORTAL HOME ====================

function PortalHome({
  onGoToDashboard,
  onLogout,
}: {
  onGoToDashboard: () => void;
  onLogout: () => void;
}) {
  const portals = [
    {
      icon: Baby,
      title: "Lista de Espera",
      tag: "Público",
      tagColor: "bg-emerald-100 text-emerald-700",
      desc: "Consulte a posição dos seus filhos na fila de espera escolar",
      url: MUNICIPIO.waitlistUrl,
      action: () => {},
    },
    {
      icon: MapPin,
      title: "Mapa de Vagas",
      tag: "Público",
      tagColor: "bg-emerald-100 text-emerald-700",
      desc: "Explore escolas por região, vagas disponíveis e lista de espera",
      url: MUNICIPIO.mapaUrl,
      action: () => {},
    },
    {
      icon: Building2,
      title: "Painel da Escola",
      tag: "Restrito",
      tagColor: "bg-[#f0f4ff] text-[#5e6062]",
      desc: "Gerenciamento de matrículas, lista de espera e responsáveis",
      url: MUNICIPIO.escolaUrl,
      action: () => {},
    },
    {
      icon: BarChart3,
      title: "Métricas e Relatórios",
      tag: "Municipal",
      tagColor: "bg-[#3b5fe0]/10 text-[#3b5fe0]",
      desc: "Indicadores exclusivos de Caraguatatuba — escolas, vagas e tendências",
      url: "",
      action: onGoToDashboard,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
      {/* Hero */}
      <div style={{ backgroundColor: MUNICIPIO.primaryColor }}>
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-10 pb-10 lg:pt-14 lg:pb-12">
          <div className="flex items-center justify-between mb-6">
            <SiveLogo scale={1.05} />
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <School className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white/55 text-xs font-semibold uppercase tracking-widest">
                Secretaria de Educação
              </p>
              <p className="text-white font-bold">
                {MUNICIPIO.city} — {MUNICIPIO.state}
              </p>
            </div>
          </div>
          <p className="text-white/65 text-sm leading-relaxed max-w-lg">
            Painel exclusivo do município. Os dados exibidos
            referem-se apenas a {MUNICIPIO.city}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8">
        <p className="text-[#979799] text-xs font-bold uppercase tracking-widest mb-5">
          Selecione o portal de acesso
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {portals.map((p) => (
            <button
              key={p.title}
              onClick={p.action}
              className="bg-white rounded-2xl p-6 flex items-start gap-5 border border-[#e8edf8] text-left hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all group"
            >
              <div className="w-14 h-14 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <p.icon className="w-7 h-7 text-[#3b5fe0]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#263238] text-lg">
                    {p.title}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.tagColor}`}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="text-[#979799] text-sm leading-snug">
                  {p.desc}
                </p>
                {p.url && (
                  <p className="text-[#3b5fe0]/45 text-xs mt-2 font-mono">
                    {p.url}
                  </p>
                )}
              </div>
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#f0f4ff] group-hover:bg-[#3b5fe0] transition-colors">
                  <ArrowRight className="w-4 h-4 text-[#bfc5d2] group-hover:text-white transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Municipal stats */}
        <div className="bg-white rounded-2xl border border-[#e8edf8] p-5 lg:flex lg:items-center lg:gap-10">
          <div className="flex-1">
            <p className="font-semibold text-[#263238] text-sm mb-1">
              Dados do município
            </p>
            <p className="text-[#979799] text-sm leading-relaxed">
              {MUNICIPIO.city} · {schools.length} escolas
              cadastradas no sistema.
            </p>
          </div>
          <div className="flex gap-8 mt-4 lg:mt-0 shrink-0">
            {[
              {
                v: totalWaitlist,
                l: "Em lista de espera",
                c: "#3b5fe0",
              },
              {
                v: totalVacancies,
                l: "Vagas disponíveis",
                c: "#22c55e",
              },
              { v: schools.length, l: "Escolas", c: "#5e6062" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p
                  className="text-2xl font-bold"
                  style={{ color: s.c }}
                >
                  {s.v}
                </p>
                <p className="text-[#979799] text-xs mt-0.5 max-w-[80px] leading-snug">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[#bfc5d2] text-xs mt-6">
          Dados protegidos pela LGPD · Acesso restrito ao
          município de {MUNICIPIO.city}
        </p>
      </div>
    </div>
  );
}

// ==================== DASHBOARD MUNICIPAL ====================

function MunicipioDashboard({
  onBack,
  onLogout,
}: {
  onBack: () => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<DashTab>("escolas");

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
      {/* Header */}
      <div
        style={{ backgroundColor: MUNICIPIO.primaryColor }}
        className="px-5 pt-6 pb-5"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-white/60 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                ← Portais
              </button>
              <span className="text-white/30">|</span>
              <SiveLogo scale={0.75} />
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-white/55 text-sm hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
          <p className="text-white/55 text-xs font-semibold uppercase tracking-widest">
            Métricas e Relatórios
          </p>
          <h2 className="text-white text-xl font-bold">
            {MUNICIPIO.city}, {MUNICIPIO.state}
          </h2>
          <p className="text-white/40 text-xs mt-0.5">
            Dados exclusivos do município · Atualizado em
            03/07/2026
          </p>

          <div className="flex gap-2 mt-4">
            {(
              [
                { key: "escolas", label: "Escolas" },
                { key: "tendencias", label: "Tendências" },
              ] as { key: DashTab; label: string }[]
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === t.key ? "bg-white text-[#3b5fe0]" : "bg-white/15 text-white"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <ContentArea>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Em lista de espera"
              value={totalWaitlist}
              icon={Users}
              color="#3b5fe0"
            />
            <StatCard
              label="Vagas disponíveis"
              value={totalVacancies}
              icon={CheckCircle}
              color="#22c55e"
            />
            <StatCard
              label="Escolas cadastradas"
              value={schools.length}
              icon={School}
              color="#5e6062"
            />
            <StatCard
              label="Taxa de ocupação"
              value="89%"
              icon={Star}
              color="#f59e0b"
            />
          </div>

          {/* ---- ESCOLAS TAB ---- */}
          {tab === "escolas" && (
            <>
              {/* Demand bar chart */}
              <Card className="p-4">
                <p className="text-[#5e6062] text-sm font-semibold mb-3">
                  Lista de espera por escola
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={schools.map((s) => ({
                      name: s.name
                        .split(" ")
                        .slice(-2)
                        .join(" "),
                      espera: s.waitlist,
                      vagas: s.vacancies,
                    }))}
                    barSize={12}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f4ff"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fill: "#979799" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#979799" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="espera"
                      fill="#3b5fe0"
                      name="Em espera"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="vagas"
                      fill="#7da5ff"
                      name="Vagas"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {[
                    ["#3b5fe0", "Em espera"],
                    ["#7da5ff", "Vagas disponíveis"],
                  ].map(([c, l]) => (
                    <div
                      key={l}
                      className="flex items-center gap-1.5"
                    >
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: c }}
                      />
                      <p className="text-[#979799] text-xs">
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* School cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {schools.map((school) => {
                  const status =
                    school.vacancies === 0
                      ? "esgotado"
                      : school.vacancies < 10
                        ? "limitado"
                        : "disponivel";
                  const statusColor =
                    status === "esgotado"
                      ? "text-red-500"
                      : status === "limitado"
                        ? "text-amber-500"
                        : "text-emerald-500";
                  const statusBg =
                    status === "esgotado"
                      ? "bg-red-50"
                      : status === "limitado"
                        ? "bg-amber-50"
                        : "bg-emerald-50";
                  return (
                    <Card key={school.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${school.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}
                            >
                              {school.type === "creche"
                                ? "Creche"
                                : "Fundamental"}
                            </span>
                          </div>
                          <p className="font-semibold text-[#263238] text-sm">
                            {school.name}
                          </p>
                        </div>
                        <div
                          className={`${statusBg} rounded-xl px-3 py-2 text-center shrink-0`}
                        >
                          <p
                            className={`text-xl font-bold leading-none ${statusColor}`}
                          >
                            {school.vacancies}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${statusColor} opacity-80`}
                          >
                            vagas
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#f0f4ff] text-center">
                        {[
                          {
                            v: school.waitlist,
                            l: "espera",
                            c: "#263238",
                          },
                          {
                            v: school.total,
                            l: "capacidade",
                            c: "#5e6062",
                          },
                          {
                            v: school.rooms,
                            l: "salas",
                            c: "#979799",
                          },
                        ].map((s) => (
                          <div key={s.l}>
                            <p
                              className="font-bold text-sm"
                              style={{ color: s.c }}
                            >
                              {s.v}
                            </p>
                            <p className="text-[#979799] text-xs">
                              {s.l}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* ---- TENDÊNCIAS TAB ---- */}
          {tab === "tendencias" && (
            <>
              <Card className="p-4">
                <p className="text-[#5e6062] text-sm font-semibold mb-3">
                  Evolução da lista de espera — {MUNICIPIO.city}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f4ff"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10, fill: "#979799" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#979799" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="espera"
                      stroke="#3b5fe0"
                      strokeWidth={2.5}
                      dot={{ fill: "#3b5fe0", r: 4 }}
                      name="Em espera"
                    />
                    <Line
                      type="monotone"
                      dataKey="vagas"
                      stroke="#7da5ff"
                      strokeWidth={2.5}
                      dot={{ fill: "#7da5ff", r: 4 }}
                      name="Vagas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
                <Card className="p-4">
                  <p className="text-[#5e6062] text-sm font-semibold mb-3">
                    Períodos de maior procura
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        period: "Jan — Fev",
                        reason: "Início do ano letivo",
                        level: 92,
                      },
                      {
                        period: "Out — Nov",
                        reason: "Pré-matrícula anual",
                        level: 78,
                      },
                      {
                        period: "Julho",
                        reason: "Férias escolares",
                        level: 55,
                      },
                    ].map((item) => (
                      <div
                        key={item.period}
                        className="p-3 bg-[#f0f4ff] rounded-xl"
                      >
                        <div className="flex justify-between mb-1.5">
                          <p className="text-[#263238] text-sm font-semibold">
                            {item.period}
                          </p>
                          <p className="text-[#3b5fe0] font-bold text-sm">
                            {item.level}%
                          </p>
                        </div>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden mb-1.5">
                          <div
                            className="h-full bg-[#3b5fe0] rounded-full"
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                        <p className="text-[#979799] text-xs">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-3">
                  <Card className="p-4">
                    <TrendingUp className="w-6 h-6 text-red-400 mb-2" />
                    <p className="text-[#263238] text-3xl font-bold">
                      +30%
                    </p>
                    <p className="text-[#979799] text-sm mt-1 leading-snug">
                      Crescimento da lista de espera em 2026
                    </p>
                  </Card>
                  <Card className="p-4">
                    <School className="w-6 h-6 text-[#3b5fe0] mb-2" />
                    <p className="text-[#263238] text-3xl font-bold">
                      2 salas
                    </p>
                    <p className="text-[#979799] text-sm mt-1 leading-snug">
                      Potencial de expansão identificado em{" "}
                      {MUNICIPIO.city}
                    </p>
                  </Card>
                </div>
              </div>
            </>
          )}
        </ContentArea>
      </div>
    </div>
  );
}

// ==================== EXPORTS ====================

/** Rota /  — login do município */
export default function MunicipioApp() {
  const navigate = useNavigate();
  return <LoginScreen onLogin={() => navigate("/portal")} />;
}

/** Rota /municipio-dashboard — métricas exclusivas do município */
export function MunicipioDashboardPage() {
  const navigate = useNavigate();
  return (
    <MunicipioDashboard
      onBack={() => navigate("/portal")}
      onLogout={() => navigate("/")}
    />
  );
}