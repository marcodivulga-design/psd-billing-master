import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { storagePut } from "../storage";

// Schema para validação de upload
const AudioUploadSchema = z.object({
  fileName: z.string().min(1, "Nome do arquivo é obrigatório"),
  mimeType: z.enum(["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"]),
  fileSize: z.number().positive("Tamanho do arquivo deve ser positivo"),
  songId: z.number().optional(),
  title: z.string().optional(),
  artist: z.string().optional(),
});

const ALLOWED_MIME_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const audioUploadRouter = router({
  // Obter presigned URL para upload direto do cliente
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        mimeType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validar tipo de arquivo
      if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Tipo de arquivo não permitido. Use: ${ALLOWED_MIME_TYPES.join(", ")}`,
        });
      }

      // Validar tamanho
      if (input.fileSize > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      // Gerar chave única para o arquivo
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileKey = `audio/${ctx.user.id}/${timestamp}-${random}-${input.fileName}`;

      // Aqui você geraria uma presigned URL
      // Por enquanto, retornamos a chave e o cliente fará upload direto
      return {
        fileKey,
        uploadUrl: `/api/upload/audio`, // Endpoint para receber o upload
        expiresIn: 3600, // 1 hora
      };
    }),

  // Registrar upload completo no banco de dados
  registerUpload: protectedProcedure
    .input(
      z.object({
        fileKey: z.string(),
        fileName: z.string(),
        mimeType: z.string(),
        fileSize: z.number(),
        durationSeconds: z.number().optional(),
        songId: z.number().optional(),
        title: z.string().optional(),
        artist: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banco de dados não disponível",
        });
      }

      // Aqui você salvaria os metadados no banco
      // Por enquanto, apenas retornamos sucesso
      return {
        success: true,
        fileKey: input.fileKey,
        audioUrl: `/manus-storage/${input.fileKey}`,
      };
    }),

  // Obter histórico de uploads do usuário
  getUploads: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // Aqui você buscaria do banco de dados
      // Por enquanto, retornamos array vazio
      return {
        uploads: [],
        total: 0,
      };
    }),

  // Deletar upload
  deleteUpload: protectedProcedure
    .input(z.object({ fileKey: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Aqui você deletaria do S3 e do banco
      return {
        success: true,
      };
    }),
});
