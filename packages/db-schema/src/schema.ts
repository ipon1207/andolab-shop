// --- テーブルスキーマの定義 ---
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

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

// purchaseLogsテーブル
export const purchaseLogs = sqliteTable('purchase_logs', {
    logId: integer('log_id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id')
        .references(() => products.productId)
        .notNull(),
    soldAt: integer('sold_at', { mode: 'timestamp' }).notNull(),
    soldPrice: integer('sold_price').notNull(),
    canceledAt: integer('canceled_at', { mode: 'timestamp' }),
});

// supplyLogsテーブル
export const supplyLogs = sqliteTable('supply_logs', {
    supplyId: integer('supply_id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id')
        .references(() => products.productId)
        .notNull(),
    suppliedAt: integer('supplied_at', { mode: 'timestamp' }).notNull(),
    quantity: integer('quantity').notNull(),
});

// productsテーブルデータの挿入用スキーマ
export const insertProductSchema = createInsertSchema(products);
// productsテーブルデータ取得用スキーマ
export const selectProductSchema = createSelectSchema(products);
// purchaseLogsテーブルデータの挿入用スキーマ
export const insertPurchaseLogSchema = createInsertSchema(purchaseLogs);
// purchaseLogsテーブルデータ取得用スキーマ
export const selectPurchaseLogSchema = createSelectSchema(purchaseLogs);
// supplyLogsテーブルデータの挿入用スキーマ
export const insertSupplyLogSchema = createInsertSchema(supplyLogs);
// supplyLogsテーブルデータ取得用スキーマ
export const selectSupplyLogSchema = createSelectSchema(supplyLogs);

// Product型の定義
export type Product = z.infer<typeof selectProductSchema>;
// PurchaseLog型の定義
export type PurchaseLog = z.infer<typeof selectPurchaseLogSchema>;
// SupplyLog型の定義
export type SupplyLog = z.infer<typeof selectSupplyLogSchema>;
