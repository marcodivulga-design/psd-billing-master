/**
 * educational-hierarchy-schema.ts
 * 
 * CAMADA 1: BASE EDUCACIONAL
 * 
 * Estrutura hierárquica completa:
 * Estados → Cidades → Secretarias → Redes → Escolas → Séries → Turmas → Calendário
 * 
 * Isso é o coração do sistema.
 */

import { pgTable, text, varchar, integer, timestamp, boolean, date, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// NÍVEL 1: ESTADOS
// ============================================================================

export const states = pgTable('states', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 2 }).unique().notNull(), // UF: SP, RJ, MG, etc
  name: varchar('name', { length: 100 }).notNull(), // São Paulo, Rio de Janeiro, etc
  region: varchar('region', { length: 50 }), // Sudeste, Nordeste, etc
  population: integer('population'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 2: CIDADES
// ============================================================================

export const cities = pgTable('cities', {
  id: uuid('id').primaryKey().defaultRandom(),
  stateId: uuid('state_id').notNull().references(() => states.id),
  code: varchar('code', { length: 10 }).unique().notNull(), // IBGE code
  name: varchar('name', { length: 100 }).notNull(),
  population: integer('population'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 3: SECRETARIAS MUNICIPAIS
// ============================================================================

export const municipalSecretariats = pgTable('municipal_secretariats', {
  id: uuid('id').primaryKey().defaultRandom(),
  cityId: uuid('city_id').notNull().references(() => cities.id),
  name: varchar('name', { length: 150 }).notNull(), // Secretaria de Educação de São Paulo
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  website: varchar('website', { length: 255 }),
  address: text('address'),
  contactPerson: varchar('contact_person', { length: 100 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 4: REDES DE ENSINO
// ============================================================================

export const educationNetworks = pgTable('education_networks', {
  id: uuid('id').primaryKey().defaultRandom(),
  secretariatId: uuid('secretariat_id').notNull().references(() => municipalSecretariats.id),
  name: varchar('name', { length: 150 }).notNull(), // Rede Municipal de Ensino
  type: varchar('type', { length: 50 }).notNull(), // municipal, estadual, federal, particular
  description: text('description'),
  totalSchools: integer('total_schools').default(0),
  totalStudents: integer('total_students').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 5: ESCOLAS
// ============================================================================

export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  networkId: uuid('network_id').notNull().references(() => educationNetworks.id),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 20 }).unique(),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  principalName: varchar('principal_name', { length: 100 }),
  totalStudents: integer('total_students').default(0),
  totalTeachers: integer('total_teachers').default(0),
  schoolType: varchar('school_type', { length: 50 }), // urbana, rural, indígena, quilombola, etc
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata'), // Dados customizados por secretaria
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 6: SÉRIES/ANOS
// ============================================================================

export const academicYears = pgTable('academic_years', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  year: integer('year').notNull(), // 1º ano, 2º ano, etc
  level: varchar('level', { length: 50 }).notNull(), // infantil, fundamental1, fundamental2, medio, eja
  description: varchar('description', { length: 100 }),
  totalStudents: integer('total_students').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 7: TURMAS
// ============================================================================

export const classrooms = pgTable('classrooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  academicYearId: uuid('academic_year_id').notNull().references(() => academicYears.id),
  name: varchar('name', { length: 50 }).notNull(), // 1º A, 1º B, etc
  code: varchar('code', { length: 20 }).unique(),
  teacherId: uuid('teacher_id'), // Professor responsável
  totalStudents: integer('total_students').default(0),
  shift: varchar('shift', { length: 20 }), // matutino, vespertino, noturno
  capacity: integer('capacity').default(30),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// NÍVEL 8: CALENDÁRIO ESCOLAR
// ============================================================================

export const schoolCalendars = pgTable('school_calendars', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  academicYear: integer('academic_year').notNull(), // 2024, 2025, etc
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalDays: integer('total_days'),
  holidays: jsonb('holidays'), // Array de datas de feriados
  breaks: jsonb('breaks'), // Array de períodos de recesso
  assessmentPeriods: jsonb('assessment_periods'), // Períodos de avaliação
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// RELAÇÕES
// ============================================================================

export const statesRelations = relations(states, ({ many }) => ({
  cities: many(cities),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  state: one(states, { fields: [cities.stateId], references: [states.id] }),
  secretariats: many(municipalSecretariats),
}));

export const municipalSecretariatsRelations = relations(municipalSecretariats, ({ one, many }) => ({
  city: one(cities, { fields: [municipalSecretariats.cityId], references: [cities.id] }),
  networks: many(educationNetworks),
}));

export const educationNetworksRelations = relations(educationNetworks, ({ one, many }) => ({
  secretariat: one(municipalSecretariats, { fields: [educationNetworks.secretariatId], references: [municipalSecretariats.id] }),
  schools: many(schools),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  network: one(educationNetworks, { fields: [schools.networkId], references: [educationNetworks.id] }),
  academicYears: many(academicYears),
  calendars: many(schoolCalendars),
}));

export const academicYearsRelations = relations(academicYears, ({ one, many }) => ({
  school: one(schools, { fields: [academicYears.schoolId], references: [schools.id] }),
  classrooms: many(classrooms),
}));

export const classroomsRelations = relations(classrooms, ({ one }) => ({
  academicYear: one(academicYears, { fields: [classrooms.academicYearId], references: [academicYears.id] }),
}));

export const schoolCalendarsRelations = relations(schoolCalendars, ({ one }) => ({
  school: one(schools, { fields: [schoolCalendars.schoolId], references: [schools.id] }),
}));

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================

export type State = typeof states.$inferSelect;
export type City = typeof cities.$inferSelect;
export type MunicipalSecretariat = typeof municipalSecretariats.$inferSelect;
export type EducationNetwork = typeof educationNetworks.$inferSelect;
export type School = typeof schools.$inferSelect;
export type AcademicYear = typeof academicYears.$inferSelect;
export type Classroom = typeof classrooms.$inferSelect;
export type SchoolCalendar = typeof schoolCalendars.$inferSelect;

// ============================================================================
// HELPERS
// ============================================================================

export const getSchoolHierarchy = (schoolId: string) => {
  return {
    query: `
      SELECT 
        s.id as state_id, s.name as state_name,
        c.id as city_id, c.name as city_name,
        ms.id as secretariat_id, ms.name as secretariat_name,
        en.id as network_id, en.name as network_name,
        sch.id as school_id, sch.name as school_name
      FROM schools sch
      JOIN education_networks en ON sch.network_id = en.id
      JOIN municipal_secretariats ms ON en.secretariat_id = ms.id
      JOIN cities c ON ms.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE sch.id = $1
    `,
    params: [schoolId],
  };
};

export const getClassroomHierarchy = (classroomId: string) => {
  return {
    query: `
      SELECT 
        s.id as state_id, s.name as state_name,
        c.id as city_id, c.name as city_name,
        ms.id as secretariat_id, ms.name as secretariat_name,
        en.id as network_id, en.name as network_name,
        sch.id as school_id, sch.name as school_name,
        ay.id as academic_year_id, ay.year as academic_year,
        cls.id as classroom_id, cls.name as classroom_name
      FROM classrooms cls
      JOIN academic_years ay ON cls.academic_year_id = ay.id
      JOIN schools sch ON ay.school_id = sch.id
      JOIN education_networks en ON sch.network_id = en.id
      JOIN municipal_secretariats ms ON en.secretariat_id = ms.id
      JOIN cities c ON ms.city_id = c.id
      JOIN states s ON c.state_id = s.id
      WHERE cls.id = $1
    `,
    params: [classroomId],
  };
};

export const getStatistics = (secretariatId: string) => {
  return {
    query: `
      SELECT 
        COUNT(DISTINCT sch.id) as total_schools,
        COUNT(DISTINCT ay.id) as total_academic_years,
        COUNT(DISTINCT cls.id) as total_classrooms,
        SUM(sch.total_students) as total_students,
        SUM(sch.total_teachers) as total_teachers
      FROM education_networks en
      LEFT JOIN schools sch ON en.id = sch.network_id
      LEFT JOIN academic_years ay ON sch.id = ay.school_id
      LEFT JOIN classrooms cls ON ay.id = cls.academic_year_id
      WHERE en.secretariat_id = $1
    `,
    params: [secretariatId],
  };
};
