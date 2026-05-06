/**
 * Configuração Global Unificada do Ecossistema PSD
 */

export const PSD_CONFIG = {
  version: "2.0.0",
  protocol: "AVI v1.0.5",
  endpoints: {
    hub: "https://api.hub-psd.com",
    billing: "https://billing.hub-psd.com",
  },
  integrations: {
    instagram: {
      apiVersion: "v18.0",
      scopes: ["instagram_basic", "instagram_manage_insights"],
    },
  },
  features: {
    moneyEngine: true,
    autoDeploy: true,
    centralizedSecrets: true,
  }
};
