import { useState } from "react";
import { useNavigate } from "react-router";
import {
  MapPin, Baby, BookOpen, Navigation, ArrowRight,
  Users, CheckCircle, School, ChevronRight, ExternalLink,
} from "lucide-react";
import brasao from "@/imports/brasao-removebg-preview.png";
import { useSchools } from "../context/SchoolsContext";

// ==================== MINI MAP ====================

function MiniMap({ schools, onViewFull }: {
  schools: { id: number; name: string; type: string; vacancies: number; waitlist: number; mapX: number; mapY: number }[];
  onViewFull: () => void;
}) {
  const getColor = (v: number) => v === 0 ? "#ef4444" : v < 5 ? "#f59e0b" : "#22c55e";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 280, background: "linear-gradient(135deg,#f0ebe0,#ede8d6)" }}>
      {/* Streets SVG */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <line x1="0" y1="38%" x2="100%" y2="38%" stroke="#fff" strokeWidth="12" />
        <line x1="0" y1="62%" x2="100%" y2="62%" stroke="#fff" strokeWidth="8" />
        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#fff" strokeWidth="12" />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#fff" strokeWidth="8" />
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#f5f2ea" strokeWidth="4" opacity="0.8" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f5f2ea" strokeWidth="3" opacity="0.7" />
        <line x1="0" y1="76%" x2="100%" y2="76%" stroke="#f5f2ea" strokeWidth="3" opacity="0.7" />
        <line x1="22%" y1="0" x2="22%" y2="100%" stroke="#f5f2ea" strokeWidth="3" opacity="0.7" />
        <line x1="52%" y1="0" x2="52%" y2="100%" stroke="#f5f2ea" strokeWidth="3" opacity="0.7" />
        <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#f5f2ea" strokeWidth="3" opacity="0.7" />
        <rect x="4%" y="5%" width="14%" height="10%" rx="4" fill="#b8d4a0" opacity="0.5" />
        <rect x="62%" y="70%" width="14%" height="12%" rx="4" fill="#b8d4a0" opacity="0.45" />
      </svg>

      {/* School markers */}
      {schools.map((s) => (
        <div key={s.id} className="absolute" style={{ left: `${s.mapX}%`, top: `${s.mapY}%`, transform: "translate(-50%,-100%)", zIndex: 10 }}>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center"
              style={{ backgroundColor: getColor(s.vacancies) }}>
              {s.type === "creche"
                ? <Baby className="w-3.5 h-3.5 text-white" />
                : <BookOpen className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: getColor(s.vacancies) }} />
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-lg px-2 py-0.5 shadow-md whitespace-nowrap pointer-events-none">
              <p className="text-[9px] font-bold" style={{ color: getColor(s.vacancies) }}>{s.vacancies} vagas</p>
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 rounded-xl p-2 shadow-md">
        {[["#22c55e", "Com vagas"], ["#f59e0b", "Poucas vagas"], ["#ef4444", "Sem vagas"]].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            <p className="text-[9px] text-[#5e6062]">{l}</p>
          </div>
        ))}
      </div>

      {/* Ver mapa completo overlay */}
      <button
        onClick={onViewFull}
        className="absolute top-3 right-3 bg-[#3b5fe0] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg hover:bg-[#2f4fc4] transition-colors active:scale-95"
      >
        <Navigation className="w-3.5 h-3.5" /> Ver mapa completo
      </button>
    </div>
  );
}

// ==================== MAIN ====================

