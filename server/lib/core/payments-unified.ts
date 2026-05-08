import Stripe from 'stripe';

/**
 * Serviço Unificado de Pagamentos
 * Integra Stripe, PIX (Asaas) e Boleto
 */

export interface PaymentConfig {
  stripeKey: string;
  asaasKey: string;
  environment: 'test' | 'production';
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'pix' | 'boleto';
  customerId: string;
  organizationId: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  id: string;
  status: 'pending' | 'approved' | 'failed';
  transactionId: string;
  amount: number;
  method: string;
  gateway: string;
  response: any;
}

export class PaymentsService {
  private stripe: Stripe;
  private asaasKey: string;
  private environment: 'test' | 'production';

  constructor(config: PaymentConfig) {
    this.stripe = new Stripe(config.stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
    this.asaasKey = config.asaasKey;
    this.environment = config.environment;
  }

  /**
   * Criar pagamento (rota principal)
   */
  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    switch (input.method) {
      case 'credit_card':
        return this.createStripePayment(input);
      case 'pix':
        return this.createPixPayment(input);
      case 'boleto':
        return this.createBoletoPayment(input);
      default:
        throw new Error(`Unsupported payment method: ${input.method}`);
    }
  }

  /**
   * Pagamento com Cartão de Crédito (Stripe)
   */
  private async createStripePayment(input: CreatePaymentInput): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100), // Stripe usa centavos
        currency: input.currency.toLowerCase(),
        metadata: {
          orderId: input.orderId,
          organizationId: input.organizationId,
          customerId: input.customerId,
          ...input.metadata,
        },
        description: `Order ${input.orderId}`,
      });

      return {
        id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'approved' : 'pending',
        transactionId: paymentIntent.id,
        amount: input.amount,
        method: 'credit_card',
        gateway: 'stripe',
        response: paymentIntent,
      };
    } catch (error: any) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
  }

  /**
   * Pagamento com PIX (Asaas)
   */
  private async createPixPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    try {
      const response = await fetch('https://api.asaas.com/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.asaasKey,
        },
        body: JSON.stringify({
          customer: input.customerId,
          billingType: 'PIX',
          value: input.amount,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: `Order ${input.orderId}`,
          externalReference: input.orderId,
          metadata: input.metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Asaas PIX error: ${data.errors?.[0]?.detail || 'Unknown error'}`);
      }

      return {
        id: data.id,
        status: 'pending',
        transactionId: data.id,
        amount: input.amount,
        method: 'pix',
        gateway: 'asaas',
        response: data,
      };
    } catch (error: any) {
      throw new Error(`PIX payment failed: ${error.message}`);
    }
  }

  /**
   * Pagamento com Boleto (Asaas)
   */
  private async createBoletoPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    try {
      const response = await fetch('https://api.asaas.com/v3/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.asaasKey,
        },
        body: JSON.stringify({
          customer: input.customerId,
          billingType: 'BOLETO',
          value: input.amount,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          description: `Order ${input.orderId}`,
          externalReference: input.orderId,
          metadata: input.metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Asaas Boleto error: ${data.errors?.[0]?.detail || 'Unknown error'}`);
      }

      return {
        id: data.id,
        status: 'pending',
        transactionId: data.id,
        amount: input.amount,
        method: 'boleto',
        gateway: 'asaas',
        response: data,
      };
    } catch (error: any) {
      throw new Error(`Boleto payment failed: ${error.message}`);
    }
  }

  /**
   * Confirmar pagamento
   */
  async confirmPayment(paymentId: string, gateway: string): Promise<PaymentResult> {
    if (gateway === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      return {
        id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'approved' : 'pending',
        transactionId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        method: 'credit_card',
        gateway: 'stripe',
        response: paymentIntent,
      };
    } else if (gateway === 'asaas') {
      const response = await fetch(`https://api.asaas.com/v3/payments/${paymentId}`, {
        headers: {
          'access_token': this.asaasKey,
        },
      });

      const data = await response.json();

      return {
        id: data.id,
        status: data.status === 'CONFIRMED' ? 'approved' : 'pending',
        transactionId: data.id,
        amount: data.value,
        method: data.billingType.toLowerCase(),
        gateway: 'asaas',
        response: data,
      };
    }

    throw new Error(`Unknown gateway: ${gateway}`);
  }

  /**
   * Reembolsar pagamento
   */
  async refundPayment(paymentId: string, gateway: string, amount?: number): Promise<PaymentResult> {
    if (gateway === 'stripe') {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        id: refund.id,
        status: 'approved',
        transactionId: refund.id,
        amount: refund.amount / 100,
        method: 'credit_card',
        gateway: 'stripe',
        response: refund,
      };
    } else if (gateway === 'asaas') {
      const response = await fetch(`https://api.asaas.com/v3/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.asaasKey,
        },
        body: JSON.stringify({
          refundAmount: amount,
        }),
      });

      const data = await response.json();

      return {
        id: data.id,
        status: 'approved',
        transactionId: data.id,
        amount: amount || data.value,
        method: data.billingType.toLowerCase(),
        gateway: 'asaas',
        response: data,
      };
    }

    throw new Error(`Unknown gateway: ${gateway}`);
  }

  /**
   * Listar pagamentos
   */
  async listPayments(organizationId: string, limit: number = 10): Promise<PaymentResult[]> {
    const paymentIntents = await this.stripe.paymentIntents.list({
      limit,
    });

    return paymentIntents.data.map((pi) => ({
      id: pi.id,
      status: pi.status === 'succeeded' ? 'approved' : 'pending',
      transactionId: pi.id,
      amount: pi.amount / 100,
      method: 'credit_card',
      gateway: 'stripe',
      response: pi,
    }));
  }

  /**
   * Webhook handler para Stripe
   */
  async handleStripeWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Atualizar status do pedido no banco
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // Notificar cliente
        break;
      case 'charge.refunded':
        console.log('Payment refunded:', event.data.object.id);
        // Atualizar status do reembolso
        break;
    }
  }

  /**
   * Webhook handler para Asaas
   */
  async handleAsaasWebhook(event: any): Promise<void> {
    switch (event.event) {
      case 'payment_confirmed':
        console.log('Payment confirmed:', event.payment.id);
        // Atualizar status do pedido
        break;
      case 'payment_received':
        console.log('Payment received:', event.payment.id);
        // Confirmar pedido
        break;
      case 'payment_overdue':
        console.log('Payment overdue:', event.payment.id);
        // Notificar cliente
        break;
    }
  }
}

/**
 * Instância global do serviço
 */
let paymentsService: PaymentsService;

export function initPaymentsService(config: PaymentConfig): PaymentsService {
  paymentsService = new PaymentsService(config);
  return paymentsService;
}

export function getPaymentsService(): PaymentsService {
  if (!paymentsService) {
    throw new Error('PaymentsService not initialized');
  }
  return paymentsService;
}
