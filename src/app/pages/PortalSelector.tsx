import { useNavigate } from "react-router";
import { BarChart3, Users, Building2, MapPin, ArrowRight, LogOut, Globe } from "lucide-react";
import siveLogo from "@/imports/SIVE_teste__6_-removebg-preview-2.png";
import brasao from "@/imports/brasao-removebg-preview.png";

const portals = [
  {
    path: "/prefeitura",
    icon: BarChart3,
    title: "Painel da Prefeitura",
    desc: "Indicadores estratégicos, demanda, bairros, histórico e exportação de relatórios",
    tag: "Gestão",
    tagColor: "bg-[#3b5fe0]/10 text-[#3b5fe0]",
  },
  {
    path: "/escola",
    icon: Building2,
    title: "Painel da Escola",
    desc: "Gestão da lista de espera, cadastro de alunos e responsáveis, chamada de vagas",
    tag: "Escolas",
    tagColor: "bg-[#7da5ff]/20 text-[#3b5fe0]",
  },
  {
    path: "/responsavel",
    icon: Users,
    title: "Portal dos Responsáveis",
    desc: "Consulta autenticada da posição na fila, período, histórico e status da solicitação",
    tag: "Público",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    path: "/mapa",
    icon: MapPin,
    title: "Mapa Inteligente de Vagas",
    desc: "Visualização pública das vagas por escola, modalidade, período e região",
    tag: "Público",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    path: "/central",
    icon: Globe,
    title: "Central de Vagas Escolares",
    desc: "Site público com mapa resumido, vagas disponíveis e acesso ao portal dos responsáveis",
    tag: "Site Público",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function PortalSelector() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
      {/* Hero */}
      <div className="bg-[#3b5fe0]">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 pt-10 pb-10 lg:pt-14 lg:pb-12">
          <div className="flex items-center justify-between mb-6">
            {/* Brasão + nome */}
            <div className="flex items-center gap-5">
              <img src={brasao} alt="Brasão Caraguatatuba" className="h-16 lg:h-20 w-auto object-contain drop-shadow-lg" />
              <div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-0.5">Prefeitura Municipal</p>
                <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight">Caraguatatuba</h1>
                <p className="text-white/60 text-sm">São Paulo — Brasil</p>
              </div>
            </div>

            {/* Logo SIVE + Sair empilhados */}
            <div className="hidden lg:flex flex-col items-center gap-3">
              <img src={siveLogo} alt="SIVE" className="h-24 w-auto object-contain opacity-90 mx-[8px] my-[0px]" />
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white text-sm font-semibold border border-white/40 rounded-xl px-4 py-2 hover:bg-white/10 transition-colors w-full justify-center"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>

            {/* Mobile: só botão Sair */}
            <button onClick={() => navigate("/")}
              className="lg:hidden flex items-center gap-1.5 border border-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>

          <p className="text-white/65 text-sm leading-relaxed max-w-xl">
            Selecione o módulo desejado. Todos os acessos são autenticados e os dados são protegidos pela LGPD.
          </p>
        </div>
      </div>

      {/* Portal cards */}
      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8">
        <p className="text-[#979799] text-xs font-bold uppercase tracking-widest mb-5">Selecione o módulo de acesso</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portals.map((p) => (
            <button
              key={p.path}
              onClick={() => navigate(p.path)}
              className="bg-white rounded-2xl p-6 flex items-start gap-5 border border-[#e8edf8] text-left hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all group"
            >
              <div className="w-14 h-14 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <p.icon className="w-7 h-7 text-[#3b5fe0]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#263238] text-lg">{p.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${p.tagColor}`}>{p.tag}</span>
                </div>
                <p className="text-[#979799] text-sm leading-snug">{p.desc}</p>
              </div>
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#f0f4ff] group-hover:bg-[#3b5fe0] transition-colors">
                  <ArrowRight className="w-4 h-4 text-[#bfc5d2] group-hover:text-white transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-2xl border border-[#e8edf8] p-5 lg:flex lg:items-center lg:gap-10">
          <div className="flex-1">
            <p className="font-semibold text-[#263238] text-sm mb-1">SIVE — {new Date().toLocaleDateString("pt-BR")}</p>
            <p className="text-[#979799] text-sm leading-relaxed">
              Sistema Integrado de Vagas Escolares. Plataforma white-label para gestão municipal de vagas e listas de espera.
            </p>
          </div>
          <div className="flex gap-8 mt-4 lg:mt-0 shrink-0">
            {[
              { v: "312", l: "Em lista de espera", c: "#3b5fe0" },
              { v: "103", l: "Vagas disponíveis", c: "#22c55e" },
              { v: "8", l: "Escolas", c: "#5e6062" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</p>
                <p className="text-[#979799] text-xs mt-0.5 max-w-[80px] leading-snug">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[#bfc5d2] text-xs mt-6">
          Dados protegidos pela LGPD · Sistema white-label SIVE
        </p>
      </div>
    </div>
  );
}
