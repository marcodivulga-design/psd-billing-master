import 'dotenv/config';
import { getDb } from './server/db.ts';
import * as db from './drizzle/schema.ts';
import { eq, sql } from 'drizzle-orm';

const NUM_CONCURRENT_USERS = 100;

interface TestResult {
  success: boolean;
  duration: bigint;
  error?: string;
  latencies: { [key: string]: bigint[] };
}

async function runSingleUserStressTest(userIdPrefix: number): Promise<TestResult> {
  const startTime = process.hrtime.bigint();
  let successfulOperations = 0;
  const latencies: { [key: string]: bigint[] } = {};
  let error: string | undefined;

  const recordLatency = (operationName: string, start: bigint) => {
    const end = process.hrtime.bigint();
    const duration = end - start;
    if (!latencies[operationName]) {
      latencies[operationName] = [];
    }
    latencies[operationName].push(duration);
  };

  try {
    const database = await getDb();
    if (!database) {
      throw new Error("Database connection failed.");
    }

    // 1. Criar usuário de teste
    const userEmail = `user${userIdPrefix}@test.com`;
    const userOpenId = `openid_user${userIdPrefix}`;
    const test1Start = process.hrtime.bigint();
    await database
      .insert(db.users)
      .values({
        email: userEmail,
        name: `User ${userIdPrefix}`,
        openId: userOpenId,
        loginMethod: 'oauth',
      });
    const users = await database.select().from(db.users).where(eq(db.users.openId, userOpenId));
    const user1 = users[0];
    if (!user1) throw new Error('Failed to create test user');
    recordLatency('Create User', test1Start);
    successfulOperations++;

    // 2. Criar planos (apenas uma vez para todos os usuários, mas simulado aqui)
    const test2Start = process.hrtime.bigint();
    await database
      .insert(db.plans)
      .values([
        { name: 'Basic', slug: `basic-${userIdPrefix}`, priceMonthly: '9.99', priceYearly: '99.9', maxAppsActive: 1, features: [] },
        { name: 'Premium', slug: `premium-${userIdPrefix}`, priceMonthly: '29.99', priceYearly: '299.9', maxAppsActive: 5, features: [] },
      ]);
    const basicPlan = (await database.select().from(db.plans).where(eq(db.plans.slug, `basic-${userIdPrefix}`)))[0];
    const premiumPlan = (await database.select().from(db.plans).where(eq(db.plans.slug, `premium-${userIdPrefix}`)))[0];
    if (!basicPlan || !premiumPlan) throw new Error('Failed to create test plans');
    recordLatency('Create Plans', test2Start);
    successfulOperations++;

    // 3. Criar app de teste (simulado por usuário)
    const test3Start = process.hrtime.bigint();
    const appSlug = `app-pet-${userIdPrefix}`;
    await database
      .insert(db.psdApps)
      .values({
        appName: `App Pet ${userIdPrefix}`,
        appSlug: appSlug,
        description: 'Pet management app',
        category: 'pet',
        webhookUrl: 'http://localhost/webhook',
        webhookSecret: 'secret'
      });
    const app = (await database.select().from(db.psdApps).where(eq(db.psdApps.appSlug, appSlug)))[0];
    if (!app) throw new Error('Failed to create test app');
    recordLatency('Create App', test3Start);
    successfulOperations++;

    // 4. Teste de Upgrade
    const test4Start = process.hrtime.bigint();
    await database.insert(db.subscriptions).values({
      userId: user1.id, planId: basicPlan.id, appSlug: app.appSlug, status: 'active',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    await database.insert(db.subscriptions).values({
      userId: user1.id, planId: premiumPlan.id, appSlug: app.appSlug, status: 'active',
      startDate: new Date(), endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    recordLatency('Upgrade Flow', test4Start);
    successfulOperations++;

    // 5. Teste de Downgrade
    const test5Start = process.hrtime.bigint();
    await database.insert(db.subscriptions).values({
      userId: user1.id, planId: basicPlan.id, appSlug: app.appSlug, status: 'active',
      startDate: new Date(), endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    recordLatency('Downgrade Flow', test5Start);
    successfulOperations++;

  } catch (e: any) {
    error = e.message;
    console.error(`❌ Error for user ${userIdPrefix}:`, e);
  }

  const endTime = process.hrtime.bigint();
  return {
    success: !error,
    duration: endTime - startTime,
    error,
    latencies,
  };
}

function calculatePercentile(sortedDurations: number[], percentile: number): number {
  if (sortedDurations.length === 0) return 0;
  const index = Math.ceil(percentile / 100 * sortedDurations.length) - 1;
  return sortedDurations[index];
}

async function main() {
  console.log(`\n🚀 Starting PSD Complex Flows Stress Test with ${NUM_CONCURRENT_USERS} concurrent users...\n`);

  const database = await getDb();
  if (!database) {
    console.error("❌ Database connection failed. Exiting.");
    process.exit(1);
  }

  // Limpar dados de testes anteriores
  console.log('🧹 Cleaning up old test data...');
  await database.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await database.delete(db.affiliateCommissions);
  await database.delete(db.referrals);
  await database.delete(db.subscriptions);
  await database.delete(db.referralCodes);
  await database.delete(db.psdApps);
  await database.delete(db.plans);
  await database.delete(db.users);
  await database.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
  console.log('✅ Cleanup complete\n');

  const allTestPromises: Promise<TestResult>[] = [];
  for (let i = 0; i < NUM_CONCURRENT_USERS; i++) {
    allTestPromises.push(runSingleUserStressTest(i));
  }

  const results = await Promise.all(allTestPromises);

  let totalSuccessfulOperations = 0;
  let totalFailedOperations = 0;
  const allDurations: number[] = [];
  const errorTypes: { [key: string]: number } = {};
  const aggregatedLatencies: { [key: string]: number[] } = {};

  for (const result of results) {
    if (result.success) {
      totalSuccessfulOperations++;
      allDurations.push(Number(result.duration) / 1_000_000); // Convert to ms
      for (const op in result.latencies) {
        if (!aggregatedLatencies[op]) {
          aggregatedLatencies[op] = [];
        }
        result.latencies[op].forEach(d => aggregatedLatencies[op].push(Number(d) / 1_000_000));
      }
    } else {
      totalFailedOperations++;
      const errorMsg = result.error || 'Unknown Error';
      errorTypes[errorMsg] = (errorTypes[errorMsg] || 0) + 1;
    }
  }

  const totalDurationMs = allDurations.reduce((sum, d) => sum + d, 0) / totalSuccessfulOperations || 0;
  const totalDurationSeconds = totalDurationMs / 1000;

  const sortedDurations = allDurations.sort((a, b) => a - b);
  const p95 = calculatePercentile(sortedDurations, 95);
  const p99 = calculatePercentile(sortedDurations, 99);

  console.log('\n📊 FINAL STRESS TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Concurrent Users: ${NUM_CONCURRENT_USERS}`);
  console.log(`Successful Operations: ${totalSuccessfulOperations}`);
  console.log(`Failed Operations: ${totalFailedOperations}`);
  console.log(`Throughput: ${(totalSuccessfulOperations / totalDurationSeconds).toFixed(2)} ops/s`);
  console.log(`Average Total Duration per User: ${totalDurationMs.toFixed(2)} ms`);

  console.log('\n⏱️ Latency Analysis (ms):');
  for (const op in aggregatedLatencies) {
    const sortedOpLatencies = aggregatedLatencies[op].sort((a, b) => a - b);
    const avg = sortedOpLatencies.reduce((sum, d) => sum + d, 0) / sortedOpLatencies.length;
    const opP95 = calculatePercentile(sortedOpLatencies, 95);
    const opP99 = calculatePercentile(sortedOpLatencies, 99);
    console.log(`   - ${op.padEnd(25)}: Avg: ${avg.toFixed(2)} | P95: ${opP95.toFixed(2)} | P99: ${opP99.toFixed(2)}`);
  }

  if (totalFailedOperations > 0) {
    console.log('\n❌ Errors by Type:');
    for (const errorType in errorTypes) {
      console.log(`   - ${errorType}: ${errorTypes[errorType]}`);
    }
  }

  console.log('\n💡 Recommendations:');
  console.log('   - Pool Size: Baseado na carga e latência, uma recomendação inicial de pool de conexões seria de 10 a 20 conexões por instância da aplicação para suportar 100 usuários concorrentes, ajustando conforme o monitoramento de utilização do pool e do banco de dados.');
  console.log('   - Consumo de RU: Para estimar o consumo de Request Units (RU) no TiDB Cloud, seria necessário monitorar as métricas de leitura/escrita do banco de dados diretamente no painel do TiDB Cloud durante a execução do teste. O Drizzle ORM não expõe diretamente o consumo de RU.');

  console.log('\n✅ Stress test completed. Review the report above.\n');
  console.log('='.repeat(60));
}

main();
