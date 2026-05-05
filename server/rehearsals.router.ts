import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { rehearsals, rehearsalAttendance } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

const rehearsalSchema = z.object({
  ministryId: z.number(),
  churchId: z.number(),
  title: z.string().min(1, "Título do ensaio é obrigatório"),
  description: z.string().optional(),
  scheduledDate: z.string(),
  duration: z.number().optional(),
  location: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
});

const rehearsalAttendanceSchema = z.object({
  rehearsalId: z.number(),
  memberId: z.number(),
  status: z.enum(["present", "absent", "excused"]),
  notes: z.string().optional(),
});

export const rehearsalsRouter = router({
  // List rehearsals for a ministry
  list: publicProcedure
    .input(
      z.object({
        ministryId: z.number(),
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
          .from(rehearsals)
          .where(eq(rehearsals.ministryId, input.ministryId))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Rehearsals] Failed to list:", error);
        return [];
      }
    }),

  // Get rehearsal by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(rehearsals)
          .where(eq(rehearsals.id, input.id))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[Rehearsals] Failed to get by ID:", error);
        return null;
      }
    }),

  // Get upcoming rehearsals
  getUpcoming: publicProcedure
    .input(
      z.object({
        churchId: z.number(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const now = new Date().toISOString();
        const result = await db
          .select()
          .from(rehearsals)
          .where(
            and(
              eq(rehearsals.churchId, input.churchId),
              eq(rehearsals.status, "scheduled"),
              gte(rehearsals.scheduledDate, now)
            )
          )
          .limit(input.limit);

        return result;
      } catch (error) {
        console.error("[Rehearsals] Failed to get upcoming:", error);
        return [];
      }
    }),

  // Create new rehearsal (protected)
  create: protectedProcedure
    .input(rehearsalSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(rehearsals).values({
          ministryId: input.ministryId,
          churchId: input.churchId,
          title: input.title,
          description: input.description || null,
          scheduledDate: input.scheduledDate,
          duration: input.duration || null,
          location: input.location || null,
          status: input.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true, id: (result as any).insertId };
      } catch (error) {
        console.error("[Rehearsals] Failed to create:", error);
        throw new Error("Failed to create rehearsal");
      }
    }),

  // Update rehearsal (protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...rehearsalSchema.partial().shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const { id, ...updateData } = input;
        await db
          .update(rehearsals)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(rehearsals.id, id));

        return { success: true };
      } catch (error) {
        console.error("[Rehearsals] Failed to update:", error);
        throw new Error("Failed to update rehearsal");
      }
    }),

  // Delete rehearsal (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.delete(rehearsals).where(eq(rehearsals.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[Rehearsals] Failed to delete:", error);
        throw new Error("Failed to delete rehearsal");
      }
    }),

  // Get attendance for a rehearsal
  getAttendance: publicProcedure
    .input(z.object({ rehearsalId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(rehearsalAttendance)
          .where(eq(rehearsalAttendance.rehearsalId, input.rehearsalId));

        return result;
      } catch (error) {
        console.error("[Rehearsals] Failed to get attendance:", error);
        return [];
      }
    }),

  // Mark attendance (protected)
  markAttendance: protectedProcedure
    .input(rehearsalAttendanceSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Check if attendance already exists
        const existing = await db
          .select()
          .from(rehearsalAttendance)
          .where(
            and(
              eq(rehearsalAttendance.rehearsalId, input.rehearsalId),
              eq(rehearsalAttendance.memberId, input.memberId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Update existing
          await db
            .update(rehearsalAttendance)
            .set({
              status: input.status,
              notes: input.notes || null,
            })
            .where(
              and(
                eq(rehearsalAttendance.rehearsalId, input.rehearsalId),
                eq(rehearsalAttendance.memberId, input.memberId)
              )
            );
        } else {
          // Insert new
          await db.insert(rehearsalAttendance).values({
            rehearsalId: input.rehearsalId,
            memberId: input.memberId,
            status: input.status,
            notes: input.notes || null,
            createdAt: new Date().toISOString(),
          });
        }

        return { success: true };
      } catch (error) {
        console.error("[Rehearsals] Failed to mark attendance:", error);
        throw new Error("Failed to mark attendance");
      }
    }),

  // Get attendance summary for a rehearsal
  getAttendanceSummary: publicProcedure
    .input(z.object({ rehearsalId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { present: 0, absent: 0, excused: 0 };

      try {
        const attendance = await db
          .select()
          .from(rehearsalAttendance)
          .where(eq(rehearsalAttendance.rehearsalId, input.rehearsalId));

        const summary = {
          present: attendance.filter((a) => a.status === "present").length,
          absent: attendance.filter((a) => a.status === "absent").length,
          excused: attendance.filter((a) => a.status === "excused").length,
        };

        return summary;
      } catch (error) {
        console.error("[Rehearsals] Failed to get attendance summary:", error);
        return { present: 0, absent: 0, excused: 0 };
      }
    }),
});
