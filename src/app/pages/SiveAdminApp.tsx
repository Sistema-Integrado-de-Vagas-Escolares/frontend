import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2, Plus, Edit3, Trash2, CheckCircle, AlertCircle,
  LogOut, X, Eye, EyeOff, School, Settings,
  Save, ArrowLeft, KeyRound, ShieldCheck,
} from "lucide-react";
import { Card, FormField } from "../components/Shared";
import siveLogo from "@/imports/SIVE_teste__6_-removebg-preview-2.png";

// ==================== TYPES ====================

interface PrefeituraAccount {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  cnpj: string;
  email: string;
  password: string;
  status: "ativo" | "inativo" | "pendente";
  primaryColor: string;
  systemName: string;
  contactEmail: string;
  schools: number;
  createdAt: string;
  lastAccess?: string;
  modules: ("prefeitura" | "escola" | "responsavel" | "mapa")[];
}

// ==================== MOCK DATA ====================

const initPrefeituras: PrefeituraAccount[] = [
  {
    id: 1, nome: "Prefeitura Municipal de Caraguatatuba", cidade: "Caraguatatuba", estado: "SP",
    cnpj: "44.082.465/0001-60", email: "seduc@caraguatatuba.sp.gov.br", password: "Cara@2026",
    status: "ativo", primaryColor: "#3b5fe0", systemName: "VagaEscolar", contactEmail: "educacao@caraguatatuba.sp.gov.br",
    schools: 8, createdAt: "10/01/2026", lastAccess: "03/07/2026",
    modules: ["prefeitura", "escola", "responsavel", "mapa"],
  },
  {
    id: 2, nome: "Prefeitura Municipal de Campinas", cidade: "Campinas", estado: "SP",
    cnpj: "51.885.242/0001-40", email: "seduc@campinas.sp.gov.br", password: "Camp@2026",
    status: "ativo", primaryColor: "#2d7dd2", systemName: "VagaEduca", contactEmail: "educacao@campinas.sp.gov.br",
    schools: 18, createdAt: "15/02/2026", lastAccess: "02/07/2026",
    modules: ["prefeitura", "escola", "responsavel", "mapa"],
  },
  {
    id: 3, nome: "Prefeitura Municipal de Ribeirão Preto", cidade: "Ribeirão Preto", estado: "SP",
    cnpj: "44.082.465/0001-61", email: "seduc@ribeirao.sp.gov.br", password: "Rib@2026",
    status: "pendente", primaryColor: "#7c3aed", systemName: "VagasRP", contactEmail: "educacao@ribeirao.sp.gov.br",
    schools: 0, createdAt: "01/07/2026", lastAccess: undefined,
    modules: ["prefeitura", "escola", "responsavel", "mapa"],
  },
];

// ==================== HELPERS ====================

type Screen = "login" | "dashboard" | "form" | "pwd";
type DashTab = "prefeituras" | "configuracoes";

const MODULE_LABELS: Record<string, string> = {
  prefeitura: "Painel da Prefeitura", escola: "Painel da Escola",
  responsavel: "Portal dos Responsáveis", mapa: "Mapa Inteligente",
};

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  ativo: { label: "Ativo", bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700" },
  inativo: { label: "Inativo", bg: "bg-red-50 border border-red-200", text: "text-red-600" },
  pendente: { label: "Aguardando ativação", bg: "bg-amber-50 border border-amber-200", text: "text-amber-700" },
};

const emptyForm: Omit<PrefeituraAccount, "id" | "schools" | "createdAt" | "lastAccess"> = {
  nome: "", cidade: "", estado: "", cnpj: "", email: "", password: "",
  status: "pendente", primaryColor: "#3b5fe0", systemName: "VagaEscolar",
  contactEmail: "", modules: ["prefeitura", "escola", "responsavel", "mapa"],
};

// ==================== PASSWORD MODAL ====================

