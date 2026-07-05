// ==================== TYPES ====================

export interface Responsavel {
  id: number;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  hasAccess: boolean;
}

export interface Child {
  id: number;
  name: string;
  dob: string;
  type: "creche" | "fundamental";
  period: "Integral" | "Manhã" | "Tarde";
  position: number;
  totalWaitlist: number;
  score: number;
  status: "em_espera" | "chamado" | "aguardando_confirmacao" | "matriculado" | "desistencia" | "recusa";
  school: string;
}

export interface Relation {
  responsavelId: number;
  childId: number;
  relationship: string;
}

export interface School {
  id: number;
  name: string;
  type: "creche" | "fundamental";
  address: string;
  neighborhood: string;
  waitlist: number;
  vacancies: number;
  total: number;
  rooms: number;
  periods: ("Integral" | "Manhã" | "Tarde")[];
  mapX: number;
  mapY: number;
}

// ==================== CARAGUATATUBA SCHOOLS ====================

export const schools: School[] = [
  { id: 1, name: "EMEI Jardim das Flores", type: "creche", address: "Rua das Rosas, 123", neighborhood: "Centro", waitlist: 47, vacancies: 5, total: 120, rooms: 6, periods: ["Integral", "Manhã"], mapX: 30, mapY: 42 },
  { id: 2, name: "EMEF Paulo Freire", type: "fundamental", address: "Av. Educação, 456", neighborhood: "Centro", waitlist: 23, vacancies: 12, total: 200, rooms: 10, periods: ["Manhã", "Tarde"], mapX: 58, mapY: 28 },
  { id: 3, name: "EMEI Sol Nascente", type: "creche", address: "Rua Girassol, 789", neighborhood: "Indaiá", waitlist: 89, vacancies: 0, total: 80, rooms: 5, periods: ["Integral"], mapX: 72, mapY: 58 },
  { id: 4, name: "EMEF Santos Dumont", type: "fundamental", address: "Av. Brasil, 890", neighborhood: "Martim de Sá", waitlist: 18, vacancies: 25, total: 150, rooms: 8, periods: ["Manhã", "Tarde"], mapX: 44, mapY: 68 },
  { id: 5, name: "EMEI Mundo Feliz", type: "creche", address: "Rua da Alegria, 654", neighborhood: "Porto Novo", waitlist: 62, vacancies: 3, total: 100, rooms: 6, periods: ["Integral", "Tarde"], mapX: 18, mapY: 62 },
  { id: 6, name: "EMEF Monteiro Lobato", type: "fundamental", address: "Praça do Saber, 321", neighborhood: "Indaiá", waitlist: 15, vacancies: 25, total: 180, rooms: 9, periods: ["Manhã", "Tarde"], mapX: 63, mapY: 46 },
  { id: 7, name: "EMEI Arco-Íris", type: "creche", address: "Rua do Arco-Íris, 555", neighborhood: "Capricórnio", waitlist: 33, vacancies: 8, total: 90, rooms: 5, periods: ["Integral", "Manhã"], mapX: 82, mapY: 36 },
  { id: 8, name: "EMEF Tiradentes", type: "fundamental", address: "R. Tiradentes, 100", neighborhood: "Martim de Sá", waitlist: 25, vacancies: 25, total: 250, rooms: 12, periods: ["Manhã", "Tarde"], mapX: 52, mapY: 76 },
];

// ==================== PREFEITURA DASHBOARD DATA ====================

export const prefData = {
  totalSchools: 8,
  totalVacancies: 103,
  totalWaitlist: 312,
  avgWaitDays: 127,

  byModality: [
    { name: "Creche", waitlist: 198, vacancies: 16, color: "#3b5fe0" },
    { name: "Fund. I", waitlist: 76, vacancies: 52, color: "#7da5ff" },
    { name: "Fund. II", waitlist: 38, vacancies: 35, color: "#93c5fd" },
  ],

  byPeriod: [
    { name: "Integral", waitlist: 180, vacancies: 24, color: "#3b5fe0" },
    { name: "Manhã", waitlist: 89, vacancies: 52, color: "#7da5ff" },
    { name: "Tarde", waitlist: 43, vacancies: 27, color: "#93c5fd" },
  ],

  schoolRanking: [
    { name: "EMEI Sol Nascente", waitlist: 89, vacancies: 0, type: "creche" },
    { name: "EMEI Mundo Feliz", waitlist: 62, vacancies: 3, type: "creche" },
    { name: "EMEI Arco-Íris", waitlist: 33, vacancies: 8, type: "creche" },
    { name: "EMEI Jardim das Flores", waitlist: 47, vacancies: 5, type: "creche" },
    { name: "EMEF Paulo Freire", waitlist: 23, vacancies: 12, type: "fundamental" },
    { name: "EMEF Tiradentes", waitlist: 25, vacancies: 25, type: "fundamental" },
  ],

  byNeighborhood: [
    { name: "Centro", waitlist: 92, vacancies: 35 },
    { name: "Indaiá", waitlist: 78, vacancies: 12 },
    { name: "Martim de Sá", waitlist: 65, vacancies: 23 },
    { name: "Porto Novo", waitlist: 47, vacancies: 18 },
    { name: "Capricórnio", waitlist: 30, vacancies: 15 },
  ],

  monthlyHistory: [
    { month: "Jan", espera: 240, vagas: 130, matriculas: 45 },
    { month: "Fev", espera: 268, vagas: 118, matriculas: 38 },
    { month: "Mar", espera: 285, vagas: 110, matriculas: 22 },
    { month: "Abr", espera: 298, vagas: 107, matriculas: 15 },
    { month: "Mai", espera: 305, vagas: 104, matriculas: 12 },
    { month: "Jun", espera: 312, vagas: 103, matriculas: 8 },
  ],
};

