#!/usr/bin/env node

import mysql from 'mysql2/promise';

/**
 * Script de Migração de Dados
 * Migra dados dos 12 apps antigos para o novo hub
 */

const APPS = [
  'psd-ai-customer-support',
  'psd-analytics-service',
  'psd-content-generator',
  'psd-dashboard-operacional',
  'psd-monitoring-service',
  'psd-payment-gateway',
  'psd-trend-radar',
  'psd-core',
  'psd-operations',
  'psd-creation',
  'psd-finalization',
  'psd-core-v2',
];

const TARGET_DB = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'psd_hub',
};

async function migrateApp(appName) {
  console.log(`\n📦 Migrando ${appName}...`);

  const sourceDb = {
    host: TARGET_DB.host,
    user: TARGET_DB.user,
    password: TARGET_DB.password,
    database: `psd_${appName.replace('psd-', '')}`,
  };

  try {
    const sourceConn = await mysql.createConnection(sourceDb);
    const targetConn = await mysql.createConnection(TARGET_DB);

    try {
      // 1. Ler dados da tabela users
      const [rows] = await sourceConn.query('SELECT * FROM users LIMIT 1000');

      if (rows.length === 0) {
        console.log(`⏭️  Nenhum usuário para migrar em ${appName}`);
        return;
      }

      // 2. Transformar dados para novo schema
      const transformedRows = rows.map(row => ({
        email: row.email || `${appName}@example.com`,
        name: row.name || row.username || 'Unknown',
        role: row.role || 'user',
        createdAt: row.created_at || new Date(),
        updatedAt: row.updated_at || new Date(),
      }));

      // 3. Inserir no novo hub (com IGNORE para evitar duplicatas)
      let inserted = 0;
      for (const row of transformedRows) {
        try {
          await targetConn.query(
            'INSERT IGNORE INTO users (email, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            [row.email, row.name, row.role, row.createdAt, row.updatedAt]
          );
          inserted++;
        } catch (err) {
          // Ignorar duplicatas
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`❌ Erro ao inserir usuário: ${err.message}`);
          }
        }
      }

      console.log(`✅ ${appName}: ${inserted} usuários migrados`);
    } finally {
      await sourceConn.end();
      await targetConn.end();
    }
  } catch (err) {
    console.error(`❌ Erro ao migrar ${appName}: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Iniciando migração de dados...');
  console.log(`📊 Apps a migrar: ${APPS.length}`);
  console.log(`🎯 Banco de dados alvo: ${TARGET_DB.database}`);
  console.log('');

  // Verificar conexão com banco de dados alvo
  try {
    const conn = await mysql.createConnection(TARGET_DB);
    await conn.end();
    console.log('✅ Conexão com banco de dados alvo validada\n');
  } catch (err) {
    console.error(`❌ Erro ao conectar ao banco de dados: ${err.message}`);
    process.exit(1);
  }

  // Migrar cada app
  for (const app of APPS) {
    await migrateApp(app);
  }

  console.log('\n✅ Migração concluída!');
  console.log('\n📊 Próximas ações:');
  console.log('1. Executar: npm run validate:data');
  console.log('2. Testar: npm run dev');
  console.log('3. Deploy: npm run build && npm start');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
