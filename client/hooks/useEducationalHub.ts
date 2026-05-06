import { useCallback, useState } from 'react';
import { trpc } from '../utils/trpc';

/**
 * useEducationalHub - Hook customizado para gerenciar dados do Educational Hub
 * 
 * Provides:
 * - Lessons management
 * - Quiz management
 * - Books management
 * - Minigames management
 */

export const useEducationalHub = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============ LESSONS ============
  const {
    data: lessons,
    isLoading: lessonsLoading,
    refetch: refetchLessons,
  } = trpc.educationalHub.lessons.getAll.useQuery();

  const completeLesson = useCallback(
    async (lessonId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await trpc.educationalHub.lessons.complete.mutate({
          lessonId,
        });
        await refetchLessons();
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchLessons]
  );

  const updateLessonProgress = useCallback(
    async (lessonId: string, progress: number) => {
      try {
        setIsLoading(true);
        setError(null);
        await trpc.educationalHub.lessons.updateProgress.mutate({
          lessonId,
          progress,
        });
        await refetchLessons();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchLessons]
  );

  // ============ QUIZ ============
  const {
    data: quizQuestions,
    isLoading: quizLoading,
  } = trpc.educationalHub.quiz.getQuestions.useQuery();

  const submitQuizAnswers = useCallback(
    async (userId: string, answers: Array<{ questionId: string; selectedAnswer: number }>) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await trpc.educationalHub.quiz.submitAnswers.mutate({
          userId,
          answers,
        });
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============ BOOKS ============
  const {
    data: books,
    isLoading: booksLoading,
    refetch: refetchBooks,
  } = trpc.educationalHub.books.getAll.useQuery();

  const updateBookProgress = useCallback(
    async (bookId: string, progress: number) => {
      try {
        setIsLoading(true);
        setError(null);
        await trpc.educationalHub.books.updateProgress.mutate({
          bookId,
          progress,
        });
        await refetchBooks();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchBooks]
  );

  const getBookRecommendations = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await trpc.educationalHub.books.getRecommendations.query({
          userId,
        });
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============ MINIGAMES ============
  const {
    data: minigames,
    isLoading: minigamesLoading,
    refetch: refetchMinigames,
  } = trpc.educationalHub.minigames.getAll.useQuery();

  const submitGameScore = useCallback(
    async (userId: string, gameId: string, score: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await trpc.educationalHub.minigames.submitScore.mutate({
          userId,
          gameId,
          score,
        });
        await refetchMinigames();
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [refetchMinigames]
  );

  const getDailyChallenges = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await trpc.educationalHub.minigames.getDailyChallenges.query({
          userId,
        });
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    // Lessons
    lessons,
    lessonsLoading,
    completeLesson,
    updateLessonProgress,
    refetchLessons,

    // Quiz
    quizQuestions,
    quizLoading,
    submitQuizAnswers,

    // Books
    books,
    booksLoading,
    updateBookProgress,
    getBookRecommendations,
    refetchBooks,

    // Minigames
    minigames,
    minigamesLoading,
    submitGameScore,
    getDailyChallenges,
    refetchMinigames,

    // Global
    isLoading,
    error,
  };
};

export default useEducationalHub;
