import 'dotenv/config';

export const ENV = {
  databaseUrl: process.env.DATABASE_URL,
  ownerOpenId: process.env.OWNER_OPENID || 'psd_owner_default',
  apisHubUrl: process.env.VITE_APIS_HUB_URL || 'https://api.hub-psd.com',
  apisHubKey: process.env.APIS_HUB_KEY || 'psd_live_p72AzwURfP7rjt51GRDwbg9LaZj0TiR6',
};
