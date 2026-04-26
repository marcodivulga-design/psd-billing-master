import { router, publicProcedure } from './trpc.ts';

export const sdkDocsRouter = router({
  getIntegrationDocs: publicProcedure.query(async () => {
    return {
      title: 'PSD Billing Master - Integration Guide',
      version: '1.0.0',
      message: 'SDK documentation coming soon',
    };
  }),
});
