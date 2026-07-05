import { useState } from "react";
import {
  Users, User, BookOpen, Plus, Search, Phone, Mail, Lock,
  Link2, Unlink2, ChevronRight, CheckCircle, AlertCircle,
  Building2, Edit3, UserPlus, X, LogOut, Home, Bell, Clock,
  ThumbsUp, ThumbsDown, PhoneCall, Layers, ArrowUpDown,
} from "lucide-react";
import {
  PortalLayout, ContentArea, SideNavItem, PageTitle,
  SubHeader, MobileHeader, BackToPortals,
  Card, PrimaryBtn, SecondaryBtn, FormField, TypePill, InfoBox,
} from "../components/Shared";
import {
  Responsavel, Child, Relation,
  initResponsaveis, initChildren, initRelations,
  formatCPF, formatPhone, STATUS_LABEL,
} from "../data";
import { useNavigate } from "react-router";
import brasao from "@/imports/brasao-removebg-preview.png";
import siveLogo from "@/imports/SIVE_teste__6_-removebg-preview-2.png";
import { useSchools } from "../context/SchoolsContext";

type WaitlistStatus = "aguardando" | "chamado" | "aceite" | "recusa" | "desistencia" | "prazo_expirado";

type Screen =
  | "login" | "dashboard" | "waitlist" | "historico" | "vagas"
  | "responsaveis" | "responsavel-detail" | "responsavel-new" | "cpf-search"
  | "children" | "child-detail" | "child-new"
  | "link-child-to-responsavel" | "link-responsavel-to-child";

const initWaitlist = [
  { id: 1, name: "Mateus Costa", age: "1a 3m", period: "Integral", position: 1, score: 94.5, criteria: "Renda + Distância", status: "aguardando" as WaitlistStatus, calledAt: undefined as string | undefined },
  { id: 2, name: "Sofia Ferreira", age: "2a 0m", period: "Manhã", position: 2, score: 91.2, criteria: "Renda + Mãe trabalhadora", status: "chamado" as WaitlistStatus, calledAt: "30/06/2026" },
  { id: 3, name: "Pedro Santos", age: "1a 8m", period: "Integral", position: 3, score: 88.7, criteria: "Distância", status: "aguardando" as WaitlistStatus, calledAt: undefined as string | undefined },
  { id: 4, name: "Maria Lima", age: "3a 0m", period: "Tarde", position: 4, score: 85.3, criteria: "Renda", status: "aguardando" as WaitlistStatus, calledAt: undefined as string | undefined },
  { id: 5, name: "João Alves", age: "2a 5m", period: "Manhã", position: 5, score: 82.1, criteria: "Distância + Irmão", status: "aguardando" as WaitlistStatus, calledAt: undefined as string | undefined },
  { id: 6, name: "Lucas Oliveira", age: "0a 4m", period: "Integral", position: 6, score: 79.8, criteria: "Renda", status: "aguardando" as WaitlistStatus, calledAt: undefined as string | undefined },
];

// Calcula dias desde a data de chamada
function daysSinceCalled(calledAt: string): number {
  const [d, m, y] = calledAt.split("/").map(Number);
  const diff = Date.now() - new Date(y, m - 1, d).getTime();
  return Math.floor(diff / 86_400_000);
}

const historyItems = [
  { date: "03/07/2026", name: "Sofia Ferreira", action: "Chamada para vaga — Integral", status: "chamado" as WaitlistStatus },
  { date: "28/06/2026", name: "Carla Mendes", action: "Aceite confirmado — Manhã", status: "aceite" as WaitlistStatus },
  { date: "25/06/2026", name: "Bruno Lima", action: "Recusa da vaga — Tarde", status: "recusa" as WaitlistStatus },
  { date: "20/06/2026", name: "Isabela Rocha", action: "Desistência da lista de espera", status: "desistencia" as WaitlistStatus },
  { date: "15/06/2026", name: "Rafael Costa", action: "Matrícula realizada — Integral", status: "aceite" as WaitlistStatus },
];

