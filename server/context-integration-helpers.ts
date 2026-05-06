/**
 * context-integration-helpers.ts
 * 
 * MELHORIAS CONTEXTUAIS
 * 
 * Helpers para integrar contexto de hierarquia educacional
 * nas camadas de aprendizagem, gamificação e IA.
 * 
 * Isso garante que cada usuário veja dados relevantes
 * ao seu contexto (escola, turma, série, etc).
 */

// ============================================================================
// CONTEXTO DE USUÁRIO EDUCACIONAL
// ============================================================================

export interface EducationalContext {
  userId: string;
  role: string;
  stateId?: string;
  cityId?: string;
  secretariatId?: string;
  networkId?: string;
  schoolId?: string;
  academicYearId?: string;
  classroomId?: string;
  level?: string; // infantil, fundamental1, fundamental2, medio, eja
}

// ============================================================================
// FILTROS DE CONTEXTO
// ============================================================================

export const createContextFilter = (context: EducationalContext) => {
  const filters: Record<string, string> = {};

  if (context.stateId) filters.state_id = context.stateId;
  if (context.cityId) filters.city_id = context.cityId;
  if (context.secretariatId) filters.secretariat_id = context.secretariatId;
  if (context.networkId) filters.network_id = context.networkId;
  if (context.schoolId) filters.school_id = context.schoolId;
  if (context.classroomId) filters.classroom_id = context.classroomId;

  return filters;
};

// ============================================================================
// CONTEXTO PARA AULAS
// ============================================================================

export const getLessonsForContext = (context: EducationalContext) => {
  return {
    query: `
      SELECT l.* FROM lessons l
      JOIN classrooms c ON l.classroom_id = c.id
      JOIN academic_years ay ON c.academic_year_id = ay.id
      JOIN schools s ON ay.school_id = s.id
      WHERE s.id = $1 AND ay.id = $2
      ORDER BY l.created_at DESC
    `,
    params: [context.schoolId, context.academicYearId],
  };
};

// ============================================================================
// CONTEXTO PARA GAMIFICAÇÃO
// ============================================================================

export const getStudentXPForContext = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        u.id, u.first_name, u.last_name,
        COALESCE(SUM(xp.amount), 0) as total_xp,
        COUNT(DISTINCT a.id) as achievements_count,
        MAX(xp.created_at) as last_activity
      FROM users u
      JOIN user_school_associations usa ON u.id = usa.user_id
      LEFT JOIN xp_transactions xp ON u.id = xp.user_id
      LEFT JOIN achievements a ON u.id = a.user_id
      WHERE usa.school_id = $1 AND usa.classroom_id = $2
      GROUP BY u.id, u.first_name, u.last_name
      ORDER BY total_xp DESC
    `,
    params: [context.schoolId, context.classroomId],
  };
};

export const getClassroomLeaderboard = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        u.id, u.first_name, u.last_name, u.avatar,
        COALESCE(SUM(xp.amount), 0) as total_xp,
        RANK() OVER (ORDER BY COALESCE(SUM(xp.amount), 0) DESC) as rank
      FROM users u
      JOIN user_school_associations usa ON u.id = usa.user_id
      LEFT JOIN xp_transactions xp ON u.id = xp.user_id
      WHERE usa.school_id = $1 AND usa.classroom_id = $2
      GROUP BY u.id, u.first_name, u.last_name, u.avatar
      ORDER BY total_xp DESC
      LIMIT 10
    `,
    params: [context.schoolId, context.classroomId],
  };
};

// ============================================================================
// CONTEXTO PARA IA PEDAGÓGICA
// ============================================================================

export const getStudentProgressForContext = (context: EducationalContext, studentId: string) => {
  return {
    query: `
      SELECT 
        s.id, s.name,
        COUNT(DISTINCT l.id) as lessons_completed,
        AVG(q.score) as average_score,
        COUNT(DISTINCT CASE WHEN q.score >= 7 THEN q.id END) as passed_quizzes,
        COUNT(DISTINCT CASE WHEN q.score < 7 THEN q.id END) as failed_quizzes
      FROM students s
      LEFT JOIN lessons l ON s.id = l.student_id AND l.status = 'completed'
      LEFT JOIN quizzes q ON s.id = q.student_id
      WHERE s.classroom_id = $1
      GROUP BY s.id, s.name
    `,
    params: [context.classroomId],
  };
};

export const getAdaptiveRecommendations = (context: EducationalContext, studentId: string) => {
  return {
    query: `
      SELECT 
        l.id, l.name, l.subject,
        AVG(q.score) as average_score,
        COUNT(q.id) as attempts,
        CASE 
          WHEN AVG(q.score) < 5 THEN 'critical'
          WHEN AVG(q.score) < 7 THEN 'needs_help'
          WHEN AVG(q.score) >= 7 THEN 'good'
        END as difficulty_level
      FROM lessons l
      LEFT JOIN quizzes q ON l.id = q.lesson_id AND q.student_id = $1
      WHERE l.classroom_id = $2
      GROUP BY l.id, l.name, l.subject
      HAVING AVG(q.score) < 7 OR COUNT(q.id) = 0
      ORDER BY average_score ASC, COUNT(q.id) DESC
    `,
    params: [studentId, context.classroomId],
  };
};

// ============================================================================
// CONTEXTO PARA RELATÓRIOS
// ============================================================================

