import { sqliteTable, text, integer, real, boolean, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Educational Hub Schema - Tabelas para Lessons, Quiz, Books e Minigames
 */

// Lessons Table
export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  difficulty: text('difficulty').default('médio'),
  duration: integer('duration').default(30),
  completed: boolean('completed').default(false),
  xp: integer('xp').default(100),
  progress: integer('progress').default(0),
  userId: text('userId'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Quizzes Table
export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  options: text('options').notNull(), // JSON string
  correctAnswer: integer('correctAnswer').notNull(),
  explanation: text('explanation'),
  difficulty: integer('difficulty').default(1),
  category: text('category'),
  lessonId: text('lessonId'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Books Table
export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
  category: text('category'),
  description: text('description'),
  rating: real('rating').default(0),
  progress: integer('progress').default(0),
  status: text('status').default('wishlist'), // 'reading' | 'completed' | 'wishlist'
  readingTime: integer('readingTime').default(0),
  difficulty: text('difficulty').default('médio'),
  tags: text('tags'), // JSON string
  userId: text('userId'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Minigames Table
export const minigames = sqliteTable('minigames', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  difficulty: integer('difficulty').default(1),
  averageScore: integer('averageScore').default(0),
  personalBest: integer('personalBest').default(0),
  timesPlayed: integer('timesPlayed').default(0),
  reward: integer('reward').default(100),
  estimatedTime: integer('estimatedTime').default(5),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// User Progress Table
export const userProgress = sqliteTable('user_progress', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type'), // 'lesson' | 'quiz' | 'book' | 'minigame' | 'daily_challenge'
  targetId: text('targetId'),
  progress: integer('progress').default(0),
  score: integer('score').default(0),
  completed: boolean('completed').default(false),
  completedAt: text('completedAt'),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Daily Challenges Table
export const dailyChallenges = sqliteTable('daily_challenges', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  gameId: text('gameId').notNull(),
  target: integer('target').notNull(),
  reward: integer('reward').default(500),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  completedAt: text('completedAt'),
  date: text('date').default(sql`CURRENT_DATE`),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Quiz Results Table
export const quizResults = sqliteTable('quiz_results', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  quizId: text('quizId').notNull(),
  answers: text('answers').notNull(), // JSON string
  correctCount: integer('correctCount').default(0),
  totalQuestions: integer('totalQuestions').default(0),
  accuracy: real('accuracy').default(0),
  xpEarned: integer('xpEarned').default(0),
  completedAt: text('completedAt').default(sql`CURRENT_TIMESTAMP`),
});

// Leaderboard Table
export const leaderboard = sqliteTable('leaderboard', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  totalXP: integer('totalXP').default(0),
  level: integer('level').default(1),
  rank: integer('rank'),
  gamesPlayed: integer('gamesPlayed').default(0),
  averageAccuracy: real('averageAccuracy').default(0),
  streak: integer('streak').default(0),
  updatedAt: text('updatedAt').default(sql`CURRENT_TIMESTAMP`),
});

export type Lesson = typeof lessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Minigame = typeof minigames.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type Leaderboard = typeof leaderboard.$inferSelect;
