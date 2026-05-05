import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

import { checkoutRouter } from './routers-checkout';
import { plansRouter } from './routers-plans';
import { sdkDocsRouter } from './routers-sdk-docs';
import { hubMentorRouter } from './routers-hub-mentor';
import { instagramRouter } from './routers-instagram';

// Music Routers
import { songsRouter } from './songs.router';
import { playlistsRouter } from './playlists.router';
import { spotifyRouter } from './spotify.router';
import { spotifyHubRouter } from './spotify-hub.router';
import { spotifySyncRouter } from './spotify-sync.router';
import { appleMusicIntegrationRouter } from './apple-music-integration.router';
import { musicCollectorRouter } from './music-collector.router';
import { musicPlatformsRouter } from './music-platforms.router';
import { playbackRouter } from './playback.router';
import { playbackHistoryRouter } from './playback-history.router';
import { smartPlaylistsRouter } from './smart-playlists.router';
import { transposeEngineRouter } from './transpose-engine.router';
import { audioUploadRouter } from './audio-upload.router';
import { audioSharingRouter } from './audio-sharing.router';
import { audioCommentsRouter } from './audio-comments.router';
import { catholicMusicRouter } from './catholic-music.router';
import { spotifyAdvancedRouter } from './spotify-advanced.router';

// Liturgical Routers
import { liturgyOfHoursRouter } from './liturgy-of-hours.router';
import { liturgicalCalendarCompleteRouter } from './liturgical-calendar-complete.router';
import { liturgicalCalendarRouter } from './liturgical-calendar.router';
import { catechismInteractiveRouter } from './catechism-interactive.router';
import { rosaryDigitalRouter } from './rosary-digital.router';
import { attendanceReportsRouter } from './attendance-reports.router';
import { rehearsalsRouter } from './rehearsals.router';
import { spiritualMentoringRouter } from './spiritual-mentoring.router';
import { dailyReflectionRouter } from './daily-reflection.router';
import { ministriesRouter } from './ministries.router';

// Streaming Routers
import { liveStreamingRouter } from './live-streaming.router';
import { youtubeHubRouter } from './youtube-hub.router';
import { whatsappBusinessRouter } from './whatsapp-business.router';
import { eventbriteIntegrationRouter } from './eventbrite-integration.router';
import { deepLinkingRouter } from './deep-linking.router';
import { socialShareRouter } from './social-share.router';
import { socialAuthRouter } from './social-auth.router';

// AI & Recommendations Routers
import { garimpeirAIRouter } from './garimpeiro-ai.router';
import { personalizedRecommendationsRouter } from './personalized-recommendations.router';
import { realtimeRecommendationsRouter } from './realtime-recommendations.router';
import { recommendationsRouter } from './recommendations.router';
import { analyticsAdvancedRouter } from './analytics-advanced.router';
import { notificationTriggersRouter } from './notification-triggers.router';
import { notificationsRealtimeRouter } from './notifications-realtime.router';
import { notificationsRouter } from './notifications.router';
import { pushNotificationsRouter } from './push-notifications.router';
import { adminDashboardRouter } from './admin-dashboard.router';
import { systemAdminRouter } from './system-admin.router';

// Payments Routers
import { stripeHubRouter } from './stripe-hub.router';
import { stripeMonetizationRouter } from './stripe-monetization.router';
import { stripeWebhooksRouter } from './stripe-webhooks.router';
import { stripeRouter } from './stripe.router';
import { psdPaymentsHubRouter } from './psd-payments-hub.router';
import { psdPaymentsRouter } from './psd-payments.router';
import { donationsRouter } from './donations.router';
import { affiliateSystemRouter } from './affiliate-system.router';
import { externalApisRouter } from './external-apis.router';
import { csvImportRouter } from './csv-import.router';

