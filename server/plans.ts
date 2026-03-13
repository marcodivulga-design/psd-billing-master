import { getDb } from './db.ts';
import { plans } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Cache simples em memória para Planos (TTL de 5 minutos)
let plansCache: any[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos em ms

export async function getAllPlans() {
    const now = Date.now();
    
    // Retorna do cache se for válido
    if (plansCache && (now - lastFetchTime < CACHE_TTL)) {
        return plansCache;
    }

    const db = await getDb();
    if (!db) return [];

    try {
        const result = await db.select().from(plans);
        plansCache = result;
        lastFetchTime = now;
        return result;
    } catch (error) {
        console.error("[Plans] Failed to fetch plans:", error);
        // Se falhar, tenta retornar o cache mesmo expirado como fallback
        return plansCache || [];
    }
}

export async function getPlanById(id: number) {
    const allPlans = await getAllPlans();
    return allPlans.find(p => p.id === id);
}

export async function getPlanBySlug(slug: string) {
    const allPlans = await getAllPlans();
    return allPlans.find(p => p.slug === slug);
}

// Função para invalidar o cache quando um plano for criado/atualizado
export function invalidatePlansCache() {
    plansCache = null;
    lastFetchTime = 0;
}
