import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { rehearsalPlaylists, playlistSongs } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

const playlistSchema = z.object({
  rehearsalId: z.number(),
  ministryId: z.number(),
  churchId: z.number(),
  name: z.string().min(1, "Nome da playlist é obrigatório"),
  description: z.string().optional(),
  duration: z.number().optional(),
});

const playlistSongSchema = z.object({
  playlistId: z.number(),
  songId: z.number().optional(),
  title: z.string().min(1, "Título da música é obrigatório"),
  artist: z.string().optional(),
  duration: z.number().optional(),
  key: z.string().optional(),
  tempo: z.number().optional(),
  lyrics: z.string().optional(),
  musicUrl: z.string().optional(),
  cifraUrl: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().default(0),
});

export const playlistsRouter = router({
  // List playlists for a rehearsal
  list: publicProcedure
    .input(
      z.object({
        rehearsalId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(rehearsalPlaylists)
          .where(eq(rehearsalPlaylists.rehearsalId, input.rehearsalId))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Playlists] Failed to list:", error);
        return [];
      }
    }),

  // Get playlist by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(rehearsalPlaylists)
          .where(eq(rehearsalPlaylists.id, input.id))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[Playlists] Failed to get by ID:", error);
        return null;
      }
    }),

  // Create new playlist (protected)
  create: protectedProcedure
    .input(playlistSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(rehearsalPlaylists).values({
          rehearsalId: input.rehearsalId,
          ministryId: input.ministryId,
          churchId: input.churchId,
          name: input.name,
          description: input.description || null,
          duration: input.duration || null,
          totalSongs: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true, id: (result as any).insertId };
      } catch (error) {
        console.error("[Playlists] Failed to create:", error);
        throw new Error("Failed to create playlist");
      }
    }),

  // Update playlist (protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...playlistSchema.partial().shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const { id, ...updateData } = input;
        await db
          .update(rehearsalPlaylists)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(rehearsalPlaylists.id, id));

        return { success: true };
      } catch (error) {
        console.error("[Playlists] Failed to update:", error);
        throw new Error("Failed to update playlist");
      }
    }),

  // Delete playlist (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.delete(rehearsalPlaylists).where(eq(rehearsalPlaylists.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[Playlists] Failed to delete:", error);
        throw new Error("Failed to delete playlist");
      }
    }),

  // Get songs in a playlist
  getSongs: publicProcedure
    .input(z.object({ playlistId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(playlistSongs)
          .where(eq(playlistSongs.playlistId, input.playlistId));

        return result;
      } catch (error) {
        console.error("[Playlists] Failed to get songs:", error);
        return [];
      }
    }),

  // Add song to playlist (protected)
  addSong: protectedProcedure
    .input(playlistSongSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(playlistSongs).values({
          playlistId: input.playlistId,
          songId: input.songId || null,
          title: input.title,
          artist: input.artist || null,
          duration: input.duration || null,
          key: input.key || null,
          tempo: input.tempo || null,
          lyrics: input.lyrics || null,
          musicUrl: input.musicUrl || null,
          cifraUrl: input.cifraUrl || null,
          notes: input.notes || null,
          order: input.order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true, id: (result as any).insertId };
      } catch (error) {
        console.error("[Playlists] Failed to add song:", error);
        throw new Error("Failed to add song to playlist");
      }
    }),

  // Remove song from playlist (protected)
  removeSong: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.delete(playlistSongs).where(eq(playlistSongs.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[Playlists] Failed to remove song:", error);
        throw new Error("Failed to remove song from playlist");
      }
    }),

  // Update song in playlist (protected)
  updateSong: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...playlistSongSchema.partial().shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const { id, ...updateData } = input;
        await db
          .update(playlistSongs)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(playlistSongs.id, id));

        return { success: true };
      } catch (error) {
        console.error("[Playlists] Failed to update song:", error);
        throw new Error("Failed to update song");
      }
    }),

  // Reorder songs in playlist (protected)
  reorderSongs: protectedProcedure
    .input(
      z.object({
        playlistId: z.number(),
        songIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Update order for each song
        for (let i = 0; i < input.songIds.length; i++) {
          await db
            .update(playlistSongs)
            .set({
              order: i,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(playlistSongs.id, input.songIds[i]));
        }

        return { success: true };
      } catch (error) {
        console.error("[Playlists] Failed to reorder songs:", error);
        throw new Error("Failed to reorder songs");
      }
    }),

  // Get total duration of playlist
  getTotalDuration: publicProcedure
    .input(z.object({ playlistId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return 0;

      try {
        const songs = await db
          .select()
          .from(playlistSongs)
          .where(eq(playlistSongs.playlistId, input.playlistId));

        const totalDuration = songs.reduce((sum, song) => sum + (song.duration || 0), 0);
        return totalDuration;
      } catch (error) {
        console.error("[Playlists] Failed to get total duration:", error);
        return 0;
      }
    }),
});