function PwdModal({ prefeitura, onClose, onSave }: {
  prefeitura: PrefeituraAccount; onClose: () => void; onSave: (pwd: string) => void;
}) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const valid = pwd.length >= 8 && pwd === confirm;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#3b5fe0]" />
            </div>
            <div>
              <p className="text-[#263238] font-bold text-sm">Redefinir senha de acesso</p>
              <p className="text-[#979799] text-xs">{prefeitura.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#979799] hover:text-[#5e6062]"><X className="w-5 h-5" /></button>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs leading-relaxed">
            Após redefinir, comunique a nova senha à prefeitura por canal seguro. O SIVE não envia senhas por e-mail.
          </p>
        </div>

        <div>
          <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Nova senha *</label>
          <div className="relative">
            <input type={show ? "text" : "password"} value={pwd} onChange={(e) => setPwd(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 pr-11" />
            <button onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#979799]">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Confirmar nova senha *</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repita a senha"
            className={`w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 ${confirm && !valid ? "ring-2 ring-red-300" : ""}`} />
          {confirm && pwd !== confirm && <p className="text-red-500 text-xs mt-1">Senhas não coincidem.</p>}
        </div>

        <div className="flex gap-3">
          <button onClick={() => onSave(pwd)} disabled={!valid}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all">
            <Save className="w-4 h-4" /> Salvar nova senha
          </button>
          <button onClick={onClose} className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff]">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== PREFEITURA FORM ====================

function PrefeituraForm({ initial, onBack, onSave }: {
  initial: Partial<PrefeituraAccount>;
  onBack: () => void;
  onSave: (data: Omit<PrefeituraAccount, "id" | "schools" | "createdAt" | "lastAccess">) => void;
}) {
  const isEditing = !!initial.id;
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [showPwd, setShowPwd] = useState(false);
  const update = (k: string, v: string | boolean | string[]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleModule = (m: string) => {
    const mods = form.modules as string[];
    update("modules", mods.includes(m) ? mods.filter((x) => x !== m) : [...mods, m]);
  };

  const canSave = form.nome.trim() && form.email.trim() && (isEditing || form.password.length >= 8);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#979799] text-xs hover:text-[#5e6062] transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para lista
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#3b5fe0]/10 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[#3b5fe0]" />
        </div>
        <div>
          <h3 className="text-[#263238] font-bold">{isEditing ? "Editar prefeitura" : "Cadastrar nova prefeitura"}</h3>
          <p className="text-[#979799] text-xs">{isEditing ? initial.nome : "Preencha todos os dados obrigatórios"}</p>
        </div>
      </div>

      {/* Dados básicos */}
      <Card className="p-5 space-y-4">
        <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Dados da Prefeitura</p>
        <FormField label="Nome da Prefeitura *" placeholder="Prefeitura Municipal de..." value={form.nome} onChange={(v) => update("nome", v)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Cidade *" placeholder="Nome da cidade" value={form.cidade} onChange={(v) => update("cidade", v)} />
          <FormField label="Estado (UF) *" placeholder="SP" value={form.estado} onChange={(v) => update("estado", v)} />
        </div>
        <FormField label="CNPJ" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={(v) => update("cnpj", v)} />
        <FormField label="E-mail de contato institucional" placeholder="educacao@prefeitura.gov.br" type="email" value={form.contactEmail} onChange={(v) => update("contactEmail", v)} />

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-[#263238] text-sm font-medium">Status da conta</p>
            <p className="text-[#979799] text-xs">{form.status === "ativo" ? "Prefeitura com acesso liberado" : form.status === "inativo" ? "Acesso suspenso" : "Aguardando ativação"}</p>
          </div>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}
            className="bg-[#f0f4ff] rounded-xl px-3 py-2 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25">
            <option value="pendente">Aguardando ativação</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo (suspenso)</option>
          </select>
        </div>
      </Card>

      {/* Credenciais de acesso */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3b5fe0]" />
          <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Credenciais de Acesso</p>
        </div>

        <div className="bg-[#f0f4ff] rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
          <p className="text-[#5e6062] text-xs leading-relaxed">
            Estas credenciais serão usadas pela prefeitura para acessar o SIVE. Comunique-as por canal seguro.
            <strong> O sistema não envia senhas por e-mail.</strong>
          </p>
        </div>

        <FormField label="E-mail de login *" placeholder="seduc@prefeitura.sp.gov.br" type="email" value={form.email} onChange={(v) => update("email", v)}
          hint="Este será o e-mail de acesso ao painel municipal." />

        <div>
          <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">
            {isEditing ? "Nova senha (deixe em branco para manter)" : "Senha de acesso *"}
          </label>
          <div className="relative">
            <input type={showPwd ? "text" : "password"} value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder={isEditing ? "Deixe em branco para não alterar" : "Mínimo 8 caracteres"}
              className="w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 focus:ring-[#3b5fe0]/25 pr-11" />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#979799]">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {!isEditing && form.password && form.password.length < 8 && (
            <p className="text-amber-500 text-xs mt-1">Mínimo 8 caracteres.</p>
          )}
        </div>
      </Card>

      {/* Identidade visual */}
      <Card className="p-5 space-y-4">
        <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Identidade Visual (White-label)</p>
        <FormField label="Nome do sistema" placeholder="ex: VagaEscolar" value={form.systemName} onChange={(v) => update("systemName", v)} />
        <div>
          <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Cor primária</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
              className="w-12 h-10 rounded-xl border border-[#e8edf8] cursor-pointer p-1" />
            <div className="flex-1 bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm font-mono">{form.primaryColor}</div>
            <div className="w-10 h-10 rounded-xl border border-[#e8edf8]" style={{ backgroundColor: form.primaryColor }} />
          </div>
        </div>
      </Card>

      {/* Módulos habilitados */}
      <Card className="p-5 space-y-3">
        <p className="text-[#5e6062] text-xs font-bold uppercase tracking-wider">Módulos habilitados</p>
        {Object.entries(MODULE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between py-1.5 border-b border-[#f0f4ff] last:border-0">
            <p className="text-[#263238] text-sm font-medium">{label}</p>
            <button onClick={() => toggleModule(key)}
              className={`w-12 h-6 rounded-full transition-colors shrink-0 ${form.modules.includes(key as never) ? "bg-[#3b5fe0]" : "bg-[#e8edf8]"}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.modules.includes(key as never) ? "translate-x-6" : ""}`} />
            </button>
          </div>
        ))}
      </Card>

      <div className="flex gap-3">
        <button onClick={() => onSave(form)} disabled={!canSave}
          className="flex-1 flex items-center justify-center gap-2 bg-[#3b5fe0] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2f4fc4] disabled:opacity-40 transition-all">
          <Save className="w-4 h-4" /> {isEditing ? "Salvar alterações" : "Cadastrar prefeitura"}
        </button>
        <button onClick={onBack} className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3.5 rounded-xl hover:bg-[#e4ecff]">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ==================== MAIN ====================

export default function SiveAdminApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<DashTab>("prefeituras");
  const [prefeituras, setPrefeituras] = useState<PrefeituraAccount[]>(initPrefeituras);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pwdTarget, setPwdTarget] = useState<PrefeituraAccount | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPwd, setAdminPwd] = useState("");
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 4000); };

  const savePrefeitura = (data: Omit<PrefeituraAccount, "id" | "schools" | "createdAt" | "lastAccess">) => {
    if (editingId) {
      setPrefeituras((prev) => prev.map((p) => p.id === editingId ? {
        ...p, ...data,
        password: data.password || p.password, // keep old password if blank
      } : p));
      showSuccess("Prefeitura atualizada com sucesso!");
    } else {
      const newId = Math.max(...prefeituras.map((p) => p.id)) + 1;
      setPrefeituras((prev) => [...prev, { ...data, id: newId, schools: 0, createdAt: new Date().toLocaleDateString("pt-BR") }]);
      showSuccess("Prefeitura cadastrada com sucesso!");
    }
    setEditingId(null);
    setScreen("dashboard");
  };

  const handleDelete = (id: number) => {
    setPrefeituras((prev) => prev.filter((p) => p.id !== id));
    setConfirmDelete(null);
    showSuccess("Prefeitura removida do sistema.");
  };

  const handleLogin = () => {
    if (adminEmail === "admin@sive.com.br" && adminPwd === "Sive@Admin2026") {
      setLoginError(false);
      setScreen("dashboard");
    } else {
      setLoginError(true);
    }
  };

  // ---- LOGIN ----
  if (screen === "login") {
    return (
      <div className="min-h-screen font-[Inter,sans-serif] lg:flex">
        {/* Left panel */}
        <div className="hidden lg:flex lg:flex-col lg:w-[420px] xl:w-[480px] shrink-0 px-12 py-10 bg-[#263238]">
          <div className="mb-8">
            <img src={siveLogo} alt="SIVE" className="h-16 w-auto object-contain" />
          </div>
          <div className="w-full h-px bg-white/10 mb-8" />
          <div className="flex-1">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">Área Restrita</p>
            <h1 className="text-white text-3xl font-black leading-tight mb-4">
              Administração<br />do Sistema SIVE
            </h1>
            <p className="text-white/55 text-sm leading-relaxed mb-8">
              Acesso exclusivo para administradores do sistema. Prefeituras não têm acesso a esta área.
            </p>
            <div className="space-y-3">
              {[
                "Cadastro e gestão de prefeituras",
                "Criação de credenciais de acesso",
                "Configuração white-label por município",
                "Controle de módulos habilitados",
              ].map((txt) => (
                <div key={txt} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  </div>
                  <p className="text-white/70 text-sm">{txt}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/20 text-xs mt-8">sive.com.br · Painel de Administração</p>
        </div>

        {/* Right: form */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="bg-[#263238] px-5 pt-12 pb-8 lg:hidden">
            <img src={siveLogo} alt="SIVE" className="h-12 w-auto object-contain mb-3" />
            <h2 className="text-white text-lg font-bold">Administração SIVE</h2>
            <p className="text-white/55 text-sm">Área restrita a administradores</p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm px-8 py-12">
              <div className="mb-8">
                <div className="hidden lg:flex items-center gap-3 mb-6">
                  <button onClick={() => navigate("/")} className="text-[#979799] text-xs hover:text-[#5e6062] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao portal
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-[#263238]/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#263238]" />
                  </div>
                  <h2 className="text-[#263238] text-2xl font-black">Acesso Admin</h2>
                </div>
                <p className="text-[#979799] text-sm">Credenciais de administrador do sistema SIVE</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">E-mail do administrador</label>
                  <input type="email" value={adminEmail} onChange={(e) => { setAdminEmail(e.target.value); setLoginError(false); }}
                    placeholder="admin@sive.com.br"
                    className={`w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 ${loginError ? "ring-2 ring-red-300" : "focus:ring-[#263238]/20"}`} />
                </div>
                <div>
                  <label className="text-[#5e6062] text-xs font-semibold block mb-1.5">Senha</label>
                  <input type="password" value={adminPwd} onChange={(e) => { setAdminPwd(e.target.value); setLoginError(false); }}
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className={`w-full bg-[#f0f4ff] rounded-xl px-4 py-3 text-[#263238] text-sm outline-none focus:ring-2 ${loginError ? "ring-2 ring-red-300" : "focus:ring-[#263238]/20"}`} />
                </div>

                {loginError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-red-600 text-xs">Credenciais inválidas. Verifique e-mail e senha.</p>
                  </div>
                )}

                <button onClick={handleLogin}
                  className="w-full bg-[#263238] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1a2428] transition-colors">
                  Acessar painel administrativo
                </button>
              </div>

              <p className="text-center text-[#bfc5d2] text-xs mt-6 leading-relaxed">
                Acesso exclusivo a administradores SIVE.<br />
                Dados protegidos pela LGPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- FORM ----
  if (screen === "form") {
    const editing = editingId ? prefeituras.find((p) => p.id === editingId) : undefined;
    return (
      <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
        <div className="bg-[#263238] px-5 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={siveLogo} alt="SIVE" className="h-8 w-auto object-contain opacity-80" />
              <span className="text-white/50 text-xs">Administração</span>
            </div>
            <button onClick={() => setScreen("login")} className="flex items-center gap-2 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white/10">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-5 py-8">
          <PrefeituraForm
            initial={editing ?? {}}
            onBack={() => { setEditingId(null); setScreen("dashboard"); }}
            onSave={savePrefeitura}
          />
        </div>
      </div>
    );
  }

  // ---- DASHBOARD ----
  const active = prefeituras.filter((p) => p.status === "ativo").length;
  const totalSchools = prefeituras.reduce((a, p) => a + p.schools, 0);

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-[Inter,sans-serif]">
      {/* Top bar */}
      <div className="bg-[#263238] px-5 py-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={siveLogo} alt="SIVE" className="h-9 w-auto object-contain opacity-85" />
            <div className="h-5 w-px bg-white/20" />
            <p className="text-white/60 text-sm">Painel de Administração</p>
          </div>
          <div className="flex gap-2">
            {([
              { k: "prefeituras", l: "Prefeituras" },
              { k: "configuracoes", l: "Configurações" },
            ] as { k: DashTab; l: string }[]).map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === t.k ? "bg-white text-[#263238]" : "text-white/60 hover:bg-white/10"}`}>
                {t.l}
              </button>
            ))}
            <div className="h-5 w-px bg-white/20 mx-1 self-center" />
            <button onClick={() => setScreen("login")}
              className="flex items-center gap-2 border border-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-white/10 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-emerald-700 text-sm font-medium">{successMsg}</p>
          </div>
        )}

        {/* ---- PREFEITURAS TAB ---- */}
        {tab === "prefeituras" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { v: prefeituras.length, l: "Prefeituras cadastradas", icon: Building2, c: "#3b5fe0" },
                { v: active, l: "Prefeituras ativas", icon: CheckCircle, c: "#22c55e" },
                { v: prefeituras.filter((p) => p.status === "pendente").length, l: "Aguardando ativação", icon: AlertCircle, c: "#f59e0b" },
                { v: totalSchools, l: "Escolas no sistema", icon: School, c: "#7c3aed" },
              ].map((k) => (
                <Card key={k.l} className="p-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${k.c}18` }}>
                    <k.icon className="w-4 h-4" style={{ color: k.c }} />
                  </div>
                  <p className="text-[#263238] text-2xl font-bold leading-none">{k.v}</p>
                  <p className="text-[#979799] text-xs mt-1 leading-snug">{k.l}</p>
                </Card>
              ))}
            </div>

            {/* List header */}
            <div className="flex items-center justify-between">
              <p className="text-[#979799] text-xs font-bold uppercase tracking-wider">
                {prefeituras.length} prefeitura(s) cadastrada(s)
              </p>
              <button onClick={() => { setEditingId(null); setScreen("form"); }}
                className="flex items-center gap-1.5 bg-[#263238] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a2428] transition-colors">
                <Plus className="w-4 h-4" /> Nova prefeitura
              </button>
            </div>

            {/* Prefeitura cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {prefeituras.map((p) => {
                const st = STATUS_STYLE[p.status];
                return (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${p.primaryColor}20` }}>
                          <Building2 className="w-5 h-5" style={{ color: p.primaryColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#263238] text-sm leading-tight truncate">{p.nome}</p>
                          <p className="text-[#979799] text-xs mt-0.5">{p.cidade} — {p.estado}</p>
                          <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${st.bg} ${st.text}`}>
                            {st.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Credentials preview */}
                    <div className="bg-[#f0f4ff] rounded-xl p-3 mb-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[#979799] text-xs">Login</p>
                        <p className="text-[#263238] text-xs font-mono font-medium">{p.email}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[#979799] text-xs">Senha</p>
                        <p className="text-[#263238] text-xs font-mono">{"•".repeat(Math.min(p.password.length, 10))}</p>
                      </div>
                      {p.lastAccess && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#e8edf8] mt-1">
                          <p className="text-[#979799] text-xs">Último acesso</p>
                          <p className="text-[#979799] text-xs">{p.lastAccess}</p>
                        </div>
                      )}
                    </div>

                    {/* Modules */}
                    <div className="flex gap-1 flex-wrap mb-4">
                      {p.modules.map((m) => (
                        <span key={m} className="text-xs bg-[#3b5fe0]/10 text-[#3b5fe0] px-2 py-0.5 rounded-full">
                          {MODULE_LABELS[m]?.split(" ")[0]}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(p.id); setScreen("form"); }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-[#e4ecff] hover:text-[#3b5fe0] transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button onClick={() => setPwdTarget(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#f0f4ff] text-[#5e6062] text-xs py-2.5 rounded-xl font-semibold hover:bg-amber-50 hover:text-amber-600 transition-colors">
                        <KeyRound className="w-3.5 h-3.5" /> Redefinir senha
                      </button>
                      <button onClick={() => setConfirmDelete(p.id)}
                        className="flex items-center justify-center gap-1.5 bg-red-50 text-red-400 text-xs px-3 py-2.5 rounded-xl font-semibold hover:bg-red-100 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* ---- CONFIGURAÇÕES TAB ---- */}
        {tab === "configuracoes" && (
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#3b5fe0]" />
              <p className="text-[#263238] font-bold">Configurações do Sistema SIVE</p>
            </div>
            <div className="space-y-4">
              <FormField label="E-mail de suporte" value="suporte@sive.com.br" hint="E-mail divulgado para prefeituras recuperarem acesso." />
              <FormField label="Versão do sistema" value="1.0.0 · Julho 2026" />
            </div>
            <div className="bg-[#f0f4ff] rounded-xl p-4 flex gap-3">
              <ShieldCheck className="w-4 h-4 text-[#3b5fe0] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#263238] text-sm font-semibold">Política de senha</p>
                <p className="text-[#979799] text-xs mt-0.5 leading-relaxed">
                  Senhas não são enviadas por e-mail. Prefeituras que precisarem redefinir senha devem entrar em contato com o suporte SIVE via <strong>suporte@sive.com.br</strong>.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-[#263238] font-bold">Remover prefeitura?</p>
                <p className="text-[#979799] text-sm">{prefeituras.find((p) => p.id === confirmDelete)?.nome}</p>
              </div>
            </div>
            <p className="text-[#5e6062] text-sm leading-relaxed">
              Isso removerá o acesso desta prefeitura ao sistema SIVE. A ação é irreversível.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(confirmDelete!)}
                className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl hover:bg-red-600">
                Sim, remover
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-[#f0f4ff] text-[#5e6062] font-semibold py-3 rounded-xl hover:bg-[#e4ecff]">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password modal */}
      {pwdTarget && (
        <PwdModal
          prefeitura={pwdTarget}
          onClose={() => setPwdTarget(null)}
          onSave={(pwd) => {
            setPrefeituras((prev) => prev.map((p) => p.id === pwdTarget.id ? { ...p, password: pwd } : p));
            setPwdTarget(null);
            showSuccess(`Senha de ${pwdTarget.nome} redefinida com sucesso!`);
          }}
        />
      )}
    </div>
  );
}
