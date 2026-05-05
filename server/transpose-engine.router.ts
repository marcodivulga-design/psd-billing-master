/**
 * Transpose Engine Router
 * API tRPC para Motor de Transposição de Cifras
 * 
 * Endpoints:
 * - transposeChord: Transpõe um acorde individual
 * - transposeCifra: Transpõe uma cifra completa
 * - transposeSong: Transpõe uma música completa
 * - recommendKeys: Recomenda tons para diferentes vozes
 * - convertChordFormat: Converte entre formatos (português/inglês)
 * - getValidNotes: Obtém notas válidas
 * - suggestNearbyKeys: Sugere tons próximos
 */

import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { transposeEngine } from "../services/transpose-engine.service";
import { TRPCError } from "@trpc/server";

export const transposeEngineRouter = router({
  /**
   * Transpõe um acorde individual
   * Exemplo: Am -> Bm (2 semitons acima)
   */
  transposeChord: publicProcedure
    .input(
      z.object({
        chord: z.string().min(1).describe("Acorde a transpor (ex: Am, C, G/B)"),
        semitones: z.number().int().min(-12).max(12).describe("Número de semitons (-12 a +12)"),
      })
    )
    .query(({ input }) => {
      try {
        const result = transposeEngine.transposeChord(input.chord, input.semitones);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao transpor acorde",
        });
      }
    }),

  /**
   * Transpõe uma cifra completa (múltiplos acordes)
   * Exemplo: "Am - F - C - G" -> "Bm - G - D - A"
   */
  transposeCifra: publicProcedure
    .input(
      z.object({
        cifra: z.string().min(1).describe("Cifra completa com acordes"),
        semitones: z.number().int().min(-12).max(12).describe("Número de semitons"),
      })
    )
    .query(({ input }) => {
      try {
        const transposedCifra = transposeEngine.transposeCifra(input.cifra, input.semitones);
        return {
          originalCifra: input.cifra,
          transposedCifra,
          semitones: input.semitones,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao transpor cifra",
        });
      }
    }),

  /**
   * Transpõe uma música completa (letra com cifras inline)
   * Formato esperado: [Am] Verso 1... [F] Refrão...
   */
  transposeSong: publicProcedure
    .input(
      z.object({
        lyrics: z.string().describe("Letra com acordes inline no formato [Am]"),
        cifra: z.string().describe("Cifra completa"),
        semitones: z.number().int().min(-12).max(12).describe("Número de semitons"),
      })
    )
    .query(({ input }) => {
      try {
        const result = transposeEngine.transposeSong(input.lyrics, input.cifra, input.semitones);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao transpor música",
        });
      }
    }),

  /**
   * Recomenda tons ideais para diferentes vozes
   * Retorna sugestões para Soprano, Mezzo-Soprano, Alto, Tenor, Barítono, Baixo
   */
  recommendKeys: publicProcedure
    .input(
      z.object({
        originalKey: z.string().min(1).describe("Tom original (ex: C, Am, G)"),
      })
    )
    .query(({ input }) => {
      try {
        if (!transposeEngine.isValidKey(input.originalKey)) {
          throw new Error(`Tom inválido: ${input.originalKey}`);
        }
        const recommendations = transposeEngine.recommendKeysForVoices(input.originalKey);
        return recommendations;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao recomendar tons",
        });
      }
    }),

  /**
   * Converte entre formatos de cifra (português <-> inglês)
   * Exemplo: "Dó" -> "C", "Lá" -> "A"
   */
  convertChordFormat: publicProcedure
    .input(
      z.object({
        chord: z.string().min(1).describe("Acorde a converter"),
        targetFormat: z.enum(["english", "portuguese"]).describe("Formato alvo"),
      })
    )
    .query(({ input }) => {
      try {
        const converted = transposeEngine.convertChordFormat(input.chord, input.targetFormat);
        return {
          originalChord: input.chord,
          convertedChord: converted,
          targetFormat: input.targetFormat,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao converter acorde",
        });
      }
    }),

  /**
   * Obtém todas as notas válidas em ambos os formatos
   */
  getValidNotes: publicProcedure.query(() => {
    return transposeEngine.getValidNotes();
  }),

  /**
   * Sugere tons próximos (fáceis de transpor)
   * Útil para encontrar tons alternativos sem grande esforço
   */
  suggestNearbyKeys: publicProcedure
    .input(
      z.object({
        originalKey: z.string().min(1).describe("Tom original"),
        maxSemitones: z.number().int().min(1).max(12).default(3).describe("Máximo de semitons de distância"),
      })
    )
    .query(({ input }) => {
      try {
        if (!transposeEngine.isValidKey(input.originalKey)) {
          throw new Error(`Tom inválido: ${input.originalKey}`);
        }
        const nearby = transposeEngine.suggestNearbyKeys(input.originalKey, input.maxSemitones);
        return {
          originalKey: input.originalKey,
          nearbyKeys: nearby,
          maxSemitones: input.maxSemitones,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao sugerir tons",
        });
      }
    }),

  /**
   * Calcula a dificuldade de uma transposição
   * Retorna: 'easy' (0-2 semitons), 'medium' (3-5), 'hard' (6+)
   */
  calculateDifficulty: publicProcedure
    .input(
      z.object({
        semitones: z.number().int().min(-12).max(12).describe("Número de semitons"),
      })
    )
    .query(({ input }) => {
      const difficulty = transposeEngine.calculateTranspositionDifficulty(input.semitones);
      return {
        semitones: input.semitones,
        difficulty,
        description: {
          easy: "Transposição fácil - mínimo esforço",
          medium: "Transposição moderada - esforço médio",
          hard: "Transposição difícil - requer prática",
        }[difficulty],
      };
    }),

  /**
   * Validação em lote de acordes
   * Verifica quais acordes são válidos
   */
  validateChords: publicProcedure
    .input(
      z.object({
        chords: z.array(z.string()).describe("Lista de acordes para validar"),
      })
    )
    .query(({ input }) => {
      const results = input.chords.map((chord) => {
        try {
          transposeEngine.transposeChord(chord, 0); // Apenas valida
          return { chord, valid: true };
        } catch {
          return { chord, valid: false };
        }
      });
      return results;
    }),

  /**
   * Transposição em lote
   * Transpõe múltiplos acordes de uma vez
   */
  transposeChordsInBatch: publicProcedure
    .input(
      z.object({
        chords: z.array(z.string()).describe("Lista de acordes"),
        semitones: z.number().int().min(-12).max(12).describe("Número de semitons"),
      })
    )
    .query(({ input }) => {
      try {
        const results = input.chords.map((chord) => {
          try {
            return transposeEngine.transposeChord(chord, input.semitones);
          } catch {
            return { originalChord: chord, error: "Acorde inválido" };
          }
        });
        return results;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Erro ao transpor acordes em lote",
        });
      }
    }),
});
