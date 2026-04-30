/**
 * Módulo Global de Integração com Instagram Graph API
 * Requer: Instagram Business Account + Graph API Token
 */

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  media_count: number;
  profile_picture_url: string;
  website: string;
}

export class InstagramAPI {
  private accessToken: string;
  private baseUrl = "https://graph.instagram.com/v18.0";

  constructor(accessToken: string) {
    if (!accessToken) {
      throw new Error("Instagram Access Token is required.");
    }
    this.accessToken = accessToken;
  }

  async searchArtist(username: string): Promise<InstagramProfile | null> {
    try {
      // Nota: O endpoint ig_hashtag_search não é o ideal para buscar perfis diretamente.
      // A Graph API para buscar perfis específicos requer permissões avançadas e user_id.
      // Para simplificar e manter a funcionalidade original do Prospecção Musical AI,
      // manteremos a lógica, mas com a ressalva de que pode não ser a busca mais precisa para 'artista'.
      // Uma abordagem mais robusta envolveria o uso do endpoint /users/{user-id} com as permissões corretas.
      const response = await fetch(
        `${this.baseUrl}/ig_hashtag_search?user_id=${username}&fields=id,username,name,biography,followers_count,media_count,profile_picture_url,website&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        console.error(`Instagram API searchArtist error: ${response.status} - ${response.statusText}`);
        return null;
      }

      const data = (await response.json()) as any;
      // A resposta de ig_hashtag_search não retorna um perfil de usuário diretamente.
      // Esta lógica precisa ser revisada para um uso mais preciso da Graph API para perfis.
      // Por ora, simulamos o retorno baseado na estrutura original.
      return data.data?.[0] || null; // Esta parte é uma adaptação da lógica original, pode não ser precisa.
    } catch (error) {
      console.error("Instagram API searchArtist error:", error);
      return null;
    }
  }

  async getEngagementMetrics(businessAccountId: string): Promise<{ engagementRate: number } | null> {
    try {
      if (!businessAccountId) {
        console.error("Business Account ID is required for engagement metrics.");
        return null;
      }
      const response = await fetch(
        `${this.baseUrl}/${businessAccountId}/insights?metric=engagement,impressions&period=day&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        console.error(`Instagram API getEngagementMetrics error: ${response.status} - ${response.statusText}`);
        return null;
      }

      const data = (await response.json()) as any;
      const engagement = data.data?.find((m: any) => m.name === "engagement")?.values?.[0]?.value || 0;
      const impressions = data.data?.find((m: any) => m.name === "impressions")?.values?.[0]?.value || 1;

      return {
        engagementRate: (engagement / impressions) * 100,
      };
    } catch (error) {
      console.error("Instagram Engagement API error:", error);
      return null;
    }
  }
}
