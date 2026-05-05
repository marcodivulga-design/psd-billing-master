import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

// Tipos para Spotify
interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  image?: string;
  tracks: number;
  owner: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  image?: string;
  previewUrl?: string;
}

export const spotifyRouter = router({
  // Conectar conta Spotify
  connectAccount: protectedProcedure
    .input(
      z.object({
        authCode: z.string(),
        redirectUri: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Aqui você trocaria o authCode por um access token
        // const response = await fetch('https://accounts.spotify.com/api/token', {...})

        return {
          success: true,
          message: "Conta Spotify conectada com sucesso",
          accessToken: "spotify_access_token_here",
        };
      } catch (error) {
        console.error("Erro ao conectar Spotify:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao conectar com Spotify",
        });
      }
    }),

  // Listar playlists do usuário
  getPlaylists: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria as playlists do Spotify
        // const response = await fetch('https://api.spotify.com/v1/me/playlists', {...})

        const playlists: SpotifyPlaylist[] = [
          {
            id: "playlist_1",
            name: "Músicas Litúrgicas",
            description: "Seleção de músicas para celebrações",
            tracks: 50,
            owner: "Spotify User",
          },
        ];

        return playlists;
      } catch (error) {
        console.error("Erro ao buscar playlists:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar playlists do Spotify",
        });
      }
    }),

  // Obter faixas de uma playlist
  getPlaylistTracks: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria as faixas da playlist
        // const response = await fetch(`https://api.spotify.com/v1/playlists/${input.playlistId}/tracks`, {...})

        const tracks: SpotifyTrack[] = [];

        return tracks;
      } catch (error) {
        console.error("Erro ao buscar faixas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar faixas da playlist",
        });
      }
    }),

  // Importar playlist para o catálogo
  importPlaylist: adminProcedure
    .input(
      z.object({
        playlistId: z.string(),
        playlistName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Buscar faixas da playlist
        // const tracks = await getPlaylistTracks(input.playlistId)

        // 2. Converter para formato CELEBRA
        // const songs = tracks.map(track => ({...}))

        // 3. Salvar no banco de dados
        // await db.insert(songs).values(songs)

        return {
          success: true,
          message: `Playlist "${input.playlistName}" importada com sucesso`,
          importedCount: 0,
        };
      } catch (error) {
        console.error("Erro ao importar playlist:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao importar playlist",
        });
      }
    }),

  // Sincronizar histórico de reprodução
  syncPlaybackHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Buscar histórico do Spotify
        // const history = await fetch('https://api.spotify.com/v1/me/player/recently-played', {...})

        // 2. Sincronizar com banco de dados local
        // await db.insert(playbackHistory).values(...)

        return {
          success: true,
          message: "Histórico sincronizado",
          syncedCount: 0,
        };
      } catch (error) {
        console.error("Erro ao sincronizar histórico:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao sincronizar histórico",
        });
      }
    }),

  // Buscar música no Spotify
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        type: z.enum(["track", "artist", "album"]).default("track"),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        // Aqui você buscaria no Spotify
        // const response = await fetch(`https://api.spotify.com/v1/search?q=${input.query}&type=${input.type}`, {...})

        return [];
      } catch (error) {
        console.error("Erro ao buscar no Spotify:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar no Spotify",
        });
      }
    }),

  // Obter recomendações do Spotify
  getRecommendations: protectedProcedure
    .input(
      z.object({
        seedTracks: z.array(z.string()).min(1).max(5),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Aqui você buscaria recomendações do Spotify
        // const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${input.seedTracks.join(',')}`, {...})

        return [];
      } catch (error) {
        console.error("Erro ao buscar recomendações:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar recomendações",
        });
      }
    }),

  // Desconectar conta Spotify
  disconnectAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      try {
        // Aqui você removeria o token do banco de dados
        // await db.update(users).set({spotifyToken: null}).where(...)

        return {
          success: true,
          message: "Conta Spotify desconectada",
        };
      } catch (error) {
        console.error("Erro ao desconectar Spotify:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao desconectar Spotify",
        });
      }
    }),
});

// Exportar para uso público
export const publicProcedure = protectedProcedure;