// Community Routers
import { communityRouter } from './community.router';
import { friendsCollaborativeRouter } from './friends-collaborative.router';
import { groupChatRouter } from './group-chat.router';
import { networkingRouter } from './networking.router';
import { badgesAchievementsRouter } from './badges-achievements.router';
import { studioCommunityRouter } from './studio-community-sharing.router';

// Studio Routers
import { studioArrangementsRouter } from './studio-arrangements.router';
import { studioDawIntegrationRouter } from './studio-daw-integration.router';
import { studioMixerRouter } from './studio-mixer.router';
import { studioPitchAnalysisRouter } from './studio-pitch-analysis.router';

// Data Routers
import { offlineRouter } from './offline.router';
import { instagramRouter } from './instagram.router';

// MV-Academy Support Routers
import { continuousLearningRouter } from './continuousLearning.router';
import { intelligentGoalsRouter } from './intelligentGoals.router';

export const t = initTRPC.context<any>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Funções auxiliares para inventário
function maskSecret(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length < 12) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}

function detectIntegrations(): Record<string, any> {
  const integrations: Record<string, any> = {};
  
  const integrationEnvVars = [
    { name: 'instagram', envVars: ['INSTAGRAM_ACCESS_TOKEN', 'INSTAGRAM_CLIENT_ID'] },
    { name: 'meta', envVars: ['META_ACCESS_TOKEN', 'META_CLIENT_ID'] },
    { name: 'facebook', envVars: ['FACEBOOK_ACCESS_TOKEN', 'FACEBOOK_APP_ID'] },
    { name: 'whatsapp', envVars: ['ZAPI_INSTANCE_ID', 'ZAPI_TOKEN'] },
    { name: 'stripe', envVars: ['STRIPE_SECRET_KEY'] },
    { name: 'mercadopago', envVars: ['MERCADOPAGO_ACCESS_TOKEN'] },
    { name: 'sendgrid', envVars: ['SENDGRID_API_KEY'] },
    { name: 'resend', envVars: ['RESEND_API_KEY'] },
    { name: 'openai', envVars: ['OPENAI_API_KEY'] },
    { name: 'anthropic', envVars: ['ANTHROPIC_API_KEY'] },
    { name: 'google', envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'] },
    { name: 'youtube', envVars: ['YOUTUBE_API_KEY'] },
  ];

  integrationEnvVars.forEach(integration => {
    const hasToken = integration.envVars.some(envVar => process.env[envVar]);
    const tokenValue = integration.envVars.find(envVar => process.env[envVar]);
    
    integrations[integration.name] = {
      name: integration.name,
      status: hasToken ? 'configured' : 'missing',
      hasToken: hasToken,
      tokenPreview: tokenValue ? maskSecret(process.env[tokenValue]) : null,
      source: 'env',
    };
  });

  return integrations;
}

// Endpoint de inventário do PSD Billing Master
export const inventoryRouter = router({
  inventory: publicProcedure.query(() => {
    return {
      appName: 'PSD Billing Master - Hub Mentor',
      appId: 'psd-hub-mentor',
      version: process.env.APP_VERSION || '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      description: 'Hub central para o ecossistema Propaga Digital (PSD)',
      endpoints: [
        '/api/trpc/inventory.inventory',
        '/api/trpc/hubMentor.listApps',
        '/api/trpc/hubMentor.scanApp',
        '/api/trpc/hubMentor.scanAll',
        '/api/trpc/hubMentor.getStatus',
        '/api/trpc/plans.list',
        '/api/trpc/checkout.createSession',
      ],
      database: {
        connected: true,
        type: process.env.DATABASE_TYPE || 'postgresql',
        tables: [
          'organizations',
          'users',
          'plans',
          'subscriptions',
          'app_registry',
        ],
      },
      integrations: detectIntegrations(),
      features: {
        multiTenant: true,
        authentication: true,
        database: true,
        appRegistry: true,
        inventoryScanning: true,
      },
      health: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    };
  }),
});

export const appRouter = router({
  // Core Routers
  inventory: inventoryRouter,
  hubMentor: hubMentorRouter,
  instagram: instagramRouter,
  checkout: checkoutRouter,
  plans: plansRouter,
  sdkDocs: sdkDocsRouter,
  
  // Music Routers (17)
  songs: songsRouter,
  playlists: playlistsRouter,
  spotify: spotifyRouter,
  spotifyHub: spotifyHubRouter,
  spotifySync: spotifySyncRouter,
  appleMusic: appleMusicIntegrationRouter,
  musicCollector: musicCollectorRouter,
  musicPlatforms: musicPlatformsRouter,
  playback: playbackRouter,
  playbackHistory: playbackHistoryRouter,
  smartPlaylists: smartPlaylistsRouter,
  transposeEngine: transposeEngineRouter,
  audioUpload: audioUploadRouter,
  audioSharing: audioSharingRouter,
  audioComments: audioCommentsRouter,
  catholicMusic: catholicMusicRouter,
  spotifyAdvanced: spotifyAdvancedRouter,
  
  // Liturgical Routers (10)
  liturgyOfHours: liturgyOfHoursRouter,
  liturgicalCalendarComplete: liturgicalCalendarCompleteRouter,
  liturgicalCalendar: liturgicalCalendarRouter,
  catechismInteractive: catechismInteractiveRouter,
  rosaryDigital: rosaryDigitalRouter,
  attendanceReports: attendanceReportsRouter,
  rehearsals: rehearsalsRouter,
  spiritualMentoring: spiritualMentoringRouter,
  dailyReflection: dailyReflectionRouter,
  ministries: ministriesRouter,
  
  // Streaming Routers (7)
  liveStreaming: liveStreamingRouter,
  youtubeHub: youtubeHubRouter,
  whatsappBusiness: whatsappBusinessRouter,
  eventbriteIntegration: eventbriteIntegrationRouter,
  deepLinking: deepLinkingRouter,
  socialShare: socialShareRouter,
  socialAuth: socialAuthRouter,
  
  // AI & Recommendations Routers (11)
  garimpeirAI: garimpeirAIRouter,
  personalizedRecommendations: personalizedRecommendationsRouter,
  realtimeRecommendations: realtimeRecommendationsRouter,
  recommendations: recommendationsRouter,
  analyticsAdvanced: analyticsAdvancedRouter,
  notificationTriggers: notificationTriggersRouter,
  notificationsRealtime: notificationsRealtimeRouter,
  notifications: notificationsRouter,
  pushNotifications: pushNotificationsRouter,
  adminDashboard: adminDashboardRouter,
  systemAdmin: systemAdminRouter,
  
  // Payments Routers (10)
  stripeHub: stripeHubRouter,
  stripeMonetization: stripeMonetizationRouter,
  stripeWebhooks: stripeWebhooksRouter,
  stripe: stripeRouter,
  psdPaymentsHub: psdPaymentsHubRouter,
  psdPayments: psdPaymentsRouter,
  donations: donationsRouter,
  affiliateSystem: affiliateSystemRouter,
  externalApis: externalApisRouter,
  csvImport: csvImportRouter,
  
  // Community Routers (6)
  community: communityRouter,
  friendsCollaborative: friendsCollaborativeRouter,
  groupChat: groupChatRouter,
  networking: networkingRouter,
  badgesAchievements: badgesAchievementsRouter,
  studioCommunity: studioCommunityRouter,
  
  // Studio Routers (4)
  studioArrangements: studioArrangementsRouter,
  studioDawIntegration: studioDawIntegrationRouter,
  studioMixer: studioMixerRouter,
  studioPitchAnalysis: studioPitchAnalysisRouter,
  
  // Data Routers (2)
  offline: offlineRouter,
  instagram: instagramRouter,
  
  // MV-Academy Support Routers (2)
  continuousLearning: continuousLearningRouter,
  intelligentGoals: intelligentGoalsRouter,
});

export type AppRouter = typeof appRouter;
