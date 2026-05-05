import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const spotifySyncRouter = router({
  // Conectar conta Spotify
  connectSpotify: protectedProcedure
    .input(
      z.object({
        authCode: z.string(),
        redirectUri: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação de conexão com Spotify
        const spotifyConnection = {
          userId: ctx.user.id,
          spotifyUserId: `spotify_${Math.random().toString(36).substr(2, 9)}`,
          accessToken: `access_token_${Math.random().toString(36).substr(2, 20)}`,
          refreshToken: `refresh_token_${Math.random().toString(36).substr(2, 20)}`,
          expiresAt: new Date(Date.now() + 3600 * 1000),
          connectedAt: new Date(),
        };

        console.log("Spotify conectado:", spotifyConnection);

        return {
          success: true,
          message: "Conta Spotify conectada com sucesso",
          spotifyUserId: spotifyConnection.spotifyUserId,
        };
      } catch (error) {
        console.error("Erro ao conectar Spotify:", error);
        throw error;
      }
    }),

  // Desconectar Spotify
  disconnectSpotify: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      return {
        success: true,
        message: "Conta Spotify desconectada com sucesso",
      };
    } catch (error) {
      console.error("Erro ao desconectar Spotify:", error);
      throw error;
    }
  }),

  // Criar playlist no Spotify
  createSpotifyPlaylist: protectedProcedure
    .input(
      z.object({
        playlistId: z.number(),
        playlistName: z.string(),
        description: z.string().optional(),
        isPublic: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação de criação de playlist no Spotify
        const spotifyPlaylist = {
          id: `spotify_playlist_${Math.random().toString(36).substr(2, 9)}`,
          name: input.playlistName,
          description: input.description || "Criado via CELEBRA",
          isPublic: input.isPublic,
          externalUrl: `https://open.spotify.com/playlist/${Math.random().toString(36).substr(2, 20)}`,
          createdAt: new Date(),
        };

        console.log("Playlist Spotify criada:", spotifyPlaylist);

        return {
          success: true,
          message: "Playlist criada no Spotify com sucesso",
          spotifyPlaylistId: spotifyPlaylist.id,
          externalUrl: spotifyPlaylist.externalUrl,
        };
      } catch (error) {
        console.error("Erro ao criar playlist no Spotify:", error);
        throw error;
      }
    }),

  // Adicionar músicas à playlist do Spotify
  addTracksToSpotifyPlaylist: protectedProcedure
    .input(
      z.object({
        spotifyPlaylistId: z.string(),
        trackUris: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação de adição de tracks
        return {
          success: true,
          message: `${input.trackUris.length} músicas adicionadas à playlist no Spotify`,
          tracksAdded: input.trackUris.length,
        };
      } catch (error) {
        console.error("Erro ao adicionar tracks ao Spotify:", error);
        throw error;
      }
    }),

  // Sincronizar playlist CELEBRA com Spotify
  syncPlaylistToSpotify: protectedProcedure
    .input(
      z.object({
        playlistId: z.number(),
        spotifyPlaylistId: z.string().optional(),
        createNew: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Simulação de sincronização
        const syncResult = {
          playlistId: input.playlistId,
          spotifyPlaylistId: input.spotifyPlaylistId || `spotify_playlist_${Math.random().toString(36).substr(2, 9)}`,
          tracksAdded: 15,
          tracksUpdated: 3,
          tracksRemoved: 1,
          syncedAt: new Date(),
        };

        console.log("Playlist sincronizada:", syncResult);

        return {
          success: true,
          message: "Playlist sincronizada com Spotify com sucesso",
          ...syncResult,
        };
      } catch (error) {
        console.error("Erro ao sincronizar playlist:", error);
        throw error;
      }
    }),

  // Obter status de sincronização
  getSyncStatus: protectedProcedure
    .input(z.object({ playlistId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de status
        return {
          playlistId: input.playlistId,
          isConnected: true,
          spotifyPlaylistId: `spotify_playlist_${Math.random().toString(36).substr(2, 9)}`,
          lastSyncedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
          tracksInSpotify: 15,
          tracksInCelebra: 15,
          isSynced: true,
          externalUrl: `https://open.spotify.com/playlist/${Math.random().toString(36).substr(2, 20)}`,
        };
      } catch (error) {
        console.error("Erro ao obter status:", error);
        throw error;
      }
    }),

  // Configurar sincronização automática
  enableAutoSync: protectedProcedure
    .input(
      z.object({
        playlistId: z.number(),
        syncInterval: z.enum(["hourly", "daily", "weekly"]).default("daily"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return {
          success: true,
          message: "Sincronização automática ativada",
          syncInterval: input.syncInterval,
        };
      } catch (error) {
        console.error("Erro ao ativar sincronização automática:", error);
        throw error;
      }
    }),

  // Desativar sincronização automática
  disableAutoSync: protectedProcedure
    .input(z.object({ playlistId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return {
          success: true,
          message: "Sincronização automática desativada",
        };
      } catch (error) {
        console.error("Erro ao desativar sincronização automática:", error);
        throw error;
      }
    }),

  // Obter playlists sincronizadas
  getSyncedPlaylists: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Simulação de playlists sincronizadas
      return [
        {
          id: 1,
          name: "Quaresma 2026",
          celebraUrl: "https://celebra.app/playlists/1",
          spotifyUrl: "https://open.spotify.com/playlist/example1",
          tracksCount: 15,
          lastSyncedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          autoSyncEnabled: true,
          syncInterval: "daily",
        },
        {
          id: 2,
          name: "Páscoa 2026",
          celebraUrl: "https://celebra.app/playlists/2",
          spotifyUrl: "https://open.spotify.com/playlist/example2",
          tracksCount: 12,
          lastSyncedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          autoSyncEnabled: false,
          syncInterval: null,
        },
      ];
    } catch (error) {
      console.error("Erro ao obter playlists sincronizadas:", error);
      throw error;
    }
  }),

  // Obter recomendações do Spotify
  getSpotifyRecommendations: protectedProcedure
    .input(
      z.object({
        seedTracks: z.array(z.string()).max(5),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        // Simulação de recomendações do Spotify
        return [
          {
            id: `spotify_track_${Math.random().toString(36).substr(2, 9)}`,
            name: "Cântico de Louvor",
            artist: "Comunidade Católica",
            uri: `spotify:track:${Math.random().toString(36).substr(2, 20)}`,
            externalUrl: "https://open.spotify.com/track/example",
            popularity: 75,
          },
          {
            id: `spotify_track_${Math.random().toString(36).substr(2, 9)}`,
            name: "Hino de Ação de Graças",
            artist: "Coral da Igreja",
            uri: `spotify:track:${Math.random().toString(36).substr(2, 20)}`,
            externalUrl: "https://open.spotify.com/track/example",
            popularity: 68,
          },
        ];
      } catch (error) {
        console.error("Erro ao obter recomendações:", error);
        throw error;
      }
    }),
});
