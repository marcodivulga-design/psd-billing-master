import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

import { checkoutRouter } from './routers-checkout';
import { plansRouter } from './routers-plans';
import { sdkDocsRouter } from './routers-sdk-docs';
import { instagramRouter } from './routers-instagram';

export const t = initTRPC.context<any>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  checkout: checkoutRouter,
  plans: plansRouter,
  sdkDocs: sdkDocsRouter,
  instagram: instagramRouter,
});

export type AppRouter = typeof appRouter;
