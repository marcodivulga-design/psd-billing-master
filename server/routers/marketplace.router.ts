import { router, publicProcedure, protectedProcedure, adminProcedure } from '../_core/trpc';
import { z } from 'zod';
import { getMarketplaceService } from '../lib/core/marketplace-service';

export const marketplaceRouter = router({
  /**
   * Criar vendor (onboarding)
   */
  createVendor: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      bankAccount: z.object({
        bank: z.string(),
        accountType: z.enum(['checking', 'savings']),
        accountNumber: z.string(),
        routingNumber: z.string(),
      }),
      commission: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      const vendor = await marketplaceService.createVendor({
        organizationId: ctx.user?.organizationId || 'default',
        ...input,
      });

      // Salvar no banco
      await ctx.db.insert(schema.vendors).values({
        id: vendor.id,
        organizationId: vendor.organizationId,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        status: 'pending',
        commission: vendor.commission,
        totalSales: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: vendor.createdAt,
      });

      // Enviar email de confirmação
      // await emailService.sendVendorOnboarding(vendor.email);

      return vendor;
    }),

  /**
   * Aprovar vendor
   */
  approveVendor: adminProcedure
    .input(z.object({ vendorId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      const vendor = await marketplaceService.approveVendor(input.vendorId);

      // Atualizar no banco
      await ctx.db.update(schema.vendors)
        .set({ status: 'approved' })
        .where(eq(schema.vendors.id, input.vendorId));

      // Enviar email
      // await emailService.sendVendorApproved(vendor.email);

      return vendor;
    }),

  /**
   * Rejeitar vendor
   */
  rejectVendor: adminProcedure
    .input(z.object({ vendorId: z.string(), reason: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      await marketplaceService.rejectVendor(input.vendorId, input.reason);

      // Atualizar no banco
      await ctx.db.update(schema.vendors)
        .set({ status: 'rejected' })
        .where(eq(schema.vendors.id, input.vendorId));

      return { success: true };
    }),

  /**
   * Adicionar produto de vendor
   */
  addVendorProduct: protectedProcedure
    .input(z.object({
      productId: z.string(),
      sku: z.string(),
      price: z.number(),
      cost: z.number(),
      stock: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      // Verificar se vendor existe
      const vendor = await ctx.db.query.vendors.findFirst({
        where: (v, { eq }) => eq(v.email, ctx.user.email),
      });

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      const product = await marketplaceService.addVendorProduct(vendor.id, {
        ...input,
      });

      // Salvar no banco
      await ctx.db.insert(schema.vendorProducts).values({
        id: product.id,
        vendorId: vendor.id,
        productId: input.productId,
        sku: input.sku,
        price: input.price,
        cost: input.cost,
        stock: input.stock,
        status: 'pending_approval',
        createdAt: product.createdAt,
      });

      return product;
    }),

  /**
   * Registrar venda de vendor
   */
  recordVendorSale: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      orderId: z.string(),
      productId: z.string(),
      quantity: z.number(),
      price: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      const sale = await marketplaceService.recordVendorSale(
        input.vendorId,
        input.orderId,
        input.productId,
        input.quantity,
        input.price
      );

      // Salvar no banco
      await ctx.db.insert(schema.vendorSales).values({
        id: sale.id,
        vendorId: input.vendorId,
        orderId: input.orderId,
        productId: input.productId,
        quantity: input.quantity,
        price: input.price,
        subtotal: sale.subtotal,
        commission: sale.commission,
        vendorEarnings: sale.vendorEarnings,
        status: 'pending',
        createdAt: sale.createdAt,
      });

      return sale;
    }),

  /**
   * Processar payout de vendor
   */
  processVendorPayout: adminProcedure
    .input(z.object({
      vendorId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      const payout = await marketplaceService.processVendorPayout(input.vendorId, {
        start: input.startDate,
        end: input.endDate,
      });

      // Salvar no banco
      await ctx.db.insert(schema.vendorPayouts).values({
        id: payout.id,
        vendorId: input.vendorId,
        amount: payout.amount,
        periodStart: input.startDate,
        periodEnd: input.endDate,
        status: 'processing',
        createdAt: payout.createdAt,
      });

      return payout;
    }),

  /**
   * Gerar relatório de vendor
   */
  generateVendorReport: protectedProcedure
    .input(z.object({
      vendorId: z.string(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .query(async ({ input, ctx }) => {
      const marketplaceService = getMarketplaceService();

      const report = await marketplaceService.generateVendorReport(input.vendorId, {
        start: input.startDate,
        end: input.endDate,
      });

      return report;
    }),

  /**
   * Listar vendors
   */
  listVendors: adminProcedure
    .input(z.object({
      status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input, ctx }) => {
      let query = ctx.db.query.vendors
        .findMany({
          where: (v, { eq }) => eq(v.organizationId, ctx.user.organizationId),
        });

      if (input.status) {
        query = query.where((v, { eq }) => eq(v.status, input.status));
      }

      const vendors = await query
        .limit(input.limit)
        .offset(input.offset);

      return vendors;
    }),

  /**
   * Obter estatísticas do marketplace
   */
  getMarketplaceStats: adminProcedure
    .query(async ({ ctx }) => {
      // Buscar dados do banco
      const vendors = await ctx.db.query.vendors.findMany({
        where: (v, { eq }) => eq(v.organizationId, ctx.user.organizationId),
      });

      const sales = await ctx.db.query.vendorSales.findMany({
        where: (vs, { eq }) => eq(vs.organizationId, ctx.user.organizationId),
      });

      const totalRevenue = sales.reduce((sum, s) => sum + s.subtotal, 0);
      const totalCommission = sales.reduce((sum, s) => sum + s.commission, 0);
      const vendorEarnings = sales.reduce((sum, s) => sum + s.vendorEarnings, 0);

      return {
        totalVendors: vendors.length,
        approvedVendors: vendors.filter(v => v.status === 'approved').length,
        totalSales: sales.length,
        totalRevenue,
        totalCommission,
        vendorEarnings,
        averageCommissionRate: vendors.length > 0
          ? vendors.reduce((sum, v) => sum + v.commission, 0) / vendors.length
          : 0,
      };
    }),
});
