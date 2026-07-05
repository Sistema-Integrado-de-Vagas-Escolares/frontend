import { useState } from "react";
import {
  Baby, BookOpen, Star, Clock, Info, Users, AlertCircle,
  ArrowLeft, LogOut, FileText, Bell, CheckCircle,
} from "lucide-react";
import {
  ContentArea, BackToPortals, Card, PrimaryBtn, FormField, ScoreBar,
} from "../components/Shared";
import { childCriteria, formatCPF, weightedScore, STATUS_LABEL } from "../data";
import brasao from "@/imports/brasao-removebg-preview.png";
import { useNavigate } from "react-router";

type Screen = "login" | "home" | "child-detail";

const mockChildren = [
  {
    id: 1, name: "Lucas Oliveira", age: "2 anos",
    school: "EMEI Jardim das Flores", type: "creche" as const,
    period: "Integral" as const,
    position: 12, totalWaitlist: 47,
    status: "em_espera" as const,
    before: { position: 11, reason: "Maior pontuação em renda familiar (critério principal)" },
    after: { position: 13, reason: "Menor pontuação de distância (critério de desempate)" },
    updatedAt: "03/07/2026",
    criteria: childCriteria,
    history: [
      { date: "03/07/2026", event: "Posição atualizada: #12", type: "info" },
      { date: "15/06/2026", event: "Inscrição confirmada na lista de espera", type: "success" },
      { date: "10/06/2026", event: "Cadastro realizado pela escola", type: "info" },
    ],
  },
  {
    id: 2, name: "Ana Oliveira", age: "6 anos",
    school: "EMEF Paulo Freire", type: "fundamental" as const,
    period: "Manhã" as const,
    position: 5, totalWaitlist: 23,
    status: "chamado" as const,
    before: { position: 4, reason: "Mora mais próximo da escola — critério de desempate" },
    after: { position: 6, reason: "Menor pontuação ponderada total" },
    updatedAt: "03/07/2026",
    criteria: [
      { name: "Renda familiar", score: 9.2, weight: 40, description: "Até 1 salário mínimo per capita" },
      { name: "Distância da residência", score: 9.0, weight: 30, description: "0,8 km da escola" },
      { name: "Mãe trabalhadora", score: 10, weight: 20, description: "Confirmado" },
      { name: "Irmão na escola", score: 10, weight: 10, description: "Lucas na mesma rede" },
    ],
    history: [
      { date: "03/07/2026", event: "Vaga disponível! Responsável chamado para confirmação.", type: "alert" },
      { date: "20/06/2026", event: "Posição atualizada: #5", type: "info" },
      { date: "15/06/2026", event: "Inscrição confirmada na lista de espera", type: "success" },
    ],
  },
];

const DOCS = [
  "RG ou certidão de nascimento da criança",
  "CPF do responsável e da criança",
  "Comprovante de residência recente",
  "Cartão de vacinação atualizado",
  "Laudo médico (se necessário para vaga especial)",
];

