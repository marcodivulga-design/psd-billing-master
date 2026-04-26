import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import * as mysql2 from "mysql2/promise"; // Import mysql2/promise for pool creation
import { users } from "../drizzle/schema.ts";
import { ENV } from './_core/env.ts';
let _db = null;
// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
    if (!_db && process.env.DATABASE_URL) {
        try {

            const pool = mysql2.createPool({
                uri: process.env.DATABASE_URL,
                ssl: {
                    minVersion: 'TLSv1.2',
                    rejectUnauthorized: true
                },
                connectionLimit: 50, // Tamanho do pool de conexões
                connectTimeout: 5000, // 5 segundos
                waitForConnections: true,
                queueLimit: 0,
                idleTimeout: 60000, // 60 segundos
                enableKeepAlive: true,
                keepAliveInitialDelay: 10000
            });
            _db = drizzle(pool); // Passa o pool para o drizzle
        }
        catch (error) {
            console.warn("[Database] Failed to connect:", error);
            _db = null;
        }
    }
    return _db;
}
export async function upsertUser(user) {
    if (!user.openId) {
        throw new Error("User openId is required for upsert");
    }
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot upsert user: database not available");
        return;
    }
    try {
        const values = {
            openId: user.openId,
        };
        const updateSet = {};
        const textFields = ["name", "email", "loginMethod"];
        const assignNullable = (field) => {
            const value = user[field];
            if (value === undefined)
                return;
            const normalized = value ?? null;
            values[field] = normalized;
            updateSet[field] = normalized;
        };
        textFields.forEach(assignNullable);
        if (user.lastSignedIn !== undefined) {
            values.lastSignedIn = user.lastSignedIn;
            updateSet.lastSignedIn = user.lastSignedIn;
        }
        if (user.role !== undefined) {
            values.role = user.role;
            updateSet.role = user.role;
        }
        else if (user.openId === ENV.ownerOpenId) {
            values.role = 'admin';
            updateSet.role = 'admin';
        }
        if (!values.lastSignedIn) {
            values.lastSignedIn = new Date();
        }
        if (Object.keys(updateSet).length === 0) {
            updateSet.lastSignedIn = new Date();
        }
        await db.insert(users).values(values).onDuplicateKeyUpdate({
            set: updateSet,
        });
    }
    catch (error) {
        console.error("[Database] Failed to upsert user:", error);
        throw error;
    }
}
export async function getUserByOpenId(openId) {
    const db = await getDb();
    if (!db) {
        console.warn("[Database] Cannot get user: database not available");
        return undefined;
    }
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
}
// TODO: add feature queries here as your schema grows.
