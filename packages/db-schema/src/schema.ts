// --- テーブルスキーマの定義 ---
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// productsテーブル
export const products = sqliteTable('products', {
    productId: integer('product_id').primaryKey({ autoIncrement: true }),
    productName: text('product_name').notNull(),
    price: integer('price').notNull(),
    type: text('type').notNull(),
    stock: integer('stock').notNull(),
    janCode: text('jan_code').unique(),
    isDeleted: integer('is_deleted', { mode: 'boolean' })
        .notNull()
        .default(false),
});
