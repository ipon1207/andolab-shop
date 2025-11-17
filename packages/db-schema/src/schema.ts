import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 例: users テーブル
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(), // 自動インクリメントの主キー
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