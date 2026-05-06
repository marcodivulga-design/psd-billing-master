/**
 * rbac-permissions-schema.ts
 * 
 * CAMADA 2: USUÁRIOS E PERMISSÕES
 * 
 * 8 Perfis com controle de acesso granular:
 * 1. Aluno
 * 2. Pais
 * 3. Professor
 * 4. Coordenador
 * 5. Diretor
 * 6. Secretário (Municipal)
 * 7. Administrador Municipal
 * 8. Suporte Técnico
 * 
 * Cada perfil vê só o que precisa.
 */

import { pgTable, text, varchar, boolean, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// TIPOS DE PERFIS
// ============================================================================

export enum UserRole {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
  COORDINATOR = 'coordinator',
  PRINCIPAL = 'principal',
  MUNICIPAL_SECRETARY = 'municipal_secretary',
  MUNICIPAL_ADMIN = 'municipal_admin',
  TECHNICAL_SUPPORT = 'technical_support',
}

// ============================================================================
// USUÁRIOS
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: text('password').notNull(), // Hash bcrypt
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatar: text('avatar'), // URL
  birthDate: text('birth_date'), // YYYY-MM-DD
  cpf: varchar('cpf', { length: 14 }).unique(), // XXX.XXX.XXX-XX
  role: varchar('role', { length: 50 }).notNull(), // student, parent, teacher, etc
  isActive: boolean('is_active').default(true),
  emailVerified: boolean('email_verified').default(false),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// ASSOCIAÇÕES DE USUÁRIO COM HIERARQUIA
// ============================================================================

export const userSchoolAssociations = pgTable('user_school_associations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').notNull(), // Referência a schools
  classroomId: uuid('classroom_id'), // Opcional: para alunos e professores
  role: varchar('role', { length: 50 }).notNull(), // Role específico nesta escola
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// PERMISSÕES (GRANULARES)
// ============================================================================

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).unique().notNull(), // ex: 'view_grades', 'create_lesson'
  name: varchar('name', { length: 150 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(), // learning, management, reporting, etc
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// ROLES (PERFIS COM PERMISSÕES)
// ============================================================================

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).unique().notNull(), // student, teacher, principal, etc
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  permissions: jsonb('permissions'), // Array de permission IDs
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// ROLE-PERMISSION MAPPING
// ============================================================================

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  permissionId: uuid('permission_id').notNull().references(() => permissions.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// RELAÇÕES
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  schoolAssociations: many(userSchoolAssociations),
}));

export const userSchoolAssociationsRelations = relations(userSchoolAssociations, ({ one }) => ({
  user: one(users, { fields: [userSchoolAssociations.userId], references: [users.id] }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

// ============================================================================
// TIPOS TYPESCRIPT
// ============================================================================

export type User = typeof users.$inferSelect;
export type UserSchoolAssociation = typeof userSchoolAssociations.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type RolePermission = typeof rolePermissions.$inferSelect;

// ============================================================================
// PERMISSÕES PADRÃO POR PERFIL
// ============================================================================

export const DEFAULT_PERMISSIONS = {
  STUDENT: [
    'view_own_lessons',
    'view_own_grades',
    'submit_assignments',
    'view_own_progress',
    'participate_in_games',
    'view_leaderboard',
    'view_own_achievements',
    'view_own_xp',
  ],
  PARENT: [
    'view_child_grades',
    'view_child_progress',
    'view_child_assignments',
    'view_child_attendance',
    'communicate_with_teacher',
    'view_school_calendar',
    'view_child_achievements',
  ],
  TEACHER: [
    'view_classroom_students',
    'create_lessons',
    'create_assignments',
    'grade_assignments',
    'view_student_progress',
    'send_notifications',
    'create_quizzes',
    'view_classroom_analytics',
    'communicate_with_parents',
    'manage_classroom',
  ],
  COORDINATOR: [
    'view_all_teachers',
    'view_all_classrooms',
    'view_school_analytics',
    'manage_curriculum',
    'create_reports',
    'manage_school_calendar',
    'view_school_performance',
    'manage_teachers',
  ],
  PRINCIPAL: [
    'view_school_dashboard',
    'view_all_students',
    'view_all_teachers',
    'view_school_analytics',
    'create_reports',
    'manage_school_settings',
    'view_financial_reports',
    'manage_staff',
    'view_attendance_reports',
    'manage_school_calendar',
  ],
  MUNICIPAL_SECRETARY: [
    'view_city_schools',
    'view_city_analytics',
    'create_city_reports',
    'manage_school_calendar',
    'view_performance_metrics',
    'manage_secretariat_users',
    'view_municipal_dashboard',
  ],
  MUNICIPAL_ADMIN: [
    'manage_all_schools',
    'manage_all_users',
    'view_municipal_analytics',
    'create_municipal_reports',
    'manage_municipal_settings',
    'view_all_data',
    'manage_permissions',
    'manage_roles',
  ],
  TECHNICAL_SUPPORT: [
    'view_system_logs',
    'manage_user_accounts',
    'reset_passwords',
    'view_system_health',
    'manage_backups',
    'view_error_logs',
    'support_users',
  ],
};

// ============================================================================
// HELPERS
// ============================================================================

export const getUserPermissions = (userId: string) => {
  return {
    query: `
      SELECT DISTINCT p.code, p.name, p.category
      FROM users u
      JOIN roles r ON u.role = r.code
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1 AND u.is_active = true
    `,
    params: [userId],
  };
};

export const canUserAccess = (userId: string, permissionCode: string) => {
  return {
    query: `
      SELECT EXISTS (
        SELECT 1
        FROM users u
        JOIN roles r ON u.role = r.code
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = $1 AND p.code = $2 AND u.is_active = true
      ) as has_access
    `,
    params: [userId, permissionCode],
  };
};

export const getUsersByRole = (role: UserRole) => {
  return {
    query: `
      SELECT id, email, first_name, last_name, role, is_active
      FROM users
      WHERE role = $1 AND is_active = true
      ORDER BY first_name, last_name
    `,
    params: [role],
  };
};

export const getUserSchoolContext = (userId: string) => {
  return {
    query: `
      SELECT 
        usa.id as association_id,
        usa.school_id,
        usa.classroom_id,
        usa.role,
        s.name as school_name,
        c.name as city_name,
        st.name as state_name
      FROM user_school_associations usa
      JOIN schools s ON usa.school_id = s.id
      JOIN education_networks en ON s.network_id = en.id
      JOIN municipal_secretariats ms ON en.secretariat_id = ms.id
      JOIN cities c ON ms.city_id = c.id
      JOIN states st ON c.state_id = st.id
      WHERE usa.user_id = $1 AND usa.is_active = true
    `,
    params: [userId],
  };
};

// ============================================================================
// MIDDLEWARE PARA CONTROLE DE ACESSO
// ============================================================================

export const createAccessControl = () => {
  return {
    checkPermission: async (userId: string, permission: string) => {
      // Implementar verificação de permissão
      // Usar query canUserAccess
    },
    checkSchoolAccess: async (userId: string, schoolId: string) => {
      // Verificar se usuário tem acesso à escola
    },
    checkClassroomAccess: async (userId: string, classroomId: string) => {
      // Verificar se usuário tem acesso à turma
    },
  };
};
