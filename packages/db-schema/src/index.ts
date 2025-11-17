// packages/db-schema/src/index.ts

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- テーブルスキーマの定義 ---
// ここに、schema.tsからコピーした内容を貼り付けます
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// 例: users テーブル
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }), // 自動インクリメントの主キー
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
});

// 例: posts テーブル
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: integer('author_id').notNull().references(() => users.id), // usersテーブルへの外部キー
});


// --- データベース接続とインスタンスのエクスポート ---
// この部分は、これまで何度も試したエラーハンドリングを含む堅牢なコードです。
const initializeDatabase = () => {
  try {
    const currentFileUrl = import.meta.url;
    const currentFilePath = fileURLToPath(currentFileUrl);
    const currentDirPath = path.dirname(currentFilePath);
    const dbPath = path.join(currentDirPath, '../sqlite.db');

    const sqlite = new Database(dbPath);
    return drizzle(sqlite);
  } catch (error) {
    console.error("[db-schema] FATAL ERROR: Failed to initialize database.", error);
    process.exit(1);
  }
};

export const db = initializeDatabase();