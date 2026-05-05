import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { ministries, ministryMembers } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

const ministrySchema = z.object({
  name: z.string().min(1, "Nome do ministério é obrigatório"),
  description: z.string().optional(),
  churchId: z.number(),
  organizationId: z.number(),
  type: z.enum(["choir", "music", "liturgy", "youth", "pastoral", "education", "social", "other"]),
  coordinatorName: z.string().optional(),
  coordinatorEmail: z.string().email().optional(),
  coordinatorPhone: z.string().optional(),
  photoUrl: z.string().optional(),
});

const ministryMemberSchema = z.object({
  ministryId: z.number(),
  churchId: z.number(),
  name: z.string().min(1, "Nome do membro é obrigatório"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().min(1, "Função é obrigatória"),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  joinDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const ministriesRouter = router({
  // List all ministries for a church
  list: publicProcedure
    .input(
      z.object({
        churchId: z.number(),
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
          .from(ministries)
          .where(eq(ministries.churchId, input.churchId))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Ministries] Failed to list:", error);
        return [];
      }
    }),

  // Get ministry by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(ministries)
          .where(eq(ministries.id, input.id))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[Ministries] Failed to get by ID:", error);
        return null;
      }
    }),

  // Create new ministry (protected)
  create: protectedProcedure
    .input(ministrySchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const result = await db.insert(ministries).values({
          name: input.name,
          description: input.description || null,
          churchId: input.churchId,
          organizationId: input.organizationId,
          type: input.type,
          coordinatorName: input.coordinatorName || null,
          coordinatorEmail: input.coordinatorEmail || null,
          coordinatorPhone: input.coordinatorPhone || null,
          photoUrl: input.photoUrl || null,
          memberCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true, id: (result as any).insertId };
      } catch (error) {
        console.error("[Ministries] Failed to create:", error);
        throw new Error("Failed to create ministry");
      }
    }),

  // Update ministry (protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...ministrySchema.partial().shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const { id, ...updateData } = input;
        await db
          .update(ministries)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(ministries.id, id));

        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to update:", error);
        throw new Error("Failed to update ministry");
      }
    }),

  // Delete ministry (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.delete(ministries).where(eq(ministries.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to delete:", error);
        throw new Error("Failed to delete ministry");
      }
    }),

  // Get ministry members
  getMembers: publicProcedure
    .input(z.object({ ministryId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(ministryMembers)
          .where(eq(ministryMembers.ministryId, input.ministryId));

        return result;
      } catch (error) {
        console.error("[Ministries] Failed to get members:", error);
        return [];
      }
    }),

  // Add member to ministry (protected)
  addMember: protectedProcedure
    .input(ministryMemberSchema)
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.insert(ministryMembers).values({
          ministryId: input.ministryId,
          churchId: input.churchId,
          name: input.name,
          email: input.email || null,
          phone: input.phone || null,
          role: input.role,
          photoUrl: input.photoUrl || null,
          bio: input.bio || null,
          joinDate: input.joinDate || null,
          isActive: input.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to add member:", error);
        throw new Error("Failed to add member to ministry");
      }
    }),

  // Remove member from ministry (protected)
  removeMember: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .delete(ministryMembers)
          .where(eq(ministryMembers.id, input.id));

        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to remove member:", error);
        throw new Error("Failed to remove member from ministry");
      }
    }),

  // Update member (protected)
  updateMember: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...ministryMemberSchema.partial().shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const { id, ...updateData } = input;
        await db
          .update(ministryMembers)
          .set({
            ...updateData,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(ministryMembers.id, id));

        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to update member:", error);
        throw new Error("Failed to update member");
      }
    }),

  // Deactivate member (protected)
  deactivateMember: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(ministryMembers)
          .set({
            isActive: false,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(ministryMembers.id, input.id));

        return { success: true };
      } catch (error) {
        console.error("[Ministries] Failed to deactivate member:", error);
        throw new Error("Failed to deactivate member");
      }
    }),
});
