import { useState } from "react";
import { Search, MapPin, X, ChevronRight, Users, School, Navigation, Info, Baby, BookOpen, ExternalLink, List, Map as MapIcon, Clock, Building2, LayoutGrid } from "lucide-react";
import { Card, VacancyBadge, TypePill, InfoBox } from "../components/Shared";
import { School as SchoolType } from "../data";
import { useNavigate } from "react-router";
import { useSchools } from "../context/SchoolsContext";
import brasao from "@/imports/brasao-removebg-preview.png";

type Filter = "all" | "creche" | "fundamental";
type PeriodFilter = "all" | "Integral" | "Manhã" | "Tarde";

function getStatusColor(vacancies: number) {
  if (vacancies === 0) return "#ef4444";
  if (vacancies < 10) return "#f59e0b";
  return "#22c55e";
}

const NEIGHBORHOODS = ["Todos os bairros", "Centro", "Indaiá", "Martim de Sá", "Porto Novo", "Capricórnio"];

// ==================== INTERACTIVE MAP ====================

function MapCanvas({
  allSchools, filtered, selectedSchool, setSelectedSchool, userPin, onLocate,
}: {
  allSchools: SchoolType[];
  filtered: SchoolType[];
  selectedSchool: SchoolType | null;
  setSelectedSchool: (s: SchoolType | null) => void;
  userPin: { x: number; y: number } | null;
  onLocate: () => void;
}) {
  return (
    <div className="relative w-full h-full min-h-[360px]" style={{ background: "linear-gradient(135deg, #f0ebe0 0%, #ede8d6 100%)" }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <rect x="4%" y="5%" width="14%" height="10%" rx="4" fill="#b8d4a0" opacity="0.55" />
        <rect x="62%" y="70%" width="16%" height="14%" rx="4" fill="#b8d4a0" opacity="0.5" />
        <rect x="26%" y="80%" width="12%" height="12%" rx="4" fill="#b8d4a0" opacity="0.45" />
        <path d="M 0 88% Q 30 84% 60 89% T 100% 86%" stroke="#93c5fd" strokeWidth="10" fill="none" opacity="0.45" />
        <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#ffffff" strokeWidth="14" />
        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#ffffff" strokeWidth="10" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#ffffff" strokeWidth="14" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#ffffff" strokeWidth="10" />
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#f5f2ea" strokeWidth="5" opacity="0.9" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="0" y1="74%" x2="100%" y2="74%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="22%" y1="0" x2="22%" y2="100%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="52%" y1="0" x2="52%" y2="100%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="22%" y1="38%" x2="40%" y2="20%" stroke="#f5f2ea" strokeWidth="4" opacity="0.7" />
        <line x1="65%" y1="38%" x2="80%" y2="60%" stroke="#f5f2ea" strokeWidth="4" opacity="0.7" />
        <rect x="23%" y="21%" width="16%" height="16%" rx="3" fill="#e8e3d4" opacity="0.5" />
        <rect x="41%" y="21%" width="22%" height="16%" rx="3" fill="#e8e3d4" opacity="0.4" />
        <rect x="23%" y="39%" width="16%" height="20%" rx="3" fill="#e8e3d4" opacity="0.4" />
        <rect x="41%" y="61%" width="22%" height="12%" rx="3" fill="#e8e3d4" opacity="0.4" />
        <rect x="0" y="39%" width="20%" height="20%" rx="3" fill="#e8e3d4" opacity="0.35" />
        <rect x="66%" y="21%" width="12%" height="16%" rx="3" fill="#e8e3d4" opacity="0.4" />
        <text x="42%" y="36%" fontSize="7" fill="#b0a898" fontFamily="sans-serif">Av. Educação</text>
        <text x="5%" y="56%" fontSize="6" fill="#b0a898" fontFamily="sans-serif">R. da Alegria</text>
        <text x="68%" y="56%" fontSize="6" fill="#b0a898" fontFamily="sans-serif">R. Girassol</text>
      </svg>

      {/* School markers */}
      {(allSchools ?? []).map((school) => {
        const isFiltered = !filtered.find((s) => s.id === school.id);
        const isSelected = selectedSchool?.id === school.id;
        const color = getStatusColor(school.vacancies);
        if (isFiltered) return null;
        return (
          <button
            key={school.id}
            onClick={() => setSelectedSchool(isSelected ? null : school)}
            className="absolute transition-transform"
            style={{ left: `${school.mapX}%`, top: `${school.mapY}%`, transform: "translate(-50%, -100%)", zIndex: isSelected ? 20 : 10 }}
          >
            <div className={`${isSelected ? "scale-125" : "scale-100"} transition-transform flex flex-col items-center`}>
              <div className="w-9 h-9 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center" style={{ backgroundColor: color }}>
                {school.type === "creche" ? <Baby className="w-4 h-4 text-white" /> : <BookOpen className="w-4 h-4 text-white" />}
              </div>
              <div className="w-2 h-2 rounded-full mt-0.5 shadow" style={{ backgroundColor: color }} />
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-md whitespace-nowrap text-center pointer-events-none">
                <p className="text-[#263238] text-[10px] font-semibold">{school.name.split(" ").slice(-2).join(" ")}</p>
                <p className="text-[10px] font-bold" style={{ color }}>{school.vacancies} vagas</p>
                <p className="text-[#979799] text-[9px]">{school.waitlist} na espera</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* User pin */}
      {userPin && (
        <div className="absolute z-30" style={{ left: `${userPin.x}%`, top: `${userPin.y}%`, transform: "translate(-50%, -50%)" }}>
          <div className="w-5 h-5 bg-[#3b5fe0] rounded-full border-2 border-white shadow-lg" />
          <div className="w-12 h-12 bg-[#3b5fe0]/20 rounded-full absolute inset-0 -translate-x-3.5 -translate-y-3.5 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl p-2.5 shadow-md">
        {[["#22c55e", "Com vagas"], ["#f59e0b", "Poucas vagas"], ["#ef4444", "Sem vagas"]].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5 mb-1 last:mb-0">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            <p className="text-[9px] text-[#5e6062]">{l}</p>
          </div>
        ))}
      </div>

      {/* Locate button */}
      <button
        onClick={onLocate}
        className="absolute top-3 right-3 bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-1.5 active:scale-95 transition-transform hover:shadow-lg"
      >
        <Navigation className="w-4 h-4 text-[#3b5fe0]" />
        <span className="text-xs font-semibold text-[#263238]">Localizar</span>
      </button>
    </div>
  );
}

// ==================== SCHOOL DETAIL PANEL ====================

function SchoolDetail({ school, onClose, onGoToWaitlist }: {
  school: SchoolType; onClose: () => void; onGoToWaitlist: () => void;
}) {
  return (
    <div className="bg-white border-t lg:border-t-0 lg:border-b border-[#e8edf8] px-4 py-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <TypePill type={school.type} />
          <p className="font-bold text-[#263238] mt-1">{school.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#979799]" />
            <p className="text-[#979799] text-xs">{school.address} · {school.neighborhood}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <VacancyBadge vacancies={school.vacancies} />
          <button onClick={onClose} className="text-[#979799] hover:text-[#5e6062] mt-1"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: school.waitlist, l: "na espera", c: "#263238", Icon: Users },
          { v: school.total, l: "capacidade", c: "#5e6062", Icon: Building2 },
          { v: school.rooms, l: "salas", c: "#979799", Icon: LayoutGrid },
        ].map((s) => (
          <div key={s.l} className="bg-[#f0f4ff] rounded-xl py-2.5 text-center flex flex-col items-center gap-0.5">
            <s.Icon className="w-3.5 h-3.5" style={{ color: s.c }} />
            <p className="font-bold text-sm" style={{ color: s.c }}>{s.v}</p>
            <p className="text-[#979799] text-xs">{s.l}</p>
          </div>
        ))}
      </div>
      {school.periods && (
        <div className="flex gap-1.5 flex-wrap">
          {school.periods.map((p) => (
            <span key={p} className="text-xs bg-[#f0f4ff] text-[#5e6062] px-2 py-1 rounded-full font-medium">{p}</span>
          ))}
        </div>
      )}
      <button
        onClick={onGoToWaitlist}
        className="w-full bg-[#3b5fe0] text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-[#2f4fc4] active:scale-95 transition-all"
      >
        <ExternalLink className="w-4 h-4" /> Consultar lista de espera
      </button>
    </div>
  );
}

// ==================== MAIN ====================

export default function MapaApp() {
  const [filter, setFilter] = useState<Filter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState(NEIGHBORHOODS[0]);
  const [userPin, setUserPin] = useState<{ x: number; y: number } | null>(null);
  const [mobileView, setMobileView] = useState<"mapa" | "lista">("mapa");
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const { schools } = useSchools();

  const filtered = schools.filter((s) => {
    const matchFilter = filter === "all" || s.type === filter;
    const matchPeriod = periodFilter === "all" || s.periods.includes(periodFilter as "Integral" | "Manhã" | "Tarde");
    const matchNeighborhood = neighborhood === NEIGHBORHOODS[0] || s.neighborhood === neighborhood;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchPeriod && matchNeighborhood && matchSearch;
  });

  const simulateLocation = () => {
    setUserPin({ x: 45, y: 52 });
    const nearest = schools.reduce((prev, curr) => {
      const pd = Math.hypot(prev.mapX - 45, prev.mapY - 52);
      const cd = Math.hypot(curr.mapX - 45, curr.mapY - 52);
      return cd < pd ? curr : prev;
    });
    setSelectedSchool(nearest);
  };

  // ---- SHARED CONTROLS ----
  const Controls = () => (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#979799]" />
        <input
          type="text"
          placeholder="Buscar escola ou endereço..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white rounded-xl pl-10 pr-4 py-3 text-[#263238] placeholder-[#979799] outline-none text-sm border border-[#e8edf8] focus:ring-2 focus:ring-[#3b5fe0]/20"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#979799]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type filter */}
      <div>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1.5">Modalidade</p>
        <div className="flex gap-1.5">
          {([
            { k: "all", l: "Todas" },
            { k: "creche", l: "Creche" },
            { k: "fundamental", l: "Fundamental" },
          ] as { k: Filter; l: string }[]).map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f.k
                  ? "bg-white text-[#3b5fe0] shadow-sm scale-[1.02]"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Period filter */}
      <div>
        <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1.5">Período</p>
        <div className="flex gap-1.5">
          {([
            { k: "all", l: "Todos" },
            { k: "Integral", l: "Integral" },
            { k: "Manhã", l: "Manhã" },
            { k: "Tarde", l: "Tarde" },
          ] as { k: PeriodFilter; l: string }[]).map((f) => (
            <button key={f.k} onClick={() => setPeriodFilter(f.k)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                periodFilter === f.k
                  ? "bg-white text-[#3b5fe0] shadow-sm scale-[1.02]"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood */}
      <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
        className="w-full bg-white rounded-xl px-3 py-2.5 text-[#263238] text-sm outline-none border border-[#e8edf8]">
        {NEIGHBORHOODS.map((n) => <option key={n}>{n}</option>)}
      </select>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl py-2.5 text-center bg-[#ffffff]">
          <p className="text-xl font-bold text-[#0ea73f]">{filtered.reduce((a, s) => a + s.vacancies, 0)}</p>
          <p className="text-[#979799] text-xs mt-0.5">vagas disponíveis</p>
        </div>
        <div className="bg-[#f0f4ff] rounded-xl py-2.5 text-center">
          <p className="text-[#263238] text-xl font-bold">{filtered.reduce((a, s) => a + s.waitlist, 0)}</p>
          <p className="text-[#979799] text-xs mt-0.5">em lista de espera</p>
        </div>
      </div>
    </div>
  );

  // ---- SCHOOL LIST ----
  const SchoolList = () => (
    <div className="space-y-3 overflow-y-auto">
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <School className="w-8 h-8 text-[#bfc5d2] mx-auto mb-2" />
          <p className="text-[#979799] text-sm">Nenhuma escola encontrada.</p>
          <button onClick={() => { setSearchQuery(""); setFilter("all"); setNeighborhood(NEIGHBORHOODS[0]); }}
            className="text-[#3b5fe0] text-sm font-semibold mt-1">Limpar filtros</button>
        </div>
      )}
      {filtered.map((school) => (
        <div key={school.id}
          onClick={() => setSelectedSchool(selectedSchool?.id === school.id ? null : school)}
          className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedSchool?.id === school.id ? "border-[#3b5fe0] shadow-md" : "border-[#e8edf8]"}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <TypePill type={school.type} />
                <span className="text-[#979799] text-xs">{school.neighborhood}</span>
              </div>
              <p className="font-bold text-[#263238] text-sm">{school.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#979799]" />
                <p className="text-[#979799] text-xs">{school.address}</p>
              </div>
            </div>
            <VacancyBadge vacancies={school.vacancies} />
          </div>
          <div className="mt-3 pt-3 border-t border-[#f0f4ff] grid grid-cols-3 gap-2">
            {[
              { v: school.waitlist, l: "na espera", c: "#263238", Icon: Users },
              { v: school.total, l: "capacidade", c: "#5e6062", Icon: Building2 },
              { v: school.rooms, l: "salas", c: "#979799", Icon: LayoutGrid },
            ].map((s) => (
              <div key={s.l} className="bg-[#f0f4ff] rounded-xl py-2 text-center flex flex-col items-center gap-0.5">
                <s.Icon className="w-3 h-3" style={{ color: s.c }} />
                <p className="font-bold text-sm" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[#979799] text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ---- INFO CONTENT ----
  const InfoContent = () => (
    <div className="space-y-4">
      <Card className="p-5">
        <h3 className="font-bold text-[#263238] mb-2">Sobre a lista de espera</h3>
        <p className="text-[#5e6062] text-sm leading-relaxed">
          Quando não há vagas, sua inscrição entra na lista de espera. A posição é calculada automaticamente com critérios socioeconômicos e de localização definidos pela SEDUC.
        </p>
      </Card>
      <Card className="p-5">
        <h3 className="font-bold text-[#263238] mb-4">Critérios de classificação</h3>
        <div className="space-y-3">
          {[
            { title: "Renda familiar", weight: "40%", desc: "Famílias de menor renda têm maior prioridade." },
            { title: "Distância", weight: "30%", desc: "Crianças que moram mais perto têm prioridade." },
            { title: "Mãe trabalhadora", weight: "20%", desc: "Mães que trabalham fora recebem pontuação adicional." },
            { title: "Irmão na escola", weight: "10%", desc: "Famílias com irmãos matriculados têm prioridade." },
          ].map((c) => (
            <div key={c.title} className="flex gap-3">
              <div className="w-12 h-7 bg-[#3b5fe0]/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#3b5fe0] text-xs font-bold">{c.weight}</span>
              </div>
              <div>
                <p className="font-semibold text-[#263238] text-sm">{c.title}</p>
                <p className="text-[#979799] text-xs mt-0.5">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <InfoBox color="blue">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
          <p className="text-sm">Em caso de empate, a criança que mora mais próximo tem prioridade (critério de desempate).</p>
        </div>
      </InfoBox>
      <button onClick={() => navigate("/responsavel")}
        className="w-full bg-[#3b5fe0] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2f4fc4] active:scale-95 transition-all">
        <ExternalLink className="w-5 h-5" /> Consultar posição do meu filho
      </button>
    </div>
  );

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen font-[Inter,sans-serif] bg-[#f0f4ff]">
      {/* ---- DESKTOP LAYOUT ---- */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        {/* Left panel */}
        <aside className="w-80 xl:w-96 bg-white border-r border-[#e8edf8] flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#3b5fe0] px-5 py-5 shrink-0">
            {/* Desktop header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                {/* Prefeitura identity */}
                <div className="flex items-center gap-2.5 mb-3">
                  <img src={brasao} alt="Brasão Caraguatatuba" className="h-10 w-auto object-contain shrink-0" />
                  <div>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Prefeitura Municipal</p>
                    <p className="text-white text-sm font-bold leading-tight">Caraguatatuba — SP</p>
                  </div>
                </div>
                {/* Main title */}
                <h1 className="text-white text-2xl font-black leading-tight tracking-tight">
                  Mapa de Vagas Escolares
                </h1>
                <p className="text-white/55 text-xs mt-1">Disponibilidade em tempo real · {new Date().toLocaleDateString("pt-BR")}</p>
              </div>
              <button onClick={() => navigate("/central")}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0 mt-1">
                ← Central de Vagas
              </button>
            </div>
            <Controls />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e8edf8] shrink-0">
            {[
              { k: "lista", l: "Lista de Escolas", icon: List },
              { k: "info", l: "Sobre o sistema", icon: Info },
            ].map((t) => (
              <button key={t.k}
                onClick={() => setShowInfo(t.k === "info")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-b-2 transition-colors ${
                  (t.k === "lista" && !showInfo) || (t.k === "info" && showInfo)
                    ? "border-[#3b5fe0] text-[#3b5fe0]"
                    : "border-transparent text-[#979799]"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />{t.l}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!showInfo ? (
              <>
                {selectedSchool && (
                  <div className="mb-4">
                    <SchoolDetail
                      school={selectedSchool}
                      onClose={() => setSelectedSchool(null)}
                      onGoToWaitlist={() => navigate("/responsavel")}
                    />
                  </div>
                )}
                <SchoolList />
              </>
            ) : (
              <InfoContent />
            )}
          </div>
        </aside>

        {/* Right: map (full height) */}
        <div className="flex-1 relative overflow-hidden">
          <MapCanvas
            allSchools={schools}
            filtered={filtered}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
            userPin={userPin}
            onLocate={simulateLocation}
          />
          {selectedSchool && (
            <div className="absolute bottom-0 left-0 right-0">
              <SchoolDetail
                school={selectedSchool}
                onClose={() => setSelectedSchool(null)}
                onGoToWaitlist={() => navigate("/responsavel")}
              />
            </div>
          )}
        </div>
      </div>

      {/* ---- MOBILE LAYOUT ---- */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Mobile header */}
        <div className="bg-[#3b5fe0] px-4 pt-12 pb-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <img src={brasao} alt="Brasão" className="h-10 w-auto object-contain shrink-0 mt-0.5" />
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5">Prefeitura de Caraguatatuba</p>
                <h1 className="text-white text-lg font-black leading-tight">Mapa de Vagas Escolares</h1>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button onClick={() => navigate("/central")}
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors">
                ← Central
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input type="text" placeholder="Buscar escola..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/55 outline-none text-sm" />
          </div>

          {/* View + filter */}
          <div className="flex gap-2">
            <button onClick={() => setMobileView("mapa")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${mobileView === "mapa" ? "bg-white text-[#3b5fe0]" : "bg-white/15 text-white"}`}>
              <MapIcon className="w-3.5 h-3.5" /> Mapa
            </button>
            <button onClick={() => setMobileView("lista")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${mobileView === "lista" ? "bg-white text-[#3b5fe0]" : "bg-white/15 text-white"}`}>
              <List className="w-3.5 h-3.5" /> Lista
            </button>
            <div className="flex gap-1 ml-auto">
              {([["all", "Todas"], ["creche", "Creche"], ["fundamental", "Fund."]] as [Filter, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === k
                      ? "bg-white text-[#3b5fe0] shadow-sm"
                      : "bg-white/15 text-white/75 hover:bg-white/25"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile map view */}
        {mobileView === "mapa" && (
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <div className="flex-1 relative overflow-hidden">
              <MapCanvas
                allSchools={schools}
                filtered={filtered}
                selectedSchool={selectedSchool}
                setSelectedSchool={setSelectedSchool}
                userPin={userPin}
                onLocate={simulateLocation}
              />
            </div>
            {selectedSchool ? (
              <SchoolDetail school={selectedSchool} onClose={() => setSelectedSchool(null)} onGoToWaitlist={() => navigate("/responsavel")} />
            ) : (
              <div className="bg-white border-t border-[#e8edf8] px-4 py-3 flex gap-3">
                <div className="flex-1 bg-[#f0f4ff] rounded-xl py-2.5 text-center">
                  <p className="text-[#3b5fe0] text-lg font-bold">{filtered.reduce((a, s) => a + s.vacancies, 0)}</p>
                  <p className="text-[#979799] text-xs">vagas</p>
                </div>
                <div className="flex-1 bg-[#f0f4ff] rounded-xl py-2.5 text-center">
                  <p className="text-[#263238] text-lg font-bold">{filtered.reduce((a, s) => a + s.waitlist, 0)}</p>
                  <p className="text-[#979799] text-xs">em espera</p>
                </div>
                <div className="flex-1 bg-[#f0f4ff] rounded-xl py-2.5 text-center">
                  <p className="text-[#5e6062] text-lg font-bold">{filtered.length}</p>
                  <p className="text-[#979799] text-xs">escolas</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile list view */}
        {mobileView === "lista" && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <SchoolList />
            <div className="space-y-3 pt-2 border-t border-[#e8edf8]">
              <p className="text-[#979799] text-xs font-bold uppercase tracking-wider">Sobre o sistema</p>
              <InfoContent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
