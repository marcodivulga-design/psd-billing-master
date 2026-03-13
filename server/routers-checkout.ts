import { router, publicProcedure } from './trpc';

export const checkoutRouter = router({
  // Placeholder para rotas de checkout
  ping: publicProcedure.query(() => {
    return { message: 'Checkout router is ready' };
  }),
});
