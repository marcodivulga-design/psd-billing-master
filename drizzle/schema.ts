import { mysqlTable, int, varchar, timestamp, text, decimal, boolean, json, unique } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
	id: int("id").autoincrement().primaryKey().notNull(),
	openId: varchar("openId", { length: 255 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }),
	role: varchar("role", { length: 50 }).default('user').notNull(),
	loginMethod: varchar("loginMethod", { length: 50 }).notNull(),
	referralCode: varchar("referralCode", { length: 255 }),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const plans = mysqlTable("plans", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	description: text("description"),
	priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }).notNull(),
	priceYearly: decimal("priceYearly", { precision: 10, scale: 2 }),
	maxAppsActive: int("maxAppsActive").default(1).notNull(),
	features: json("features"),
	isActive: boolean("isActive").default(true).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const psdApps = mysqlTable("psdApps", {
	id: int("id").autoincrement().primaryKey().notNull(),
	appSlug: varchar("appSlug", { length: 255 }).notNull().unique(),
	appName: varchar("appName", { length: 255 }).notNull(),
	category: varchar("category", { length: 50 }).notNull(),
	shortDescription: varchar("shortDescription", { length: 180 }),
	longDescription: text("longDescription"),
	tags: json("tags"),
	features: json("features"),
	screenshots: json("screenshots"),
	entryUrl: varchar("entryUrl", { length: 255 }),
	webhookUrl: varchar("webhookUrl", { length: 255 }).notNull(),
	webhookSecret: varchar("webhookSecret", { length: 255 }).notNull(),
	logoUrl: varchar("logoUrl", { length: 255 }),
	iconUrl: varchar("iconUrl", { length: 255 }),
	faviconUrl: varchar("faviconUrl", { length: 255 }),
	primaryColor: varchar("primaryColor", { length: 7 }),
	secondaryColor: varchar("secondaryColor", { length: 7 }),
	status: varchar("status", { length: 50 }).default('draft').notNull(),
	active: boolean("active").default(true).notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const referralCodes = mysqlTable("referralCodes", {
	id: int("id").autoincrement().primaryKey().notNull(),
	userId: int("userId").notNull().unique(),
	code: varchar("code", { length: 255 }).notNull().unique(),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const subscriptions = mysqlTable("subscriptions", {
	id: int("id").autoincrement().primaryKey().notNull(),
	userId: int("userId").notNull(),
	planId: int("planId").notNull(),
	appSlug: varchar("appSlug", { length: 255 }).notNull(),
	status: varchar("status", { length: 50 }).notNull(),
	startDate: timestamp("startDate", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	endDate: timestamp("endDate", { mode: 'string' }),
	asaasSubscriptionId: varchar("asaasSubscriptionId", { length: 255 }),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const referrals = mysqlTable("referrals", {
	id: int("id").autoincrement().primaryKey().notNull(),
	referrerId: int("referrerId").notNull(),
	referredUserId: int("referredUserId"),
	referredEmail: varchar("referredEmail", { length: 320 }),
	referralCodeId: int("referralCodeId").notNull(),
	status: varchar("status", { length: 50 }).default('pending').notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});

export const affiliateCommissions = mysqlTable("affiliateCommissions", {
	id: int("id").autoincrement().primaryKey().notNull(),
	referrerId: int("referrerId").notNull(),
	referredUserId: int("referredUserId").notNull(),
	subscriptionId: int("subscriptionId").notNull(),
	commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).notNull(),
	status: varchar("status", { length: 50 }).default('pending').notNull(),
	paidAt: timestamp("paidAt", { mode: 'string' }),
	createdAt: timestamp("createdAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
});