export default function CentralApp() {
  const navigate = useNavigate();
  const { schools } = useSchools();

  const totalVacancies = schools.reduce((a, s) => a + s.vacancies, 0);
  const totalWaitlist = schools.reduce((a, s) => a + s.waitlist, 0);
  const schoolsWithVacancies = schools.filter((s) => s.vacancies > 0).length;

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
      {/* Hero */}
      <div className="bg-[#3b5fe0]">
        <div className="max-w-3xl mx-auto px-5 py-10 lg:py-14">
          {/* Brand */}
          <div className="flex items-center gap-4 mb-6">
            <img src={brasao} alt="Brasão Caraguatatuba" className="h-14 lg:h-16 w-auto object-contain" />
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Prefeitura de Caraguatatuba</p>
              <h1 className="text-white text-2xl lg:text-3xl font-black leading-tight">
                Central de Vagas Escolares
              </h1>
              <p className="text-white/60 text-sm mt-0.5">Creches e Ensino Fundamental · {new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: totalVacancies, l: "Vagas disponíveis", c: "#22c55e", icon: CheckCircle },
              { v: schools.length, l: "Escolas municipais", c: "#7da5ff", icon: School },
              { v: totalWaitlist, l: "Em lista de espera", c: "#fbbf24", icon: Users },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-2xl p-3 text-center">
                <p className="font-black text-2xl" style={{ color: s.c }}>{s.v}</p>
                <p className="text-white/60 text-xs mt-0.5 leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        {/* Main CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/responsavel")}
            className="bg-[#3b5fe0] text-white rounded-2xl p-6 text-left hover:bg-[#2f4fc4] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97] transition-all group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="font-bold text-lg leading-tight mb-1">Acompanhar lista de espera</p>
            <p className="text-white/70 text-sm leading-snug">
              Acesse com seu CPF e senha para ver a posição do seu filho na fila e o status da solicitação.
            </p>
            <div className="flex items-center gap-2 mt-4 text-white/80 text-sm font-semibold">
              Acessar portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("/mapa")}
            className="bg-white border-2 border-[#3b5fe0]/20 text-[#263238] rounded-2xl p-6 text-left hover:border-[#3b5fe0]/60 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] transition-all group"
          >
            <div className="w-12 h-12 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-[#3b5fe0]" />
            </div>
            <p className="font-bold text-lg leading-tight mb-1 text-[#263238]">Mapa inteligente de vagas</p>
            <p className="text-[#979799] text-sm leading-snug">
              Explore as escolas do município, filtre por modalidade e período e encontre vagas próximas à sua residência.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[#3b5fe0] text-sm font-semibold">
              Ver mapa completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Mini map preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#263238] font-bold">Visão geral das vagas — Caraguatatuba</p>
            <button onClick={() => navigate("/mapa")}
              className="flex items-center gap-1 text-[#3b5fe0] text-xs font-semibold hover:text-[#2f4fc4] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Abrir mapa completo
            </button>
          </div>
          <MiniMap schools={schools} onViewFull={() => navigate("/mapa")} />
        </div>

        {/* School list preview */}
        <div>
          <p className="text-[#263238] font-bold mb-3">Escolas com vagas disponíveis</p>
          {schools.filter((s) => s.vacancies > 0).length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8edf8] p-5 text-center">
              <p className="text-[#979799] text-sm">Não há vagas disponíveis no momento.</p>
              <p className="text-[#979799] text-xs mt-1">Inscreva seu filho na lista de espera para ser notificado.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schools.filter((s) => s.vacancies > 0).slice(0, 5).map((s) => (
                <button key={s.id} onClick={() => navigate("/mapa")}
                  className="w-full bg-white rounded-2xl border border-[#e8edf8] p-4 flex items-center gap-4 text-left hover:shadow-md hover:border-[#3b5fe0]/20 transition-all group active:scale-[0.98]">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    {s.type === "creche"
                      ? <Baby className="w-5 h-5 text-emerald-600" />
                      : <BookOpen className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#263238] text-sm">{s.name}</p>
                    <p className="text-[#979799] text-xs">{s.neighborhood} · {s.type === "creche" ? "Creche" : "Fundamental"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-emerald-600 font-black text-xl leading-none">{s.vacancies}</p>
                    <p className="text-[#979799] text-xs">vagas</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#bfc5d2] group-hover:text-[#3b5fe0] transition-colors shrink-0" />
                </button>
              ))}
              {schools.filter((s) => s.vacancies > 0).length > 5 && (
                <button onClick={() => navigate("/mapa")}
                  className="w-full py-3 text-[#3b5fe0] text-sm font-semibold hover:underline transition-colors">
                  Ver todas as {schools.filter((s) => s.vacancies > 0).length} escolas com vagas no mapa →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="bg-white rounded-2xl border border-[#e8edf8] p-5">
          <p className="text-[#263238] font-bold mb-1">Como funciona a lista de espera?</p>
          <p className="text-[#979799] text-sm leading-relaxed mb-4">
            Quando não há vagas disponíveis na escola desejada, a criança é inscrita na lista de espera. A posição é calculada automaticamente com base em critérios socioeconômicos definidos pela Secretaria de Educação.
          </p>
          <button onClick={() => navigate("/responsavel")}
            className="w-full flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3 rounded-xl hover:bg-[#2f4fc4] transition-colors active:scale-95">
            <Users className="w-4 h-4" /> Consultar minha posição na fila
          </button>
        </div>

        <p className="text-center text-[#bfc5d2] text-xs pb-4">
          Prefeitura Municipal de Caraguatatuba · Sistema Integrado de Vagas Escolares (SIVE)
        </p>
      </div>
    </div>
  );
}
