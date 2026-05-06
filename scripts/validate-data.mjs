#!/usr/bin/env node

import mysql from 'mysql2/promise';

/**
 * Script de Validação de Dados
 * Valida integridade dos dados migrados
 */

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'psd_hub',
};

async function validateData() {
  console.log('🔍 Iniciando validação de dados...\n');

  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    let passed = true;

    // 1. Validar contagem de registros
    console.log('📊 Validando contagem de registros...');
    const [countResult] = await conn.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;
    console.log(`   ✅ Total de usuários: ${total}`);

    if (total === 0) {
      console.log('   ⚠️  Nenhum usuário encontrado');
    }

    // 2. Validar emails únicos
    console.log('\n📧 Validando emails únicos...');
    const [duplicates] = await conn.query(
      'SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING count > 1'
    );

    if (duplicates.length > 0) {
      console.log(`   ❌ ${duplicates.length} emails duplicados encontrados:`);
      duplicates.forEach(dup => {
        console.log(`      - ${dup.email} (${dup.count}x)`);
      });
      passed = false;
    } else {
      console.log('   ✅ Todos os emails são únicos');
    }

    // 3. Validar campos obrigatórios
    console.log('\n📋 Validando campos obrigatórios...');
    const [nulls] = await conn.query(
      'SELECT COUNT(*) as count FROM users WHERE email IS NULL OR name IS NULL'
    );

    if (nulls[0].count > 0) {
      console.log(`   ❌ ${nulls[0].count} registros com campos nulos`);
      passed = false;
    } else {
      console.log('   ✅ Todos os campos obrigatórios preenchidos');
    }

    // 4. Validar datas
    console.log('\n📅 Validando datas...');
    const [invalidDates] = await conn.query(
      'SELECT COUNT(*) as count FROM users WHERE created_at > NOW() OR updated_at > NOW()'
    );

    if (invalidDates[0].count > 0) {
      console.log(`   ❌ ${invalidDates[0].count} registros com datas inválidas`);
      passed = false;
    } else {
      console.log('   ✅ Todas as datas são válidas');
    }

    // 5. Validar roles
    console.log('\n👤 Validando roles...');
    const [roles] = await conn.query(
      'SELECT DISTINCT role, COUNT(*) as count FROM users GROUP BY role'
    );

    console.log('   Roles encontrados:');
    roles.forEach(role => {
      console.log(`      - ${role.role}: ${role.count}`);
    });

    // 6. Validar distribuição de dados
    console.log('\n📈 Distribuição de dados:');
    const [stats] = await conn.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT email) as unique_emails,
        MIN(created_at) as oldest,
        MAX(created_at) as newest
      FROM users
    `);

    const stat = stats[0];
    console.log(`   - Total de registros: ${stat.total}`);
    console.log(`   - Emails únicos: ${stat.unique_emails}`);
    console.log(`   - Registro mais antigo: ${stat.oldest}`);
    console.log(`   - Registro mais novo: ${stat.newest}`);

    // Resultado final
    console.log('\n' + '='.repeat(50));
    if (passed) {
      console.log('✅ VALIDAÇÃO PASSOU!');
      console.log('\nDados estão prontos para deploy.');
    } else {
      console.log('❌ VALIDAÇÃO FALHOU!');
      console.log('\nCorrija os erros acima antes de fazer deploy.');
      process.exit(1);
    }
    console.log('='.repeat(50));

  } catch (err) {
    console.error('❌ Erro durante validação:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

validateData();
