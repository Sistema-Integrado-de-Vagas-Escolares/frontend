import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users, School, CheckCircle, BarChart3, LogOut, X,
  TrendingUp, Clock, MapPin, Download, Home, Building2,
  Sliders, Plus, Trash2, GripVertical, AlertCircle, Save, Edit3, Settings, Globe, Copy, Link2, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import {
  PortalLayout, ContentArea, SideNavItem, PageTitle,
  BackToPortals, Card, StatCard, PrimaryBtn, FormField,
} from "../components/Shared";
import { prefData } from "../data";
import { useSchools } from "../context/SchoolsContext";
import brasao from "@/imports/brasao-removebg-preview.png";

type Screen = "login" | "dashboard";
type Tab = "overview" | "escolas" | "gerenciar" | "espera" | "bairros" | "historico" | "criterios" | "configuracoes" | "dominio";

// ==================== CRITERIA STATE ====================

interface Criterio {
  id: number;
  name: string;
  description: string;
  weight: number;
  type: "boolean" | "range" | "distance";
  tiebreaker: boolean;
  active: boolean;
}

const defaultCriterios: Criterio[] = [
  { id: 1, name: "Renda familiar per capita", description: "Pontuação máxima para renda até 1/4 do salário mínimo", weight: 40, type: "range", tiebreaker: false, active: true },
  { id: 2, name: "Vulnerabilidade socioeconômica", description: "Família cadastrada no CadÚnico ou em situação de vulnerabilidade comprovada", weight: 20, type: "boolean", tiebreaker: false, active: true },
  { id: 3, name: "Distância da residência", description: "Quanto mais próximo da escola, maior a pontuação (critério de desempate primário)", weight: 15, type: "distance", tiebreaker: true, active: true },
  { id: 4, name: "Responsável solo", description: "Mãe solteira, pai solteiro ou responsável único sem cônjuge", weight: 10, type: "boolean", tiebreaker: false, active: true },
  { id: 5, name: "Benefício governamental", description: "Bolsa Família, BPC/LOAS ou outro benefício assistencial ativo", weight: 8, type: "boolean", tiebreaker: false, active: true },
  { id: 6, name: "Mora de aluguel", description: "Família não possui imóvel próprio e paga aluguel", weight: 4, type: "boolean", tiebreaker: false, active: true },
  { id: 7, name: "Irmão matriculado na escola", description: "Criança com irmão já matriculado na mesma unidade escolar", weight: 3, type: "boolean", tiebreaker: false, active: true },
];

const PREFEITURA = {
  name: "Prefeitura Municipal de Caraguatatuba",
  secretaria: "Secretaria Municipal de Educação",
  city: "Caraguatatuba",
  state: "SP",
};

// ==================== SIDEBAR ====================

