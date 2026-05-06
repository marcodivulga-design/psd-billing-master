/**
 * customizable-registry.ts - Sistema de Cadastro Adaptável
 * 
 * Permite que a Secretaria de Educação personalize:
 * - Tipos de escola
 * - Matérias novas
 * - Ativar/desativar módulos
 * - Mudar nomenclaturas
 * - Adicionar projetos locais
 */

import { z } from 'zod';

// ============================================
// TIPOS DE CADASTRO ADAPTÁVEL
// ============================================

export const CustomSchoolTypeSchema = z.object({
  id: z.string(),
  municipalityId: z.string(),
  name: z.string().min(1).max(100),
  icon: z.string(),
  description: z.string().optional(),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CustomSchoolType = z.infer<typeof CustomSchoolTypeSchema>;

export const CustomSubjectSchema = z.object({
  id: z.string(),
  municipalityId: z.string(),
  name: z.string().min(1).max(100),
  icon: z.string(),
  description: z.string().optional(),
  activities: z.array(z.string()).min(1),
  gradeRange: z.object({
    minGrade: z.number(),
    maxGrade: z.number(),
  }),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CustomSubject = z.infer<typeof CustomSubjectSchema>;

export const CustomProjectSchema = z.object({
  id: z.string(),
  municipalityId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string(),
  icon: z.string(),
  objectives: z.array(z.string()),
  targetGrades: z.array(z.string()),
  duration: z.string(), // ex: "1 semestre", "1 ano"
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CustomProject = z.infer<typeof CustomProjectSchema>;

export const ModuleFeatureSchema = z.object({
  id: z.string(),
  municipalityId: z.string(),
  moduleName: z.enum([
    'lessons',
    'quiz',
    'gamification',
    'ai-tutor',
    'parents-panel',
    'teacher-library',
    'emotional-area',
    'school-wall',
    'municipal-events',
  ]),
  enabled: z.boolean(),
  customSettings: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ModuleFeature = z.infer<typeof ModuleFeatureSchema>;

export const MunicipalityCustomizationSchema = z.object({
  id: z.string(),
  municipalityName: z.string(),
  state: z.string(),
  logo: z.string().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }).optional(),
  nomenclature: z.record(z.string()).optional(), // ex: { "student": "aluno", "teacher": "professor" }
  customSchoolTypes: z.array(CustomSchoolTypeSchema),
  customSubjects: z.array(CustomSubjectSchema),
  customProjects: z.array(CustomProjectSchema),
  moduleFeatures: z.array(ModuleFeatureSchema),
  active: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MunicipalityCustomization = z.infer<typeof MunicipalityCustomizationSchema>;

// ============================================
// EXEMPLOS DE CUSTOMIZAÇÕES POR MUNICÍPIO
// ============================================

export const MUNICIPALITY_EXAMPLES = {
  pantanal: {
    name: 'Município do Pantanal',
    customProjects: [
      {
        name: 'Cultura Pantaneira',
        description: 'Preservação e valorização da cultura local',
        icon: '🐊',
        objectives: ['Conhecer tradições', 'Valorizar patrimônio', 'Engajar comunidade'],
        targetGrades: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
      },
      {
        name: 'Educação Ambiental Local',
        description: 'Sustentabilidade do Pantanal',
        icon: '🌱',
        objectives: ['Conservar ecossistema', 'Entender biodiversidade', 'Agir sustentavelmente'],
        targetGrades: ['6º ano', '7º ano', '8º ano', '9º ano'],
      },
      {
        name: 'Agro Pantaneiro',
        description: 'Técnicas agrícolas regionais',
        icon: '🌾',
        objectives: ['Aprender técnicas', 'Empreendedorismo rural', 'Inovação agrícola'],
        targetGrades: ['1º EM', '2º EM', '3º EM'],
      },
    ],
    customSubjects: [
      {
        name: 'Música Regional',
        icon: '🎵',
        description: 'Ritmos e instrumentos do Pantanal',
        activities: ['Aprender ritmos', 'Tocar instrumentos', 'Criar composições'],
        gradeRange: { minGrade: 1, maxGrade: 12 },
      },
    ],
  },
  metropole: {
    name: 'Metrópole Urbana',
    customProjects: [
      {
        name: 'Robótica Avançada',
        description: 'Preparação para competições nacionais',
        icon: '🤖',
        objectives: ['Programação', 'Engenharia', 'Inovação'],
        targetGrades: ['6º ano', '7º ano', '8º ano', '9º ano', '1º EM', '2º EM', '3º EM'],
      },
      {
        name: 'Preparatório Militar',
        description: 'Disciplina e excelência',
        icon: '⚔️',
        objectives: ['Liderança', 'Disciplina', 'Excelência'],
        targetGrades: ['1º EM', '2º EM', '3º EM'],
      },
      {
        name: 'Turismo Local',
        description: 'Conhecer a cidade',
        icon: '🏙️',
        objectives: ['Conhecer patrimônio', 'Empreendedorismo', 'Turismo'],
        targetGrades: ['7º ano', '8º ano', '9º ano'],
      },
    ],
    customSubjects: [
      {
        name: 'Tecnologia Urbana',
        icon: '🌐',
        description: 'Smart cities e inovação',
        activities: ['Programação', 'IoT', 'Sustentabilidade urbana'],
        gradeRange: { minGrade: 6, maxGrade: 12 },
      },
    ],
  },
};

// ============================================
// HELPERS
// ============================================

export function createMunicipalityCustomization(
  municipalityName: string,
  state: string,
  baseCustomization?: Partial<MunicipalityCustomization>
): MunicipalityCustomization {
  return {
    id: `municipality_${Date.now()}`,
    municipalityName,
    state,
    customSchoolTypes: baseCustomization?.customSchoolTypes || [],
    customSubjects: baseCustomization?.customSubjects || [],
    customProjects: baseCustomization?.customProjects || [],
    moduleFeatures: baseCustomization?.moduleFeatures || [],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function toggleModule(
  customization: MunicipalityCustomization,
  moduleName: string,
  enabled: boolean
): MunicipalityCustomization {
  return {
    ...customization,
    moduleFeatures: customization.moduleFeatures.map((mf) =>
      mf.moduleName === moduleName ? { ...mf, enabled } : mf
    ),
    updatedAt: new Date(),
  };
}

export function addCustomSubject(
  customization: MunicipalityCustomization,
  subject: Omit<CustomSubject, 'id' | 'municipalityId' | 'createdAt' | 'updatedAt'>
): MunicipalityCustomization {
  const newSubject: CustomSubject = {
    ...subject,
    id: `subject_${Date.now()}`,
    municipalityId: customization.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...customization,
    customSubjects: [...customization.customSubjects, newSubject],
    updatedAt: new Date(),
  };
}

export function addCustomProject(
  customization: MunicipalityCustomization,
  project: Omit<CustomProject, 'id' | 'municipalityId' | 'createdAt' | 'updatedAt'>
): MunicipalityCustomization {
  const newProject: CustomProject = {
    ...project,
    id: `project_${Date.now()}`,
    municipalityId: customization.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    ...customization,
    customProjects: [...customization.customProjects, newProject],
    updatedAt: new Date(),
  };
}

export function updateNomenclature(
  customization: MunicipalityCustomization,
  nomenclature: Record<string, string>
): MunicipalityCustomization {
  return {
    ...customization,
    nomenclature: {
      ...customization.nomenclature,
      ...nomenclature,
    },
    updatedAt: new Date(),
  };
}

export function getEnabledModules(customization: MunicipalityCustomization): string[] {
  return customization.moduleFeatures
    .filter((mf) => mf.enabled)
    .map((mf) => mf.moduleName);
}

export function isModuleEnabled(
  customization: MunicipalityCustomization,
  moduleName: string
): boolean {
  return customization.moduleFeatures.some(
    (mf) => mf.moduleName === moduleName && mf.enabled
  );
}
