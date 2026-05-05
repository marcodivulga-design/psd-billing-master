import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { invokeLLM } from "../_core/llm";

export const recommendationsRouter = router({
  // Obter recomendações personalizadas baseadas em histórico e preferências
  getPersonalized: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(5).max(20),
        genres: z.array(z.string()).optional(),
        excludeSongIds: z.array(z.number()).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      try {
        // Buscar histórico do usuário (últimas 20 músicas ouvidas)
        // Aqui você buscaria do banco de dados
        const userHistory = [
          { title: "Ave Maria", artist: "Schubert", genre: "Clássico" },
          { title: "Hino Nacional", artist: "Anônimo", genre: "Patriótico" },
        ];

        // Buscar todas as músicas disponíveis
        // Aqui você buscaria do banco de dados
        const allSongs = [
          {
            id: 1,
            title: "Salve Rainha",
            artist: "Anônimo",
            genre: "Litúrgico",
          },
          {
            id: 2,
            title: "Glória",
            artist: "Vivaldi",
            genre: "Clássico",
          },
          {
            id: 3,
            title: "Aleluia",
            artist: "Handel",
            genre: "Clássico",
          },
          {
            id: 4,
            title: "Magnificat",
            artist: "Bach",
            genre: "Clássico",
          },
          {
            id: 5,
            title: "Te Deum",
            artist: "Charpentier",
            genre: "Clássico",
          },
        ];

        // Preparar contexto para o LLM
        const userGenres = input.genres || ["Clássico", "Litúrgico"];
        const userHistoryText = userHistory
          .map((s) => `${s.title} (${s.artist}) - ${s.genre}`)
          .join("\n");

        const availableSongsText = allSongs
          .map((s) => `ID: ${s.id}, ${s.title} (${s.artist}) - ${s.genre}`)
          .join("\n");

        const prompt = `Você é um especialista em recomendação de músicas litúrgicas e clássicas.

Histórico de músicas que o usuário ouviu:
${userHistoryText}

Gêneros preferidos: ${userGenres.join(", ")}

Músicas disponíveis no catálogo:
${availableSongsText}

Baseado no histórico e preferências do usuário, recomende exatamente ${input.limit} músicas do catálogo que o usuário provavelmente gostará.

Responda em JSON com este formato:
{
  "recommendations": [
    {
      "songId": 1,
      "reason": "Motivo da recomendação em uma frase"
    }
  ]
}

Recomende apenas músicas do catálogo listado acima.`;

        // Chamar LLM
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em recomendação de músicas. Sempre responda em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "music_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        songId: { type: "number" },
                        reason: { type: "string" },
                      },
                      required: ["songId", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        // Parse da resposta
        const responseText =
          response.choices[0]?.message?.content || "{}";
        const parsedResponse = JSON.parse(responseText);

        // Mapear recomendações com dados completos
        const recommendations = parsedResponse.recommendations
          .slice(0, input.limit)
          .map((rec: { songId: number; reason: string }) => {
            const song = allSongs.find((s) => s.id === rec.songId);
            return {
              ...song,
              reason: rec.reason,
            };
          })
          .filter((r: any) => r && r.id);

        return recommendations;
      } catch (error) {
        console.error("Erro ao gerar recomendações:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar recomendações",
        });
      }
    }),

  // Obter recomendações por gênero específico
  getByGenre: protectedProcedure
    .input(
      z.object({
        genre: z.string(),
        limit: z.number().default(5).max(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const prompt = `Recomende ${input.limit} músicas do gênero "${input.genre}" que são populares e bem avaliadas.

Responda em JSON com este formato:
{
  "recommendations": [
    {
      "title": "Título da música",
      "artist": "Artista",
      "genre": "${input.genre}",
      "reason": "Por que esta música é recomendada"
    }
  ]
}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em recomendação de músicas. Sempre responda em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "genre_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        artist: { type: "string" },
                        genre: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["title", "artist", "genre", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        const responseText =
          response.choices[0]?.message?.content || "{}";
        const parsedResponse = JSON.parse(responseText);

        return parsedResponse.recommendations.slice(0, input.limit);
      } catch (error) {
        console.error("Erro ao gerar recomendações por gênero:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar recomendações",
        });
      }
    }),

  // Obter recomendações baseadas em uma música específica (similar)
  getSimilar: protectedProcedure
    .input(
      z.object({
        songTitle: z.string(),
        artist: z.string().optional(),
        limit: z.number().default(5).max(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const prompt = `Baseado na música "${input.songTitle}"${input.artist ? ` de ${input.artist}` : ""}, recomende ${input.limit} músicas similares.

Responda em JSON com este formato:
{
  "recommendations": [
    {
      "title": "Título da música",
      "artist": "Artista",
      "reason": "Por que esta música é similar"
    }
  ]
}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um especialista em recomendação de músicas. Sempre responda em JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "similar_recommendations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        artist: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["title", "artist", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommendations"],
                additionalProperties: false,
              },
            },
          },
        });

        const responseText =
          response.choices[0]?.message?.content || "{}";
        const parsedResponse = JSON.parse(responseText);

        return parsedResponse.recommendations.slice(0, input.limit);
      } catch (error) {
        console.error("Erro ao gerar recomendações similares:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar recomendações",
        });
      }
    }),
});