function Sidebar({ tab, setTab, onLogout }: { tab: Tab; setTab: (t: Tab) => void; onLogout: () => void }) {
  const nav = [
    { key: "overview", icon: Home, label: "Visão Geral" },
    { key: "escolas", icon: School, label: "Métricas das Escolas" },
    { key: "gerenciar", icon: Building2, label: "Gerenciar Escolas" },
    { key: "espera", icon: Users, label: "Lista de Espera" },
    { key: "bairros", icon: MapPin, label: "Por Bairro" },
    { key: "historico", icon: TrendingUp, label: "Histórico" },
    { key: "criterios", icon: Sliders, label: "Critérios de Fila" },
    { key: "configuracoes", icon: Settings, label: "Configurações" },
    { key: "dominio", icon: Globe, label: "Configurar Domínio" },
  ];
  return (
    <div className="bg-[#3b5fe0] h-full flex flex-col">
      <div className="px-5 py-5 border-b border-white/15 flex items-center gap-3">
        <img src={brasao} alt="Brasão" className="w-10 h-10 object-contain shrink-0" />
        <div>
          <p className="text-white/55 text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">Painel da Prefeitura</p>
          <p className="text-white font-bold text-sm leading-tight">{PREFEITURA.city}</p>
          <p className="text-white/45 text-xs leading-tight">{PREFEITURA.state} · SME</p>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/15 space-y-2">
        {[
          { v: prefData.totalWaitlist, l: "Em lista de espera", c: "text-white" },
          { v: prefData.totalVacancies, l: "Vagas disponíveis", c: "text-emerald-300" },
        ].map((s) => (
          <div key={s.l} className="bg-white/10 rounded-xl px-3 py-2 flex items-center justify-between">
            <p className="text-white/55 text-xs">{s.l}</p>
            <p className={`font-bold text-sm ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => (
          <SideNavItem key={item.key} icon={item.icon} label={item.label} active={tab === item.key} onClick={() => setTab(item.key as Tab)} />
        ))}
      </nav>

      <div className="px-4 pb-5 pt-4 space-y-3">
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 border border-white/40 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </div>
  );
}

// ==================== TABS ====================

function OverviewTab() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Escolas cadastradas" value={prefData.totalSchools} icon={School} color="#3b5fe0" />
        <StatCard label="Vagas disponíveis" value={prefData.totalVacancies} icon={CheckCircle} color="#22c55e" />
        <StatCard label="Em lista de espera" value={prefData.totalWaitlist} icon={Users} color="#f59e0b" />
        <StatCard label="Tempo médio de espera" value="4 meses" icon={Clock} color="#7c3aed" />
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0">
        <Card className="p-4">
          <p className="text-[#5e6062] text-sm font-semibold mb-3">Distribuição por modalidade</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={prefData.byModality} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="waitlist">
                {prefData.byModality.map((e, i) => <Cell key={`mod-${i}-${e.name}`} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} alunos`, "Em espera"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 flex-wrap mt-1">
            {prefData.byModality.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <p className="text-[#5e6062] text-xs">{item.name} ({item.waitlist})</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-[#5e6062] text-sm font-semibold mb-3">Distribuição por período</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={prefData.byPeriod} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#979799" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="waitlist" name="Em espera" radius={[6, 6, 0, 0]}>
                {prefData.byPeriod.map((e, i) => <Cell key={`per-${i}-${e.name}`} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#5e6062] text-sm font-semibold">Ranking — escolas com maior demanda</p>
        </div>
        <div className="space-y-3">
          {prefData.schoolRanking.map((s, i) => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[#979799] text-xs font-bold w-5 shrink-0">#{i + 1}</span>
                  <p className="text-[#263238] text-sm truncate">{s.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${s.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}>
                    {s.type === "creche" ? "Creche" : "Fund."}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-[#263238] text-sm font-bold">{s.waitlist}</p>
                  <p className={`text-xs font-semibold ${s.vacancies === 0 ? "text-red-500" : "text-emerald-600"}`}>
                    {s.vacancies === 0 ? "Sem vagas" : `${s.vacancies} vagas`}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-[#f0f4ff] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#3b5fe0]" style={{ width: `${(s.waitlist / prefData.schoolRanking[0].waitlist) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function EscolasTab() {
  const { schools } = useSchools();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {schools.map((school) => {
        const status = school.vacancies === 0 ? "esgotado" : school.vacancies < 10 ? "limitado" : "disponivel";
        const statusColor = { esgotado: "text-red-500 bg-red-50", limitado: "text-amber-600 bg-amber-50", disponivel: "text-emerald-600 bg-emerald-50" }[status];
        return (
          <Card key={school.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${school.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}>
                    {school.type === "creche" ? "Creche" : "Fundamental"}
                  </span>
                  <span className="text-[#979799] text-xs">{school.neighborhood}</span>
                </div>
                <p className="font-bold text-[#263238] text-sm">{school.name}</p>
                <p className="text-[#979799] text-xs mt-0.5">{school.address}</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {school.periods.map((p) => (
                    <span key={p} className="text-xs bg-[#f0f4ff] text-[#5e6062] px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
              <div className={`rounded-xl px-3 py-2 text-center shrink-0 ${statusColor}`}>
                <p className="text-xl font-bold leading-none">{school.vacancies}</p>
                <p className="text-xs mt-0.5 opacity-80">vagas</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#f0f4ff] text-center">
              {[
                { v: school.waitlist, l: "em espera", c: "#263238" },
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
        );
      })}
    </div>
  );
}

function EsperaTab() {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {prefData.byModality.map((m) => (
          <Card key={m.name} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
              <p className="text-[#5e6062] text-sm font-semibold">{m.name}</p>
            </div>
            <p className="text-[#263238] text-2xl font-bold">{m.waitlist}</p>
            <p className="text-[#979799] text-xs mt-0.5">em espera</p>
            <div className="mt-2 h-1.5 bg-[#f0f4ff] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ backgroundColor: m.color, width: `${(m.waitlist / prefData.totalWaitlist) * 100}%` }} />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <p className="text-[#5e6062] text-sm font-semibold mb-3">Lista de espera por período</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={prefData.byPeriod} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#979799" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="waitlist" name="Em espera" radius={[6, 6, 0, 0]}>
              {prefData.byPeriod.map((e, i) => <Cell key={`per-${i}-${e.name}`} fill={e.color} />)}
            </Bar>
            <Bar dataKey="vacancies" name="Vagas" fill="#e8edf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {[["#3b5fe0", "Em espera"], ["#e8edf8", "Vagas"]].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
              <p className="text-[#979799] text-xs">{l}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-[#5e6062] text-sm font-semibold mb-3">Ranking de espera por escola</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={prefData.schoolRanking.map((s) => ({ ...s, shortName: s.name.split(" ").slice(-2).join(" ") }))} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="shortName" tick={{ fontSize: 10, fill: "#5e6062" }} axisLine={false} tickLine={false} width={100} />
            <Tooltip />
            <Bar dataKey="waitlist" name="Em espera" fill="#3b5fe0" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

function BairrosTab() {
  return (
    <>
      <Card className="p-4">
        <p className="text-[#5e6062] text-sm font-semibold mb-4">Indicadores por bairro — Caraguatatuba</p>
        <div className="space-y-4">
          {prefData.byNeighborhood.map((b) => {
            const total = b.waitlist + b.vacancies;
            const pct = Math.round((b.waitlist / total) * 100);
            return (
              <div key={b.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[#263238] text-sm font-semibold">{b.name}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#263238] font-bold">{b.waitlist} <span className="text-[#979799] font-normal text-xs">espera</span></span>
                    <span className="text-emerald-600 font-bold">{b.vacancies} <span className="text-[#979799] font-normal text-xs">vagas</span></span>
                  </div>
                </div>
                <div className="h-2.5 bg-[#f0f4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b5fe0] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[#979799] text-xs mt-1">{pct}% da demanda sem vaga disponível</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-[#5e6062] text-sm font-semibold mb-3">Demanda por bairro</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={prefData.byNeighborhood} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#979799" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="waitlist" name="Em espera" fill="#3b5fe0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vacancies" name="Vagas" fill="#7da5ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <p className="text-[#5e6062] text-sm font-semibold mb-3">Pressão de demanda</p>
          <div className="space-y-3 mt-4">
            {[...prefData.byNeighborhood].sort((a, b) => (b.waitlist / (b.waitlist + b.vacancies)) - (a.waitlist / (a.waitlist + a.vacancies))).map((b, i) => (
              <div key={b.name} className={`p-3 rounded-xl flex items-center gap-3 ${i === 0 ? "bg-red-50 border border-red-100" : i === 1 ? "bg-amber-50 border border-amber-100" : "bg-[#f0f4ff]"}`}>
                <span className={`text-xs font-bold ${i === 0 ? "text-red-500" : i === 1 ? "text-amber-500" : "text-[#979799]"}`}>#{i + 1}</span>
                <p className="text-[#263238] text-sm font-medium flex-1">{b.name}</p>
                <span className={`text-xs font-bold ${i === 0 ? "text-red-500" : i === 1 ? "text-amber-500" : "text-[#5e6062]"}`}>
                  {Math.round((b.waitlist / (b.waitlist + b.vacancies)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function HistoricoTab() {
  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#5e6062] text-sm font-semibold">Histórico de ocupação — 2026</p>
          <button className="flex items-center gap-1.5 text-[#3b5fe0] text-xs font-semibold hover:text-[#2f4fc4] transition-colors border border-[#3b5fe0]/30 rounded-xl px-3 py-1.5">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={prefData.monthlyHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#979799" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12, color: "#5e6062" }} />
            <Line type="monotone" dataKey="espera" stroke="#3b5fe0" strokeWidth={2.5} dot={{ fill: "#3b5fe0", r: 4 }} name="Em espera" />
            <Line type="monotone" dataKey="vagas" stroke="#7da5ff" strokeWidth={2.5} dot={{ fill: "#7da5ff", r: 4 }} name="Vagas disponíveis" />
            <Line type="monotone" dataKey="matriculas" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 2" dot={{ fill: "#22c55e", r: 3 }} name="Matrículas realizadas" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="lg:grid lg:grid-cols-3 lg:gap-4 space-y-3 lg:space-y-0">
        {[
          { label: "Matrículas em Jan–Jun", value: "140", icon: CheckCircle, color: "#22c55e", desc: "Total de matrículas realizadas no semestre" },
          { label: "Crescimento da fila", value: "+30%", icon: TrendingUp, color: "#f59e0b", desc: "Aumento da lista de espera em 2026" },
          { label: "Taxa de conversão", value: "45%", icon: Users, color: "#3b5fe0", desc: "Chamados que resultaram em matrícula" },
        ].map((k) => (
          <Card key={k.label} className="p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${k.color}18` }}>
              <k.icon className="w-5 h-5" style={{ color: k.color }} />
            </div>
            <p className="text-[#263238] text-2xl font-bold">{k.value}</p>
            <p className="text-[#5e6062] text-sm font-medium mt-0.5">{k.label}</p>
            <p className="text-[#979799] text-xs mt-1 leading-snug">{k.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <p className="text-[#5e6062] text-sm font-semibold mb-3">Matrículas realizadas por mês</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={prefData.monthlyHistory} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#979799" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="matriculas" name="Matrículas" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

// ==================== MAIN ====================

// ==================== CRITÉRIOS TAB ====================

function CriteriosTab({ criterios, setCriterios }: { criterios: Criterio[]; setCriterios: (c: Criterio[]) => void }) {
  // view: "list" = lista principal | "form" = formulário de criar/editar
  const [view, setView] = useState<"list" | "form">("list");
  const [formData, setFormData] = useState<Omit<Criterio, "id"> & { id?: number }>({
    name: "", description: "", weight: 5, type: "boolean", tiebreaker: false, active: true,
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const totalWeight = criterios.filter((c) => c.active).reduce((a, c) => a + c.weight, 0);
  const isValid = totalWeight === 100;
  const isEditing = formData.id !== undefined;

  const typeLabel: Record<Criterio["type"], string> = {
    boolean: "Sim / Não",
    range: "Faixa de valores",
    distance: "Distância (km)",
  };

  const openNew = () => {
    setFormData({ name: "", description: "", weight: Math.max(1, 100 - totalWeight), type: "boolean", tiebreaker: false, active: true });
    setView("form");
  };

  const openEdit = (c: Criterio) => {
    setFormData({ ...c });
    setView("form");
  };

  const saveForm = () => {
    if (!formData.name.trim() || formData.weight < 1) return;
    if (isEditing) {
      setCriterios(criterios.map((c) => c.id === formData.id ? { ...formData, id: formData.id! } : c));
    } else {
      const newId = criterios.length > 0 ? Math.max(...criterios.map((c) => c.id)) + 1 : 1;
      setCriterios([...criterios, { ...formData, id: newId }]);
    }
    setView("list");
  };

  const toggleActive = (id: number) =>
    setCriterios(criterios.map((c) => c.id === id ? { ...c, active: !c.active } : c));

  const confirmAndDelete = (id: number) => {
    setCriterios(criterios.filter((c) => c.id !== id));
    setConfirmDelete(null);
  };

  const updateForm = <K extends keyof typeof formData>(k: K, v: typeof formData[K]) =>
    setFormData((f) => ({ ...f, [k]: v }));

  // ---- FORM VIEW ----
  if (view === "form") {
    return (
      <>
        {/* Back button */}
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-[#979799] text-xs mb-4 hover:text-[#5e6062] transition-colors">
          ← Voltar para lista de critérios
        </button>

        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
              <Sliders className="w-5 h-5 text-[#3b5fe0]" />
            </div>
            <div>
              <h3 className="text-[#263238] font-bold">
                {isEditing ? "Editar critério" : "Novo critério de classificação"}
              </h3>
              <p className="text-[#979799] text-xs">
                {isEditing ? `Editando: ${formData.name}` : "Defina como esse critério pontuará a lista de espera"}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Nome do critério *</label>
            <input value={formData.name} onChange={(e) => updateForm("name", e.target.value)}
              placeholder="ex: Renda familiar per capita"
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] placeholder-[#bfc5d2] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm" />
          </div>

          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Descrição / como é avaliado</label>
            <textarea value={formData.description} onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Explique como esse critério será avaliado e quais documentos comprovam..."
              rows={3}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] placeholder-[#bfc5d2] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Peso na pontuação (%)</label>
              <input type="number" min={1} max={100} value={formData.weight} onChange={(e) => updateForm("weight", Number(e.target.value))}
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm" />
              <p className="text-[#979799] text-xs mt-1">Soma atual: {totalWeight + (isEditing ? formData.weight - (criterios.find((c) => c.id === formData.id)?.weight ?? 0) : formData.weight)}%</p>
            </div>
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Tipo de resposta</label>
              <select value={formData.type} onChange={(e) => updateForm("type", e.target.value as Criterio["type"])}
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm">
                <option value="boolean">Sim / Não</option>
                <option value="range">Faixa de valores</option>
                <option value="distance">Distância (km)</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-[#f0f4ff]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#263238] text-sm font-medium">Critério de desempate</p>
                <p className="text-[#979799] text-xs">Aplicado quando duas crianças têm a mesma pontuação total</p>
              </div>
              <button onClick={() => updateForm("tiebreaker", !formData.tiebreaker)}
                className={`w-12 h-6 rounded-full transition-colors shrink-0 ${formData.tiebreaker ? "bg-[#3b5fe0]" : "bg-[#e8edf8]"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${formData.tiebreaker ? "translate-x-6" : ""}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#263238] text-sm font-medium">Critério ativo</p>
                <p className="text-[#979799] text-xs">Critérios inativos não afetam a pontuação</p>
              </div>
              <button onClick={() => updateForm("active", !formData.active)}
                className={`w-12 h-6 rounded-full transition-colors shrink-0 ${formData.active ? "bg-emerald-500" : "bg-[#e8edf8]"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${formData.active ? "translate-x-6" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={saveForm} disabled={!formData.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all">
              <Save className="w-4 h-4" />
              {isEditing ? "Salvar alterações" : "Adicionar critério"}
            </button>
            <button onClick={() => setView("list")}
              className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3.5 rounded-xl hover:bg-[#e4ecff] transition-colors">
              Cancelar
            </button>
          </div>
        </Card>
      </>
    );
  }

  // ---- LIST VIEW ----
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${isValid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {isValid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {totalWeight}% atribuído {!isValid && `— faltam ${100 - totalWeight}%`}
        </div>
        <div className="flex gap-2">
          <button onClick={openNew}
            className="flex items-center gap-1.5 bg-[#3b5fe0] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#2f4fc4] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Novo critério
          </button>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
            className="flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-600 transition-colors">
            <Save className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <p className="text-emerald-700 text-sm font-medium">Critérios publicados! As listas serão recalculadas.</p>
        </div>
      )}

      <Card className="p-4 bg-[#f0f4ff] border-[#3b5fe0]/15">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
          <p className="text-[#979799] text-xs leading-relaxed">
            A soma dos pesos dos critérios ativos deve ser exatamente <strong>100%</strong>. O <strong>critério de desempate</strong> é aplicado quando duas crianças têm a mesma pontuação total.
          </p>
        </div>
      </Card>

      {/* Criteria cards */}
      <div className="space-y-3">
        {criterios.map((c, i) => (
          <Card key={c.id} className={`p-4 transition-all ${!c.active ? "opacity-55 bg-[#f8f8f8]" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0 pt-1">
                <GripVertical className="w-4 h-4 text-[#bfc5d2] mb-1" />
                <span className="text-[#bfc5d2] text-xs font-bold">#{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-[#263238] font-semibold text-sm">{c.name}</p>
                      {c.tiebreaker && (
                        <span className="text-xs bg-[#3b5fe0]/10 text-[#3b5fe0] px-2 py-0.5 rounded-full font-semibold">Desempate</span>
                      )}
                      <span className="text-xs bg-[#f0f4ff] text-[#5e6062] px-2 py-0.5 rounded-full">{typeLabel[c.type]}</span>
                      {!c.active && <span className="text-xs bg-[#e8edf8] text-[#979799] px-2 py-0.5 rounded-full">Inativo</span>}
                    </div>
                    <p className="text-[#979799] text-xs leading-relaxed">{c.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#3b5fe0] text-2xl font-bold leading-none">{c.weight}%</p>
                    <p className="text-[#979799] text-xs">peso</p>
                  </div>
                </div>

                <div className="h-2 bg-[#f0f4ff] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#3b5fe0] rounded-full transition-all" style={{ width: `${c.weight}%` }} />
                </div>

                {/* Action bar */}
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)}
                    className="flex items-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#e4ecff] hover:text-[#3b5fe0] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button onClick={() => toggleActive(c.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                      c.active
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-[#f0f4ff] text-[#979799] hover:bg-[#e4ecff]"
                    }`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {c.active ? "Ativo" : "Inativo"}
                  </button>
                  <button onClick={() => setConfirmDelete(c.id)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:items-center lg:justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-sm lg:mx-4 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-[#263238] font-bold">Remover critério?</p>
                <p className="text-[#979799] text-sm">{criterios.find((c) => c.id === confirmDelete)?.name}</p>
              </div>
            </div>
            <p className="text-[#5e6062] text-sm leading-relaxed">
              Essa ação é irreversível. Os alunos já cadastrados terão suas pontuações recalculadas após publicar os critérios.
            </p>
            <div className="flex gap-3">
              <button onClick={() => confirmAndDelete(confirmDelete)}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-colors">
                Sim, remover
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff] transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Weight chart */}
      <Card className="p-4">
        <p className="text-[#5e6062] text-sm font-semibold mb-3">Distribuição dos pesos ativos</p>
        <ResponsiveContainer width="100%" height={Math.max(140, criterios.filter((c) => c.active).length * 32)}>
          <BarChart data={criterios.filter((c) => c.active)} barSize={20} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" horizontal={false} />
            <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10, fill: "#979799" }} axisLine={false} tickLine={false} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#5e6062" }} axisLine={false} tickLine={false} width={140} />
            <Tooltip formatter={(v) => [`${v}%`, "Peso"]} />
            <Bar dataKey="weight" fill="#3b5fe0" radius={[0, 4, 4, 0]} name="Peso (%)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}

// ==================== CONFIGURAÇÕES TAB ====================

function ConfiguracoesTab() {
  const { deadlineConfig, updateDeadlineConfig, schoolDeadlines, updateSchoolDeadline, schools } = useSchools();
  const [form, setForm] = useState({ ...deadlineConfig });
  const [schoolForms, setSchoolForms] = useState<Record<number, { schoolContactDays: string; enrollmentDays: string }>>(
    () => Object.fromEntries(schools.map((s) => [s.id, {
      schoolContactDays: String(schoolDeadlines[s.id]?.schoolContactDays ?? ""),
      enrollmentDays: String(schoolDeadlines[s.id]?.enrollmentDays ?? ""),
    }]))
  );
  const [saved, setSaved] = useState(false);

  const totalDays = form.schoolContactDays + form.enrollmentDays;

  const handleSaveGlobal = () => {
    updateDeadlineConfig(form);
    // Apply per-school overrides
    schools.forEach((s) => {
      const sf = schoolForms[s.id];
      const override: Record<string, number> = {};
      if (sf?.schoolContactDays) override.schoolContactDays = Number(sf.schoolContactDays);
      if (sf?.enrollmentDays) override.enrollmentDays = Number(sf.enrollmentDays);
      if (Object.keys(override).length > 0) updateSchoolDeadline(s.id, override);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <p className="text-emerald-700 text-sm font-medium">Configurações salvas! Todas as escolas foram atualizadas.</p>
        </div>
      )}

      {/* Global deadline */}
      <Card className="p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#3b5fe0]" />
          </div>
          <div>
            <p className="text-[#263238] font-bold">Prazos padrão — Prefeitura de Caraguatatuba</p>
            <p className="text-[#979799] text-xs">Aplicados a todas as escolas que não tenham prazo próprio configurado</p>
          </div>
        </div>

        <div className="bg-[#f0f4ff] rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#5e6062] font-medium">Prazo total por chamada</span>
            <span className="text-[#3b5fe0] font-bold">{totalDays} dias</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <div className="h-full flex rounded-full overflow-hidden">
              <div className="bg-[#3b5fe0] transition-all" style={{ width: `${(form.schoolContactDays / totalDays) * 100}%` }} />
              <div className="bg-[#7da5ff] transition-all flex-1" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#979799]">
            <span>Escola contata: {form.schoolContactDays}d</span>
            <span>Responsável matricula: {form.enrollmentDays}d</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
              Dias para a escola contatar o responsável
            </label>
            <input
              type="number" min={1} max={30} value={form.schoolContactDays}
              onChange={(e) => setForm({ ...form, schoolContactDays: Number(e.target.value) })}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25"
            />
            <p className="text-[#979799] text-xs mt-1">A partir da disponibilização da vaga</p>
          </div>
          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
              Dias para o responsável realizar a matrícula
            </label>
            <input
              type="number" min={1} max={30} value={form.enrollmentDays}
              onChange={(e) => setForm({ ...form, enrollmentDays: Number(e.target.value) })}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25"
            />
            <p className="text-[#979799] text-xs mt-1">Após o contato da escola</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs leading-relaxed">
            Quando o prazo total expira sem confirmação, a vaga é repassada automaticamente para o próximo da fila e o responsável é registrado como "não compareceu no prazo".
          </p>
        </div>
      </Card>

      {/* Per-school overrides */}
      <div>
        <p className="text-[#979799] text-xs font-bold uppercase tracking-wider mb-3">Prazos por escola (opcional)</p>
        <p className="text-[#979799] text-xs mb-4">Deixe em branco para herdar o prazo padrão da prefeitura.</p>
        <div className="space-y-3">
          {schools.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-[#263238] font-semibold text-sm">{s.name}</p>
                  <p className="text-[#979799] text-xs">{s.neighborhood} · {s.type}</p>
                </div>
                <div className="text-right shrink-0">
                  {(schoolDeadlines[s.id]?.schoolContactDays || schoolDeadlines[s.id]?.enrollmentDays) ? (
                    <span className="text-xs bg-[#3b5fe0]/10 text-[#3b5fe0] px-2 py-0.5 rounded-full font-semibold">Prazo próprio</span>
                  ) : (
                    <span className="text-xs bg-[#f0f4ff] text-[#979799] px-2 py-0.5 rounded-full">Padrão ({deadlineConfig.schoolContactDays}+{deadlineConfig.enrollmentDays}d)</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#979799] text-xs block mb-1">Dias para contato</label>
                  <input
                    type="number" min={1} max={30}
                    value={schoolForms[s.id]?.schoolContactDays ?? ""}
                    placeholder={String(deadlineConfig.schoolContactDays)}
                    onChange={(e) => setSchoolForms((prev) => ({ ...prev, [s.id]: { ...prev[s.id], schoolContactDays: e.target.value } }))}
                    className="w-full bg-[#f0f4ff] rounded-xl px-3 py-2 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 placeholder-[#bfc5d2]"
                  />
                </div>
                <div>
                  <label className="text-[#979799] text-xs block mb-1">Dias para matrícula</label>
                  <input
                    type="number" min={1} max={30}
                    value={schoolForms[s.id]?.enrollmentDays ?? ""}
                    placeholder={String(deadlineConfig.enrollmentDays)}
                    onChange={(e) => setSchoolForms((prev) => ({ ...prev, [s.id]: { ...prev[s.id], enrollmentDays: e.target.value } }))}
                    className="w-full bg-[#f0f4ff] rounded-xl px-3 py-2 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 placeholder-[#bfc5d2]"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSaveGlobal}
          className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2f4fc4] transition-colors">
          <Save className="w-4 h-4" /> Salvar configurações de prazos
        </button>
      </div>
    </>
  );
}

// ==================== GERENCIAR ESCOLAS TAB ====================

const PERIODS = ["Integral", "Manhã", "Tarde"] as const;
type Period = typeof PERIODS[number];

interface SchoolForm {
  id?: number;
  name: string;
  type: "creche" | "fundamental";
  address: string;
  neighborhood: string;
  rooms: number;
  total: number;
  periods: Period[];
  mapX: number;
  mapY: number;
}

const emptyForm: SchoolForm = {
  name: "", type: "creche", address: "", neighborhood: "", rooms: 5, total: 100, periods: ["Integral"], mapX: 50, mapY: 50,
};

// CSV import helpers
const CSV_FIELDS = [
  { key: "name", label: "Nome da escola", required: true },
  { key: "type", label: "Tipo (creche / fundamental)", required: true },
  { key: "address", label: "Endereço", required: false },
  { key: "neighborhood", label: "Bairro / Região", required: false },
  { key: "rooms", label: "Número de salas", required: false },
  { key: "total", label: "Capacidade total de alunos", required: false },
  { key: "periods", label: "Períodos (ex: Integral,Manhã)", required: false },
] as const;

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const split = (line: string) =>
    line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  return { headers: split(lines[0]), rows: lines.slice(1).map(split) };
}

function GerenciarEscolasTab() {
  const { schools, addSchool, updateSchool, removeSchool } = useSchools();
  const [view, setView] = useState<"list" | "form">("list");
  const [form, setForm] = useState<SchoolForm>({ ...emptyForm });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // CSV import state
  const [showImport, setShowImport] = useState(false);
  const [importStep, setImportStep] = useState<"upload" | "map" | "preview">("upload");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [colMap, setColMap] = useState<Record<string, string>>({});
  const [importDone, setImportDone] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { headers, rows } = parseCSV(text);
      setCsvHeaders(headers);
      setCsvRows(rows);
      // Auto-map by name similarity
      const auto: Record<string, string> = {};
      CSV_FIELDS.forEach(({ key }) => {
        const match = headers.find((h) =>
          h.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(h.toLowerCase())
        );
        if (match) auto[key] = match;
      });
      setColMap(auto);
      setImportStep("map");
    };
    reader.readAsText(file, "utf-8");
  };

  const getCellValue = (row: string[], header: string) => {
    const idx = csvHeaders.indexOf(header);
    return idx >= 0 ? row[idx] ?? "" : "";
  };

  const mappedRows = csvRows.map((row) => ({
    name: getCellValue(row, colMap.name ?? ""),
    type: (getCellValue(row, colMap.type ?? "").toLowerCase().includes("fund") ? "fundamental" : "creche") as "creche" | "fundamental",
    address: getCellValue(row, colMap.address ?? "") || "A definir",
    neighborhood: getCellValue(row, colMap.neighborhood ?? "") || "A definir",
    rooms: parseInt(getCellValue(row, colMap.rooms ?? "")) || 5,
    total: parseInt(getCellValue(row, colMap.total ?? "")) || 100,
    periods: (getCellValue(row, colMap.periods ?? "") || "Integral").split(/[;|]/).map((p) => p.trim()).filter(Boolean) as Period[],
    waitlist: 0, vacancies: 0, mapX: 50, mapY: 50,
  }));

  const handleImport = () => {
    mappedRows.filter((r) => r.name).forEach((r) => addSchool(r));
    setImportDone(true);
    setTimeout(() => {
      setShowImport(false);
      setImportStep("upload");
      setCsvHeaders([]); setCsvRows([]); setColMap({}); setImportDone(false);
      setSuccessMsg(`${mappedRows.filter((r) => r.name).length} escola(s) importadas com sucesso!`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1200);
  };

  const resetImport = () => { setShowImport(false); setImportStep("upload"); setCsvHeaders([]); setCsvRows([]); setColMap({}); setImportDone(false); };

  const isEditing = !!form.id;

  const openNew = () => { setForm({ ...emptyForm }); setView("form"); };
  const openEdit = (s: School) => {
    setForm({
      id: s.id, name: s.name, type: s.type, address: s.address,
      neighborhood: s.neighborhood, rooms: s.rooms, total: s.total,
      periods: (s.periods ?? ["Integral"]) as Period[],
      mapX: s.mapX, mapY: s.mapY,
    });
    setView("form");
  };

  const togglePeriod = (p: Period) =>
    setForm((f) => ({
      ...f,
      periods: f.periods.includes(p) ? f.periods.filter((x) => x !== p) : [...f.periods, p],
    }));

  const saveForm = () => {
    if (!form.name.trim() || !form.address.trim() || !form.neighborhood.trim()) return;
    if (isEditing) {
      updateSchool(form.id!, { name: form.name, type: form.type, address: form.address, neighborhood: form.neighborhood, rooms: form.rooms, total: form.total, periods: form.periods, mapX: form.mapX, mapY: form.mapY });
      setSuccessMsg("Escola atualizada com sucesso!");
    } else {
      addSchool({ name: form.name, type: form.type, address: form.address, neighborhood: form.neighborhood, rooms: form.rooms, total: form.total, periods: form.periods, waitlist: 0, vacancies: 0, mapX: form.mapX, mapY: form.mapY });
      setSuccessMsg("Escola cadastrada com sucesso!");
    }
    setView("list");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ---- FORM VIEW ----
  if (view === "form") {
    return (
      <>
        <button onClick={() => setView("list")} className="flex items-center gap-1.5 text-[#979799] text-xs mb-4 hover:text-[#5e6062] transition-colors">
          ← Voltar para lista de escolas
        </button>

        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#3b5fe0]" />
            </div>
            <div>
              <h3 className="text-[#263238] font-bold">{isEditing ? `Editando: ${form.name}` : "Nova Escola"}</h3>
              <p className="text-[#979799] text-xs">{isEditing ? "Atualize os dados da unidade escolar" : "Cadastrar nova unidade na rede municipal"}</p>
            </div>
          </div>

          {/* Dados básicos */}
          <div className="space-y-4">
            <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Dados da Escola</p>

            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Nome da escola *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ex: EMEI Jardim das Flores"
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 placeholder-[#bfc5d2]" />
            </div>

            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Tipo de escola *</label>
              <div className="flex gap-2">
                {(["creche", "fundamental"] as const).map((t) => (
                  <button key={t} onClick={() => setForm({ ...form, type: t })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.type === t ? "bg-[#3b5fe0] text-white" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}>
                    {t === "creche" ? "Creche / Pré-escola" : "Ensino Fundamental"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Endereço completo *</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Rua, número — ex: Rua das Rosas, 123"
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 placeholder-[#bfc5d2]" />
            </div>

            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Bairro / Região *</label>
              <input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                placeholder="ex: Centro, Indaiá, Porto Novo..."
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 placeholder-[#bfc5d2]" />
            </div>
          </div>

          {/* Capacidade */}
          <div className="space-y-4 pt-4 border-t border-[#f0f4ff]">
            <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Estrutura e Capacidade</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Número de salas de aula</label>
                <input type="number" min={1} max={100} value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: Number(e.target.value) })}
                  className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25" />
              </div>
              <div>
                <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Capacidade total de alunos</label>
                <input type="number" min={1} max={2000} value={form.total}
                  onChange={(e) => setForm({ ...form, total: Number(e.target.value) })}
                  className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25" />
              </div>
            </div>
            <p className="text-[#979799] text-xs -mt-2">
              Alunos por sala estimado: <strong>{form.rooms > 0 ? Math.round(form.total / form.rooms) : 0}</strong>
            </p>

            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-2">Períodos de funcionamento *</label>
              <div className="flex gap-2">
                {PERIODS.map((p) => (
                  <button key={p} onClick={() => togglePeriod(p)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${form.periods.includes(p) ? "bg-[#263238] text-white" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}>
                    {p}
                  </button>
                ))}
              </div>
              {form.periods.length === 0 && <p className="text-red-500 text-xs mt-1">Selecione ao menos um período.</p>}
            </div>
          </div>

          <div className="bg-[#f0f4ff] rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
            <p className="text-[#5e6062] text-xs leading-relaxed">
              O número de <strong>vagas disponíveis</strong> e os dados da <strong>lista de espera</strong> são gerenciados pelo Painel da Escola e não podem ser editados aqui.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={saveForm}
              disabled={!form.name.trim() || !form.address.trim() || !form.neighborhood.trim() || form.periods.length === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all">
              <Save className="w-4 h-4" />
              {isEditing ? "Salvar alterações" : "Cadastrar escola"}
            </button>
            <button onClick={() => setView("list")}
              className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3.5 rounded-xl hover:bg-[#e4ecff] transition-colors">
              Cancelar
            </button>
          </div>
        </Card>
      </>
    );
  }

  // ---- LIST VIEW ----
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[#979799] text-xs">{schools.length} escola(s) cadastrada(s)</span>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 bg-[#f0f4ff] text-[#3b5fe0] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#e4ecff] border border-[#3b5fe0]/20 transition-colors">
            <Download className="w-4 h-4" /> Importar CSV
          </button>
          <button onClick={openNew}
            className="flex items-center gap-1.5 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2f4fc4] transition-colors">
            <Plus className="w-4 h-4" /> Nova escola
          </button>
        </div>
      </div>

      {/* ---- MODAL IMPORTAR CSV ---- */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f0f4ff]">
              <div>
                <p className="text-[#263238] font-bold text-lg">Importar escolas via CSV</p>
                <p className="text-[#979799] text-xs mt-0.5">
                  {importStep === "upload" ? "Selecione o arquivo CSV" : importStep === "map" ? "Configure o mapeamento das colunas" : "Confirme os dados a importar"}
                </p>
              </div>
              <button onClick={resetImport} className="text-[#979799] hover:text-[#5e6062] p-1"><X className="w-5 h-5" /></button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-2">
              {[{ n: 1, l: "Upload" }, { n: 2, l: "Mapeamento" }, { n: 3, l: "Prévia" }].map(({ n, l }, i) => {
                const stepIdx = importStep === "upload" ? 0 : importStep === "map" ? 1 : 2;
                const active = i === stepIdx;
                const done = i < stepIdx || importDone;
                return (
                  <div key={l} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-emerald-500 text-white" : active ? "bg-[#3b5fe0] text-white" : "bg-[#f0f4ff] text-[#979799]"}`}>
                      {done ? "✓" : n}
                    </div>
                    <span className={`text-xs font-semibold ${active ? "text-[#3b5fe0]" : "text-[#979799]"}`}>{l}</span>
                    {i < 2 && <div className="w-8 h-px bg-[#e8edf8]" />}
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6 pt-4 space-y-5">
              {/* STEP 1: Upload */}
              {importStep === "upload" && (
                <>
                  <label className="block">
                    <div className="border-2 border-dashed border-[#3b5fe0]/30 rounded-2xl p-10 text-center cursor-pointer hover:border-[#3b5fe0]/60 hover:bg-[#f0f4ff]/50 transition-all">
                      <Download className="w-10 h-10 text-[#3b5fe0]/40 mx-auto mb-3" />
                      <p className="text-[#263238] font-semibold mb-1">Clique para selecionar o arquivo CSV</p>
                      <p className="text-[#979799] text-xs">ou arraste e solte aqui · Arquivo .csv, UTF-8</p>
                    </div>
                    <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <Card className="p-4 bg-[#f0f4ff]">
                    <p className="text-[#5e6062] text-xs font-semibold mb-2">Formato esperado do CSV</p>
                    <code className="text-[10px] text-[#3b5fe0] font-mono block leading-relaxed">
                      nome,tipo,endereco,bairro,salas,capacidade,periodos<br />
                      EMEI Exemplo,creche,Rua A 123,Centro,5,100,"Integral,Manhã"<br />
                      EMEF Exemplo,fundamental,Av. B 456,Indaiá,10,300,Manhã
                    </code>
                  </Card>
                </>
              )}

              {/* STEP 2: Column mapping */}
              {importStep === "map" && (
                <>
                  <div className="bg-[#f0f4ff] rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-[#5e6062] text-xs">{csvRows.length} linha(s) encontrada(s) · {csvHeaders.length} coluna(s) detectada(s)</p>
                  </div>

                  <div className="space-y-3">
                    {CSV_FIELDS.map(({ key, label, required }) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-52 shrink-0">
                          <p className="text-[#263238] text-sm font-medium">{label}</p>
                          {required && <span className="text-[10px] text-red-400 font-semibold">Obrigatório</span>}
                        </div>
                        <select
                          value={colMap[key] ?? ""}
                          onChange={(e) => setColMap((m) => ({ ...m, [key]: e.target.value }))}
                          className={`flex-1 bg-[#f0f4ff] rounded-xl px-3 py-2.5 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 ${colMap[key] ? "border border-emerald-300" : required ? "border border-amber-300" : "border border-transparent"}`}
                        >
                          <option value="">— Não mapear —</option>
                          {csvHeaders.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                        {colMap[key] && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setImportStep("upload")} className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff]">Voltar</button>
                    <button
                      onClick={() => setImportStep("preview")}
                      disabled={!colMap.name || !colMap.type}
                      className="flex-1 bg-[#3b5fe0] text-white font-semibold py-3 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all"
                    >
                      Ver prévia →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: Preview */}
              {importStep === "preview" && (
                <>
                  <div className="bg-[#f0f4ff] rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#3b5fe0] shrink-0" />
                    <p className="text-[#5e6062] text-xs">{mappedRows.filter((r) => r.name).length} escola(s) serão importadas. Verifique os dados abaixo.</p>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {mappedRows.filter((r) => r.name).slice(0, 10).map((r, i) => (
                      <div key={i} className="bg-[#f0f4ff] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}>
                            {r.type === "creche" ? "Creche" : "Fundamental"}
                          </span>
                          <p className="text-[#263238] text-sm font-semibold">{r.name}</p>
                        </div>
                        <p className="text-[#979799] text-xs">{r.address} · {r.neighborhood} · {r.rooms} salas · {r.total} alunos</p>
                        <div className="flex gap-1 mt-1">
                          {r.periods.map((p) => <span key={p} className="text-[10px] bg-white text-[#5e6062] px-1.5 py-0.5 rounded-full">{p}</span>)}
                        </div>
                      </div>
                    ))}
                    {mappedRows.filter((r) => r.name).length > 10 && (
                      <p className="text-[#979799] text-xs text-center py-1">+ {mappedRows.filter((r) => r.name).length - 10} escola(s) adicionais</p>
                    )}
                  </div>

                  {importDone ? (
                    <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <p className="text-emerald-700 font-semibold">Importação concluída!</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setImportStep("map")} className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff]">Ajustar mapeamento</button>
                      <button onClick={handleImport}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3 rounded-xl hover:bg-[#2f4fc4] transition-all">
                        <Download className="w-4 h-4" /> Importar {mappedRows.filter((r) => r.name).length} escola(s)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <p className="text-emerald-700 text-sm font-medium">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {schools.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.type === "creche" ? "bg-[#7da5ff]/25 text-[#3b5fe0]" : "bg-[#263238]/10 text-[#263238]"}`}>
                    {s.type === "creche" ? "Creche" : "Fundamental"}
                  </span>
                  <span className="text-[#979799] text-xs">{s.neighborhood}</span>
                </div>
                <p className="font-bold text-[#263238]">{s.name}</p>
                <p className="text-[#979799] text-xs mt-0.5">{s.address}</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {(s.periods ?? []).map((p) => (
                    <span key={p} className="text-xs bg-[#f0f4ff] text-[#5e6062] px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 py-3 border-y border-[#f0f4ff] text-center mb-3">
              {[
                { v: s.rooms, l: "salas" },
                { v: s.total, l: "capacidade" },
                { v: s.vacancies, l: "vagas", c: s.vacancies === 0 ? "#ef4444" : "#22c55e" },
                { v: s.waitlist, l: "em espera" },
              ].map((stat) => (
                <div key={stat.l}>
                  <p className="font-bold text-sm" style={{ color: stat.c ?? "#263238" }}>{stat.v}</p>
                  <p className="text-[#979799] text-xs">{stat.l}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(s)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] hover:text-[#3b5fe0] transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Editar dados
              </button>
              <button onClick={() => setConfirmDelete(s.id)}
                className="flex items-center justify-center gap-1.5 bg-red-50 text-red-400 text-xs px-3 py-2.5 rounded-xl font-semibold hover:bg-red-100 hover:text-red-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:items-center lg:justify-center">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-sm lg:mx-4 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-[#263238] font-bold">Remover escola?</p>
                <p className="text-[#979799] text-sm">{schools.find((s) => s.id === confirmDelete)?.name}</p>
              </div>
            </div>
            <p className="text-[#5e6062] text-sm leading-relaxed">
              A escola será removida da plataforma, incluindo todos os dados de mapa e configurações. Os dados de lista de espera permanecem no histórico.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { removeSchool(confirmDelete); setConfirmDelete(null); setSuccessMsg("Escola removida."); setTimeout(() => setSuccessMsg(""), 3000); }}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-colors">
                Sim, remover
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff] transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== DOMÍNIO TAB ====================

function DominioTab() {
  const [domain, setDomain] = useState("vagas.prefeitura.gov.br");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verified" | "pending">("idle");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleVerify = () => {
    setVerifyStatus("pending");
    setTimeout(() => setVerifyStatus("verified"), 1500);
  };

  const portals = [
    { label: "Portal dos Responsáveis", icon: Users, path: "/", color: "#22c55e" },
    { label: "Painel da Prefeitura", icon: BarChart3, path: "/prefeitura", color: "#3b5fe0" },
    { label: "Painel das Escolas", icon: Building2, path: "/escola", color: "#5e6062" },
    { label: "Mapa Inteligente", icon: MapPin, path: "/mapa", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-5">
      {/* Card 1 — Domínio Principal */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#3b5fe0]" />
          </div>
          <div>
            <p className="text-[#263238] font-bold">Domínio Principal</p>
            <p className="text-[#979799] text-xs">Endereço raiz da plataforma da sua prefeitura</p>
          </div>
        </div>

        <div>
          <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Domínio Principal</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#f0f4ff] rounded-xl px-4 py-3 border border-transparent focus-within:border-[#3b5fe0]/30 focus-within:ring-2 focus-within:ring-[#3b5fe0]/15">
              <Globe className="w-4 h-4 text-[#979799] shrink-0" />
              <input
                value={domain}
                onChange={(e) => { setDomain(e.target.value); setVerifyStatus("idle"); }}
                placeholder="vagas.prefeitura.gov.br"
                className="flex-1 bg-transparent text-[#263238] text-sm outline-none placeholder-[#bfc5d2]"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={!domain.trim() || verifyStatus === "pending"}
              className="flex items-center gap-2 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-50 transition-all active:scale-95 shrink-0"
            >
              {verifyStatus === "pending" ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verificando...</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verificar Domínio</span>
              )}
            </button>
          </div>
        </div>

        {/* Status */}
        {verifyStatus === "verified" && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-emerald-700 text-sm font-semibold">🟢 Domínio verificado</p>
              <p className="text-emerald-600 text-xs mt-0.5">O domínio <strong>{domain}</strong> está configurado corretamente e apontando para o SIVE.</p>
            </div>
          </div>
        )}
        {verifyStatus === "pending" && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
            <div>
              <p className="text-red-700 text-sm font-semibold">🔴 DNS pendente</p>
              <p className="text-red-600 text-xs mt-0.5">Registros DNS não encontrados. Configure o CNAME conforme as instruções abaixo e aguarde a propagação (até 24h).</p>
            </div>
          </div>
        )}
        {verifyStatus === "idle" && (
          <p className="text-[#979799] text-xs">Clique em "Verificar Domínio" para checar a configuração DNS.</p>
        )}
      </Card>

      {/* Card 2 — Endereços da Plataforma */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#7da5ff]/20 rounded-xl flex items-center justify-center">
            <Link2 className="w-5 h-5 text-[#3b5fe0]" />
          </div>
          <div>
            <p className="text-[#263238] font-bold">Endereços da Plataforma</p>
            <p className="text-[#979799] text-xs">Rotas geradas automaticamente a partir do domínio principal</p>
          </div>
        </div>

        <div className="space-y-3">
          {portals.map((p) => {
            const url = `https://${domain || "vagas.prefeitura.gov.br"}${p.path}`;
            const key = p.label;
            return (
              <div key={p.label} className="flex items-center gap-3 p-3 bg-[#f0f4ff] rounded-xl">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.color}15` }}>
                  <p.icon className="w-4 h-4" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#263238] text-sm font-medium">{p.label}</p>
                  <p className="text-[#3b5fe0] text-xs font-mono truncate">{url}</p>
                </div>
                <button
                  onClick={() => handleCopy(url, key)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shrink-0 transition-all ${
                    copied === key
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-[#5e6062] hover:bg-[#e4ecff] hover:text-[#3b5fe0]"
                  }`}
                >
                  {copied === key ? <><CheckCircle className="w-3.5 h-3.5" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Card 3 — Configuração DNS */}
      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#263238]/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#263238]" />
          </div>
          <div>
            <p className="text-[#263238] font-bold">Configuração DNS</p>
            <p className="text-[#979799] text-xs">Siga as instruções para apontar seu domínio para o SIVE</p>
          </div>
        </div>

        <div className="bg-[#f0f4ff] rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#3b5fe0] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <p className="text-[#263238] text-sm font-semibold">Crie um registro CNAME no seu provedor DNS</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4">
              <p className="text-[#979799] text-xs font-semibold uppercase tracking-wider mb-2">Nome (Host)</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[#263238] text-sm font-mono font-bold">
                  {domain.split(".")[0] || "vagas"}
                </code>
                <button
                  onClick={() => handleCopy(domain.split(".")[0] || "vagas", "cname-name")}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${copied === "cname-name" ? "bg-emerald-100 text-emerald-700" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}
                >
                  {copied === "cname-name" ? <><CheckCircle className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <p className="text-[#979799] text-xs font-semibold uppercase tracking-wider mb-2">Destino (Value)</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[#263238] text-sm font-mono font-bold">tenant.sive.com.br</code>
                <button
                  onClick={() => handleCopy("tenant.sive.com.br", "cname-dest")}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${copied === "cname-dest" ? "bg-emerald-100 text-emerald-700" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}
                >
                  {copied === "cname-dest" ? <><CheckCircle className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar destino</>}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-[#3b5fe0] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <p className="text-[#263238] text-sm font-semibold">Aguarde a propagação DNS</p>
              <p className="text-[#979799] text-xs mt-0.5 leading-relaxed">
                A propagação pode levar de <strong>alguns minutos a 24 horas</strong>, dependendo do provedor de DNS. Após esse período, clique em "Verificar Domínio" para confirmar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-[#3b5fe0] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div>
              <p className="text-[#263238] text-sm font-semibold">Verifique e ative</p>
              <p className="text-[#979799] text-xs mt-0.5">Use o botão "Verificar Domínio" na parte superior para confirmar a configuração e ativar o domínio personalizado.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-700 text-sm font-semibold">Certificado SSL incluso</p>
            <p className="text-amber-600 text-xs mt-0.5 leading-relaxed">
              O SIVE provisiona automaticamente um certificado SSL (HTTPS) para o seu domínio após a verificação bem-sucedida. Nenhuma configuração adicional é necessária.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PrefeituraApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<Tab>("overview");
  const [criterios, setCriterios] = useState<Criterio[]>(defaultCriterios);
  const navigate = useNavigate();
  const { schools } = useSchools();

  if (screen === "login") {
    return (
      <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif] lg:items-center lg:justify-center lg:flex">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-[#3b5fe0] px-6 pt-8 pb-8 lg:rounded-t-3xl">
            <div className="flex items-center gap-4 mb-5">
              <img src={brasao} alt="Brasão Caraguatatuba" className="h-14 w-auto object-contain" />
              <div>
                <p className="text-white/55 text-xs font-bold uppercase tracking-wider">Painel da Prefeitura</p>
                <p className="text-white font-bold leading-tight">Caraguatatuba — SP</p>
                <p className="text-white/55 text-xs">Secretaria Municipal de Educação</p>
              </div>
            </div>
            <h2 className="text-white text-xl font-bold">Acesso Administrativo</h2>
          </div>
          <div className="bg-white px-6 py-6 space-y-4 lg:rounded-b-3xl shadow-xl">
            <FormField label="E-mail institucional" placeholder="nome@caraguatatuba.sp.gov.br" type="email" />
            <FormField label="Senha" placeholder="••••••••" type="password" />
            <PrimaryBtn onClick={() => setScreen("dashboard")}>Acessar Painel</PrimaryBtn>
          </div>
        </div>
      </div>
    );
  }

  const tabTitles: Record<Tab, { title: string; subtitle: string }> = {
    overview: { title: "Visão Geral", subtitle: "Indicadores estratégicos · Caraguatatuba, SP" },
    escolas: { title: "Métricas das Escolas", subtitle: `${schools.length} unidades cadastradas` },
    gerenciar: { title: "Gerenciar Escolas", subtitle: "Cadastro e atualização das unidades da rede municipal" },
    espera: { title: "Lista de Espera", subtitle: `${prefData.totalWaitlist} alunos aguardando` },
    bairros: { title: "Por Bairro", subtitle: "Indicadores por região do município" },
    historico: { title: "Histórico", subtitle: "Ocupação e tendências — 2026" },
    criterios: { title: "Critérios de Fila", subtitle: "Pesos e regras de classificação da lista de espera" },
    configuracoes: { title: "Configurações", subtitle: "Prazos e regras operacionais do sistema" },
    dominio: { title: "Configuração de Domínio", subtitle: "Personalize o endereço de acesso da plataforma da sua prefeitura." },
  };

  const MobileHeader = () => (
    <div className="bg-[#3b5fe0] px-5 pt-4 pb-5 lg:hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={brasao} alt="" className="h-9 w-auto object-contain" />
          <div>
            <p className="text-white/50 text-xs">Painel da Prefeitura</p>
            <p className="text-white font-bold text-sm">Caraguatatuba</p>
          </div>
        </div>
        <button onClick={() => setScreen("login")} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(["overview", "escolas", "gerenciar", "espera", "bairros", "historico", "criterios", "configuracoes", "dominio"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? "bg-white text-[#3b5fe0]" : "bg-white/15 text-white"}`}>
            {tabTitles[t].title}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="font-[Inter,sans-serif]">
      <PortalLayout sidebar={<Sidebar tab={tab} setTab={setTab} onLogout={() => setScreen("login")} />}>
        <BackToPortals />
        <MobileHeader />
        <ContentArea>
          <PageTitle title={tabTitles[tab].title} subtitle={tabTitles[tab].subtitle} />
          {tab === "overview" && <OverviewTab />}
          {tab === "escolas" && <EscolasTab />}
          {tab === "espera" && <EsperaTab />}
          {tab === "bairros" && <BairrosTab />}
          {tab === "historico" && <HistoricoTab />}
          {tab === "gerenciar" && <GerenciarEscolasTab />}
          {tab === "criterios" && <CriteriosTab criterios={criterios} setCriterios={setCriterios} />}
          {tab === "configuracoes" && <ConfiguracoesTab />}
          {tab === "dominio" && <DominioTab />}
        </ContentArea>
      </PortalLayout>
    </div>
  );
}
