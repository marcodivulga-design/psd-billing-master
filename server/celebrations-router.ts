import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const celebrationsRouter = router({
  exportPDF: publicProcedure
    .input(z.object({
      html: z.string(),
      filename: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Usar weasyprint ou similar para gerar PDF
        // Por enquanto, vamos retornar um placeholder
        return {
          success: true,
          message: "PDF generation not yet implemented",
        };
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
      }
    }),
});
