import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router } from '../trpc';
import { checkoutRouter } from '../routers-checkout.ts';
import { sdkDocsRouter } from '../routers-sdk-docs.ts';
import { plansRouter } from '../routers-plans.ts';
import cors from 'cors';

const appRouter = router({
  checkout: checkoutRouter,
  sdk: sdkDocsRouter,
  plans: plansRouter,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
