import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { db } from './db';
import { lessons, quizzes, books, minigames, userProgress } from './schema';
import { eq, and } from 'drizzle-orm';

/**
 * Educational Hub Router - Rotas tRPC para Lessons, Quiz, Bookshelf e MinigamesHub
 * 
 * Endpoints:
 * - lessons.getAll
 * - lessons.getById
 * - lessons.complete
 * - lessons.updateProgress
 * - quiz.getQuestions
 * - quiz.submitAnswers
 * - quiz.getResults
 * - books.getAll
 * - books.getRecommendations
 * - books.updateProgress
 * - minigames.getAll
 * - minigames.submitScore
 * - minigames.getDailyChallenges
 */

export const educationalHubRouter = router({
  // ============ LESSONS ============
  lessons: router({
    getAll: publicProcedure.query(async () => {
      try {
        const allLessons = await db.select().from(lessons);
        return allLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          category: lesson.category,
          difficulty: lesson.difficulty as 'fácil' | 'médio' | 'difícil',
          duration: lesson.duration,
          completed: lesson.completed,
          xp: lesson.xp,
          progress: lesson.progress,
        }));
      } catch (error) {
        console.error('Error fetching lessons:', error);
        return [];
      }
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const lesson = await db
            .select()
            .from(lessons)
            .where(eq(lessons.id, input.id))
            .limit(1);
          return lesson[0] || null;
        } catch (error) {
          console.error('Error fetching lesson:', error);
          return null;
        }
      }),

    complete: publicProcedure
      .input(z.object({ lessonId: z.string(), userId: z.string().optional() }))
      .mutation(async ({ input }) => {
        try {
          const lesson = await db
            .select()
            .from(lessons)
            .where(eq(lessons.id, input.lessonId))
            .limit(1);

          if (!lesson[0]) {
            throw new Error('Lesson not found');
          }

          // Update lesson completion
          await db
            .update(lessons)
            .set({
              completed: true,
              progress: 100,
              updatedAt: new Date(),
            })
            .where(eq(lessons.id, input.lessonId));

          return {
            success: true,
            xpEarned: lesson[0].xp,
            message: `Parabéns! Você ganhou ${lesson[0].xp} XP!`,
          };
        } catch (error) {
          console.error('Error completing lesson:', error);
          return {
            success: false,
            message: 'Erro ao completar aula',
          };
        }
      }),

    updateProgress: publicProcedure
      .input(z.object({ lessonId: z.string(), progress: z.number().min(0).max(100) }))
      .mutation(async ({ input }) => {
        try {
          await db
            .update(lessons)
            .set({
              progress: input.progress,
              updatedAt: new Date(),
            })
            .where(eq(lessons.id, input.lessonId));

          return { success: true };
        } catch (error) {
          console.error('Error updating progress:', error);
          return { success: false };
        }
      }),
  }),

  // ============ QUIZ ============
  quiz: router({
    getQuestions: publicProcedure
      .input(z.object({ category: z.string().optional(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        try {
          const allQuizzes = await db.select().from(quizzes).limit(input.limit);
          return allQuizzes.map(q => ({
            id: q.id,
            text: q.question,
            options: JSON.parse(q.options as string),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            category: q.category,
          }));
        } catch (error) {
          console.error('Error fetching quiz questions:', error);
          return [];
        }
      }),

    submitAnswers: publicProcedure
      .input(z.object({
        userId: z.string(),
        answers: z.array(z.object({
          questionId: z.string(),
          selectedAnswer: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        try {
          let correctCount = 0;
          const results = [];

          for (const answer of input.answers) {
            const question = await db
              .select()
              .from(quizzes)
              .where(eq(quizzes.id, answer.questionId))
              .limit(1);

            if (question[0]) {
              const isCorrect = question[0].correctAnswer === answer.selectedAnswer;
              if (isCorrect) correctCount++;

              results.push({
                questionId: answer.questionId,
                isCorrect,
                explanation: question[0].explanation,
              });
            }
          }

          const accuracy = (correctCount / input.answers.length) * 100;
          const xpEarned = Math.round((accuracy / 100) * 500);

          return {
            success: true,
            correctCount,
            totalQuestions: input.answers.length,
            accuracy: Math.round(accuracy),
            xpEarned,
            results,
          };
        } catch (error) {
          console.error('Error submitting quiz answers:', error);
          return {
            success: false,
            message: 'Erro ao enviar respostas',
          };
        }
      }),

    getResults: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          // Fetch user quiz results from database
          const results = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, input.userId));

          return results || [];
        } catch (error) {
          console.error('Error fetching quiz results:', error);
          return [];
        }
      }),
  }),

  // ============ BOOKSHELF ============
  books: router({
    getAll: publicProcedure.query(async () => {
      try {
        const allBooks = await db.select().from(books);
        return allBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          description: book.description,
          rating: book.rating,
          progress: book.progress,
          status: book.status as 'reading' | 'completed' | 'wishlist',
          readingTime: book.readingTime,
          difficulty: book.difficulty as 'fácil' | 'médio' | 'difícil',
          tags: JSON.parse(book.tags as string),
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
        return [];
      }
    }),

    getRecommendations: publicProcedure
      .input(z.object({ userId: z.string(), limit: z.number().default(5) }))
      .query(async ({ input }) => {
        try {
          // Get user's reading history
          const userBooks = await db
            .select()
            .from(books)
            .where(eq(books.userId, input.userId));

          // Extract favorite categories
          const categories = userBooks
            .filter(b => b.status === 'completed')
            .map(b => b.category);

          const favoriteCategory = categories.length > 0
            ? categories.reduce((a, b, _, arr) =>
                arr.filter(v => v === a).length > arr.filter(v => v === b).length ? a : b
              )
            : null;

          // Get recommendations
          const recommended = await db
            .select()
            .from(books)
            .where(
              favoriteCategory
                ? eq(books.category, favoriteCategory)
                : undefined
            )
            .limit(input.limit);

          return recommended;
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          return [];
        }
      }),

    updateProgress: publicProcedure
      .input(z.object({ bookId: z.string(), progress: z.number().min(0).max(100) }))
      .mutation(async ({ input }) => {
        try {
          const newStatus = input.progress >= 100 ? 'completed' : 'reading';

          await db
            .update(books)
            .set({
              progress: input.progress,
              status: newStatus,
              updatedAt: new Date(),
            })
            .where(eq(books.id, input.bookId));

          return { success: true };
        } catch (error) {
          console.error('Error updating book progress:', error);
          return { success: false };
        }
      }),
  }),

  // ============ MINIGAMES ============
  minigames: router({
    getAll: publicProcedure.query(async () => {
      try {
        const allGames = await db.select().from(minigames);
        return allGames.map(game => ({
          id: game.id,
          title: game.title,
          description: game.description,
          category: game.category,
          difficulty: game.difficulty,
          averageScore: game.averageScore,
          personalBest: game.personalBest,
          timesPlayed: game.timesPlayed,
          reward: game.reward,
          estimatedTime: game.estimatedTime,
        }));
      } catch (error) {
        console.error('Error fetching minigames:', error);
        return [];
      }
    }),

    submitScore: publicProcedure
      .input(z.object({
        userId: z.string(),
        gameId: z.string(),
        score: z.number(),
      }))
      .mutation(async ({ input }) => {
        try {
          const game = await db
            .select()
            .from(minigames)
            .where(eq(minigames.id, input.gameId))
            .limit(1);

          if (!game[0]) {
            throw new Error('Game not found');
          }

          const newTimesPlayed = game[0].timesPlayed + 1;
          const newAverageScore = Math.round(
            (game[0].averageScore * game[0].timesPlayed + input.score) / newTimesPlayed
          );
          const newPersonalBest = Math.max(game[0].personalBest, input.score);

          // Update game stats
          await db
            .update(minigames)
            .set({
              timesPlayed: newTimesPlayed,
              averageScore: newAverageScore,
              personalBest: newPersonalBest,
              updatedAt: new Date(),
            })
            .where(eq(minigames.id, input.gameId));

          // Calculate XP reward
          let xpReward = game[0].reward;
          if (input.score > game[0].personalBest) {
            xpReward += 50; // Bonus for new personal best
          }
          if (input.score > game[0].averageScore) {
            xpReward += 25; // Bonus for above average
          }

          return {
            success: true,
            xpEarned: xpReward,
            newPersonalBest: newPersonalBest > game[0].personalBest,
            message: `Você ganhou ${xpReward} XP!`,
          };
        } catch (error) {
          console.error('Error submitting game score:', error);
          return {
            success: false,
            message: 'Erro ao enviar score',
          };
        }
      }),

    getDailyChallenges: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        try {
          // Fetch daily challenges for user
          const challenges = await db
            .select()
            .from(userProgress)
            .where(
              and(
                eq(userProgress.userId, input.userId),
                eq(userProgress.type, 'daily_challenge')
              )
            );

          return challenges || [];
        } catch (error) {
          console.error('Error fetching daily challenges:', error);
          return [];
        }
      }),
  }),
});

export type EducationalHubRouter = typeof educationalHubRouter;
