import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { songs } from "../../drizzle/schema";

// Schema para validação de linha do CSV
const SongRowSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  artist: z.string().min(1, "Artista é obrigatório"),
  genre: z.string().min(1, "Gênero é obrigatório"),
  duration: z.string().regex(/^\d+:\d{2}$/, "Duração deve estar no formato MM:SS"),
});

type SongRow = z.infer<typeof SongRowSchema>;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: SongRow;
}

interface PreviewResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: Array<{
    rowNumber: number;
    isValid: boolean;
    data?: SongRow;
    errors: string[];
  }>;
}

// Função auxiliar para converter MM:SS em segundos
function durationToSeconds(duration: string): number {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
}

// Função para validar uma linha do CSV
function validateRow(row: Record<string, string>, rowNumber: number): ValidationResult {
  try {
    const validated = SongRowSchema.parse(row);
    return { isValid: true, errors: [], data: validated };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors) {
      const errors = error.errors.map((e) => `${e.path.join(".") || "campo"}: ${e.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ["Erro ao validar linha"] };
  }
}

export const csvImportRouter = router({
  // Preview do CSV antes de importar
  preview: protectedProcedure
    .input(z.object({ csvContent: z.string() }))
    .mutation(async ({ input, ctx }): Promise<PreviewResult> => {
      // Verificar se é admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem importar CSV",
        });
      }

      const lines = input.csvContent.trim().split("\n");
      if (lines.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "CSV deve ter cabeçalho e pelo menos uma linha de dados",
        });
      }

      // Parse do cabeçalho
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const requiredHeaders = ["title", "artist", "genre", "duration"];

      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
      if (missingHeaders.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cabeçalhos faltando: ${missingHeaders.join(", ")}`,
        });
      }

      // Parse das linhas de dados
      const rows: Array<{
        rowNumber: number;
        isValid: boolean;
        data?: SongRow;
        errors: string[];
      }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length < requiredHeaders.length) continue;

        const rowData: Record<string, string> = {};
        requiredHeaders.forEach((header, index) => {
          rowData[header] = values[index];
        });

        const validation = validateRow(rowData, i);
        rows.push({
          rowNumber: i + 1,
          isValid: validation.isValid,
          data: validation.data,
          errors: validation.errors,
        });
      }

      const validRows = rows.filter((r) => r.isValid).length;
      const invalidRows = rows.filter((r) => !r.isValid).length;

      return {
        totalRows: rows.length,
        validRows,
        invalidRows,
        rows,
      };
    }),

  // Importar CSV confirmado
  import: protectedProcedure
    .input(
      z.object({
        csvContent: z.string(),
        skipInvalid: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verificar se é admin
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Apenas administradores podem importar CSV",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      const lines = input.csvContent.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const songsToInsert: Array<{
        title: string;
        artist: string;
        genre: string;
        durationSeconds: number;
        source: string;
        importedBy: number;
      }> = [];

      let importedCount = 0;
      let skippedCount = 0;
      const errors: Array<{ rowNumber: number; error: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length < headers.length) continue;

        const rowData: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });

        const validation = validateRow(rowData, i);

        if (!validation.isValid) {
          if (input.skipInvalid) {
            skippedCount++;
            errors.push({
              rowNumber: i + 1,
              error: validation.errors.join("; "),
            });
          } else {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Erro na linha ${i + 1}: ${validation.errors.join("; ")}`,
            });
          }
          continue;
        }

        if (validation.data) {
          songsToInsert.push({
            title: validation.data.title,
            artist: validation.data.artist,
            genre: validation.data.genre,
            durationSeconds: durationToSeconds(validation.data.duration),
            source: "csv_import",
            importedBy: ctx.user.id,
          });
          importedCount++;
        }
      }

      // Inserir em lotes de 100
      if (songsToInsert.length > 0) {
        const batchSize = 100;
        for (let i = 0; i < songsToInsert.length; i += batchSize) {
          const batch = songsToInsert.slice(i, i + batchSize);
          try {
            await db.insert(songs).values(
              batch.map((song) => ({
                title: song.title,
                artist: song.artist,
                theme: song.genre,
                isPublic: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }))
            );
          } catch (batchError) {
            console.error(`Erro ao inserir lote de ${batch.length} músicas:`, batchError);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Erro ao salvar músicas no banco de dados",
            });
          }
        }
      }
      }

      return {
        success: true,
        importedCount,
        skippedCount,
        errors: errors.slice(0, 10), // Retornar apenas os primeiros 10 erros
      };
    }),
});