const STATUS_WAITLIST: Record<WaitlistStatus, { label: string; bg: string; text: string }> = {
  aguardando: { label: "Aguardando", bg: "bg-[#f0f4ff]", text: "text-[#5e6062]" },
  chamado: { label: "Chamado", bg: "bg-amber-50 border border-amber-200", text: "text-amber-700" },
  aceite: { label: "Aceite", bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700" },
  recusa: { label: "Recusa", bg: "bg-red-50 border border-red-200", text: "text-red-600" },
  desistencia: { label: "Desistência", bg: "bg-red-50 border border-red-200", text: "text-red-600" },
  prazo_expirado: { label: "Prazo expirado — sem comparecimento", bg: "bg-red-100 border border-red-300", text: "text-red-700" },
};

const SCHOOL = "EMEI Jardim das Flores";

// ==================== SIDEBAR ====================

function EscolaSidebar({
  screen, go, onLogout, vacancies, capacity, waitingCount,
}: {
  screen: Screen; go: (s: Screen) => void; onLogout: () => void;
  vacancies: number; capacity: number; waitingCount: number;
}) {
  const nav = [
    { key: "dashboard", icon: Home, label: "Início" },
    { key: "waitlist", icon: Users, label: "Lista de Espera" },
    { key: "vagas", icon: Layers, label: "Gestão de Vagas" },
    { key: "historico", icon: Clock, label: "Histórico" },
    { key: "responsaveis", icon: UserPlus, label: "Responsáveis" },
    { key: "children", icon: User, label: "Alunos" },
    { key: "cpf-search", icon: Search, label: "Buscar por CPF" },
  ];
  const activeKey = ["responsavel-detail", "responsavel-new", "link-child-to-responsavel"].includes(screen)
    ? "responsaveis"
    : ["child-detail", "child-new", "link-responsavel-to-child"].includes(screen)
    ? "children"
    : screen;

  return (
    <div className="bg-[#3b5fe0] h-full flex flex-col">
      <div className="px-5 py-5 border-b border-white/15">
        <div className="flex items-center gap-3 mb-1">
          <img src={brasao} alt="Brasão" className="h-10 w-auto object-contain" />
          <div>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Painel da Escola</p>
            <p className="text-white font-bold text-sm leading-tight">{SCHOOL}</p>
            <p className="text-white/45 text-xs">Caraguatatuba — SP</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/15 grid grid-cols-3 gap-2">
        {[
          { v: waitingCount, l: "Espera" },
          { v: vacancies, l: "Vagas" },
          { v: capacity, l: "Capacidade" },
        ].map((s) => (
          <div key={s.l} className="bg-white/10 rounded-xl p-2.5 text-center">
            <p className="text-white text-xl font-bold">{s.v}</p>
            <p className="text-white/45 text-xs mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => (
          <SideNavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeKey === item.key}
            onClick={() => go(item.key as Screen)}
          />
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

export default function EscolaApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>(initResponsaveis);
  const [children, setChildren] = useState<Child[]>(initChildren);
  const [relations, setRelations] = useState<Relation[]>(initRelations);
  const [waitlist, setWaitlist] = useState(initWaitlist);
  const [selResponsavel, setSelResponsavel] = useState<Responsavel | null>(null);
  const [selChild, setSelChild] = useState<Child | null>(null);
  const [cpfSearch, setCpfSearch] = useState("");
  const [cpfSearchResult, setCpfSearchResult] = useState<Responsavel | "not-found" | null>(null);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const { schools, updateVacancies, vacancyLog, getDeadline } = useSchools();

  // escola atual (id=1 — EMEI Jardim das Flores)
  const SCHOOL_ID = 1;
  const currentSchool = schools.find((s) => s.id === SCHOOL_ID)!;
  const schoolVacancyLog = vacancyLog.filter((l) => l.schoolId === SCHOOL_ID);
  const deadline = getDeadline(SCHOOL_ID);

  const today = new Date().toLocaleDateString("pt-BR");

  const updateStatus = (id: number, status: WaitlistStatus) =>
    setWaitlist((prev) => prev.map((w) => w.id === id ? { ...w, status } : w));

  const callNext = () => {
    const next = waitlist.find((w) => w.status === "aguardando");
    if (next) setWaitlist((prev) => prev.map((w) => w.id === next.id ? { ...w, status: "chamado", calledAt: today } : w));
  };

  // Repassar vaga: move o chamado para prazo_expirado no final da fila e chama o próximo
  const passToNext = (id: number) => {
    setWaitlist((prev) => {
      const active = prev.filter((w) => w.id !== id);
      const expired = prev.find((w) => w.id === id);
      if (!expired) return prev;

      const reordered = active.map((w, i) => ({ ...w, position: i + 1 }));
      const expiredEntry = { ...expired, status: "prazo_expirado" as WaitlistStatus, calledAt: undefined, position: reordered.length + 1 };

      const next = reordered.find((w) => w.status === "aguardando");
      const finalList = reordered.map((w) => w.id === next?.id ? { ...w, status: "chamado" as WaitlistStatus, calledAt: today } : w);

      return [...finalList, expiredEntry];
    });
  };

  const getChildrenFor = (rId: number) =>
    relations.filter((r) => r.responsavelId === rId)
      .map((r) => ({ ...children.find((c) => c.id === r.childId)!, relationship: r.relationship }))
      .filter(Boolean);

  const getResponsaveisFor = (cId: number) =>
    relations.filter((r) => r.childId === cId)
      .map((r) => ({ ...responsaveis.find((rv) => rv.id === r.responsavelId)!, relationship: r.relationship }))
      .filter(Boolean);

  const unlinkRelation = (responsavelId: number, childId: number) =>
    setRelations((prev) => prev.filter((r) => !(r.responsavelId === responsavelId && r.childId === childId)));

  const linkRelation = (responsavelId: number, childId: number, relationship: string) =>
    setRelations((prev) => {
      if (prev.find((r) => r.responsavelId === responsavelId && r.childId === childId)) return prev;
      return [...prev, { responsavelId, childId, relationship }];
    });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const go = (s: Screen) => setScreen(s);
  const loggedIn = screen !== "login";

  // Wrap logged-in screens in PortalLayout (desktop sidebar)
  const withLayout = (content: React.ReactNode) => (
    <PortalLayout
      sidebar={<EscolaSidebar screen={screen} go={go} onLogout={() => go("login")}
        vacancies={currentSchool?.vacancies ?? 0}
        capacity={currentSchool?.total ?? 0}
        waitingCount={waitlist.filter((w) => w.status === "aguardando" || w.status === "chamado").length}
      />}
    >
      {content}
    </PortalLayout>
  );

  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex flex-col font-[Inter,sans-serif] lg:items-center lg:justify-center">
        <div className="w-full max-w-sm mx-auto">
          <BackToPortals alwaysShow />
          <div className="bg-[#3b5fe0] px-6 pt-8 pb-8 lg:rounded-t-3xl">
            <div className="flex items-center gap-3 mb-2">
              <img src={brasao} alt="Brasão" className="h-12 w-auto object-contain" />
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Painel da Escola</p>
                <p className="text-white font-bold leading-tight">Caraguatatuba — SP</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-6 space-y-4 lg:rounded-b-3xl shadow-xl">
            <FormField label="Código da Escola" placeholder="ex: EMEI-0012" />
            <FormField label="Senha" placeholder="••••••••" type="password" />
            <PrimaryBtn onClick={() => go("dashboard")}>Acessar Painel</PrimaryBtn>
          </div>
        </div>
      </div>
    );
  }

  // ---- DASHBOARD ----
  if (screen === "dashboard") {
    const menuItems = [
      { icon: Users, label: "Lista de Espera", desc: `${waitlist.length} alunos aguardando`, action: () => go("waitlist"), color: "#3b5fe0" },
      { icon: UserPlus, label: "Responsáveis", desc: `${responsaveis.length} cadastrados`, action: () => go("responsaveis"), color: "#5e6062" },
      { icon: User, label: "Alunos", desc: `${children.length} registradas`, action: () => go("children"), color: "#263238" },
      { icon: Search, label: "Buscar por CPF", desc: "Localizar responsável no sistema", action: () => go("cpf-search"), color: "#7da5ff" },
    ];
    return withLayout(
      <>
        <BackToPortals />
        <div className="bg-[#3b5fe0] px-5 pt-12 pb-4 lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <img src={brasao} alt="Brasão" className="h-7 w-auto object-contain" />
            <button onClick={() => go("login")} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile stats strip */}
        <div className="bg-[#3b5fe0] px-5 pb-4 grid grid-cols-3 gap-2 lg:hidden">
          {[{ v: waitlist.length, l: "Na espera" }, { v: 5, l: "Vagas" }, { v: 115, l: "Matriculados" }].map((s) => (
            <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-white text-2xl font-bold">{s.v}</p>
              <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>

        <ContentArea>
          <PageTitle title="Início" subtitle={SCHOOL} />

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-emerald-700 text-sm">{successMsg}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <button key={item.label} onClick={item.action}
                className="bg-white rounded-2xl p-5 flex items-center gap-4 border border-[#e8edf8] text-left active:scale-[0.97] hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}18` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#263238]">{item.label}</p>
                  <p className="text-[#979799] text-sm mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#bfc5d2]" />
              </button>
            ))}
          </div>
        </ContentArea>
      </>
    );
  }

  // ---- WAITLIST ----
  if (screen === "waitlist") {
    const nextUp = waitlist.find((w) => w.status === "aguardando");
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title="Lista de Espera" subtitle={SCHOOL} onBack={() => go("dashboard")} />
        <ContentArea>
          <PageTitle title="Lista de Espera" subtitle={SCHOOL} onBack={() => go("dashboard")} />

          {/* Chamar próximo */}
          <Card className="p-4 flex items-center gap-4 border-[#3b5fe0]/20 bg-[#3b5fe0]/5">
            <div className="flex-1">
              <p className="text-[#263238] font-semibold text-sm">Próximo da fila</p>
              {nextUp ? (
                <p className="text-[#979799] text-xs mt-0.5">#{nextUp.position}º — {nextUp.name} · {nextUp.period}</p>
              ) : (
                <p className="text-[#979799] text-xs mt-0.5">Nenhum aluno aguardando</p>
              )}
            </div>
            <button
              onClick={callNext}
              disabled={!nextUp}
              className="flex items-center gap-2 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> Chamar próximo
            </button>
          </Card>

          {/* Deadline config info */}
          <div className="bg-[#f0f4ff] rounded-2xl px-4 py-3 flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#3b5fe0] shrink-0" />
            <p className="text-[#5e6062] text-xs">
              Prazos desta escola: <strong>{deadline.schoolContactDays} dias</strong> para contato · <strong>{deadline.enrollmentDays} dias</strong> para matrícula
              · Total: <strong>{deadline.schoolContactDays + deadline.enrollmentDays} dias</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {waitlist.map((s) => {
              const st = STATUS_WAITLIST[s.status];
              const days = s.calledAt ? daysSinceCalled(s.calledAt) : 0;
              const contactExpired = days > deadline.schoolContactDays;
              const totalExpired = days > (deadline.schoolContactDays + deadline.enrollmentDays);
              const daysLeftContact = Math.max(0, deadline.schoolContactDays - days);
              const daysLeftEnroll = Math.max(0, deadline.schoolContactDays + deadline.enrollmentDays - days);

              return (
                <Card key={s.id} className={`p-4 ${s.status === "chamado" ? (totalExpired ? "border-red-300 bg-red-50/30" : "border-amber-200") : s.status === "prazo_expirado" ? "border-red-200 opacity-70" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-[#3b5fe0] font-bold text-sm">#{s.position}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#263238] text-sm">{s.name}</p>
                      <p className="text-[#979799] text-xs">{s.age} · {s.criteria} · {s.period}</p>
                      {s.calledAt && <p className="text-[#979799] text-xs">Chamado em: {s.calledAt}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                      <p className="text-[#3b5fe0] font-bold text-sm">{s.score} pts</p>
                    </div>
                  </div>

                  {/* Deadline countdown for "chamado" */}
                  {s.status === "chamado" && s.calledAt && (
                    <div className={`mt-3 rounded-xl p-3 ${totalExpired ? "bg-red-100 border border-red-200" : contactExpired ? "bg-amber-50 border border-amber-200" : "bg-emerald-50 border border-emerald-200"}`}>
                      {totalExpired ? (
                        <p className="text-red-700 text-xs font-semibold">⚠ Prazo total encerrado há {days - (deadline.schoolContactDays + deadline.enrollmentDays)}d — repasse a vaga</p>
                      ) : contactExpired ? (
                        <div className="space-y-0.5">
                          <p className="text-amber-700 text-xs font-semibold">⏱ Fase 2: responsável deve matricular</p>
                          <p className="text-amber-600 text-xs">{daysLeftEnroll} dia(s) restante(s) para matrícula</p>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-emerald-700 text-xs font-semibold">📞 Fase 1: escola deve contatar responsável</p>
                          <p className="text-emerald-600 text-xs">{daysLeftContact} dia(s) restante(s) para contato</p>
                        </div>
                      )}
                      <div className="mt-2 h-1.5 bg-white/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${totalExpired ? "bg-red-500" : contactExpired ? "bg-amber-400" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(100, (days / (deadline.schoolContactDays + deadline.enrollmentDays)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {s.status === "chamado" && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(s.id, "aceite")}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Aceite
                        </button>
                        <button onClick={() => updateStatus(s.id, "recusa")}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" /> Recusa
                        </button>
                        <button onClick={() => updateStatus(s.id, "desistencia")}
                          className="flex-1 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] transition-colors">
                          Desistência
                        </button>
                      </div>
                      <button onClick={() => passToNext(s.id)}
                        className={`w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl font-semibold transition-colors ${
                          totalExpired
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "border border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                        }`}>
                        ⏭ Repassar vaga — não compareceu no prazo
                      </button>
                      <button onClick={() => updateStatus(s.id, "aguardando")}
                        className="w-full flex items-center justify-center gap-1.5 border border-amber-300 text-amber-600 bg-amber-50 text-xs py-2 rounded-xl font-semibold hover:bg-amber-100 transition-colors">
                        ↩ Desfazer chamado — retornar para lista de espera
                      </button>
                    </div>
                  )}
                  {s.status === "aguardando" && (
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => updateStatus(s.id, "chamado")}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#3b5fe0] text-white text-xs py-2.5 rounded-xl font-semibold hover:bg-[#2f4fc4] transition-colors">
                        <Bell className="w-3.5 h-3.5" /> Chamar
                      </button>
                      <button className="flex-1 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] transition-colors">
                        Ver perfil
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </ContentArea>
      </>
    );
  }

  // ---- HISTÓRICO ----
  if (screen === "historico") {
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title="Histórico" subtitle="Movimentações da lista de espera" onBack={() => go("dashboard")} />
        <ContentArea>
          <PageTitle title="Histórico de Movimentações" subtitle={SCHOOL} onBack={() => go("dashboard")} />
          <Card className="p-4">
            <div className="space-y-3">
              {historyItems.map((h, i) => {
                const st = STATUS_WAITLIST[h.status];
                return (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#f0f4ff] last:border-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${st.bg}`}>
                      {h.status === "aceite" ? <CheckCircle className={`w-4 h-4 ${st.text}`} />
                        : h.status === "chamado" ? <Bell className={`w-4 h-4 ${st.text}`} />
                        : <X className={`w-4 h-4 ${st.text}`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[#263238] text-sm font-semibold">{h.name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                      </div>
                      <p className="text-[#979799] text-xs mt-0.5">{h.action}</p>
                      <p className="text-[#bfc5d2] text-xs mt-0.5">{h.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </ContentArea>
      </>
    );
  }

  // ---- GESTÃO DE VAGAS ----
  if (screen === "vagas") {
    return withLayout(
      <VagasScreen
        school={currentSchool}
        schoolId={SCHOOL_ID}
        log={schoolVacancyLog}
        onUpdate={(novas, motivo) => {
          updateVacancies(SCHOOL_ID, novas, motivo);
          showSuccess(`Vagas atualizadas: ${novas} vagas disponíveis.`);
        }}
        onBack={() => go("dashboard")}
      />
    );
  }

  // ---- CPF SEARCH ----
  if (screen === "cpf-search") {
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title="Buscar por CPF" subtitle="Localizar responsável no sistema" dark onBack={() => go("dashboard")} />
        <ContentArea>
          <PageTitle title="Buscar por CPF" subtitle="Localizar responsável no sistema" onBack={() => go("dashboard")} />
          <div className="lg:max-w-xl">
            <Card className="p-5 space-y-4">
              <FormField
                label="CPF do Responsável"
                placeholder="000.000.000-00"
                type="tel"
                value={cpfSearch}
                onChange={(v) => { setCpfSearch(formatCPF(v)); setCpfSearchResult(null); }}
              />
              <PrimaryBtn dark onClick={() => {
                const found = responsaveis.find((r) => r.cpf === cpfSearch);
                setCpfSearchResult(found || "not-found");
              }}>
                Buscar no Sistema
              </PrimaryBtn>
            </Card>

            {cpfSearchResult === "not-found" && (
              <Card className="p-5 mt-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#263238] text-sm">Responsável não encontrado</p>
                    <p className="text-[#979799] text-xs mt-0.5">CPF {cpfSearch} não está cadastrado no sistema.</p>
                  </div>
                </div>
                <PrimaryBtn onClick={() => { setCpfSearch(""); setCpfSearchResult(null); go("responsavel-new"); }}>
                  <span className="flex items-center justify-center gap-2"><UserPlus className="w-4 h-4" /> Cadastrar novo responsável</span>
                </PrimaryBtn>
              </Card>
            )}

            {cpfSearchResult && cpfSearchResult !== "not-found" && (
              <Card className="p-5 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <p className="font-semibold text-[#263238] text-sm">Responsável encontrado</p>
                </div>
                <div className="bg-[#f0f4ff] rounded-xl p-4 mb-4 space-y-1.5">
                  <p className="font-semibold text-[#263238]">{cpfSearchResult.name}</p>
                  <p className="text-[#979799] text-sm font-mono">{cpfSearchResult.cpf}</p>
                  <div className="flex items-center gap-2 text-[#979799] text-xs"><Phone className="w-3.5 h-3.5" />{cpfSearchResult.phone}</div>
                  <div className="flex items-center gap-2 text-[#979799] text-xs"><Mail className="w-3.5 h-3.5" />{cpfSearchResult.email}</div>
                  <div className="pt-1">
                    {cpfSearchResult.hasAccess
                      ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Tem acesso ao portal</span>
                      : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Sem acesso ao portal</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <PrimaryBtn onClick={() => {
                    setSelResponsavel(cpfSearchResult as Responsavel);
                    setCpfSearchResult(null); setCpfSearch("");
                    go("responsavel-detail");
                  }}>
                    Ver perfil completo
                  </PrimaryBtn>
                  <SecondaryBtn onClick={() => { setSelResponsavel(cpfSearchResult as Responsavel); setShowPwdModal(true); }}>
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      {cpfSearchResult.hasAccess ? "Alterar senha" : "Criar acesso"}
                    </span>
                  </SecondaryBtn>
                </div>
              </Card>
            )}
          </div>
        </ContentArea>

        {showPwdModal && selResponsavel && (
          <PwdModal
            responsavel={selResponsavel}
            onClose={() => setShowPwdModal(false)}
            onSave={() => {
              setResponsaveis((prev) => prev.map((r) => r.id === selResponsavel.id ? { ...r, hasAccess: true } : r));
              setShowPwdModal(false);
              showSuccess(selResponsavel.hasAccess ? "Senha alterada!" : "Acesso criado!");
              setCpfSearchResult(null);
            }}
          />
        )}
      </>
    );
  }

  // ---- RESPONSÁVEIS LIST ----
  if (screen === "responsaveis") {
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title="Responsáveis" subtitle={`${responsaveis.length} cadastrados`} dark onBack={() => go("dashboard")} />
        <ContentArea>
          <div className="flex items-center justify-between">
            <PageTitle title="Responsáveis" subtitle={`${responsaveis.length} cadastrados`} />
            <button onClick={() => go("responsavel-new")}
              className="hidden lg:flex items-center gap-2 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2f4fc4] transition-colors mb-6">
              <UserPlus className="w-4 h-4" /> Novo Responsável
            </button>
          </div>
          <button onClick={() => go("responsavel-new")}
            className="lg:hidden w-full bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform">
            <UserPlus className="w-4 h-4" /> Novo Responsável
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {responsaveis.map((r) => {
              const linked = getChildrenFor(r.id);
              return (
                <button key={r.id} onClick={() => { setSelResponsavel(r); go("responsavel-detail"); }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#e8edf8] text-left active:scale-[0.97] hover:shadow-md transition-all">
                  <div className="w-11 h-11 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-[#3b5fe0] font-bold text-sm">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#263238] text-sm">{r.name}</p>
                    <p className="text-[#979799] text-xs font-mono">{r.cpf}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#5e6062]">{linked.length} filho(s)</span>
                      {r.hasAccess
                        ? <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">Tem acesso</span>
                        : <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">Sem acesso</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bfc5d2] shrink-0" />
                </button>
              );
            })}
          </div>
        </ContentArea>
      </>
    );
  }

  // ---- RESPONSÁVEL DETAIL ----
  if (screen === "responsavel-detail" && selResponsavel) {
    const rv = selResponsavel;
    const linked = getChildrenFor(rv.id);
    const unlinked = children.filter((c) => !linked.find((l) => l.id === c.id));

    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title={rv.name} subtitle={rv.cpf} dark onBack={() => go("responsaveis")} />
        <ContentArea>
          <PageTitle title={rv.name} subtitle={rv.cpf} onBack={() => go("responsaveis")} />
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
            {/* Left column: contact info */}
            <div className="space-y-4">
              <Card className="p-5 space-y-3">
                <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Dados de Contato</p>
                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#979799] shrink-0" /><p className="text-[#263238] text-sm">{rv.phone}</p></div>
                <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#979799] shrink-0" /><p className="text-[#263238] text-sm">{rv.email}</p></div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#979799] shrink-0" />
                  {rv.hasAccess
                    ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Acesso ativo ao portal</span>
                    : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Sem acesso ao portal</span>}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="flex items-center justify-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] transition-colors">
                    <Edit3 className="w-3.5 h-3.5" /> Editar dados
                  </button>
                  <button onClick={() => setShowPwdModal(true)}
                    className="flex items-center justify-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] transition-colors">
                    <Lock className="w-3.5 h-3.5" /> {rv.hasAccess ? "Alterar senha" : "Criar acesso"}
                  </button>
                </div>
              </Card>
            </div>

            {/* Right column: children */}
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Filhos vinculados ({linked.length})</p>
                  {unlinked.length > 0 && (
                    <button onClick={() => go("link-child-to-responsavel")} className="flex items-center gap-1 text-[#3b5fe0] text-xs font-semibold hover:text-[#2f4fc4]">
                      <Link2 className="w-3.5 h-3.5" /> Vincular filho
                    </button>
                  )}
                </div>
                {linked.length === 0 && <p className="text-[#979799] text-sm text-center py-2">Nenhum filho vinculado.</p>}
                {linked.map((child) => (
                  <div key={child.id} className="flex items-center gap-3 py-3 border-b border-[#f0f4ff] last:border-0">
                    <div className="w-9 h-9 bg-[#f0f4ff] rounded-xl flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#3b5fe0]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#263238] text-sm">{child.name}</p>
                      <p className="text-[#979799] text-xs">{child.relationship} · {child.type}</p>
                    </div>
                    <button onClick={() => unlinkRelation(rv.id, child.id)} className="text-[#bfc5d2] p-1.5 hover:text-red-400 transition-colors">
                      <Unlink2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </Card>

              <button onClick={() => go("child-new")}
                className="w-full border-2 border-dashed border-[#bfc5d2] rounded-2xl py-4 flex items-center justify-center gap-2 text-[#979799] text-sm font-medium hover:border-[#3b5fe0] hover:text-[#3b5fe0] transition-colors">
                <Plus className="w-4 h-4" /> Cadastrar novo filho
              </button>
            </div>
          </div>
        </ContentArea>

        {showPwdModal && (
          <PwdModal
            responsavel={rv}
            onClose={() => setShowPwdModal(false)}
            onSave={() => {
              setResponsaveis((prev) => prev.map((r) => r.id === rv.id ? { ...r, hasAccess: true } : r));
              setSelResponsavel({ ...rv, hasAccess: true });
              setShowPwdModal(false);
              showSuccess(rv.hasAccess ? "Senha alterada!" : "Acesso criado!");
            }}
          />
        )}
      </>
    );
  }

  // ---- RESPONSÁVEL NEW ----
  if (screen === "responsavel-new") {
    return withLayout(
      <ResponsavelNewForm
        onBack={() => go("responsaveis")}
        onSave={(rv) => {
          const newId = Math.max(...responsaveis.map((r) => r.id)) + 1;
          setResponsaveis((prev) => [...prev, { ...rv, id: newId }]);
          showSuccess("Responsável cadastrado com sucesso!");
          go("responsaveis");
        }}
      />
    );
  }

  // ---- LINK CHILD TO RESPONSÁVEL ----
  if (screen === "link-child-to-responsavel" && selResponsavel) {
    const linked = getChildrenFor(selResponsavel.id);
    const available = children.filter((c) => !linked.find((l) => l.id === c.id));
    return withLayout(
      <LinkForm
        title="Vincular Filho"
        subtitle={`Adicionar aluno para ${selResponsavel.name}`}
        emptyMsg="Todos os filhos já estão vinculados a este responsável."
        items={available.map((c) => ({ id: c.id, primary: c.name, secondary: `${c.dob} · ${c.type}`, icon: <User className="w-5 h-5 text-[#3b5fe0]" /> }))}
        onBack={() => go("responsavel-detail")}
        onLink={(childId, relType) => {
          linkRelation(selResponsavel.id, childId, relType);
          showSuccess(`${children.find((c) => c.id === childId)?.name} vinculado!`);
          go("responsavel-detail");
        }}
      />
    );
  }

  // ---- CHILDREN LIST ----
  if (screen === "children") {
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title="Alunos" subtitle={`${children.length} registradas`} dark onBack={() => go("dashboard")} />
        <ContentArea>
          <div className="flex items-center justify-between">
            <PageTitle title="Alunos" subtitle={`${children.length} registradas`} />
            <button onClick={() => { setSelResponsavel(null); go("child-new"); }}
              className="hidden lg:flex items-center gap-2 bg-[#3b5fe0] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2f4fc4] transition-colors mb-6">
              <Plus className="w-4 h-4" /> Cadastrar Aluno
            </button>
          </div>
          <button onClick={() => { setSelResponsavel(null); go("child-new"); }}
            className="lg:hidden w-full bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm active:scale-95">
            <Plus className="w-4 h-4" /> Cadastrar Aluno
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {children.map((child) => {
              const rvs = getResponsaveisFor(child.id);
              return (
                <button key={child.id} onClick={() => { setSelChild(child); go("child-detail"); }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#e8edf8] text-left active:scale-[0.97] hover:shadow-md transition-all">
                  <div className="w-11 h-11 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0">
                    {child.type === "creche" ? <User className="w-5 h-5 text-[#3b5fe0]" /> : <BookOpen className="w-5 h-5 text-[#3b5fe0]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#263238] text-sm">{child.name}</p>
                    <p className="text-[#979799] text-xs">{child.dob} · {child.type}</p>
                    <p className="text-[#979799] text-xs mt-0.5">{rvs.length} responsável(is)</p>
                  </div>
                  <span className="bg-[#3b5fe0] text-white text-xs font-bold px-2.5 py-1 rounded-xl shrink-0">#{child.position}º</span>
                </button>
              );
            })}
          </div>
        </ContentArea>
      </>
    );
  }

  // ---- CHILD DETAIL ----
  if (screen === "child-detail" && selChild) {
    const child = selChild;
    const rvs = getResponsaveisFor(child.id);
    const unlinkedRvs = responsaveis.filter((r) => !rvs.find((v) => v.id === r.id));
    return withLayout(
      <>
        <BackToPortals />
        <SubHeader title={child.name} subtitle={`${child.dob} · #${child.position}º na fila`} dark onBack={() => go("children")} />
        <ContentArea>
          <PageTitle title={child.name} subtitle={`${child.dob} · #${child.position}º na lista`} onBack={() => go("children")} />
          <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TypePill type={child.type} />
                  <span className="text-[#979799] text-xs">Pontuação: <span className="text-[#3b5fe0] font-bold">{child.score}</span></span>
                </div>
                <div className="h-2 bg-[#f0f4ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#3b5fe0] rounded-full" style={{ width: `${((child.totalWaitlist - child.position) / child.totalWaitlist) * 100}%` }} />
                </div>
                <p className="text-[#979799] text-xs mt-1">#{child.position}º de {child.totalWaitlist} na lista de espera</p>
              </Card>
            </div>

            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Responsáveis ({rvs.length})</p>
                  {unlinkedRvs.length > 0 && (
                    <button onClick={() => go("link-responsavel-to-child")} className="flex items-center gap-1 text-[#3b5fe0] text-xs font-semibold hover:text-[#2f4fc4]">
                      <Link2 className="w-3.5 h-3.5" /> Vincular
                    </button>
                  )}
                </div>
                {rvs.length === 0 && <p className="text-[#979799] text-sm text-center py-2">Nenhum responsável vinculado.</p>}
                {rvs.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-3 border-b border-[#f0f4ff] last:border-0">
                    <div className="w-9 h-9 bg-[#f0f4ff] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-[#3b5fe0] font-bold text-xs">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#263238] text-sm">{r.name}</p>
                      <p className="text-[#979799] text-xs">{r.relationship} · {r.cpf}</p>
                    </div>
                    <button onClick={() => unlinkRelation(r.id, child.id)} className="text-[#bfc5d2] p-1.5 hover:text-red-400 transition-colors">
                      <Unlink2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </Card>

              <button onClick={() => go("responsavel-new")}
                className="w-full border-2 border-dashed border-[#bfc5d2] rounded-2xl py-4 flex items-center justify-center gap-2 text-[#979799] text-sm font-medium hover:border-[#3b5fe0] hover:text-[#3b5fe0] transition-colors">
                <UserPlus className="w-4 h-4" /> Adicionar novo responsável
              </button>
            </div>
          </div>
        </ContentArea>
      </>
    );
  }

  // ---- LINK RESPONSÁVEL TO CHILD ----
  if (screen === "link-responsavel-to-child" && selChild) {
    const rvs = getResponsaveisFor(selChild.id);
    const available = responsaveis.filter((r) => !rvs.find((v) => v.id === r.id));
    return withLayout(
      <LinkForm
        title="Vincular Responsável"
        subtitle={`Adicionar responsável para ${selChild.name}`}
        emptyMsg="Todos os responsáveis já estão vinculados a este aluno."
        items={available.map((r) => ({
          id: r.id,
          primary: r.name,
          secondary: r.cpf,
          icon: <span className="text-[#3b5fe0] font-bold text-xs">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>,
        }))}
        onBack={() => go("child-detail")}
        onLink={(rvId, relType) => {
          linkRelation(rvId, selChild.id, relType);
          showSuccess(`${responsaveis.find((r) => r.id === rvId)?.name} vinculado!`);
          go("child-detail");
        }}
      />
    );
  }

  // ---- CHILD NEW ----
  if (screen === "child-new") {
    return withLayout(
      <ChildNewForm
        onBack={() => go(selResponsavel ? "responsavel-detail" : "children")}
        responsaveis={responsaveis}
        prelinkedResponsavelId={selResponsavel?.id}
        onSave={(child, links) => {
          const newId = Math.max(...children.map((c) => c.id)) + 1;
          setChildren((prev) => [...prev, { ...child, id: newId, position: 20, totalWaitlist: 47, score: 75 }]);
          links.forEach(({ rvId, relType }) => linkRelation(rvId, newId, relType));
          showSuccess("aluno cadastrada com sucesso!");
          go(selResponsavel ? "responsavel-detail" : "children");
        }}
      />
    );
  }

  return null;
}

// ==================== SUB-COMPONENTS ====================

function PwdModal({ responsavel, onClose, onSave }: {
  responsavel: Responsavel; onClose: () => void; onSave: () => void;
}) {
  const [pwd, setPwd] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end lg:items-center lg:justify-center">
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full lg:max-w-sm lg:mx-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[#263238]">{responsavel.hasAccess ? "Alterar senha" : "Criar acesso ao portal"}</p>
          <button onClick={onClose} className="text-[#979799] hover:text-[#5e6062]"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-[#979799] text-sm">{responsavel.name} — {responsavel.cpf}</p>
        <FormField label="Nova senha" placeholder="Mínimo 8 caracteres" type="password" value={pwd} onChange={setPwd} />
        <FormField label="Confirmar senha" placeholder="Repita a senha" type="password" />
        <PrimaryBtn onClick={onSave}>{responsavel.hasAccess ? "Salvar nova senha" : "Criar acesso"}</PrimaryBtn>
      </div>
    </div>
  );
}

function ResponsavelNewForm({ onBack, onSave }: {
  onBack: () => void;
  onSave: (rv: Omit<Responsavel, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [createAccess, setCreateAccess] = useState(false);
  return (
    <>
      <BackToPortals />
      <SubHeader title="Novo Responsável" subtitle="Cadastro no sistema" dark onBack={onBack} />
      <ContentArea>
        <PageTitle title="Novo Responsável" subtitle="Cadastrar no sistema" onBack={onBack} />
        <div className="lg:max-w-xl">
          <Card className="p-5 space-y-4">
            <FormField label="Nome completo" placeholder="Nome do responsável" value={name} onChange={setName} />
            <FormField label="CPF" placeholder="000.000.000-00" type="tel" value={cpf} onChange={(v) => setCpf(formatCPF(v))} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField label="Telefone / WhatsApp" placeholder="(00) 00000-0000" type="tel" value={phone} onChange={(v) => setPhone(formatPhone(v))} />
              <FormField label="E-mail" placeholder="email@exemplo.com" type="email" value={email} onChange={setEmail} />
            </div>
            <div className="flex items-center gap-3 py-1">
              <button onClick={() => setCreateAccess(!createAccess)}
                className={`w-12 h-6 rounded-full transition-colors shrink-0 ${createAccess ? "bg-[#3b5fe0]" : "bg-[#e8edf8]"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${createAccess ? "translate-x-6" : "translate-x-0"}`} />
              </button>
              <p className="text-[#263238] text-sm font-medium">Criar acesso ao portal do responsável</p>
            </div>
            {createAccess && <FormField label="Senha de acesso" placeholder="Mínimo 8 caracteres" type="password" />}
            <PrimaryBtn onClick={() => { if (!name || !cpf) return; onSave({ cpf, name, email, phone, hasAccess: createAccess }); }}>
              Cadastrar Responsável
            </PrimaryBtn>
          </Card>
        </div>
      </ContentArea>
    </>
  );
}

function LinkForm({ title, subtitle, items, emptyMsg, onBack, onLink }: {
  title: string; subtitle: string; emptyMsg: string;
  items: { id: number; primary: string; secondary: string; icon: React.ReactNode }[];
  onBack: () => void;
  onLink: (id: number, relType: string) => void;
}) {
  const [relType, setRelType] = useState("");
  return (
    <>
      <BackToPortals />
      <SubHeader title={title} subtitle={subtitle} dark onBack={onBack} />
      <ContentArea>
        <PageTitle title={title} subtitle={subtitle} onBack={onBack} />
        <div className="lg:max-w-xl space-y-4">
          <FormField label="Tipo de relação" placeholder="Mãe, Pai, Avó, Tutor, Responsável legal..." value={relType} onChange={setRelType} />
          <div className="space-y-3">
            {items.length === 0 && <InfoBox>{emptyMsg}</InfoBox>}
            {items.map((item) => (
              <Card key={item.id} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#263238] text-sm">{item.primary}</p>
                  <p className="text-[#979799] text-xs">{item.secondary}</p>
                </div>
                <button onClick={() => onLink(item.id, relType || "Responsável")}
                  className="bg-[#3b5fe0] text-white text-xs px-3 py-2 rounded-xl font-semibold active:scale-95 hover:bg-[#2f4fc4] transition-all shrink-0">
                  Vincular
                </button>
              </Card>
            ))}
          </div>
        </div>
      </ContentArea>
    </>
  );
}

// ---- ChildNewForm with CPF search + multiple responsáveis ----

interface LinkedRv {
  responsavel: Responsavel;
  relationship: string;
}

// Scoring helpers
const RENDA_SCORE: Record<string, number> = {
  "ate_1_4_sm": 10, "ate_1_2_sm": 8.5, "ate_1_sm": 6.5, "acima_1_sm": 3,
};
function calcScore(renda: string, vulner: boolean, monopar: boolean, aluguel: boolean, bolsa: boolean, bpc: boolean, defic: boolean, irmao: boolean): number {
  const r = (RENDA_SCORE[renda] ?? 5) * 0.40;
  const v = (vulner ? 10 : 2) * 0.20;
  const d = 7 * 0.15; // distance unknown, use neutral
  const m = (monopar ? 10 : 2) * 0.10;
  const b = ((bolsa || bpc) ? 10 : 2) * 0.08;
  const a = (aluguel ? 10 : 2) * 0.04;
  const ir = (irmao ? 10 : 2) * 0.03;
  return Math.min(10, parseFloat((r + v + d + m + b + a + ir).toFixed(1)));
}

function ChildNewForm({ onBack, responsaveis, prelinkedResponsavelId, onSave }: {
  onBack: () => void;
  responsaveis: Responsavel[];
  prelinkedResponsavelId?: number;
  onSave: (child: Omit<Child, "id" | "position" | "totalWaitlist" | "score">, links: { rvId: number; relType: string }[]) => void;
}) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [type, setType] = useState<"creche" | "fundamental">("creche");
  const [period, setPeriod] = useState<"Integral" | "Manhã" | "Tarde">("Integral");
  const [endereco, setEndereco] = useState("");

  // Scoring criteria
  const [renda, setRenda] = useState("");
  const [vulnerabilidade, setVulnerabilidade] = useState(false);
  const [responsavelSolo, setResponsavelSolo] = useState(false);
  const [moraAluguel, setMoraAluguel] = useState(false);
  const [bolsaFamilia, setBolsaFamilia] = useState(false);
  const [bpcLoas, setBpcLoas] = useState(false);
  const [deficiencia, setDeficiencia] = useState(false);
  const [irmaoEscola, setIrmaoEscola] = useState(false);

  const score = calcScore(renda, vulnerabilidade, responsavelSolo, moraAluguel, bolsaFamilia, bpcLoas, deficiencia, irmaoEscola);

  const prelinked = prelinkedResponsavelId ? responsaveis.find((r) => r.id === prelinkedResponsavelId) : undefined;
  const [linkedRvs, setLinkedRvs] = useState<LinkedRv[]>(
    prelinked ? [{ responsavel: prelinked, relationship: "Responsável" }] : []
  );
  const [cpfInput, setCpfInput] = useState("");
  const [cpfResult, setCpfResult] = useState<Responsavel | "not-found" | null>(null);
  const [pendingRel, setPendingRel] = useState("");

  const handleSearch = () => {
    const found = responsaveis.find((r) => r.cpf === cpfInput);
    setCpfResult(found || "not-found");
  };

  const addLinked = (rv: Responsavel) => {
    if (!linkedRvs.find((l) => l.responsavel.id === rv.id)) {
      setLinkedRvs((prev) => [...prev, { responsavel: rv, relationship: pendingRel || "Responsável" }]);
    }
    setCpfInput(""); setCpfResult(null); setPendingRel("");
  };

  const removeLinked = (rvId: number) =>
    setLinkedRvs((prev) => prev.filter((l) => l.responsavel.id !== rvId));

  return (
    <>
      <BackToPortals />
      <SubHeader title="Cadastrar aluno" subtitle="Nova inscrição na lista de espera" dark onBack={onBack} />
      <ContentArea>
        <PageTitle title="Cadastrar aluno" subtitle="Nova inscrição na lista de espera" onBack={onBack} />
        <div className="max-w-md mx-auto space-y-4">
          <Card className="p-5 space-y-4">
            <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Dados da aluno</p>
            <FormField label="Nome da aluno" placeholder="Nome completo" value={name} onChange={setName} />
            <FormField label="Data de nascimento" placeholder="DD/MM/AAAA" value={dob} onChange={setDob} />
            <div>
              <p className="text-[#5e6062] text-xs font-semibold mb-2">Tipo de vaga</p>
              <div className="flex gap-2">
                {(["creche", "fundamental"] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${type === t ? "bg-[#3b5fe0] text-white" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}>
                    {t === "creche" ? "Creche" : "Fundamental"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#5e6062] text-xs font-semibold mb-2">Período solicitado</p>
              <div className="flex gap-2">
                {(["Integral", "Manhã", "Tarde"] as const).map((p) => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${period === p ? "bg-[#263238] text-white" : "bg-[#f0f4ff] text-[#5e6062] hover:bg-[#e4ecff]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <FormField label="Endereço de residência" placeholder="Rua, número, bairro" value={endereco} onChange={setEndereco}
              hint="Usado para calcular a distância até a escola solicitada." />
          </Card>

          {/* Critérios de pontuação */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Critérios de pontuação</p>
              <div className="bg-[#3b5fe0] text-white text-xs font-bold px-3 py-1.5 rounded-xl">
                Score: {score} / 10
              </div>
            </div>

            {/* Renda */}
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Renda familiar per capita</label>
              <select value={renda} onChange={(e) => setRenda(e.target.value)}
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25">
                <option value="">Selecione a faixa de renda</option>
                <option value="ate_1_4_sm">Até 1/4 do salário mínimo (máx. pontuação)</option>
                <option value="ate_1_2_sm">Entre 1/4 e 1/2 salário mínimo</option>
                <option value="ate_1_sm">Entre 1/2 e 1 salário mínimo</option>
                <option value="acima_1_sm">Acima de 1 salário mínimo</option>
              </select>
            </div>

            {/* Boolean criteria */}
            {[
              { label: "Família em situação de vulnerabilidade socioeconômica", hint: "CadÚnico, CRAS ou comprovação de vulnerabilidade", val: vulnerabilidade, set: setVulnerabilidade },
              { label: "Responsável solo (mãe ou pai solteiro)", hint: "Único responsável legal, sem cônjuge ou companheiro", val: responsavelSolo, set: setResponsavelSolo },
              { label: "aluno mora de aluguel", hint: "Família não possui imóvel próprio", val: moraAluguel, set: setMoraAluguel },
              { label: "Beneficiário do Bolsa Família", hint: "Família inscrita e ativa no programa federal", val: bolsaFamilia, set: setBolsaFamilia },
              { label: "Beneficiário do BPC/LOAS", hint: "Benefício de Prestação Continuada ativo", val: bpcLoas, set: setBpcLoas },
              { label: "aluno com deficiência ou necessidade especial", hint: "Laudo médico comprobatório", val: deficiencia, set: setDeficiencia },
              { label: "Irmão já matriculado na mesma escola", hint: "Irmão biológico ou adotivo matriculado na unidade", val: irmaoEscola, set: setIrmaoEscola },
            ].map(({ label, hint, val, set }) => (
              <div key={label} className="flex items-start gap-3 py-2 border-b border-[#f0f4ff] last:border-0">
                <button onClick={() => set(!val)}
                  className={`w-12 h-6 rounded-full transition-colors shrink-0 mt-0.5 ${val ? "bg-[#3b5fe0]" : "bg-[#e8edf8]"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${val ? "translate-x-6" : "translate-x-0"}`} />
                </button>
                <div>
                  <p className="text-[#263238] text-sm font-medium">{label}</p>
                  <p className="text-[#979799] text-xs mt-0.5">{hint}</p>
                </div>
              </div>
            ))}

            {/* Score preview bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[#5e6062] text-xs font-semibold">Pontuação estimada</p>
                <p className="text-[#3b5fe0] font-bold text-sm">{score} / 10</p>
              </div>
              <div className="h-2.5 bg-[#f0f4ff] rounded-full overflow-hidden">
                <div className="h-full bg-[#3b5fe0] rounded-full transition-all" style={{ width: `${score * 10}%` }} />
              </div>
              <p className="text-[#979799] text-xs mt-1">* Distância calculada após confirmação do endereço</p>
            </div>
          </Card>

          {/* Right: responsáveis */}
          <Card className="p-5 space-y-4">
            <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">
              Responsáveis vinculados ({linkedRvs.length})
            </p>

            {/* Linked list */}
            {linkedRvs.length > 0 && (
              <div className="space-y-2">
                {linkedRvs.map(({ responsavel: rv, relationship }) => (
                  <div key={rv.id} className="flex items-center gap-3 bg-[#f0f4ff] rounded-xl p-3">
                    <div className="w-8 h-8 bg-[#3b5fe0]/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-[#3b5fe0] font-bold text-xs">{rv.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#263238] text-sm font-medium truncate">{rv.name}</p>
                      <p className="text-[#979799] text-xs">{relationship} · {rv.cpf}</p>
                    </div>
                    <button onClick={() => removeLinked(rv.id)} className="text-[#bfc5d2] hover:text-red-400 transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* CPF search */}
            <div className="border-t border-[#f0f4ff] pt-4 space-y-3">
              <p className="text-[#5e6062] text-xs font-semibold">Buscar responsável por CPF</p>
              <div className="flex gap-2">
                <input
                  type="tel"
                  inputMode="numeric"
                  value={cpfInput}
                  onChange={(e) => { setCpfInput(formatCPF(e.target.value)); setCpfResult(null); }}
                  placeholder="000.000.000-00"
                  className="flex-1 bg-[#f0f4ff] rounded-xl px-3 py-2.5 text-[#263238] placeholder-[#bfc5d2] outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#263238] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a2428] transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden lg:inline">Buscar</span>
                </button>
              </div>

              {cpfResult === "not-found" && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-amber-700 text-xs">CPF não encontrado. Cadastre o responsável primeiro.</p>
                </div>
              )}

              {cpfResult && cpfResult !== "not-found" && !linkedRvs.find((l) => l.responsavel.id === (cpfResult as Responsavel).id) && (
                <div className="bg-white border border-[#e8edf8] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[#263238] text-sm font-semibold">{(cpfResult as Responsavel).name}</p>
                      <p className="text-[#979799] text-xs">{(cpfResult as Responsavel).cpf}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pendingRel}
                      onChange={(e) => setPendingRel(e.target.value)}
                      placeholder="Relação: Mãe, Pai, Avó..."
                      className="flex-1 bg-[#f0f4ff] rounded-xl px-3 py-2 text-[#263238] placeholder-[#bfc5d2] outline-none text-sm"
                    />
                    <button
                      onClick={() => addLinked(cpfResult as Responsavel)}
                      className="bg-[#3b5fe0] text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#2f4fc4] transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden lg:inline">Adicionar</span>
                    </button>
                  </div>
                </div>
              )}

              {cpfResult && cpfResult !== "not-found" && linkedRvs.find((l) => l.responsavel.id === (cpfResult as Responsavel).id) && (
                <p className="text-emerald-600 text-xs flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Responsável já adicionado à lista.
                </p>
              )}
            </div>
          </Card>
          <PrimaryBtn onClick={() => {
            if (!name || !dob) return;
            onSave(
              { name, dob, type, period, status: "em_espera", school: SCHOOL },
              linkedRvs.map((l) => ({ rvId: l.responsavel.id, relType: l.relationship }))
            );
          }}>
            Cadastrar na lista de espera
          </PrimaryBtn>
        </div>
      </ContentArea>
    </>
  );
}


// ==================== VAGAS SCREEN ====================

import type { School } from "../data";

function VagasScreen({ school, schoolId, log, onUpdate, onBack }: {
  school: School;
  schoolId: number;
  log: { date: string; schoolId: number; previous: number; updated: number; reason: string }[];
  onUpdate: (novas: number, motivo: string) => void;
  onBack: () => void;
}) {
  const [novas, setNovas] = useState<number>(school.vacancies);
  const [motivo, setMotivo] = useState("");
  const [motivoCustom, setMotivoCustom] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const motivoFinal = motivo === "outro" ? motivoCustom : motivo;
  const delta = novas - school.vacancies;

  const handleSubmit = () => {
    if (!motivo || novas < 0) return;
    onUpdate(novas, motivoFinal);
    setConfirmed(true);
  };

  return (
    <>
      <BackToPortals />
      <SubHeader title="Gestão de Vagas" subtitle={school.name} onBack={onBack} />
      <ContentArea>
        <PageTitle title="Gestão de Vagas" subtitle={school.name} onBack={onBack} />

        {/* Current status */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { v: school.vacancies, l: "Vagas disponíveis", c: school.vacancies === 0 ? "#ef4444" : school.vacancies < 5 ? "#f59e0b" : "#22c55e" },
            { v: school.total - school.vacancies, l: "Alunos matriculados", c: "#3b5fe0" },
            { v: school.total, l: "Capacidade total", c: "#5e6062" },
          ].map((s) => (
            <Card key={s.l} className="p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</p>
              <p className="text-[#979799] text-xs mt-1 leading-snug">{s.l}</p>
            </Card>
          ))}
        </div>

        {/* Update form */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5 text-[#3b5fe0]" />
            </div>
            <div>
              <p className="text-[#263238] font-bold">Atualizar disponibilidade de vagas</p>
              <p className="text-[#979799] text-xs">Essa atualização será refletida no Mapa de Vagas e no Painel da Prefeitura em tempo real.</p>
            </div>
          </div>

          {confirmed && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-emerald-700 text-sm font-medium">Vagas atualizadas com sucesso! Mapa e painéis foram sincronizados.</p>
            </div>
          )}

          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Nova quantidade de vagas disponíveis</label>
            <input
              type="number"
              min={0}
              max={school.total}
              value={novas}
              onChange={(e) => { setNovas(Number(e.target.value)); setConfirmed(false); }}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25"
            />
            {novas !== school.vacancies && (
              <p className={`text-xs mt-1.5 font-medium ${delta > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {delta > 0 ? `+${delta} vagas sendo adicionadas` : `${delta} vagas sendo removidas`}
              </p>
            )}
          </div>

          <div>
            <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Motivo da atualização *</label>
            <select value={motivo} onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25">
              <option value="">Selecione o motivo</option>
              <option value="Novas matrículas">Novas matrículas realizadas</option>
              <option value="Cancelamento de matrícula">Cancelamento de matrícula</option>
              <option value="Abertura de nova turma">Abertura de nova turma</option>
              <option value="Encerramento de turma">Encerramento de turma</option>
              <option value="Transferência de aluno">Transferência de aluno</option>
              <option value="Correção de dados">Correção de dados cadastrais</option>
              <option value="outro">Outro motivo</option>
            </select>
          </div>

          {motivo === "outro" && (
            <div>
              <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Descreva o motivo</label>
              <input value={motivoCustom} onChange={(e) => setMotivoCustom(e.target.value)}
                placeholder="Descreva o motivo da atualização"
                className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25" />
            </div>
          )}

          <PrimaryBtn
            onClick={handleSubmit}
            disabled={!motivo || novas < 0 || novas === school.vacancies || (motivo === "outro" && !motivoCustom.trim())}
          >
            Confirmar atualização de vagas
          </PrimaryBtn>
        </Card>

        {/* Vacancy log */}
        {log.length > 0 && (
          <Card className="p-4">
            <p className="text-[#5e6062] text-sm font-semibold mb-3">Histórico de atualizações de vagas</p>
            <div className="space-y-3">
              {log.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#f0f4ff] last:border-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    entry.updated > entry.previous ? "bg-emerald-100" : "bg-red-50"
                  }`}>
                    <ArrowUpDown className={`w-4 h-4 ${entry.updated > entry.previous ? "text-emerald-600" : "text-red-500"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${entry.updated > entry.previous ? "text-emerald-600" : "text-red-500"}`}>
                        {entry.previous} → {entry.updated} vagas
                        {entry.updated > entry.previous
                          ? ` (+${entry.updated - entry.previous})`
                          : ` (${entry.updated - entry.previous})`}
                      </p>
                    </div>
                    <p className="text-[#5e6062] text-xs mt-0.5">{entry.reason}</p>
                    <p className="text-[#bfc5d2] text-xs mt-0.5">{entry.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </ContentArea>
    </>
  );
}
