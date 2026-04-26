import axios from 'axios';

const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

const asaasClient = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'access_token': ASAAS_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const asaas = {
  createCustomer: async (data: { name: string; email: string; cpfCnpj?: string }) => {
    const response = await asaasClient.post('/customers', data);
    return response.data;
  },
  createPaymentLink: async (data: { name: string; value: number; billingType: string; chargeType: string }) => {
    const response = await asaasClient.post('/paymentLinks', data);
    return response.data;
  },
  getSubscriptions: async (customerId: string) => {
    const response = await asaasClient.get(`/subscriptions?customer=${customerId}`);
    return response.data;
  }
};
