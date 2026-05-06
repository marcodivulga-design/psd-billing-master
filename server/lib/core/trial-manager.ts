/**
 * PSD Trial Manager - Gestão de Versões de Teste
 * Permite que usuários experimentem o sistema por tempo limitado.
 */

export class PSDTrialManager {
  /**
   * Gera um link de acesso temporário (7 dias).
   */
  public static generateTrialLink(appId: string, userId: string): string {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    console.log(`🔑 [PSD Trial] Gerando acesso de 7 dias para o app ${appId}`);
    
    // Em produção, isso geraria um token JWT assinado
    const token = Buffer.from(`${appId}:${userId}:${expiresAt.getTime()}`).toString('base64');
    return `https://app.propaga.digital/trial?token=${token}`;
  }

  /**
   * Valida se o acesso trial ainda é válido.
   */
  public static isTrialValid(token: string): boolean {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [,, expiry] = decoded.split(':');
    return Date.now() < parseInt(expiry);
  }
}