// ==================== INIT DATA ====================

export const initResponsaveis: Responsavel[] = [
  { id: 1, cpf: "123.456.789-00", name: "Maria Oliveira", email: "maria@email.com", phone: "(12) 98765-0001", hasAccess: true },
  { id: 2, cpf: "987.654.321-00", name: "João Oliveira", email: "joao@email.com", phone: "(12) 98765-0002", hasAccess: true },
  { id: 3, cpf: "111.222.333-44", name: "Ana Costa", email: "ana@email.com", phone: "(12) 98765-0003", hasAccess: false },
  { id: 4, cpf: "555.666.777-88", name: "Carlos Ferreira", email: "carlos@email.com", phone: "(12) 98765-0004", hasAccess: true },
];

export const initChildren: Child[] = [
  { id: 1, name: "Lucas Oliveira", dob: "15/03/2024", type: "creche", period: "Integral", position: 12, totalWaitlist: 47, score: 87.3, status: "em_espera", school: "EMEI Jardim das Flores" },
  { id: 2, name: "Ana Oliveira", dob: "20/05/2020", type: "fundamental", period: "Manhã", position: 5, totalWaitlist: 23, score: 92.1, status: "em_espera", school: "EMEF Paulo Freire" },
  { id: 3, name: "Pedro Costa", dob: "08/11/2023", type: "creche", period: "Integral", position: 31, totalWaitlist: 47, score: 72.4, status: "em_espera", school: "EMEI Jardim das Flores" },
  { id: 4, name: "Sofia Ferreira", dob: "12/07/2022", type: "creche", period: "Manhã", position: 8, totalWaitlist: 47, score: 89.7, status: "chamado", school: "EMEI Jardim das Flores" },
];

export const initRelations: Relation[] = [
  { responsavelId: 1, childId: 1, relationship: "Mãe" },
  { responsavelId: 1, childId: 2, relationship: "Mãe" },
  { responsavelId: 2, childId: 1, relationship: "Pai" },
  { responsavelId: 2, childId: 2, relationship: "Pai" },
  { responsavelId: 3, childId: 3, relationship: "Mãe" },
  { responsavelId: 4, childId: 4, relationship: "Pai" },
];

export const childCriteria = [
  { name: "Renda familiar", score: 9.2, weight: 40, description: "Até 1 salário mínimo per capita" },
  { name: "Distância da residência", score: 8.5, weight: 30, description: "1,2 km da escola" },
  { name: "Mãe trabalhadora", score: 10, weight: 20, description: "Confirmado" },
  { name: "Irmão na escola", score: 0, weight: 10, description: "Não aplicável" },
];

// ==================== UTILS ====================

export function formatCPF(val: string) {
  const n = val.replace(/\D/g, "").slice(0, 11);
  return n.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(val: string) {
  const n = val.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return n.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

export function weightedScore(criteria: typeof childCriteria) {
  return criteria.reduce((acc, c) => acc + (c.score * c.weight) / 100, 0).toFixed(1);
}

export const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  em_espera: { label: "Em espera", color: "text-[#5e6062]", bg: "bg-[#f0f4ff]" },
  chamado: { label: "Chamado", color: "text-amber-700", bg: "bg-amber-50 border border-amber-200" },
  aguardando_confirmacao: { label: "Aguardando confirmação", color: "text-[#3b5fe0]", bg: "bg-[#3b5fe0]/10" },
  matriculado: { label: "Matriculado", color: "text-emerald-700", bg: "bg-emerald-50 border border-emerald-200" },
  desistencia: { label: "Desistência", color: "text-red-600", bg: "bg-red-50 border border-red-200" },
  recusa: { label: "Recusa", color: "text-red-600", bg: "bg-red-50 border border-red-200" },
};
