import 'dotenv/config';
import { getDb } from './server/db.ts';
import { sql } from 'drizzle-orm';

async function initDb() {
  console.log('🚀 Initializing database tables...');
  const db = await getDb();
  if (!db) {
    throw new Error('Database connection failed');
  }

  try {
    // Limpar tabelas se existirem para garantir que o schema esteja correto
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
    const tables = ['users', 'plans', 'psdApps', 'referralCodes', 'subscriptions', 'referrals', 'affiliateCommissions'];
    for (const table of tables) {
      await db.execute(sql.raw("DROP TABLE IF EXISTS `" + table + "`"));
    }
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

    // Create users table
    await db.execute(sql`
      CREATE TABLE \`users\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`openId\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`name\` varchar(255),
        \`role\` varchar(50) NOT NULL DEFAULT 'user',
        \`loginMethod\` varchar(50) NOT NULL,
        \`referralCode\` varchar(255),
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`openId_idx\` (\`openId\`),
        UNIQUE KEY \`email_idx\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Users table ready');

    // Create plans table
    await db.execute(sql`
      CREATE TABLE \`plans\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`slug\` varchar(255) NOT NULL,
        \`description\` text,
        \`priceMonthly\` decimal(10,2) NOT NULL,
        \`priceYearly\` decimal(10,2),
        \`maxAppsActive\` int NOT NULL DEFAULT 1,
        \`features\` json,
        \`isActive\` boolean NOT NULL DEFAULT true,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`slug_idx\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Plans table ready');

    // Create psdApps table
    await db.execute(sql`
      CREATE TABLE \`psdApps\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`appSlug\` varchar(255) NOT NULL,
        \`appName\` varchar(255) NOT NULL,
        \`category\` varchar(50) NOT NULL,
        \`shortDescription\` varchar(180),
        \`longDescription\` text,
        \`tags\` json,
        \`features\` json,
        \`screenshots\` json,
        \`entryUrl\` varchar(255),
        \`webhookUrl\` varchar(255) NOT NULL,
        \`webhookSecret\` varchar(255) NOT NULL,
        \`logoUrl\` varchar(255),
        \`iconUrl\` varchar(255),
        \`faviconUrl\` varchar(255),
        \`primaryColor\` varchar(7),
        \`secondaryColor\` varchar(7),
        \`status\` varchar(50) NOT NULL DEFAULT 'draft',
        \`active\` boolean NOT NULL DEFAULT true,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`appSlug_idx\` (\`appSlug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ psdApps table ready');

    // Create referralCodes table
    await db.execute(sql`
      CREATE TABLE \`referralCodes\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`userId\` int unsigned NOT NULL,
        \`code\` varchar(255) NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`referral_userId_idx\` (\`userId\`),
        UNIQUE KEY \`referral_code_idx\` (\`code\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ referralCodes table ready');

    // Create subscriptions table
    await db.execute(sql`
      CREATE TABLE \`subscriptions\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`userId\` int unsigned NOT NULL,
        \`planId\` int unsigned NOT NULL,
        \`appSlug\` varchar(255) NOT NULL,
        \`status\` varchar(50) NOT NULL,
        \`startDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`endDate\` timestamp,
        \`asaasSubscriptionId\` varchar(255),
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Subscriptions table ready');

    // Create referrals table
    await db.execute(sql`
      CREATE TABLE \`referrals\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`referrerId\` int unsigned NOT NULL,
        \`referredUserId\` int unsigned,
        \`referredEmail\` varchar(320),
        \`referralCodeId\` int unsigned NOT NULL,
        \`status\` varchar(50) NOT NULL DEFAULT 'pending',
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Referrals table ready');

    // Create affiliateCommissions table
    await db.execute(sql`
      CREATE TABLE \`affiliateCommissions\` (
        \`id\` int unsigned NOT NULL AUTO_INCREMENT,
        \`referrerId\` int unsigned NOT NULL,
        \`referredUserId\` int unsigned NOT NULL,
        \`subscriptionId\` int unsigned NOT NULL,
        \`commissionAmount\` decimal(10,2) NOT NULL,
        \`status\` varchar(50) NOT NULL DEFAULT 'pending',
        \`paidAt\` timestamp NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ AffiliateCommissions table ready');

    console.log('\n✨ Database initialization completed!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
