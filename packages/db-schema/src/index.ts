// packages/db-schema/src/index.ts

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export * from './schema';

// --- データベース接続とインスタンスのエクスポート ---
const initializeDatabase = () => {
    try {
        if (process.env.DATABASE_URL) {
            console.log(`Using database at: ${process.env.DATABASE_URL}`);
            const sqlite = new Database(process.env.DATABASE_URL);
            return drizzle(sqlite);
        }

        const currentFileUrl = import.meta.url;
        const currentFilePath = fileURLToPath(currentFileUrl);
        const currentDirPath = path.dirname(currentFilePath);
        const dbPath = path.join(currentDirPath, '../sqlite.db');

        const sqlite = new Database(dbPath);
        return drizzle(sqlite);
    } catch (error) {
        console.error(
            '[db-schema] FATAL ERROR: Failed to initialize database.',
            error,
        );
        process.exit(1);
    }
};

export const db = initializeDatabase();
