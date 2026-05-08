import sgMail from '@sendgrid/mail';
import { Resend } from 'resend';

/**
 * Serviço Unificado de Email e Notificações
 * Suporta SendGrid, Resend e templates customizados
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
}

export interface NotificationPayload {
  to: string;
  template: string;
  data: Record<string, any>;
  organizationId: string;
}

export interface EmailConfig {
  sendgridKey?: string;
  resendKey?: string;
  fromEmail: string;
  fromName: string;
}

// Templates de Email
const EMAIL_TEMPLATES: Record<string, EmailTemplate> = {
  order_confirmation: {
    id: 'order_confirmation',
    name: 'Order Confirmation',
    subject: 'Pedido Confirmado - {{orderNumber}}',
    html: `
      <h1>Obrigado pela sua compra!</h1>
      <p>Seu pedido <strong>{{orderNumber}}</strong> foi confirmado.</p>
      <h2>Detalhes do Pedido:</h2>
      <ul>
        <li>Total: R$ {{total}}</li>
        <li>Data: {{date}}</li>
        <li>Status: {{status}}</li>
      </ul>
      <p>Você receberá um email com o rastreamento assim que o pedido for enviado.</p>
    `,
  },
  order_shipped: {
    id: 'order_shipped',
    name: 'Order Shipped',
    subject: 'Seu Pedido Foi Enviado - {{orderNumber}}',
    html: `
      <h1>Seu pedido foi enviado!</h1>
      <p>Pedido <strong>{{orderNumber}}</strong> está a caminho.</p>
      <h2>Rastreamento:</h2>
      <p>Código: <strong>{{trackingCode}}</strong></p>
      <p>Transportadora: {{carrier}}</p>
      <p>Entrega estimada: {{estimatedDelivery}}</p>
      <a href="{{trackingUrl}}">Rastrear Pedido</a>
    `,
  },
  order_delivered: {
    id: 'order_delivered',
    name: 'Order Delivered',
    subject: 'Pedido Entregue - {{orderNumber}}',
    html: `
      <h1>Seu pedido foi entregue!</h1>
      <p>Pedido <strong>{{orderNumber}}</strong> foi entregue com sucesso.</p>
      <p>Agradecemos sua compra! Deixe uma avaliação para nos ajudar a melhorar.</p>
      <a href="{{reviewUrl}}">Avaliar Pedido</a>
    `,
  },
  payment_confirmation: {
    id: 'payment_confirmation',
    name: 'Payment Confirmation',
    subject: 'Pagamento Confirmado - {{transactionId}}',
    html: `
      <h1>Pagamento Confirmado</h1>
      <p>Seu pagamento foi processado com sucesso.</p>
      <h2>Detalhes:</h2>
      <ul>
        <li>ID da Transação: {{transactionId}}</li>
        <li>Valor: R$ {{amount}}</li>
        <li>Método: {{method}}</li>
        <li>Data: {{date}}</li>
      </ul>
    `,
  },
  payment_failed: {
    id: 'payment_failed',
    name: 'Payment Failed',
    subject: 'Pagamento Não Processado',
    html: `
      <h1>Problema no Pagamento</h1>
      <p>Não conseguimos processar seu pagamento.</p>
      <p>Motivo: {{reason}}</p>
      <p>Por favor, tente novamente ou entre em contato conosco.</p>
      <a href="{{retryUrl}}">Tentar Novamente</a>
    `,
  },
  welcome: {
    id: 'welcome',
    name: 'Welcome Email',
    subject: 'Bem-vindo!',
    html: `
      <h1>Bem-vindo {{firstName}}!</h1>
      <p>Obrigado por se cadastrar em nossa plataforma.</p>
      <p>Explore nossos produtos e aproveite as melhores ofertas.</p>
      <a href="{{shopUrl}}">Começar a Comprar</a>
    `,
  },
  password_reset: {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Redefinir Senha',
    html: `
      <h1>Redefinir Senha</h1>
      <p>Recebemos uma solicitação para redefinir sua senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="{{resetUrl}}">Redefinir Senha</a>
      <p>Este link expira em 24 horas.</p>
    `,
  },
};

export class EmailNotificationService {
  private sendgridClient?: typeof sgMail;
  private resendClient?: Resend;
  private fromEmail: string;
  private fromName: string;
  private provider: 'sendgrid' | 'resend';

  constructor(config: EmailConfig) {
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;

    if (config.sendgridKey) {
      sgMail.setApiKey(config.sendgridKey);
      this.sendgridClient = sgMail;
      this.provider = 'sendgrid';
    } else if (config.resendKey) {
      this.resendClient = new Resend(config.resendKey);
      this.provider = 'resend';
    } else {
      throw new Error('No email provider configured');
    }
  }

  /**
   * Enviar email usando template
   */
  async sendEmail(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string }> {
    try {
      const template = EMAIL_TEMPLATES[payload.template];
      if (!template) {
        throw new Error(`Template not found: ${payload.template}`);
      }

      const subject = this.interpolate(template.subject, payload.data);
      const html = this.interpolate(template.html, payload.data);

      if (this.provider === 'sendgrid' && this.sendgridClient) {
        const result = await this.sendgridClient.send({
          to: payload.to,
          from: `${this.fromName} <${this.fromEmail}>`,
          subject,
          html,
          replyTo: this.fromEmail,
        });

        return {
          success: true,
          messageId: result[0].headers['x-message-id'],
        };
      } else if (this.provider === 'resend' && this.resendClient) {
        const result = await this.resendClient.emails.send({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: payload.to,
          subject,
          html,
          replyTo: this.fromEmail,
        });

        return {
          success: !result.error,
          messageId: result.data?.id,
        };
      }

      throw new Error('No email provider available');
    } catch (error: any) {
      console.error('Email send failed:', error);
      return { success: false };
    }
  }

  /**
   * Enviar email customizado
   */
  async sendCustomEmail(
    to: string,
    subject: string,
    html: string,
    organizationId: string
  ): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (this.provider === 'sendgrid' && this.sendgridClient) {
        const result = await this.sendgridClient.send({
          to,
          from: `${this.fromName} <${this.fromEmail}>`,
          subject,
          html,
          replyTo: this.fromEmail,
        });

        return {
          success: true,
          messageId: result[0].headers['x-message-id'],
        };
      } else if (this.provider === 'resend' && this.resendClient) {
        const result = await this.resendClient.emails.send({
          from: `${this.fromName} <${this.fromEmail}>`,
          to,
          subject,
          html,
          replyTo: this.fromEmail,
        });

        return {
          success: !result.error,
          messageId: result.data?.id,
        };
      }

      return { success: false };
    } catch (error: any) {
      console.error('Custom email send failed:', error);
      return { success: false };
    }
  }

  /**
   * Enviar email em massa
   */
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    organizationId: string
  ): Promise<{ success: boolean; sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        const result = await this.sendCustomEmail(recipient, subject, html, organizationId);
        if (result.success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    }

    return { success: failed === 0, sent, failed };
  }

  /**
   * Registrar novo template
   */
  registerTemplate(template: EmailTemplate): void {
    EMAIL_TEMPLATES[template.id] = template;
  }

  /**
   * Obter template
   */
  getTemplate(templateId: string): EmailTemplate | undefined {
    return EMAIL_TEMPLATES[templateId];
  }

  /**
   * Listar todos os templates
   */
  listTemplates(): EmailTemplate[] {
    return Object.values(EMAIL_TEMPLATES);
  }

  /**
   * Interpolação de variáveis no template
   */
  private interpolate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key]?.toString() || match;
    });
  }
}

/**
 * Instância global
 */
let emailService: EmailNotificationService;

export function initEmailService(config: EmailConfig): EmailNotificationService {
  emailService = new EmailNotificationService(config);
  return emailService;
}

export function getEmailService(): EmailNotificationService {
  if (!emailService) {
    throw new Error('EmailNotificationService not initialized');
  }
  return emailService;
}
