import { router, publicProcedure, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { psdHubService } from '../services/psd-hub.service';

/**
 * External APIs Router
 * Integrates with PSD Hub for Spotify, YouTube, Suno AI, Stripe, WhatsApp
 */
export const externalApisRouter = router({
  // ============ SPOTIFY ============
  spotify: router({
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        type: z.enum(['track', 'artist', 'album']).default('track'),
        limit: z.number().default(20),
      }))
      .query(async ({ input }) => {
        const response = await psdHubService.spotifySearch(
          input.query,
          input.type,
          input.limit
        );
        return response;
      }),

    getTrack: publicProcedure
      .input(z.object({ trackId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.spotifyGetTrack(input.trackId);
        return response;
      }),

    getArtist: publicProcedure
      .input(z.object({ artistId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.spotifyGetArtist(input.artistId);
        return response;
      }),

    getPlaylist: publicProcedure
      .input(z.object({ playlistId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.spotifyGetPlaylist(input.playlistId);
        return response;
      }),

    getRecommendations: publicProcedure
      .input(z.object({ seedTracks: z.array(z.string()) }))
      .query(async ({ input }) => {
        const response = await psdHubService.spotifyGetRecommendations(input.seedTracks);
        return response;
      }),
  }),

  // ============ YOUTUBE ============
  youtube: router({
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        type: z.enum(['video', 'playlist', 'channel']).default('video'),
        maxResults: z.number().default(20),
      }))
      .query(async ({ input }) => {
        const response = await psdHubService.youtubeSearch(
          input.query,
          input.type,
          input.maxResults
        );
        return response;
      }),

    getVideo: publicProcedure
      .input(z.object({ videoId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.youtubeGetVideo(input.videoId);
        return response;
      }),

    getChannel: publicProcedure
      .input(z.object({ channelId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.youtubeGetChannel(input.channelId);
        return response;
      }),

    getPlaylist: publicProcedure
      .input(z.object({ playlistId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.youtubeGetPlaylist(input.playlistId);
        return response;
      }),
  }),

  // ============ SUNO AI ============
  suno: router({
    generateMusic: protectedProcedure
      .input(z.object({
        prompt: z.string(),
        duration: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.sunoGenerateMusic({
          prompt: input.prompt,
          duration: input.duration,
        });
        return response;
      }),

    editMusic: protectedProcedure
      .input(z.object({
        id: z.string(),
        prompt: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.sunoEditMusic({
          id: input.id,
          prompt: input.prompt,
        });
        return response;
      }),

    getStatus: publicProcedure
      .input(z.object({ generationId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.sunoGetStatus(input.generationId);
        return response;
      }),
  }),

  // ============ STRIPE ============
  stripe: router({
    createCheckout: protectedProcedure
      .input(z.object({
        amount: z.number(),
        currency: z.string(),
        description: z.string(),
        metadata: z.record(z.string(), z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.stripeCreateCheckout({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
          metadata: input.metadata,
        });
        return response;
      }),

    getPayments: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const response = await psdHubService.stripeGetPayments(input.limit);
        return response;
      }),

    getSubscription: protectedProcedure
      .query(async () => {
        const response = await psdHubService.stripeGetSubscription();
        return response;
      }),

    getInvoice: protectedProcedure
      .input(z.object({ invoiceId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.stripeGetInvoice(input.invoiceId);
        return response;
      }),
  }),

  // ============ WHATSAPP BUSINESS ============
  whatsapp: router({
    sendMessage: protectedProcedure
      .input(z.object({
        phoneNumber: z.string(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.whatsappSendMessage({
          phoneNumber: input.phoneNumber,
          message: input.message,
        });
        return response;
      }),

    sendTemplate: protectedProcedure
      .input(z.object({
        phoneNumber: z.string(),
        templateName: z.string(),
        parameters: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.whatsappSendTemplate({
          phoneNumber: input.phoneNumber,
          templateName: input.templateName,
          parameters: input.parameters,
        });
        return response;
      }),

    getMessageStatus: protectedProcedure
      .input(z.object({ messageId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.whatsappGetMessageStatus(input.messageId);
        return response;
      }),
  }),

  // ============ GOOGLE CALENDAR ============
  googleCalendar: router({
    createEvent: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        attendees: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.googleCalendarCreateEvent({
          title: input.title,
          description: input.description,
          startTime: input.startTime,
          endTime: input.endTime,
          attendees: input.attendees,
        });
        return response;
      }),

    updateEvent: protectedProcedure
      .input(z.object({
        eventId: z.string(),
        updates: z.any(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.googleCalendarUpdateEvent(
          input.eventId,
          input.updates
        );
        return response;
      }),

    listEvents: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const response = await psdHubService.googleCalendarListEvents(input.limit);
        return response;
      }),

    deleteEvent: protectedProcedure
      .input(z.object({ eventId: z.string() }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.googleCalendarDeleteEvent(input.eventId);
        return response;
      }),
  }),

  // ============ GOOGLE MAPS ============
  googleMaps: router({
    geocode: publicProcedure
      .input(z.object({ address: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.googleMapsGeocode(input.address);
        return response;
      }),

    getDirections: publicProcedure
      .input(z.object({
        origin: z.string(),
        destination: z.string(),
        mode: z.string().default('driving'),
      }))
      .query(async ({ input }) => {
        const response = await psdHubService.googleMapsGetDirections(
          input.origin,
          input.destination,
          input.mode
        );
        return response;
      }),

    searchPlaces: publicProcedure
      .input(z.object({
        query: z.string(),
        location: z.object({ lat: z.number(), lng: z.number() }).optional(),
      }))
      .query(async ({ input }) => {
        const response = await psdHubService.googleMapsSearchPlaces(
          input.query,
          input.location as any
        );
        return response;
      }),
  }),

  // ============ PSD2 (PORTUGAL) ============
  psd2: router({
    createPayment: protectedProcedure
      .input(z.object({
        amount: z.number(),
        currency: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.psd2CreatePayment({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
        });
        return response;
      }),

    createRecurringDonation: protectedProcedure
      .input(z.object({
        amount: z.number(),
        frequency: z.enum(['weekly', 'monthly', 'quarterly', 'annual']),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await psdHubService.psd2CreateRecurringDonation({
          amount: input.amount,
          frequency: input.frequency,
          description: input.description,
        });
        return response;
      }),

    getPaymentStatus: protectedProcedure
      .input(z.object({ paymentId: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.psd2GetPaymentStatus(input.paymentId);
        return response;
      }),

    getPaymentHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        const response = await psdHubService.psd2GetPaymentHistory(input.limit);
        return response;
      }),
  }),

  // ============ HUB STATUS ============
  hub: router({
    healthCheck: publicProcedure
      .query(async () => {
        const response = await psdHubService.healthCheck();
        return response;
      }),

    getStatus: publicProcedure
      .query(async () => {
        const response = await psdHubService.getHubStatus();
        return response;
      }),

    getAvailableApis: publicProcedure
      .query(async () => {
        const response = await psdHubService.getAvailableApis();
        return response;
      }),

    getApiStatus: publicProcedure
      .input(z.object({ apiName: z.string() }))
      .query(async ({ input }) => {
        const response = await psdHubService.getApiStatus(input.apiName);
        return response;
      }),
  }),
});