export default function ResponsavelApp() {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [screen, setScreen] = useState<Screen>("login");
  const [cpf, setCpf] = useState("");
  const [selChild, setSelChild] = useState<typeof mockChildren[0] | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (cpf === "123.456.789-00" && password === "Resp@2026") {
      setLoginError(false);
      setScreen("home");
      setPassword("");
      setCpf("");
    } else {
      setLoginError(true);
    }
  };


  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif] lg:flex">
        {/* Desktop branding */}
        <div className="hidden lg:flex lg:flex-col lg:w-96 xl:w-[440px] bg-[#3b5fe0] p-12 shrink-0">
          <div className="flex items-center gap-4 mb-10">
            <img src={brasao} alt="Brasão" className="h-14 w-auto object-contain" />
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Prefeitura Municipal</p>
              <p className="text-white font-bold text-lg leading-tight">Caraguatatuba</p>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-white text-3xl font-bold leading-tight mb-4">Portal dos Responsáveis</h1>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Acompanhe a posição na fila de espera, o período solicitado, o histórico de movimentações e o status da solicitação.
            </p>
            <div className="space-y-3">
              {["Posição atual na lista de espera", "Histórico de movimentações", "Status em tempo real", "Notificações sobre a fila", "Documentação necessária"].map((txt) => (
                <div key={txt} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-white/60 shrink-0" />
                  <p className="text-white/80 text-sm">{txt}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-white/30 text-xs">Portal público · Dados protegidos pela LGPD</p>
            <button onClick={() => navigate("/central")}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
              ← Central de Vagas
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 bg-[#f0f4ff] flex flex-col">
          <div className="bg-[#3b5fe0] px-5 pt-12 pb-8 lg:hidden">
            <div className="flex items-center justify-between mb-4">
              <BackToPortals alwaysShow />
              <button onClick={() => navigate("/central")}
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors">
                ← Central de Vagas
              </button>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img src={brasao} alt="" className="h-10 w-auto object-contain" />
              <p className="text-white font-bold">Caraguatatuba</p>
            </div>
            <h2 className="text-white text-xl font-bold">Portal dos Responsáveis</h2>
          </div>

          <div className="flex-1 flex items-start justify-center">
            <div className="w-full max-w-md px-5 py-8 lg:px-8 lg:py-16">
              <div className="hidden lg:block mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => navigate("/central")} className="flex items-center gap-1.5 text-[#979799] text-xs hover:text-[#5e6062] transition-colors">
                    ← Central de Vagas
                  </button>
                </div>
                <h2 className="text-[#263238] text-3xl font-bold">Bem-vindo</h2>
                <p className="text-[#979799] text-sm mt-1">Acesse com CPF e senha fornecidos pela escola</p>
              </div>

              <div className="bg-white rounded-3xl p-6 space-y-4 shadow-sm border border-[#e8edf8]">
                <FormField label="CPF do Responsável" placeholder="000.000.000-00" type="tel" value={cpf} onChange={(v) => setCpf(formatCPF(v))} />
                <FormField label="Senha" placeholder="••••••••" type="password" value={password} onChange={(password) => setPassword(password)} />
                {loginError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-red-600 text-xs">Credenciais inválidas. Verifique e-mail e senha.</p>
                  </div>
                )}
                <PrimaryBtn onClick={handleLogin}>Entrar</PrimaryBtn>
                <p className="text-center text-[#979799] text-sm">
                  Esqueceu a senha?{" "}
                  <span className="text-[#3b5fe0] font-semibold cursor-pointer hover:underline">Recuperar acesso</span>
                </p>
              </div>

              <div className="mt-4 bg-[#7da5ff]/15 rounded-2xl p-4 flex gap-3">
                <Info className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
                <p className="text-[#5e6062] text-xs leading-relaxed">
                  Dados protegidos pela LGPD. O acesso é individual e restrito ao responsável cadastrado pela escola.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- HOME ----
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
        <BackToPortals />
        <div className="bg-[#3b5fe0] px-5 pt-4 pb-6 lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={brasao} alt="" className="h-9 w-auto object-contain" />
              <div>
                <p className="text-white/50 text-xs">Portal dos Responsáveis</p>
                <h2 className="text-white font-bold text-sm">Maria Oliveira</h2>
              </div>
            </div>
            <button onClick={() => setScreen("login")} className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="bg-white/15 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/60" />
            <p className="text-white/65 text-xs">Atualizado em 03/07/2026 às 14:32</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="hidden lg:flex items-center justify-between px-8 pt-8 pb-4">
            <div>
              <h2 className="text-[#263238] text-2xl font-bold">Olá, Maria Oliveira</h2>
              <p className="text-[#979799] text-sm mt-0.5">CPF: 123.456.789-00 · Atualizado em 03/07/2026</p>
            </div>
            <button onClick={() => setScreen("login")} className="flex items-center gap-2 text-[#979799] text-sm border border-[#e8edf8] rounded-xl px-4 py-2.5 bg-white hover:shadow-sm transition-all">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>

          <ContentArea>
            <p className="text-[#979799] text-xs font-bold uppercase tracking-wider">Solicitações na lista de espera</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mockChildren.map((child) => {
                const pct = Math.round(((child.totalWaitlist - child.position) / child.totalWaitlist) * 100);
                const st = STATUS_LABEL[child.status];
                return (
                  <button key={child.id} onClick={() => { setSelChild(child); setScreen("child-detail"); }}
                    className="bg-white rounded-2xl p-5 flex items-start gap-4 border border-[#e8edf8] text-left hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] transition-all">
                    <div className="w-12 h-12 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-[#3b5fe0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#263238]">{child.name}</p>
                      <p className="text-[#979799] text-xs mt-0.5">{child.age} · {child.type === "creche" ? "Creche" : "Fundamental"} · {child.period}</p>
                      <p className="text-[#5e6062] text-xs mt-0.5 truncate">{child.school}</p>

                      <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${st.bg} ${st.color}`}>{st.label}</span>
                        {child.status === "em_espera" && (
                          <span className="bg-[#3b5fe0] text-white text-xs font-bold px-2.5 py-1 rounded-xl">#{child.position}º na fila</span>
                        )}
                      </div>

                      {child.status === "em_espera" && (
                        <>
                          <div className="mt-2.5 h-1.5 bg-[#f0f4ff] rounded-full overflow-hidden">
                            <div className="h-full bg-[#3b5fe0] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[#979799] text-xs mt-1">{pct}% das crianças já atendidas</p>
                        </>
                      )}

                      {child.status === "chamado" && (
                        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2">
                          <p className="text-amber-700 text-xs font-semibold">⚠ Vaga disponível! Entre em contato com a escola.</p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Bell className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                Quando sua posição mudar ou uma vaga for disponibilizada, você receberá uma notificação. Mantenha seus dados de contato atualizados junto à escola.
              </p>
            </div>
          </ContentArea>
        </div>
      </div>
    );
  }

  // ---- CHILD DETAIL ----
  if (screen === "child-detail" && selChild) {
    const child = selChild;
    const score = weightedScore(child.criteria);
    const pct = Math.round(((child.totalWaitlist - child.position) / child.totalWaitlist) * 100);
    const st = STATUS_LABEL[child.status];

    return (
      <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
        <BackToPortals />
        <div className="bg-[#3b5fe0] px-5 pt-4 pb-6 lg:hidden">
          <button onClick={() => setScreen("home")} className="mb-4 flex items-center gap-1.5 text-white/60">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm">Meus filhos</span>
          </button>
          <h2 className="text-white text-xl font-bold">{child.name}</h2>
          <p className="text-white/60 text-sm">{child.age} · {child.type === "creche" ? "Creche" : "Fundamental"} · {child.period}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="hidden lg:block px-8 pt-8 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setScreen("home")} className="text-[#979799] text-sm hover:text-[#5e6062] flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Meus filhos
              </button>
              <span className="text-[#bfc5d2]">/</span>
              <p className="text-[#263238] font-semibold">{child.name}</p>
            </div>
          </div>

          <ContentArea>
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start space-y-4 lg:space-y-0">
              {/* Left col */}
              <div className="space-y-4">
                {/* Status + position */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Situação</p>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl ${st.bg} ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#979799]">Escola solicitada</span>
                      <span className="text-[#263238] font-medium text-right max-w-[140px]">{child.school}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#979799]">Modalidade</span>
                      <span className="text-[#263238] font-medium">{child.type === "creche" ? "Creche" : "Fundamental"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#979799]">Período</span>
                      <span className="text-[#3b5fe0] font-semibold">{child.period}</span>
                    </div>
                  </div>
                </Card>

                {child.status === "em_espera" && (
                  <div className="bg-[#3b5fe0] rounded-2xl p-5 text-center">
                    <p className="text-white/65 text-sm mb-1">Posição na fila</p>
                    <p className="text-white font-black leading-none" style={{ fontSize: 64 }}>#{child.position}</p>
                    <p className="text-white/55 text-xs mt-2">{child.totalWaitlist} na lista de espera</p>
                    <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-white/45 text-xs mt-1.5">{pct}% já atendidas</p>
                  </div>
                )}

                {child.status === "chamado" && (
                  <Card className="p-4 border-amber-200 bg-amber-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="w-5 h-5 text-amber-500" />
                      <p className="text-amber-700 font-semibold text-sm">Vaga disponível!</p>
                    </div>
                    <p className="text-amber-600 text-xs leading-relaxed">
                      Entre em contato com a escola imediatamente para confirmar interesse na vaga. Prazo de confirmação: 5 dias úteis.
                    </p>
                  </Card>
                )}

                {/* Pontuação */}
                <Card className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#3b5fe0]" />
                  </div>
                  <div>
                    <p className="text-[#979799] text-xs">Pontuação ponderada</p>
                    <p className="text-[#263238] text-2xl font-bold">{score} <span className="text-sm font-normal text-[#979799]">/ 10</span></p>
                  </div>
                </Card>

                {/* Vizinhos na fila */}
                {child.status === "em_espera" && (
                  <Card className="p-4">
                    <p className="text-[#5e6062] text-sm font-semibold mb-3">Posições vizinhas</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-[#f0f4ff] rounded-xl">
                        <div className="w-8 h-8 bg-[#979799]/15 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#979799]" />
                        </div>
                        <div>
                          <p className="text-[#5e6062] text-sm font-medium">#{child.before.position}º — À frente</p>
                          <p className="text-[#979799] text-xs mt-0.5">{child.before.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-[#3b5fe0] rounded-xl">
                        <div className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">#{child.position}º — {child.name}</p>
                          <p className="text-white/65 text-xs mt-0.5">Pontuação {score}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-[#f0f4ff] rounded-xl">
                        <div className="w-8 h-8 bg-[#979799]/15 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-[#979799]" />
                        </div>
                        <div>
                          <p className="text-[#5e6062] text-sm font-medium">#{child.after.position}º — Atrás</p>
                          <p className="text-[#979799] text-xs mt-0.5">{child.after.reason}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      <Info className="w-3.5 h-3.5 text-[#979799]" />
                      <p className="text-[#979799] text-xs">Identidades preservadas conforme LGPD</p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Right col (2 cols on desktop) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Critérios */}
                <Card className="p-5">
                  <p className="text-[#5e6062] text-sm font-semibold mb-4">Por que estou nessa posição?</p>
                  <div className="space-y-4">
                    {child.criteria.map((c) => (
                      <ScoreBar key={c.name} score={c.score} label={c.name} weight={c.weight} description={c.description} />
                    ))}
                  </div>
                </Card>

                {/* Histórico */}
                <Card className="p-4">
                  <p className="text-[#5e6062] text-sm font-semibold mb-3">Histórico de movimentações</p>
                  <div className="space-y-3">
                    {child.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          h.type === "alert" ? "bg-amber-100" : h.type === "success" ? "bg-emerald-100" : "bg-[#f0f4ff]"
                        }`}>
                          {h.type === "alert" ? <Bell className="w-4 h-4 text-amber-500" />
                            : h.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                            : <Clock className="w-4 h-4 text-[#979799]" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#263238] text-sm">{h.event}</p>
                          <p className="text-[#979799] text-xs mt-0.5">{h.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Documentação */}
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-[#3b5fe0]" />
                    <p className="text-[#5e6062] text-sm font-semibold">Documentação para matrícula</p>
                  </div>
                  <p className="text-[#979799] text-xs mb-3">Separe os documentos abaixo para quando a vaga for disponibilizada:</p>
                  <div className="space-y-2">
                    {DOCS.map((doc, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 bg-[#f0f4ff] rounded-xl">
                        <div className="w-5 h-5 bg-[#3b5fe0]/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[#3b5fe0] text-xs font-bold">{i + 1}</span>
                        </div>
                        <p className="text-[#5e6062] text-sm">{doc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            <p className="text-center text-[#bfc5d2] text-xs">Atualizado em {child.updatedAt}</p>
          </ContentArea>
        </div>
      </div>
    );
  }

  return null;
}
