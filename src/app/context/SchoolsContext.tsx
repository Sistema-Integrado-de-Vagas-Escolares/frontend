import { createContext, useContext, useState } from "react";
import { schools as initialSchools, School } from "../data";

export interface DeadlineConfig {
  schoolContactDays: number;
  enrollmentDays: number;
}

interface VacancyLog {
  date: string;
  schoolId: number;
  previous: number;
  updated: number;
  reason: string;
}

interface SchoolsContextType {
  schools: School[];
  vacancyLog: VacancyLog[];
  updateVacancies: (schoolId: number, vacancies: number, reason: string) => void;
  // School CRUD (Prefeitura only)
  addSchool: (school: Omit<School, "id">) => void;
  updateSchool: (id: number, data: Partial<Omit<School, "id" | "vacancies">>) => void;
  removeSchool: (id: number) => void;
  // Deadlines
  deadlineConfig: DeadlineConfig;
  updateDeadlineConfig: (config: DeadlineConfig) => void;
  schoolDeadlines: Record<number, Partial<DeadlineConfig>>;
  updateSchoolDeadline: (schoolId: number, config: Partial<DeadlineConfig>) => void;
  getDeadline: (schoolId: number) => DeadlineConfig;
}

const defaultDeadline: DeadlineConfig = { schoolContactDays: 3, enrollmentDays: 3 };

const SchoolsContext = createContext<SchoolsContextType>({
  schools: initialSchools,
  vacancyLog: [],
  updateVacancies: () => {},
  addSchool: () => {},
  updateSchool: () => {},
  removeSchool: () => {},
  deadlineConfig: defaultDeadline,
  updateDeadlineConfig: () => {},
  schoolDeadlines: {},
  updateSchoolDeadline: () => {},
  getDeadline: () => defaultDeadline,
});

export function SchoolsProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [vacancyLog, setVacancyLog] = useState<VacancyLog[]>([
    { date: "20/06/2026", schoolId: 1, previous: 3, updated: 5, reason: "Cancelamento de matrícula" },
    { date: "10/06/2026", schoolId: 1, previous: 5, updated: 3, reason: "Novas matrículas" },
  ]);
  const [deadlineConfig, setDeadlineConfig] = useState<DeadlineConfig>(defaultDeadline);
  const [schoolDeadlines, setSchoolDeadlines] = useState<Record<number, Partial<DeadlineConfig>>>({});

  const updateVacancies = (schoolId: number, vacancies: number, reason: string) => {
    setSchools((prev) => {
      const school = prev.find((s) => s.id === schoolId);
      if (!school) return prev;
      setVacancyLog((log) => [
        { date: new Date().toLocaleDateString("pt-BR"), schoolId, previous: school.vacancies, updated: vacancies, reason },
        ...log,
      ]);
      return prev.map((s) => s.id === schoolId ? { ...s, vacancies } : s);
    });
  };

  const addSchool = (school: Omit<School, "id">) => {
    setSchools((prev) => {
      const newId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      return [...prev, { ...school, id: newId }];
    });
  };

  const updateSchool = (id: number, data: Partial<Omit<School, "id" | "vacancies">>) => {
    setSchools((prev) => prev.map((s) => s.id === id ? { ...s, ...data } : s));
  };

  const removeSchool = (id: number) => {
    setSchools((prev) => prev.filter((s) => s.id !== id));
  };

  const updateDeadlineConfig = (config: DeadlineConfig) => setDeadlineConfig(config);

  const updateSchoolDeadline = (schoolId: number, config: Partial<DeadlineConfig>) =>
    setSchoolDeadlines((prev) => ({ ...prev, [schoolId]: { ...prev[schoolId], ...config } }));

  const getDeadline = (schoolId: number): DeadlineConfig => ({
    schoolContactDays: schoolDeadlines[schoolId]?.schoolContactDays ?? deadlineConfig.schoolContactDays,
    enrollmentDays: schoolDeadlines[schoolId]?.enrollmentDays ?? deadlineConfig.enrollmentDays,
  });

  return (
    <SchoolsContext.Provider value={{
      schools, vacancyLog, updateVacancies, addSchool, updateSchool, removeSchool,
      deadlineConfig, updateDeadlineConfig, schoolDeadlines, updateSchoolDeadline, getDeadline,
    }}>
      {children}
    </SchoolsContext.Provider>
  );
}

export const useSchools = () => useContext(SchoolsContext);