export const getClassroomReport = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        c.name as classroom_name,
        COUNT(DISTINCT u.id) as total_students,
        AVG(q.score) as average_score,
        COUNT(DISTINCT l.id) as lessons_completed,
        COUNT(DISTINCT CASE WHEN q.score >= 7 THEN q.id END)::float / 
          NULLIF(COUNT(DISTINCT q.id), 0) * 100 as pass_rate
      FROM classrooms c
      JOIN user_school_associations usa ON c.id = usa.classroom_id
      JOIN users u ON usa.user_id = u.id
      LEFT JOIN lessons l ON c.id = l.classroom_id AND l.status = 'completed'
      LEFT JOIN quizzes q ON c.id = q.classroom_id
      WHERE c.id = $1
      GROUP BY c.name
    `,
    params: [context.classroomId],
  };
};

export const getSchoolReport = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        s.name as school_name,
        COUNT(DISTINCT u.id) as total_students,
        COUNT(DISTINCT t.id) as total_teachers,
        COUNT(DISTINCT c.id) as total_classrooms,
        AVG(q.score) as average_score,
        COUNT(DISTINCT l.id) as total_lessons_completed
      FROM schools s
      LEFT JOIN education_networks en ON s.network_id = en.id
      LEFT JOIN academic_years ay ON s.id = ay.school_id
      LEFT JOIN classrooms c ON ay.id = c.academic_year_id
      LEFT JOIN user_school_associations usa ON s.id = usa.school_id
      LEFT JOIN users u ON usa.user_id = u.id AND u.role = 'student'
      LEFT JOIN users t ON usa.user_id = t.id AND t.role = 'teacher'
      LEFT JOIN lessons l ON c.id = l.classroom_id AND l.status = 'completed'
      LEFT JOIN quizzes q ON c.id = q.classroom_id
      WHERE s.id = $1
      GROUP BY s.name
    `,
    params: [context.schoolId],
  };
};

// ============================================================================
// CONTEXTO PARA NOTIFICAÇÕES
// ============================================================================

export const getContextualNotifications = (context: EducationalContext, userId: string) => {
  return {
    query: `
      SELECT 
        n.id, n.type, n.title, n.message, n.created_at,
        CASE n.type
          WHEN 'achievement' THEN '🏆'
          WHEN 'level_up' THEN '⬆️'
          WHEN 'new_lesson' THEN '📚'
          WHEN 'assignment_due' THEN '⏰'
          WHEN 'grade_posted' THEN '📊'
          ELSE '📢'
        END as icon
      FROM notifications n
      WHERE n.user_id = $1 
        AND n.school_id = $2
        AND n.created_at > NOW() - INTERVAL '7 days'
      ORDER BY n.created_at DESC
      LIMIT 20
    `,
    params: [userId, context.schoolId],
  };
};

// ============================================================================
// CONTEXTO PARA EVENTOS E DESAFIOS
// ============================================================================

export const getSchoolEvents = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        e.id, e.name, e.description, e.start_date, e.end_date,
        e.type, e.participants_count
      FROM events e
      WHERE e.school_id = $1 
        AND e.start_date >= NOW()
      ORDER BY e.start_date ASC
    `,
    params: [context.schoolId],
  };
};

export const getCityEvents = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        e.id, e.name, e.description, e.start_date, e.end_date,
        e.type, COUNT(DISTINCT p.id) as participants_count
      FROM events e
      LEFT JOIN event_participants p ON e.id = p.event_id
      WHERE e.city_id = $1 
        AND e.start_date >= NOW()
      GROUP BY e.id, e.name, e.description, e.start_date, e.end_date, e.type
      ORDER BY e.start_date ASC
    `,
    params: [context.cityId],
  };
};

// ============================================================================
// CONTEXTO PARA COMUNICAÇÃO
// ============================================================================

export const getClassroomMessages = (context: EducationalContext) => {
  return {
    query: `
      SELECT 
        m.id, m.sender_id, m.content, m.created_at,
        u.first_name, u.last_name, u.avatar,
        u.role
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.classroom_id = $1
      ORDER BY m.created_at DESC
      LIMIT 50
    `,
    params: [context.classroomId],
  };
};

// ============================================================================
// MIDDLEWARE DE CONTEXTO
// ============================================================================

export const createContextMiddleware = () => {
  return {
    extractContext: (req: any): EducationalContext => {
      return {
        userId: req.user?.id,
        role: req.user?.role,
        stateId: req.query?.stateId || req.body?.stateId,
        cityId: req.query?.cityId || req.body?.cityId,
        secretariatId: req.query?.secretariatId || req.body?.secretariatId,
        networkId: req.query?.networkId || req.body?.networkId,
        schoolId: req.query?.schoolId || req.body?.schoolId,
        academicYearId: req.query?.academicYearId || req.body?.academicYearId,
        classroomId: req.query?.classroomId || req.body?.classroomId,
        level: req.query?.level || req.body?.level,
      };
    },

    validateContext: (context: EducationalContext): boolean => {
      // Validar se usuário tem acesso ao contexto
      return !!(context.userId && (context.schoolId || context.cityId));
    },

    enrichContext: async (context: EducationalContext) => {
      // Enriquecer contexto com dados adicionais
      return {
        ...context,
        timestamp: new Date().toISOString(),
        version: '1.0',
      };
    },
  };
};

// ============================================================================
// CACHE DE CONTEXTO
// ============================================================================

export const createContextCache = () => {
  const cache = new Map<string, any>();

  return {
    get: (key: string) => cache.get(key),
    set: (key: string, value: any, ttl: number = 300000) => {
      cache.set(key, value);
      setTimeout(() => cache.delete(key), ttl);
    },
    clear: () => cache.clear(),
  };
};
