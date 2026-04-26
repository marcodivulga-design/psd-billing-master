import { router, publicProcedure } from './trpc.ts';

import { z } from 'zod';
import { asaas } from './asaas.ts';

export const checkoutRouter = router({
  ping: publicProcedure.query(() => {
    return { message: 'Checkout router is ready' };
  }),
  createCustomer: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      // Aqui integraria com o banco para verificar se já existe
      return await asaas.createCustomer(input);
    }),
});
