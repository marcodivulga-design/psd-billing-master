import { publicProcedure, router } from '../_core/trpc';
import { musicSourcesScraper } from '../services/music-sources-scraper.service';
import { catholicMusicCollector } from '../services/catholic-music-collector.service';
import { z } from 'zod';

/**
 * Catholic Music Collection Router
 * 
 * Handles music collection, classification, and retrieval
 */

export const catholicMusicRouter = router({
  /**
   * Collect and save songs from all trusted sources
   */
  collectFromSources: publicProcedure.mutation(async () => {
    try {
      const result = await musicSourcesScraper.collectFromAllSources();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: `Collection failed: ${error}`,
      };
    }
  }),

  /**
   * Get collection statistics
   */
  getStats: publicProcedure.query(async () => {
    try {
      const stats = await catholicMusicCollector.getStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get stats: ${error}`,
      };
    }
  }),

  /**
   * Get sample songs for preview
   */
  getSampleSongs: publicProcedure.query(() => {
    try {
      const samples = musicSourcesScraper.getSampleSongs();
      return {
        success: true,
        data: samples,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get samples: ${error}`,
      };
    }
  }),

  /**
   * Classify a song
   */
  classifySong: publicProcedure
    .input(
      z.object({
        title: z.string(),
        lyrics: z.string().optional(),
      })
    )
    .query(({ input }) => {
      try {
        const genre = catholicMusicCollector.classifyGenre(input.title);
        const massFunction = catholicMusicCollector.classifyMassFunction(input.title, input.lyrics);
        const liturgicalTime = catholicMusicCollector.classifyLiturgicalTime(input.title);

        return {
          success: true,
          data: {
            genre,
            massFunction,
            liturgicalTime,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: `Classification failed: ${error}`,
        };
      }
    }),
});
